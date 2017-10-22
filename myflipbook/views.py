from django.shortcuts import render
from django.http import HttpResponse
from forms import ContactForm
from forms import UploadForm
from django.utils import timezone

from myflipbook.models import jobs

from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response
from django.core.mail import send_mail
from django.http import JsonResponse

import uuid
import os

def index(request):
    return render(request, 'myflipbook/home.html')

def video_thanks(request):
    return render(request, 'myflipbook/video_thanks.html')

def contact_thanks(request):
    return render(request, 'myflipbook/contact_thanks.html')

def video(request):
    filters = [('No filter','nofilter'),
                ('Sepia','sepia'),
                ('Gray Scale','grayscale'),
                ('Contrast','contrast'),
                ('Saturate','saturate'),
                ('Opacity','opacity')]

    return render(request, 'myflipbook/video.html', {'filters': filters})

def contact(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)

        if form.is_valid():
            sender = form.cleaned_data['sender']
            subject = form.cleaned_data['subject']
            message = form.cleaned_data['message']

            return HttpResponseRedirect('contact/thanks')
            """
            send_mail(
                'Feedback from your site, topic: %s' % subject,
				message, sender,
				['toguto@gmail.com']
			)
            """
        return render(request, 'myflipbook/contact.html', {'form': form })

    else:
        form = ContactForm()

    return render(request, 'myflipbook/contact.html', {'form': form })

def printable(request):
    return render(request, 'myflipbook/print.html')

def error(request):
    return render(request, 'myflipbook/error.html')
