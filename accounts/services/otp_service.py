import secrets
from datetime import timedelta

from django.conf import settings
from django.utils import timezone

from accounts.models import EmailOTP


def generate_otp_code() -> str:
    return f'{secrets.randbelow(1_000_000):06d}'


def create_otp(*, email: str, purpose: str) -> str:
    code = generate_otp_code()
    expires_at = timezone.now() + timedelta(minutes=settings.OTP_EXPIRY_MINUTES)

    EmailOTP.objects.filter(
        email__iexact=email,
        purpose=purpose,
    ).delete()

    EmailOTP.objects.create(
        email=email.lower(),
        code=code,
        purpose=purpose,
        expires_at=expires_at,
    )

    return code


def _get_valid_otp(*, email: str, code: str, purpose: str):
    otp = (
        EmailOTP.objects.filter(
            email__iexact=email,
            purpose=purpose,
            code=code,
        )
        .order_by('-created_at')
        .first()
    )

    if otp is None or otp.expires_at < timezone.now():
        return None

    return otp


def verify_otp(*, email: str, code: str, purpose: str, consume: bool = True) -> bool:
    otp = _get_valid_otp(email=email, code=code, purpose=purpose)

    if otp is None:
        return False

    if consume:
        EmailOTP.objects.filter(
            email__iexact=email,
            purpose=purpose,
        ).delete()

    return True


def create_signup_otp(email: str) -> str:
    return create_otp(email=email, purpose=EmailOTP.PURPOSE_SIGNUP)


def verify_signup_otp(*, email: str, code: str) -> bool:
    return verify_otp(
        email=email,
        code=code,
        purpose=EmailOTP.PURPOSE_SIGNUP,
        consume=True,
    )


def create_password_reset_otp(email: str) -> str:
    return create_otp(email=email, purpose=EmailOTP.PURPOSE_PASSWORD_RESET)


def verify_password_reset_otp(*, email: str, code: str, consume: bool = False) -> bool:
    return verify_otp(
        email=email,
        code=code,
        purpose=EmailOTP.PURPOSE_PASSWORD_RESET,
        consume=consume,
    )
