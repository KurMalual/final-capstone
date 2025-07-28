from django.urls import path
from .views import DashboardSummaryView, LoginView, RegisterView, LogoutView
from rest_framework.routers import DefaultRouter
from .views import MessageViewSet, PublicContactView

router = DefaultRouter()
router.register(r'messages', MessageViewSet, basename='message')

urlpatterns = [
    path('', DashboardSummaryView.as_view(), name='dashboard-summary'),
    path('dashboard/', DashboardSummaryView.as_view(), name='auth-dashboard'),
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('contact/', PublicContactView.as_view(), name='public-contact'),
] + router.urls
