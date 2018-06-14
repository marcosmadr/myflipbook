from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^video/$', views.video, name='video'),
    url(r'^video/settings$', views.video_settings, name='video_settings'),
    url(r'^video/thanks$', views.video_thanks, name='video_thanks'),
    url(r'^contact$', views.contact, name='contact'),
    url(r'^contact/thanks$', views.contact_thanks, name='contact_thanks'),
    url(r'^help$', views.help, name='help'),
    url(r'^error$', views.error, name='error'),
    url(r'^print$', views.printable, name='printable'),
 
]
