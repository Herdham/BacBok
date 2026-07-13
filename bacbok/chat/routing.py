from django.urls import path
from .consumers import ChatConsumer

websocket_patterns = [
    path("ws/chat/message/<int:id>", ChatConsumer.as_asgi())
]