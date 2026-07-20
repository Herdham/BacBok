import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Conversation, Message
from django.contrib.auth import get_user_model

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):

    
    async def connect(self):

        is_loggedIn = self.scope["user"].is_authenticated
        if is_loggedIn:
            current_user = self.scope["user"].id
            target_user = self.scope["url_route"]["kwargs"]["id"]
            self.room_name = f"private_{min(current_user, target_user)}_{max(current_user, target_user)}"

            @database_sync_to_async
            def get_current_user(user_id):
                return User.objects.get(id=user_id)
            

            @database_sync_to_async
            def get_target_user(user_id):
                return User.objects.get(id=user_id)
            
            self.currentUser = await get_current_user(current_user)
            self.targetUser = await get_target_user(target_user)

            await self.channel_layer.group_add(self.room_name, self.channel_name)
            await self.accept()

        else:
            await self.close()

    

    async def receive(self, text_data):
        data = json.loads(text_data)
        
        await self.channel_layer.group_send(
            self.room_name,
            {
                "type": "message_handler",
                "message": data['message'],
                "room_name": self.room_name,
                "currentUserId": self.scope["user"].id
            }
        )

    async def message_handler(self, event):

        await self.create_message(data=event, currentUser=self.currentUser, targetUser=self.targetUser)

        await self.send(json.dumps({
            "message": event['message'],
            "room_name": event['room_name'],
            "user_id": event["currentUserId"]
        }))

        
    @database_sync_to_async
    def create_message(self, data, currentUser, targetUser):
        conversation, created = Conversation.objects.get_or_create(room_name=data["room_name"])
        if created:
            conversation.user.add(currentUser, targetUser)

        Message.objects.create(conversation=conversation, sender=currentUser, message=data["message"])
        
        

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.room_name, self.channel_name)
        self.close(code)