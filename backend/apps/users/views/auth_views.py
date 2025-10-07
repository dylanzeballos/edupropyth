from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from allauth.socialaccount.models import SocialAccount
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from django.contrib.auth import get_user_model

User = get_user_model()

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    oauth2_client_class = OAuth2Client
    client_class = OAuth2Client

    def get_response(self):
        serializer_class = self.get_response_serializer()

        if getattr(self, 'access_token', None):
            token_data = {
                'access_token': self.access_token,
                'refresh_token': self.token.get('refresh_token'),
            }
        else:
            refresh = RefreshToken.for_user(self.user)
            token_data = {
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh)
            }

        if serializer_class:
            serializer = serializer_class(
                instance=token_data,
                context=self.get_serializer_context()
            )
            response_data = serializer.data
        else:
            response_data = token_data

        social_account = SocialAccount.objects.filter(user=self.user, provider='google').first()
        profile_picture = social_account.get_avatar_url() if social_account else None
        
        if not isinstance(response_data, dict):
            response_data = dict(response_data)
        else:
            response_data = dict(response_data)
            
        response_data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'username': self.user.username,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'full_name': self.user.get_full_name(),
            'profile_role': getattr(self.user_profile, 'role', 'student') if hasattr(self.user, 'profile') else 'student',
            'profile_picture': profile_picture
        }

        return Response(response_data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def google_auth(request):
    google_token = request.data.get('access_token')

    if not google_token:
        return Response(
            {'error': 'Google access token is required.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        view = GoogleLogin()
        view.request = request
        return view.post(request)
    
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )



