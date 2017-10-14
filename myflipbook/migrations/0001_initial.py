# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='FlipbookJobs',
            fields=[
                ('job_id', models.CharField(max_length=128, serialize=False, primary_key=True)),
                ('timestamp', models.DateField(max_length=30)),
                ('video_filename', models.CharField(max_length=128)),
                ('path', models.CharField(max_length=128)),
                ('action', models.CharField(max_length=10)),
                ('state', models.CharField(default=b'NEW', max_length=30)),
            ],
        ),
    ]
