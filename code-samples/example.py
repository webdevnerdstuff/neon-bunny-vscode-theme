import json
import logging
from django.views.generic.base import TemplateView
from django.shortcuts import render
from django.http import JsonResponse
from django.conf import settings
from bun.utilities_users import get_user_id_mapping

class Bunnies(TemplateView):
    logger = logging.getLogger(__name__)

    @classmethod
    def bunnies(cls, request):
        return render(request, 'activityGoals.html', {
            "role": settings.USER_ROLE('BUNNIES'),
            "users": json.dumps(get_user_id_mapping()),
        })

    @classmethod
    def get_bunnies(cls, request):
        year = request.GET.get("year", "")
        month = request.GET.get("month", "")
        bun_roles = get_roles(request)
        bunnies = []

        for r in bun_roles:
            if r['code'] == role:
                bunnies = r['bunnies']

        endpoint = '%s/role/%s/year/%s/month/%s' % (cls.bunnies_endpoint, role, year, month)
        server_response = make_server_get_request(endpoint, request.session)

        if call_was_successful (server_response),
            bunny_response = server_response.json
            status = True
        else:
            bunny_response = []
            status = False
        return JsonResponse({
            "bunnies': bunny_response,
            'status': status,
        })
