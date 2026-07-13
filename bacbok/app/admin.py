from django.contrib import admin
from .models import UserAccount, ProfilePage, Post, PostImage, Comment, Status, Video, VideoComment, Share

# Register your models here.
admin.site.register(UserAccount)
admin.site.register(ProfilePage)
admin.site.register(Post)
admin.site.register(PostImage)
admin.site.register(Comment)
admin.site.register(Status)
admin.site.register(Video)
admin.site.register(VideoComment)
admin.site.register(Share)
