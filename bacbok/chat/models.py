from django.db import models
from django.conf import settings

# Create your models here.
class Conversation(models.Model):
    room_name = models.CharField(max_length=255, blank=False, unique=True)
    user = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="useraccount")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.room_name
    
class Message(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="user_sender")
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name="messages")
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)