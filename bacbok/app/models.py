from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

# Create your models here.
class UserAccount(AbstractUser):
    pass


class ProfilePage(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='users_acc')
    firstname = models.CharField(max_length=100, blank=True)
    lastname = models.CharField(max_length=100, blank=True)
    fullname = models.CharField(max_length=100, blank=True)
    image = models.ImageField(upload_to='pictures', default='images.png')
    cover = models.ImageField(upload_to='cover_pic', default="gray.avif")
    bio = models.TextField(blank=True)
    website = models.URLField(default='')
    address = models.CharField(max_length=200, blank=True)
    follow = models.ManyToManyField("self", symmetrical=False, blank=True, related_name="followers")
    date_created = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username}"
    
class Post(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='users_post')
    caption = models.TextField(default='', blank=True)
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name='posts_like')
    share = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username

class PostImage(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="image")
    image = models.ImageField(upload_to='post_feed', blank=True, null=True)

    def __str__(self):
        return f"{self.post.user.username}"


class Comment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="comments")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField()


class Share(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="shareuser")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="postshare")
    caption = models.TextField(default='', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Status(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="status")
    caption = models.CharField(max_length=150, blank=True)
    image = models.ImageField(upload_to="statusImage", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def __str__(self):
        return f"{self.user.username}"



class Video(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="user")
    video = models.FileField(upload_to="video")
    caption = models.TextField(blank=True)
    user_likes = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name="video_like")
    share = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)


class ShareVideo(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="videouser")
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name="videoshare")
    caption = models.TextField(default='', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class VideoComment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name="videocomment")
    comment_text = models.TextField()