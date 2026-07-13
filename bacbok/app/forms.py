from django import forms
from django.contrib.auth import get_user_model
from allauth.account.forms import SignupForm as AuthSignupForm
from allauth.account.forms import LoginForm as AuthLoginForm
import re

User = get_user_model()

class SignupForm(AuthSignupForm):
    email = forms.EmailField()
    username = forms.CharField(widget=forms.TextInput, max_length=200, min_length=4)
    password1 = forms.CharField(widget=forms.PasswordInput)
    password2 = forms.CharField(widget=forms.PasswordInput)

    def clean_email(self):
        email = self.cleaned_data.get("email")
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("Email Already Exist")
        
        return email
    
    def clean_username(self):
        username = self.cleaned_data.get("username")
        if User.objects.filter(username=username).exists():
            raise forms.ValidationError("Username Already Exits")
        
        elif len(username) < 4:
            raise forms.ValidationError("Username should not be less than 4 character")
        
        elif not re.search(r"[A-Z][a-zA-Z0-9]{3,}", username):
            raise forms.ValidationError("Username name must start with capital letter and atleast 4 character")
        
        return username
    
    def clean(self):
        cleaned_data = super().clean()

        pass1 = cleaned_data.get("password1")
        pass2 = cleaned_data.get("password2")
        username = cleaned_data.get("username")

        if pass1 != pass2:
            raise forms.ValidationError("check password, password not equal")
        
        elif username == pass1:
            raise forms.ValidationError("Username and password cannot be equal")
        
        return cleaned_data
    

class LoginForm(AuthLoginForm):
    email = forms.EmailField()
    password = forms.CharField(widget=forms.PasswordInput, max_length=150)

    