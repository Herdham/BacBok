from django.shortcuts import render, redirect
from django.contrib import messages, auth
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth.decorators import login_required
from .models import ProfilePage, Post, PostImage, Comment, Status, Video, VideoComment, Share, ShareVideo
from chat.models import Conversation, Message
from django.db.models import OuterRef, Subquery, Q, F
from django.http import JsonResponse, HttpResponse
from .forms import SignUpForm
from django.views.generic import CreateView, TemplateView
from django.views import View
from django.utils.http import (
    urlsafe_base64_encode, urlsafe_base64_decode
)
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import (
    default_token_generator
)
from django.core.mail import send_mail
User = get_user_model()


class SignUpView(CreateView):
    form_class = SignUpForm
    template_name = "account/signup.html"

    def form_valid(self, form):

        user = form.save(commit=False)
        user.is_active = False
        user.save()

        uidb64 = urlsafe_base64_encode(
            force_bytes(user.pk)
        )

        token = default_token_generator.make_token(user)

        verification_path = reverse(
            "verify-email",
            kwargs={
                "uidb64": uidb64,
                "token": token,
            }
        )

        verification_url = self.request.build_absolute_uri(
            verification_path
        )

        send_mail(
            subject="Verify your email",
            message=(
                f"Hi {user.username},\n\n"
                "Please click the link below to verify your account:\n\n"
                f"{verification_url}"
            ),
            from_email="user.me.adam@gmail.com",
            recipient_list=[user.email],
        )

        return redirect("check-email")


class CheckEmailView(TemplateView):
    template_name = "account/checkmail.html"


class VerifyEmailView(View):

    def get(self, request, uidb64, token):

        try:
            uid = force_str(
                urlsafe_base64_decode(uidb64)
            )

            user = User.objects.get(pk=uid)

        except (
            TypeError,
            ValueError,
            OverflowError,
            User.DoesNotExist,
        ):
            user = None

        if (
            user is not None
            and default_token_generator.check_token(user, token)
        ):
            user.is_active = True
            user.save()

            return redirect("login")

        return redirect("signup")

#login validation
def login(request):
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")

        try:
            user = User.objects.get(email=email)
            auth_user = auth.authenticate(username=user.username, password=password)
                    
            if auth_user is not None:
                auth.login(request, auth_user)
                return redirect('login_check')
            else:
                messages.info(request, "Crendential Incorrect")
                return redirect('login')
        except User.DoesNotExist:
            messages.info(request, "User Does Not Exist Create an Account")
            return redirect('login')
            
    else:
        return render(request, 'account/login.html')


def login_check(request):
    profile_update = ProfilePage.objects.get(user=request.user)

    if profile_update.firstname != '' and profile_update.lastname != '':
        return redirect('home')
    else:
        return redirect('setting', request.user.username)



def forget_password(request):
    return render(request, 'account/password_reset.html')


@login_required(login_url='login')
def home(request):
    profile = ProfilePage.objects.select_related("user").get(user=request.user)
    follow_user_obj = profile.follow.values_list("user", flat=True)
    post = Post.objects.prefetch_related("image", "comments", "likes", "user__users_acc").select_related("user").filter(Q(user=request.user.id) | Q(user__in=follow_user_obj))
    video = Video.objects.select_related("user").prefetch_related("videocomment", "user_likes").filter(user=request.user.id)
    now = timezone.now()

    profiles = ProfilePage.objects.exclude(user__in=follow_user_obj).select_related('user')[:5]
    status_obj = Status.objects.select_related("user").filter(user=request.user, expires_at__gt=now)

    status_follow = Status.objects.filter(user__in=follow_user_obj, user=OuterRef('pk'), expires_at__gt=now).order_by("-created_at")
    users = User.objects.exclude(id=request.user.id).annotate(user_status=Subquery(status_follow.values("user")[:1]))

    status_count = [user.user_status for user in users if user.user_status is not None]
    status_count = len(status_count)
    print(status_count)

    latest_message = Message.objects.filter(conversation=OuterRef('pk')).order_by("-created_at")
    conversation = Conversation.objects.annotate(latest_msg=Subquery(latest_message.values("message")[:1])).prefetch_related("user", "messages", "user__users_acc").filter(user=request.user)

    context = {"profile": profile, "posts": post, "profiles": profiles, "now": now, "status_obj": status_obj, "users": users, "videos": video, "conversation": conversation, "status_count": status_count}

    if request.method == 'POST':
        if "home_post" in request.POST:
            home_post_image = request.FILES.getlist('photoimages')
            home_post_caption = request.POST.get("home_post_caption")
            print(home_post_image, home_post_caption)
            if not home_post_image and not home_post_caption:
                messages.info(request, "Post must contain text or image")
                return redirect('home')
            else:
                post = Post.objects.create(user=request.user, caption=home_post_caption)
                for image in home_post_image:
                    postimage = PostImage.objects.create(post=post, image=image)
                    postimage.save()
                return redirect('home')
        elif "content_upload" in request.POST:
            post_images = request.FILES.getlist('post_image')
            post_caption = request.POST.get("post_caption")

            if not post_images and not post_caption:
                messages.info(request, "Post must contain text or image")
                return redirect('home')
            else:
                post = Post.objects.create(user=request.user, caption=post_caption)
                for post_image in post_images:
                    postImage = PostImage.objects.create(post=post, image=post_image)
                    postImage.save()
                return redirect('home')

        elif "status_submit" in request.POST:

            status_text = request.POST.get("statusText")
            status_image = request.FILES.get('statusImages')
            expires = timezone.now() + timedelta(hours=24)
            status = Status.objects.create(user=request.user, caption=status_text, image=status_image, expires_at=expires)
            status.save()
            return redirect('home')
        
        elif "video_submit" in request.POST:
            video = request.FILES.get("videoUpload")
            video_caption = request.POST.get("video_caption")
            
            video_upload = Video.objects.create(user=request.user, video=video, caption=video_caption)
            video_upload.save()
            return redirect('home')

        else:
            return redirect('home')
    else: 
        return render(request, 'auth/home.html', context)


