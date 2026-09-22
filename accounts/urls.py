from django.urls import path

from accounts.views import (
    ForgotPasswordRequestView,
    LoginView,
    MeView,
    ResendForgotPasswordOtpView,
    ResendSignUpOtpView,
    ResetPasswordView,
    SignUpView,
    VerifyForgotPasswordOtpView,
    VerifySignUpView,
)

urlpatterns = [
    path('sign-up/', SignUpView.as_view(), name='sign-up'),
    path('sign-up/verify/', VerifySignUpView.as_view(), name='sign-up-verify'),
    path('sign-up/resend-otp/', ResendSignUpOtpView.as_view(), name='sign-up-resend-otp'),
    path('login/', LoginView.as_view(), name='login'),
    path('me/', MeView.as_view(), name='me'),
    path('forgot-password/', ForgotPasswordRequestView.as_view(), name='forgot-password'),
    path(
        'forgot-password/verify/',
        VerifyForgotPasswordOtpView.as_view(),
        name='forgot-password-verify',
    ),
    path(
        'forgot-password/resend-otp/',
        ResendForgotPasswordOtpView.as_view(),
        name='forgot-password-resend-otp',
    ),
    path('forgot-password/reset/', ResetPasswordView.as_view(), name='forgot-password-reset'),
]
