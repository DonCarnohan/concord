import requests, random, string
from django.conf import settings
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

from core.models import *
from core.utils import UserContext

def update_nickname(request, group):
    if request.user.is_authenticated:
        user = request.user
        if user.userprofile.discord_information:
            discord_user_id = user.userprofile.discord_information.id
            headers = {
                "Content-Type":"application/json",
                'Authorization': "Bot " + settings.DISCORD_BOT_TOKEN
            }
            response = requests.get(settings.DISCORD_API_ENDPOINT+"/guilds/"+group.discord_server_identifier+"/members/"+str(discord_user_id), headers=headers)
            member = response.json()
            if member.get("nick") and member.get("nick") != user.userprofile.display_name:
                user.userprofile.display_name = member.get("nick", '')
                user.userprofile.save()

def authenticate_user(request, code, group):
    data = {
        'client_id': settings.DISCORD_CLIENT_ID,
        'client_secret': settings.DISCORD_CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri':settings.DISCORD_REDIRECT,
    }
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    response = requests.post(settings.DISCORD_API_ENDPOINT+"/oauth2/token", data, headers=headers)
    token_response = response.json()

    data = {
    }
    headers = {
        'Authorization': "Bearer " + token_response['access_token']
    }
    response = requests.get(settings.DISCORD_API_ENDPOINT+"/users/@me", headers=headers)
    user_response = response.json()
    headers = {
        "Content-Type":"application/json",
        'Authorization': "Bot " + settings.DISCORD_BOT_TOKEN
    }
    response = requests.get(settings.DISCORD_API_ENDPOINT+"/guilds/"+group.discord_server_identifier+"/members/"+str(user_response["id"]), headers=headers)
    member = response.json()

    if member.get("code"):# not members_response.get("code", None):
        raise ValidationError("Your discord account is not a member of that server. Are you sure you're logged in correctly?")

    return member

def login_and_link(request):
    user = None
    error = None

    if request.user.is_authenticated:
        user = request.user

    code = request.GET.get("code")
    if code:
        data = {
            'client_id': settings.DISCORD_CLIENT_ID,
            'client_secret': settings.DISCORD_CLIENT_SECRET,
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri':settings.DISCORD_REDIRECT,
        }
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        response = requests.post(settings.DISCORD_API_ENDPOINT+"/oauth2/token", data, headers=headers)
        token_response = response.json()

        data = {
        }
        headers = {
            'Authorization': "Bearer " + token_response['access_token']
        }
        response = requests.get(settings.DISCORD_API_ENDPOINT+"/users/@me", headers=headers)
        user_response = response.json()

        discord_information = None
        created = False
        if not user_response.get("email", None):
            return None, 'Email must be provided to create an account'
        if not user:
            try:
                discord_information = DiscordInformation.objects.get(id=user_response["id"])
            except DiscordInformation.DoesNotExist as e:
                pass
            if discord_information:
                try:
                    user_profile = UserProfile.objects.get(discord_information_id=discord_information.id)
                    user = user_profile.user
                except UserProfile.DoesNotExist as e:
                    return None, '(103): Something really strange happened... Contact an administrator.'
            else:
                user, created = User.objects.get_or_create(username=user_response['email'], email=user_response['email'])
                if created:
                    user.set_password(''.join(random.choice(string.ascii_uppercase + string.ascii_lowercase + string.digits) for _ in range(25)))
                    user.save()
                    with UserContext(user):
                        user_profile = UserProfile(
                            user_id=user.id,
                        )
                        user_profile.save()
                else:
                    return None, 'An account with that email already exists. Login to link with your discord account.'

        if not user.userprofile.discord_information:
            with UserContext(user):
                discord_information = DiscordInformation(
                    id=user_response["id"],
                    username=user_response["username"],
                    discriminator=user_response["discriminator"],
                    avatar=user_response['avatar'] or '',
                    )
                discord_information.save()
                user.userprofile.discord_information = discord_information
                user.userprofile.save()
    return user, error