@login_required(login_url='login')
def follow(request, profile_id):
    profile = ProfilePage.objects.get(id=profile_id)
    profile_user = ProfilePage.objects.get(user=request.user)
    is_follow = True
    if profile_user.follow.filter(id=profile.id).exists():
        profile_user.follow.remove(profile)
        is_follow = False
    else:
        profile_user.follow.add(profile)
    return JsonResponse(
        {"followers_count": profile.followers.count(), 
         "following_count": profile.follow.count(),
         "is_follow": is_follow
         })


@login_required(login_url='login')
def search(request):
    if request.method == 'GET':
        search = request.GET.get('search')
        profile = ProfilePage.objects.get(user=request.user)
        # first, last = search.split(" ")
        user_follow = [profile.user for profile in request.user.users_acc.follow.all()]
        print(user_follow)
        profile = ProfilePage.objects.filter(fullname__icontains=search)[:15]
        profile_user = ProfilePage.objects.get(user=request.user)
        context = {"profile": profile, "profile_user":profile_user}
        return render(request, 'auth/search.html', context)
    else:
        return render(request, 'auth/search.html')


#fullname validation
@login_required(login_url='login')    
def fullname(request):
    if request.method == 'POST':
        firstname = request.POST['firstname'].strip()
        lastname = request.POST['lastname'].strip()
        if len(firstname) < 3 and len(lastname) < 3:
            messages.info(request, "Name is too short must be atleast 3 character")
            return redirect("fullname")
        else:
            user_profile = User.objects.get(username=request.user.username)
            fullname = firstname + " " + lastname
            try:
                ProfilePage.objects.get(user=user_profile)
                return redirect("login")
            except ProfilePage.DoesNotExist:
                profile = ProfilePage.objects.create(user=user_profile, firstname=firstname, lastname=lastname, fullname=fullname)
                profile.save()
                return redirect('home')
    else:
        return render(request, 'auth/fullname.html')
 

