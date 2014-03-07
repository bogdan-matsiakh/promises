from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout

# Create your views here.
def index(request):
    if request.user.is_authenticated():
        return render(request, 'main/index.html')
    else:
        # Do something for anonymous users.
        return render(request, 'main/register.html')

def login(request):
    user = authenticate(username='john', password='secret')
    if user is not None:
        # the password verified for the user
        if user.is_active:
            login(request, user)
            # Redirect to a success page.
        else:
            print("The password is valid, but the account has been disabled!")
    else:
        # the authentication system was unable to verify the username and password
        print("The username and password were incorrect.")
        
def logout(request):
    index(request)
    
def register(request):
    index(request)