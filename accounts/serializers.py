from datetime import date

from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers

User = get_user_model()


def validate_otp_digits(value):
    if not value.isdigit():
        raise serializers.ValidationError('Verification code must be 6 digits.')
    return value


def validate_date_of_birth(value: date) -> date:
    today = date.today()

    try:
        min_date = today.replace(year=today.year - 120)
    except ValueError:
        min_date = today.replace(year=today.year - 120, day=28)

    try:
        max_date = today.replace(year=today.year - 1)
    except ValueError:
        max_date = today.replace(year=today.year - 1, day=28)

    if value >= today:
        raise serializers.ValidationError('Date of birth must be in the past.')

    if value < min_date:
        raise serializers.ValidationError('Date of birth must be within the last 120 years.')

    if value > max_date:
        raise serializers.ValidationError('You must be at least 1 year old.')

    return value


def validate_passwords_match(attrs):
    if attrs['password'] != attrs['confirm_password']:
        raise serializers.ValidationError(
            {'confirm_password': 'Passwords do not match.'}
        )
    return attrs


class SignUpSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=255)
    date_of_birth = serializers.DateField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)

    def validate_email(self, value):
        normalized_email = value.lower()
        existing_user = User.objects.filter(email__iexact=normalized_email).first()

        if existing_user and existing_user.is_active:
            raise serializers.ValidationError('An account with this email already exists.')

        return normalized_email

    def validate_date_of_birth(self, value):
        return validate_date_of_birth(value)

    def validate(self, attrs):
        return validate_passwords_match(attrs)


class VerifySignUpSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(min_length=6, max_length=6)

    def validate_otp(self, value):
        return validate_otp_digits(value)


class ResendSignUpOtpSerializer(serializers.Serializer):
    email = serializers.EmailField()


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs['email'].lower()
        user = authenticate(
            request=self.context.get('request'),
            username=email,
            password=attrs['password'],
        )

        if user is None:
            raise serializers.ValidationError('Invalid email or password.')

        if not user.is_active:
            raise serializers.ValidationError(
                'Your account is not verified yet. Please complete sign-up.'
            )

        attrs['user'] = user
        return attrs


class ForgotPasswordRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class VerifyForgotPasswordOtpSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(min_length=6, max_length=6)

    def validate_otp(self, value):
        return validate_otp_digits(value)


class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(min_length=6, max_length=6)
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)

    def validate_otp(self, value):
        return validate_otp_digits(value)

    def validate(self, attrs):
        return validate_passwords_match(attrs)


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'full_name', 'date_of_birth')
