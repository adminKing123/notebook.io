from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers

User = get_user_model()


def validate_otp_digits(value):
    if not value.isdigit():
        raise serializers.ValidationError('Verification code must be 6 digits.')
    return value


def validate_passwords_match(attrs):
    if attrs['password'] != attrs['confirm_password']:
        raise serializers.ValidationError(
            {'confirm_password': 'Passwords do not match.'}
        )
    return attrs


class SignUpSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=255)
    age = serializers.IntegerField(min_value=1, max_value=120)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)

    def validate_email(self, value):
        normalized_email = value.lower()
        existing_user = User.objects.filter(email__iexact=normalized_email).first()

        if existing_user and existing_user.is_active:
            raise serializers.ValidationError('An account with this email already exists.')

        return normalized_email

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
        fields = ('email', 'full_name', 'age')
