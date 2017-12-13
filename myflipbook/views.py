from django.shortcuts import render
from django.http import HttpResponse
from forms import ContactForm
from django.utils import timezone

from myflipbook.models import Contact

from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response
from django.core.mail import send_mail
from django.http import JsonResponse

from myflipbook.myflipbook_settings import myflipbook_settings

def index(request):
    return render(request, 'myflipbook/home.html')

def video(request):
    return render(request, 'myflipbook/video.html', {'form': myflipbook_settings})

def video_settings(request):
    return JsonResponse({"code": 0, "data": myflipbook_settings}) 

def video_thanks(request):
    return render(request, 'myflipbook/video_thanks.html')

def contact(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)

        if form.is_valid():
            form.save()
            return HttpResponseRedirect('contact/thanks')
        return render(request, 'myflipbook/contact.html', {'form': form })

    else:
        form = ContactForm()

    return render(request, 'myflipbook/contact.html', {'form': form })

def contact_thanks(request):
    return render(request, 'myflipbook/contact_thanks.html')

def help(request):
    return render(request, 'myflipbook/help.html')

def printable(request):
    return render(request, 'myflipbook/print.html')

def error(request):
    return render(request, 'myflipbook/error.html')
