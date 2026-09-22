from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.serializers import (
    ForgotPasswordRequestSerializer,
    LoginSerializer,
    ResendSignUpOtpSerializer,
    ResetPasswordSerializer,
    SignUpSerializer,
    UserProfileSerializer,
    VerifyForgotPasswordOtpSerializer,
    VerifySignUpSerializer,
)
from accounts.services.email_service import (
    send_password_reset_otp_email,
    send_signup_otp_email,
)
from accounts.services.otp_service import (
    create_password_reset_otp,
    create_signup_otp,
    verify_password_reset_otp,
    verify_signup_otp,
)

User = get_user_model()

INVALID_OTP_RESPONSE = Response(
    {'detail': 'Invalid or expired verification code.'},
    status=status.HTTP_400_BAD_REQUEST,
)


def build_auth_response(*, user):
    refresh = RefreshToken.for_user(user)
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': UserProfileSerializer(user).data,
    }


def get_pending_signup_user(email):
    user = User.objects.filter(email__iexact=email).first()

    if user is None:
        return None, Response(
            {'detail': 'No pending sign-up found for this email.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if user.is_active:
        return None, Response(
            {'detail': 'This account is already verified.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    return user, None


def send_signup_otp(email):
    otp_code = create_signup_otp(email)
    send_signup_otp_email(email=email, code=otp_code)
    return otp_code


def send_password_reset_otp(email):
    otp_code = create_password_reset_otp(email)
    send_password_reset_otp_email(email=email, code=otp_code)
    return otp_code


class SignUpView(APIView):
    authentication_classes = []
    permission_classes = []

    @transaction.atomic
    def post(self, request):
        serializer = SignUpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        user = User.objects.filter(email__iexact=data['email']).first()

        if user is None:
            user = User.objects.create_user(
                email=data['email'],
                password=data['password'],
                full_name=data['full_name'],
                age=data['age'],
                is_active=False,
            )
        else:
            user.full_name = data['full_name']
            user.age = data['age']
            user.set_password(data['password'])
            user.is_active = False
            user.save(update_fields=['full_name', 'age', 'password', 'is_active'])

        send_signup_otp(user.email)

        return Response(
            {
                'message': 'Verification code sent to your email.',
                'email': user.email,
            },
            status=status.HTTP_201_CREATED,
        )


class VerifySignUpView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = VerifySignUpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        user, error_response = get_pending_signup_user(data['email'])
        if error_response is not None:
            return error_response

        if not verify_signup_otp(email=data['email'], code=data['otp']):
            return INVALID_OTP_RESPONSE

        user.is_active = True
        user.save(update_fields=['is_active'])

        return Response(
            {
                'message': 'Email verified successfully. You can now sign in.',
                'email': user.email,
            },
            status=status.HTTP_200_OK,
        )


class ResendSignUpOtpView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = ResendSignUpOtpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email'].lower()

        user, error_response = get_pending_signup_user(email)
        if error_response is not None:
            return error_response

        send_signup_otp(user.email)

        return Response(
            {'message': 'A new verification code has been sent to your email.'},
            status=status.HTTP_200_OK,
        )


class LoginView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        return Response(build_auth_response(user=user), status=status.HTTP_200_OK)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserProfileSerializer(request.user).data)


class ForgotPasswordRequestView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = ForgotPasswordRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email'].lower()

        user = User.objects.filter(email__iexact=email, is_active=True).first()
        if user is not None:
            send_password_reset_otp(user.email)

        return Response(
            {
                'message': (
                    'If an account exists for this email, '
                    'a verification code has been sent.'
                ),
                'email': email,
            },
            status=status.HTTP_200_OK,
        )


class VerifyForgotPasswordOtpView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = VerifyForgotPasswordOtpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        user = User.objects.filter(email__iexact=data['email'], is_active=True).first()
        if user is None:
            return INVALID_OTP_RESPONSE

        if not verify_password_reset_otp(
            email=data['email'],
            code=data['otp'],
            consume=False,
        ):
            return INVALID_OTP_RESPONSE

        return Response(
            {'message': 'Verification code confirmed. You can set a new password.'},
            status=status.HTTP_200_OK,
        )


class ResendForgotPasswordOtpView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = ForgotPasswordRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email'].lower()

        user = User.objects.filter(email__iexact=email, is_active=True).first()
        if user is None:
            return Response(
                {'detail': 'No account found for this email.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        send_password_reset_otp(user.email)

        return Response(
            {'message': 'A new verification code has been sent to your email.'},
            status=status.HTTP_200_OK,
        )


class ResetPasswordView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        user = User.objects.filter(email__iexact=data['email'], is_active=True).first()
        if user is None:
            return INVALID_OTP_RESPONSE

        if not verify_password_reset_otp(
            email=data['email'],
            code=data['otp'],
            consume=True,
        ):
            return INVALID_OTP_RESPONSE

        user.set_password(data['password'])
        user.save(update_fields=['password'])

        return Response(
            {'message': 'Password updated successfully. You can now sign in.'},
            status=status.HTTP_200_OK,
        )