#profile validation
@login_required(login_url='login')   
def profile(request, username):
    user_obj = User.objects.get(username=request.user.username)
    user = User.objects.get(username=username)
    profile_info = ProfilePage.objects.select_related("user").get(user=user_obj)
    other_profile = ProfilePage.objects.select_related("user").get(user=user)
    posts = Post.objects.prefetch_related("image", "comments", "likes", "user__users_acc").select_related("user").filter(user__username=username)
    others_post = Post.objects.prefetch_related("image", "comments", "likes", "user__users_acc").select_related("user").filter(user__username=username)
    post_count = Post.objects.prefetch_related("image", "comments").filter(user__username=username).count()
    user_not_follow = ProfilePage.objects.select_related("user").exclude(followers__user=profile_info.id)
    context = {'username': username, 
               'profile_info': profile_info, 
               'other_profile': other_profile, 
               "posts": posts,
               'post_count': post_count,
               'others_post': others_post,
               'user_not_follow': user_not_follow}
    
    if request.method == 'POST':
        if 'profile_submit' in request.POST:
            profile_pic = request.FILES.get("profileimage")
            print(profile_pic, request.FILES)
            if profile_pic is not None:
                profile_info.image = profile_pic
                print(profile_pic)
                profile_info.save()
                return redirect('profile', request.user.username)
            else:
                profile_info.image = profile_info.image
                profile_info.save()
                return redirect('profile', request.user.username)
        
        elif 'post_submit' in request.POST:
    
            post_caption = request.POST['post_caption']
            post_image = request.FILES.getlist('post_image')
            
            if not post_caption and not post_image:
                messages.info(request, 'Post must contain text or image')
                return redirect('profile', request.user.username)
            else:
                post = Post.objects.create(user=request.user, caption=post_caption)
                for image in post_image:
                    post_Image = PostImage.objects.create(post=post, image=image)
                    post_Image.save()  
                return redirect('home')
            
        elif "content_upload" in request.POST:
            post_images = request.FILES.getlist('post_images')
            post_captions = request.POST.get("post_captions")

            if not post_images and not post_captions:
                messages.info(request, "Post must contain text or image")
                return redirect('home')
            else:
                post = Post.objects.create(user=request.user, caption=post_captions)
                for post_img in post_images:
                    postImage = PostImage.objects.create(post=post, image=post_img)
                    postImage.save()
                return redirect('home')
            
        elif "cover_upload" in request.POST:
            cover_pic = request.FILES.get("coverphoto")
            get_profile = ProfilePage.objects.get(user=request.user)
            get_profile.cover = cover_pic
            get_profile.save()
            return redirect("profile", request.user.username)
        else:
            return render(request, 'auth/profile.html', context)
    else:
        return render(request, 'auth/profile.html', context)

#profile_display
@login_required(login_url='login')   
def profile_display(request, pk):
    profile = ProfilePage.objects.get(id=pk)
    context = {"profile": profile}
    return render(request, 'auth/profile_display.html', context)

#setting validation
@login_required(login_url='login')
def setting(request, user):
    profile_info = ProfilePage.objects.get(user=request.user)
    context = {'profile_info': profile_info}
    if request.method == 'POST':
        firstname = request.POST['firstname'].strip()
        lastname = request.POST['lastname'].strip()
        bio = request.POST['bio'].strip()
        website = str(request.POST['website']).strip()
        address = request.POST['address'].strip()
        if len(firstname) <= 3 and len(lastname) <= 3:
            messages.info(request, "Name must be at least 4 character")
            return redirect('setting', request.user.username)
        else:
            profile_info.firstname = firstname
            profile_info.lastname = lastname
            profile_info.fullname = firstname + " " + lastname
            profile_info.bio = bio
            profile_info.website = website.split("//")[1]
            profile_info.address = address
            profile_info.save()
            return redirect('home')
    else:
        return render(request, 'auth/settings.html', context)


@login_required(login_url='login')
def postLikes(request, post_id):
    post = Post.objects.get(id=post_id)
    if post.likes.filter(id=request.user.id).exists():
        post.likes.remove(request.user)
    else:
        post.likes.add(request.user)
    return JsonResponse({
        "post_likes": post.likes.count()
    })


@login_required(login_url="login")
def videoLikes(request, video_id):
    video = Video.objects.get(id=video_id)
    if request.user in video.user_likes.all():
        video.user_likes.remove(request.user)
    else:
        video.user_likes.add(request.user)
    return JsonResponse({
        "video_count": video.user_likes.count()
    })

#POST COMMENT
@login_required(login_url='login')
def postComment(request, post_id):
    user = User.objects.get(username=request.user.username)
    profile = ProfilePage.objects.select_related("user").get(user=user)
    follow_user_obj = profile.follow.values_list("user", flat=True)
    profiles = ProfilePage.objects.exclude(user__in=follow_user_obj).select_related('user')[:5]
    post = Post.objects.select_related("user", "user__users_acc").get(id=post_id)
    comment = Comment.objects.select_related("post", "user", "user__users_acc").filter(post=post)
    context = {"profile": profile, "post": post, "comments": comment, "profiles": profiles}
    if request.method == 'POST':
        comment_text = request.POST.get('comment')
        comment = Comment.objects.create(user=request.user, post=post, text=comment_text)
        comment.save()
        return JsonResponse({
            "image": profile.image.url,
            "comment_text": comment.text,
            "fullname": profile.fullname,
            "username": profile.user.username
        }, safe=False)
    else:
        return render(request, 'auth/comment_page.html', context)


