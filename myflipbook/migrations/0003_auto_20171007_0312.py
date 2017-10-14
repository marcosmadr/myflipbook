# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myflipbook', '0002_auto_20171007_0242'),
    ]

    operations = [
        migrations.AlterField(
            model_name='jobs',
            name='timestamp',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
