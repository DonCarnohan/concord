import json
from django.http import Http404
from django.shortcuts import render

from core.models import *
from core.api.serializers import *

# Create your views here.
def page(request, page=None):
    if not page:
        page = "Home"
    context = {"page_view": page.capitalize()}
    return render(request, "pages/base.html", context)

def group_page(request, page=None):
    context = {"page_view": page.capitalize()}
    return render(request, "pages/base.html", context)

def form(request, request_type=None, model=None, model_id=None):
    model = model.capitalize()
    context = {
        "page_view": "Form",
        "model": model,
    }
    #List of allowed model names
    model_map = {
        "Group": (Group, GroupSerializer),
    }
    if not model_map.get(model) or (model_id and request_type == "add"):
        raise Http404("Page does not exist")
    model_class = model_map.get(model)[0]
    model_serializer = model_map.get(model)[0]
    if model_id and request_type == "edit":
        try:
            model_instance = model_class.objects.get(id=model_id)
            #TODO: check permission, preferably using generic method
            model_json = model_serializer(model_instance)
            context["model_json"] = json.dumps(model_json)
        except model_class.DoesNotExist as e:
            raise Http404("Page does not exist")

    return render(request, "pages/base.html", context)
