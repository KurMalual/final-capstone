from django.urls import path
from . import views

urlpatterns = [
    path('csrf/', views.csrf_token_view, name='csrf_token'),
    path('get-csrf/', views.get_csrf_token, name='get_csrf_token'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('signup/', views.signup_view, name='signup'),
    path('profile/', views.profile_view, name='profile'),
]
