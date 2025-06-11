from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('profile/', views.profile, name='profile'),
    path('contact/', views.contact_form, name='contact_form'),  # New contact form endpoint
    path('debug/users/', views.debug_users, name='debug_users'),  # Debug endpoint
    path('csrf-token/', views.get_csrf_token, name='get_csrf_token'),  # CSRF token endpoint
]
