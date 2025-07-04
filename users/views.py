from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import User
from .serializers import UserSerializer, UserRegistrationSerializer
import json
import logging

logger = logging.getLogger(__name__)

def get_csrf_token(request):
    """Get CSRF token for frontend"""
    return JsonResponse({'csrfToken': get_token(request)})

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            # Use request.data instead of request.body to avoid reading issues
            data = request.data
            username = data.get('username')
            password = data.get('password')
            
            print(f"Login attempt for username: {username}")
            
            if not username or not password:
                return JsonResponse({
                    'success': False,
                    'error': 'Username and password are required'
                }, status=400)
            
            user = authenticate(request, username=username, password=password)
            
            if user is not None:
                login(request, user)
                print(f"Login successful for user: {username}")
                return JsonResponse({
                    'success': True,
                    'message': 'Login successful',
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'user_type': user.user_type,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                    }
                })
            else:
                print(f"Login failed for username: {username}")
                return JsonResponse({
                    'success': False,
                    'error': 'Invalid username or password'
                }, status=401)
                
        except Exception as e:
            print(f"Login error: {str(e)}")
            return JsonResponse({
                'success': False,
                'error': f'Login error: {str(e)}'
            }, status=500)

@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            # Use request.data instead of request.body to avoid reading issues
            data = request.data
            print(f"Registration attempt for: {data.get('username')}")
            
            # Check if user already exists
            if User.objects.filter(username=data.get('username')).exists():
                return JsonResponse({
                    'success': False,
                    'error': 'Username already exists'
                }, status=400)
            
            if User.objects.filter(email=data.get('email')).exists():
                return JsonResponse({
                    'success': False,
                    'error': 'Email already exists'
                }, status=400)
            
            # Create new user using the custom User model
            user = User(
                username=data.get('username'),
                email=data.get('email'),
                first_name=data.get('first_name', ''),
                last_name=data.get('last_name', ''),
                user_type=data.get('user_type', 'farmer'),
                phone_number=data.get('phone_number', ''),
                location=data.get('location', '')
            )
            user.set_password(data.get('password'))
            user.save()
            
            print(f"Registration successful for: {user.username}")
            
            return JsonResponse({
                'success': True,
                'message': 'Registration successful',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'user_type': user.user_type,
                }
            })
            
        except Exception as e:
            print(f"Registration error: {str(e)}")
            return JsonResponse({
                'success': False,
                'error': f'Registration error: {str(e)}'
            }, status=500)

class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return JsonResponse({
            'success': True,
            'message': 'Logout successful'
        })

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
