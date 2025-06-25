from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import AnonymousUser
from django.middleware.csrf import get_token
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils.decorators import method_decorator
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .models import User
from .serializers import UserSerializer
import json
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
@require_http_methods(["GET"])
def csrf_token_view(request):
    """Get CSRF token for frontend"""
    token = get_token(request)
    return JsonResponse({'csrfToken': token})

@ensure_csrf_cookie
@api_view(['GET'])
@permission_classes([AllowAny])
def get_csrf_token(request):
    """Alternative CSRF token endpoint"""
    return Response({'csrfToken': get_token(request)})

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Login endpoint with proper CSRF handling"""
    try:
        data = request.data
        username = data.get('username')
        password = data.get('password')
        
        logger.info(f"Login attempt for username: {username}")
        
        if not username or not password:
            return Response({
                'success': False,
                'error': 'Username and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user exists
        try:
            user_obj = User.objects.get(username=username)
            logger.info(f"User exists: {username}, user_type: {user_obj.user_type}")
        except User.DoesNotExist:
            logger.warning(f"User does not exist: {username}")
            return Response({
                'success': False,
                'error': 'Invalid username or password'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Authenticate user
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            logger.info(f"Authentication result: {user.username} ({user.user_type})")
            
            # Login the user (creates session)
            login(request, user)
            
            # Create or get token for API authentication
            token, created = Token.objects.get_or_create(user=user)
            
            # Serialize user data
            serializer = UserSerializer(user)
            
            logger.info(f"User logged in successfully: {user.username}")
            
            return Response({
                'success': True,
                'user': serializer.data,
                'token': token.key,
                'message': 'Login successful'
            }, status=status.HTTP_200_OK)
        else:
            logger.warning(f"Authentication failed for: {username}")
            return Response({
                'success': False,
                'error': 'Invalid username or password'
            }, status=status.HTTP_401_UNAUTHORIZED)
            
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return Response({
            'success': False,
            'error': 'Login failed. Please try again.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Logout endpoint"""
    try:
        # Delete the user's token
        try:
            token = Token.objects.get(user=request.user)
            token.delete()
        except Token.DoesNotExist:
            pass
        
        # Logout the user
        logout(request)
        
        return Response({
            'success': True,
            'message': 'Logout successful'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Logout error: {str(e)}")
        return Response({
            'success': False,
            'error': 'Logout failed'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    """Get user profile"""
    try:
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Profile error: {str(e)}")
        return Response({
            'error': 'Failed to get profile'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def signup_view(request):
    """Signup endpoint"""
    try:
        data = request.data
        
        # Validate required fields
        required_fields = ['username', 'email', 'password', 'first_name', 'last_name', 'user_type']
        for field in required_fields:
            if not data.get(field):
                return Response({
                    'success': False,
                    'error': f'{field} is required'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if username already exists
        if User.objects.filter(username=data['username']).exists():
            return Response({
                'success': False,
                'error': 'Username already exists'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if email already exists
        if User.objects.filter(email=data['email']).exists():
            return Response({
                'success': False,
                'error': 'Email already exists'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create user
        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            user_type=data['user_type'],
            phone_number=data.get('phone_number', ''),
            location=data.get('location', '')
        )
        
        logger.info(f"User created successfully: {user.username}")
        
        return Response({
            'success': True,
            'message': 'Account created successfully'
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        logger.error(f"Signup error: {str(e)}")
        return Response({
            'success': False,
            'error': 'Signup failed. Please try again.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
