import os
from flask import Flask, render_template, request, flash, redirect, session, g, url_for
from flask_debugtoolbar import DebugToolbarExtension
from sqlalchemy.exc import IntegrityError
from flask_login import login_required, current_user, LoginManager
from forms import UserAddForm, LoginForm, MessageForm, UserEditForm
from models import db, connect_db, User, Message, Follows, Likes
from flask import request, redirect, url_for
from flask import render_template, redirect, url_for, flash


app = Flask(__name__)

# Initialize app configurations
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql://Joe:Magic323!@localhost/warbler')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = False
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = True
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', "it's a secret")

toolbar = DebugToolbarExtension(app)

# Connect the database to the Flask app
connect_db(app)

# Initialize LoginManager
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"  # Redirect users who are not logged in

# Load user from session
@login_manager.user_loader
def load_user(user_id):
    """Load the current user by ID."""
    return User.query.get(int(user_id))




from flask import redirect, url_for

@app.route('/messages/<int:message_id>/like', methods=['POST'])
def like_message(message_id):
    """Handle liking a message."""
    message = Message.query.get_or_404(message_id)
    if g.user:
        if message in g.user.liked_messages:
            print(f"User {g.user.username} is unliking message {message_id}")
            g.user.liked_messages.remove(message)
        else:
            print(f"User {g.user.username} is liking message {message_id}")
            g.user.liked_messages.append(message)
        db.session.commit()
    else:
        print("User is not logged in")
    
    return redirect(url_for('home'))



# Global user setup before each request
@app.before_request
def add_user_to_g():
    """If we're logged in, add the current user to Flask global object."""
    if 'curr_user' in session:
        g.user = User.query.get(session['curr_user'])
        print(f"Logged in as: {g.user.username}") 
    else:
        g.user = None
        print("Not logged in")
def do_login(user):
    """Log in a user."""
    session['curr_user'] = user.id

def do_logout():
    """Logout a user."""
    if 'curr_user' in session:
        del session['curr_user']


@app.route('/')
def home():
    if g.user:
        # Get the IDs of users being followed by the current user
        following_ids = [user.id for user in g.user.following]
        # Query messages from users being followed
        messages = Message.query.filter(Message.user_id.in_(following_ids)).order_by(Message.timestamp.desc()).limit(10).all()
    else:
        messages = []
    return render_template('home.html', messages=messages)





@app.route('/login', methods=["GET", "POST"])
def login():
    """Login user."""
    form = LoginForm()
    if form.validate_on_submit():
        user = User.authenticate(form.username.data, form.password.data)
        if user:
            do_login(user)
            flash("Welcome back!", "success")

            # Redirect to user's profile page after login
            next_page = request.args.get('next')
            if not next_page or next_page == url_for('login'):
                next_page = url_for('user_profile', user_id=user.id)  # Redirect to user's profile
            return redirect(next_page)

        flash("Invalid credentials.", "danger")
    
    return render_template('users/login.html', form=form)





@app.route('/signup', methods=["GET", "POST"])
def signup():
    """Sign up new user."""
    form = UserAddForm()
    if form.validate_on_submit():
        try:
            user = User.signup(
                username=form.username.data,
                email=form.email.data,
                password=form.password.data,
                image_url=form.image_url.data
            )
            db.session.commit()
            do_login(user)  # Log the user in after successful signup
            flash("Welcome! You've signed up successfully.", "success")
            return redirect(f'/users/{user.id}')  # Redirect to the user's profile page
        except IntegrityError:
            db.session.rollback()
            flash("Username or email already taken.", "danger")
    return render_template('signup.html', form=form)

@app.route('/logout')
def logout():
    """Handle user logout."""
    do_logout()
    flash("You have been successfully logged out.", "success")
    return redirect("/")

@app.route('/users/<int:user_id>')
def user_profile(user_id):
    """Show user profile."""
    user = User.query.get_or_404(user_id)
    return render_template('users/profile.html', user=user)

@app.route('/users/profile', methods=["GET", "POST"])
def edit_profile():
    """Edit user profile."""
    user = g.user  # Get the logged-in user
    if not user:
        flash("Please log in to edit your profile.", "danger")
        return redirect('/login')

    form = UserEditForm(obj=user)  # Pre-fill the form with the current user's data

    if form.validate_on_submit():
        user.username = form.username.data
        user.email = form.email.data
        user.image_url = form.image_url.data or user.image_url  # Keep existing if not provided
        user.header_image_url = form.header_image_url.data or user.header_image_url  # Keep existing if not provided
        user.bio = form.bio.data
        user.location = form.location.data

        db.session.commit()
        flash("Profile updated successfully.", "success")
        return redirect(url_for('user_profile', user_id=user.id))  # Redirect to the user's profile page

    return render_template('users/edit.html', form=form)  # Ensure this renders the edit.html

@app.route('/users/<int:user_id>/following')
def show_following(user_id):
    """Show list of people this user is following."""
    user = User.query.get_or_404(user_id)
    following = user.following  # Assuming a relationship called 'following' in your User model
    return render_template('users/following.html', user=user, following=following)

@app.route('/users/<int:user_id>/followers')
def show_followers(user_id):
    """Show list of people following this user."""
    user = User.query.get_or_404(user_id)
    followers = user.followers  # Assuming a relationship called 'followers' in your User model
    return render_template('users/followers.html', user=user, followers=followers)



@app.route('/messages/<int:message_id>/unlike', methods=["POST"])
def unlike_message(message_id):
    """Unlike a message."""
    like = Likes.query.filter_by(user_id=g.user.id, message_id=message_id).first()
    if like:
        db.session.delete(like)
        db.session.commit()
        flash("You unliked this message.", "success")
    return redirect(url_for('home'))

@app.route('/users/<int:user_id>/likes')
def liked_messages(user_id):
    """Show all liked messages of a user."""
    user = User.query.get_or_404(user_id)
    liked_messages = user.liked_messages
    return render_template('users/liked_messages.html', user=user, liked_messages=liked_messages)


if __name__ == '__main__':
    app.run(debug=True)
