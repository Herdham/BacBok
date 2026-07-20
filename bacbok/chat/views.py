from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from app.models import ProfilePage
from django.contrib.auth.decorators import login_required
from .models import Conversation, Message
from django.contrib.auth import get_user_model
from django.db.models import Subquery, OuterRef
# Create your views here.

User = get_user_model()

@login_required(login_url="login")
def message(request):
    profile = ProfilePage.objects.select_related("user").get(user=request.user)
    conversations = Conversation.objects.filter(user=request.user).prefetch_related("user", "messages")
    context = {"profile": profile, "conversations": conversations}
    return render(request, "chat/messanger.html", context)


@login_required(login_url="login")
def get_message_api(request, id):
    currentUserId = request.user.id
    currentUser = User.objects.get(id=currentUserId)
    targetUser = User.objects.get(id=int(id))
    room_name = f"private_{min(currentUserId, int(id))}_{max(currentUserId, int(id))}"
    conversation, created = Conversation.objects.get_or_create(room_name=room_name)
    if created:
        conversation.user.add(currentUser, targetUser)
    
    message = Message.objects.filter(conversation=conversation).values(
        "sender__username", "message", "created_at"
    )
    
    return JsonResponse({
        "target_user": targetUser.username,
        "current_user": currentUser.username,
        "message": list(message)
    })


@login_required(login_url="login")
def search_profile(request):
    query = request.GET.get('q', '')

    if query:
        result = ProfilePage.objects.filter(fullname__icontains=query)
        data = []
        for profile in result:
            data.append({
                "id": profile.id,
                "username": profile.user.username,
                "fullname": profile.fullname,
                "image": profile.image.url 
            })
    else:
        data = []
    
    return JsonResponse(data, safe=False)


@login_required(login_url="login")
def message_room(request, id):
    user = User.objects.get(id=id)
    profile = ProfilePage.objects.get(user=request.user)
    receiver_profile = ProfilePage.objects.get(id=id)
    currentUserId = request.user.id
    targetUserId = id
    currentUser = User.objects.get(id=currentUserId)
    targetUser = User.objects.get(id=targetUserId)

    room_name = f"private_{min(currentUserId, targetUserId)}_{max(currentUserId, targetUserId)}"
    conversation = Conversation.objects.get_or_create(room_name=room_name)
    conversation[0].user.add(currentUser, targetUser)
    messages = Message.objects.filter(conversation=conversation[0])

    lastest_message = Message.objects.filter(conversation=OuterRef("pk")).order_by("-created_at")[:1]
    conversations = Conversation.objects.annotate(new_message=Subquery(lastest_message.values("message")))

    currentUser_conversation = Conversation.objects.filter(user=request.user)
    msg = Message.objects.filter(conversation__in=currentUser_conversation).order_by("-created_at")

    context = {"id": id, "currentUserId": currentUserId, "profile": profile, "receiver_profile": receiver_profile, "messages": messages, "currentUser_conversation": currentUser_conversation, "conversations": conversations}
    return render(request, "chat/chatRoom.html", context)