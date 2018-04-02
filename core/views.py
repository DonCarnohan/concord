import json, os, subprocess
from django.http import Http404, HttpResponse
from django.shortcuts import render, redirect
from django.db import transaction
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as django_login, logout as django_logout
from django.views.decorators.csrf import ensure_csrf_cookie
from django.conf import settings

from core.models import *
from core.api.serializers import *
from core.utils import UserContext
from core import discord

# Create your views here.
@ensure_csrf_cookie
def page(request, page=None):
    if not page:
        page = "Home"
    context = {
            "page_view": page.capitalize()
        }
    # if request.user.is_authenticated:
    #     context["user"] = UserSerializer(request.user)
    return render(request, "pages/base.html", context)

@ensure_csrf_cookie
def group_page(request, url_name=None, page_name=None):
    context = {"page_view": "GroupHome"}
    if not request.user.is_authenticated:
        return redirect("/login/")
    group = None
    try:
        group = Group.objects.get(url_name=url_name)
    except Group.DoesNotExist as e:
        pass
    if not group:
        return Http404("Page does not exist.")
    else:
        context["group_id"] = group.id

    if page_name:
        context["page_view"] = "Group"+page_name.capitalize()
    return render(request, "pages/base.html", context)

@ensure_csrf_cookie
def invite(request, code=None):
    if not invite_code:
        raise Http404("Page does not exist.")

    invite_code = None
    try:
        invite_code = InviteCode.objects.get(code=invite_code)
    except InviteCode.DoesNotExist as e:
        raise Http404("Page does not exist")

    if request.user.is_authenticated:
        invite_code.group
        return redirect("/groups/"+invite_code.group.url_name)
    else:
        return render(request, "pages/base.html", context)

@ensure_csrf_cookie
def form(request, url_name=None, request_type=None, model=None, model_id=None):
    #capitalize every word delineated by a '-', event-category => EventCategory
    model = ''.join([x.capitalize() for x in model.split('-')])
    context = {
        "page_view": "Form",
        "model": model,
    }
    #List of allowed model names
    # (Model, Serializer, GroupRequired)
    # GroupRequired: None, means it will work with both.
    model_map = {
        "Group": (Group, GroupSerializer, False),
        "Session": (Session, SessionSerializer, True),
        "Event": (Event, EventSerializer, True),
        "EventCategory": (EventCategory, EventCategorySerializer, True),
    }
    if not model_map.get(model) or (model_id and request_type == "add"):
        raise Http404("Page does not exist")
    model_class = model_map.get(model)[0]
    model_serializer = model_map.get(model)[1]
    group_required = model_map.get(model)[2]
    if group_required is True and not url_name:
        raise Http404("Page does not exist")
    if url_name:
        try:
            group = Group.objects.get(url_name=url_name)
            context["group_id"] = group.id
        except Group.DoesNotExist as e:
            raise Http404("Page does not exist")
    if model_id and request_type == "edit":
        try:
            model_instance = model_class.objects.get(id=model_id)
            #TODO: check permission, preferably using generic method
            #TODO?: use serializer to send full model data to front
            #model_json = model_serializer(model_instance)
            context["model_id"] = model_id
        except model_class.DoesNotExist as e:
            raise Http404("Page does not exist")

    return render(request, "pages/base.html", context)

@transaction.atomic()
@ensure_csrf_cookie
def login(request):
    #add bot url
    #https://discordapp.com/api/oauth2/authorize?client_id=416470490475921418&permissions=142336&redirect_uri=http%3A%2F%2Fbabelfish099.pythonanywhere.com%2Flogin%2F&response_type=code&scope=bot%20guilds%20email
    context = {
            "page_view": "Login",
        }
    if request.method == "POST":
        #post returns JSON, not a page
        response = {
            'errors': [],
            'success': False,
        }
        if request.user.is_authenticated:
            response['success'] = True
        else:
            if request.POST.get("password2"): #Register
                email = request.POST.get('email')
                raw_password1 = request.POST.get('password')
                raw_password2 = request.POST.get('password2')
                if raw_password2 != raw_password1:
                    response["errors"].append("Passwords do not match.")
                elif len(raw_password1) < 8:
                    response["errors"].append("Password is too short.")
                else:
                    user, created = User.objects.get_or_create(username=email, email=email)
                    if not created:
                        response["errors"].append("That email already has an account associated with it.")
                    else:
                        user.set_password(raw_password1)
                        user.save()
                        with UserContext(user):
                            user_profile = UserProfile(
                                user_id=user.id,
                            )
                            user_profile.save()
                        django_login(request, user)
                        response['success'] = True
            else: #login
                username = request.POST.get('email')
                raw_password = request.POST.get('password')
                user = authenticate(username=username, password=raw_password)
                if user is not None:
                    django_login(request, user)
                    response['success'] = True
                else:
                    response["errors"].append("Invalid username or password.")

        response = json.dumps(response)
        return HttpResponse(response)
    else:
        if request.user.is_authenticated:
            return redirect("/")

        #Handle discord login
        if request.GET.get("code"):
            user, error = discord.login_and_link(request)
            if not user:
                context['error'] = error#"Problem logging in with Discord. If you already have an account login first to connect it with Discord."
                return render(request, "pages/base.html", context)
            else:
                django_login(request, user)
                return redirect("/")
        return render(request, "pages/base.html", context)

def logout(request):
    django_logout(request)
    return redirect("/")
