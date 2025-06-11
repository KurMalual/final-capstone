from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import User
from .serializers import UserSerializer
import json
import logging

logger = logging.getLogger(__name__)

@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        try:
            print("Registration data received:", request.data)  # Debug log
            
            # Extract data
            username = request.data.get('username')
            email = request.data.get('email')
            password = request.data.get('password')
            first_name = request.data.get('first_name')
            last_name = request.data.get('last_name')
            user_type = request.data.get('user_type', 'farmer')
            phone_number = request.data.get('phone_number', '')
            location = request.data.get('location', '')
            
            # Validation
            if not username or not email or not password:
                return Response({'error': 'Username, email, and password are required'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if user already exists
            if User.objects.filter(username=username).exists():
                return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
            
            if User.objects.filter(email=email).exists():
                return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Create user
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
                user_type=user_type,
                phone_number=phone_number,
                location=location
            )
            
            print(f"User created successfully: {user.username}")  # Debug log
            
            return Response({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'user_type': user.user_type,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'location': user.location,
                'phone_number': user.phone_number,
                'message': 'User created successfully'
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            print(f"Registration error: {str(e)}")  # Debug log
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        try:
            username = request.data.get('username')
            password = request.data.get('password')
            
            print(f"Login attempt for username: {username}")  # Debug log
            
            if not username or not password:
                return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if user exists
            try:
                user_exists = User.objects.get(username=username)
                print(f"User exists: {user_exists.username}, user_type: {user_exists.user_type}")  # Debug log
            except User.DoesNotExist:
                print(f"User does not exist: {username}")  # Debug log
                return Response({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)
            
            # Authenticate user
            user = authenticate(request, username=username, password=password)
            print(f"Authentication result: {user}")  # Debug log
            
            if user is not None:
                login(request, user)
                print(f"User logged in successfully: {user.username}")  # Debug log
                return Response({
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'user_type': user.user_type,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'location': user.location,
                    'phone_number': user.phone_number,
                })
            else:
                print("Authentication failed - password mismatch")  # Debug log
                return Response({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)
                
        except Exception as e:
            print(f"Login error: {str(e)}")  # Debug log
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(APIView):
    permission_classes = [permissions.AllowAny]  # Changed from IsAuthenticated
    
    def post(self, request):
        try:
            logout(request)
            return Response({'message': 'Logged out successfully'})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ProfileView(APIView):
    permission_classes = [permissions.AllowAny]  # Changed to allow checking auth status
    
    def get(self, request):
        try:
            if request.user.is_authenticated:
                serializer = UserSerializer(request.user)
                return Response(serializer.data)
            else:
                return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Debug view to check users
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def debug_users(request):
    try:
        users = User.objects.all().values('id', 'username', 'email', 'user_type', 'first_name', 'last_name')
        return Response(list(users))
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# CSRF token endpoint for frontend
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_csrf_token(request):
    from django.middleware.csrf import get_token
    return Response({'csrfToken': get_token(request)})


# Keep the function-based views for backward compatibility
@csrf_exempt
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):
    return RegisterView().post(request)


@csrf_exempt
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    return LoginView().post(request)


@csrf_exempt
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def logout_view(request):
    return LogoutView().post(request)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def profile(request):
    return ProfileView().get(request)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def contact_form(request):
    """
    Handle contact form submissions
    """
    try:
        name = request.data.get('name')
        email = request.data.get('email')
        message = request.data.get('message')
        
        if not all([name, email, message]):
            return Response({'error': 'Please provide all required fields'}, status=400)
        
        # Log the contact form submission
        logger.info(f"Contact form submission from {name} ({email})")
        
        # In production, you would send an email
        # send_mail(
        #     subject=f"Contact Form: Message from {name}",
        #     message=f"From: {name} ({email})\n\n{message}",
        #     from_email=settings.DEFAULT_FROM_EMAIL,
        #     recipient_list=[settings.CONTACT_EMAIL],
        #     fail_silently=False,
        # )
        
        # For now, just log the message
        logger.info(f"Message content: {message}")
        
        return Response({'success': True, 'message': 'Your message has been sent successfully'})
    
    except Exception as e:
        logger.error(f"Error processing contact form: {str(e)}")
        return Response({'error': 'An error occurred while processing your request'}, status=500)
