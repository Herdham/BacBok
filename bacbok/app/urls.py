from django.urls import path
from . import views
from chat.urls import urlpatterns


urlpatterns = [
    # path('', views.register, name='signup'),
    # path('accounts/login/', views.login, name='account_login'),
    path('login_check', views.login_check, name="login_check"),
    path('fullname', views.fullname, name='fullname'),
    path('home', views.home, name='home'),
    path('logout', views.logout, name='logout'),
    path('search', views.search, name='search'),
    path('profile/<str:username>', views.profile, name='profile'),
    path('profile_display/<int:pk>', views.profile_display, name='display'),
    path('setting/<str:user>', views.setting, name='setting'),
    path('postlikes/<int:post_id>', views.postLikes, name='postlikes'),
    path('videolikes/<int:video_id>', views.videoLikes, name="videolikes"),
    path('follow/<int:profile_id>', views.follow, name='follow'),
    path('friend', views.friend, name="friend"),
    path('friend_request/<int:id>', views.friend_request, name="friend_request"),
    path('postcomment/<int:post_id>', views.postComment, name='postcomment'),
    path('videocomment/<int:video_id>', views.videoComment, name='videocomment'),
    path('status/<str:username>', views.status, name='status'),
    path('delete_post/<int:post_id>', views.deletePost, name="deletePost"),
    path('delete_video/<int:video_id>', views.deletePost, name="deleteVideo"),
    path('edit/<int:post_id>', views.editPost, name="editPost"),
    path('editvideo/<int:video_id>', views.editVideo, name="editVideo"),
    path('share/<int:post_id>', views.sharePost, name="sharePost"),
    path('share_video/<int:video_id>', views.shareVideo, name="shareVideo"),
    urlpatterns[0],
    urlpatterns[3]
]