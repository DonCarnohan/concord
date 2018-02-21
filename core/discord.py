import requests
from django.conf import settings
from django.core.exceptions import ValidationError

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
        raise ValidationError('Your discord account is not a member of that server. Are you sure you\'re logged in correctly?')

    return member
