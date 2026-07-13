from django.urls import path

from . import views

urlpatterns = [
    path("message", views.message, name="message"),
    path("get_message_api/<int:id>", views.get_message_api, name="message_api"),
    path("api/search-profile", views.search_profile, name="search_profile"),
    path("message/<int:id>", views.message_room, name="message")
]
