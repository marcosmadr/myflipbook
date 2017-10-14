from django.db import models

# Create your models here.


class jobs(models.Model):
    job_id = models.CharField(max_length=128, primary_key=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    video_filename = models.CharField(max_length=128)
    path = models.CharField(max_length=128)
    action = models.CharField(max_length=10)
    state = models.CharField(max_length=30, default='NEW')