#VIDEO COMMENT
@login_required(login_url='login')
def videoComment(request, video_id):
    user = User.objects.get(username=request.user.username)
    video = Video.objects.select_related("user").prefetch_related("user_likes").get(id=video_id)
    profile = ProfilePage.objects.select_related("user", "user__users_acc").get(user=request.user)
    videoComment = VideoComment.objects.select_related("user", "video").filter(video=video)
    follow_user_obj = profile.follow.values_list("user", flat=True)
    profiles = ProfilePage.objects.exclude(user__in=follow_user_obj).select_related('user')[:5]
    
    context = {"video": video, "profile": profile, "profiles": profiles, "videocomment": videoComment}
    if request.method == 'POST':
        videocomment = request.POST.get("videocomment")
        video_comment = VideoComment.objects.create(user=user, video=video, comment_text=videocomment)
        video_comment.save()
        return JsonResponse({
            "image": profile.image.url,
            "comment_text": video_comment.comment_text,
            "fullname": profile.fullname,
            "username": profile.user.username
        }, safe=False)
    else:
        return render(request, 'auth/video_comment.html', context)
    

@login_required(login_url='login')
def friend(request):
    profile = ProfilePage.objects.prefetch_related("follow").select_related('user').get(user=request.user)
    users = User.objects.exclude(id=request.user.id).prefetch_related('users_acc')
    context = {"profile": profile, "users": users}
    return render(request, "chat/friend.html", context)


def friend_request(request, id):
    profile_following = ProfilePage.objects.get(id=id)
    currentProfile = ProfilePage.objects.get(user=request.user)
    isFollow = "Follow"

    if profile_following in currentProfile.follow.all():
        currentProfile.follow.remove(profile_following)
        isFollow = "Follow"
    else:
        currentProfile.follow.add(profile_following)
        isFollow = "Following"

    return JsonResponse(isFollow, safe=False)


@login_required(login_url='login')
def status(request, username):
    now = timezone.now()
    profile = ProfilePage.objects.get(user=request.user)    
    user_obj = User.objects.get(username=username)
    status = Status.objects.filter(user=user_obj, expires_at__gt=now)
    user_follow = [ profile.user for profile in request.user.users_acc.follow.all() ]
    status_follow = Status.objects.filter(user__in=user_follow, expires_at__gt=now, user=OuterRef('pk')).order_by("-created_at")
    users = User.objects.exclude(id=request.user.id).annotate(user_status=Subquery(status_follow.values("user")[:1]))

    other_profile = ProfilePage.objects.filter(user__in=user_follow)
    
    context = {"profile": profile, "status_obj": status, "now": now, "user_obj": user_obj, "other_profile": other_profile, "users": users}
    return render(request, 'auth/status.html', context)


#deletepost
def deletePost(request, post_id):
    postDelete = Post.objects.get(id=post_id).delete()
    return redirect('home')

#deleteVideo
def deleteVideo(request, video_id):
    videoDelete = Video.objects.get(id=video_id).delete()
    return redirect('home')

#editPost
def editPost(request, post_id):
    post = Post.objects.get(id=post_id)
    if request.method == "POST":
        update_caption = request.POST.get("caption")
        post.caption = update_caption
        post.save()
        return JsonResponse({"success": "Update Successfully", "caption": update_caption}, safe=False)
    else:
        return JsonResponse({"error": "Failed to Update Post"})

#editVideo
def editVideo(request, video_id):
    video = Video.objects.get(id=video_id)
    if request.method == "POST":
        update_caption = request.POST.get("caption")
        video.caption = update_caption
        video.save()
        return JsonResponse({"success": "Update Successfully", "caption": update_caption}, safe=False)
    else:
        return JsonResponse({"error": "Failed to Update Post"})

#sharePost
def sharePost(request, post_id):
    profile = ProfilePage.objects.select_related("user").get(user__username=request.user.username)
    post = Post.objects.select_related("user").prefetch_related("image").filter(id=post_id).first()
    print(post)
    context = {"profile": profile, "post": post}
    if request.method == "POST":
        repost_caption = request.POST.get("repost_caption")
        share = Share.objects.create(user=request.user, post=post, caption=repost_caption)
        post.share = F("share") + 1
        post.save()
        share.save()
        return JsonResponse({"success": "post shared successfully"})
    else:
        return render(request, "auth/repost.html", context)

#shareVideo
def shareVideo(request, video_id):
    profile = ProfilePage.objects.select_related("user").get(user__username=request.user.username)
    video = Video.objects.select_related("user").filter(id=video_id).first()
    print(video)
    context = {"profile": profile, "video": video}
    if request.method == "POST":
        repost_caption = request.POST.get("repost_caption")
        share = ShareVideo.objects.create(user=request.user, video=video, caption=repost_caption)
        video.share = F("share") + 1
        video.save()
        share.save()
        return JsonResponse({"success": "post shared successfully"})
    else:
        return render(request, "auth/repost_video.html", context)

#logout
@login_required(login_url='login') 
def logout(request):
    auth.logout(request)
    return redirect('login')
