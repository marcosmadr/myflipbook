from django.forms import ModelForm
from myflipbook.models import Contact

class ContactForm(ModelForm):
    class Meta:
        model = Contact
        fields = ['sender', 'subject', 'message']
