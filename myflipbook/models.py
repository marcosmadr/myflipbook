from django.db import models

# Create your models here.


class Contact(models.Model):
    contact_time = models.DateTimeField(auto_now_add=True)
    sender = models.EmailField()
    subject = models.CharField(max_length=128)
    message = models.CharField(max_length=1024)
