from datetime import datetime
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy

bcrypt = Bcrypt()
db = SQLAlchemy()

class Follows(db.Model):
    """Connection of a follower <-> followed_user."""

    __tablename__ = 'follows'

    user_being_followed_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id', ondelete="cascade"),
        primary_key=True,
    )

    user_following_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id', ondelete="cascade"),
        primary_key=True,
    )


class Likes(db.Model):
    """Mapping between users and liked messages."""

    __tablename__ = 'likes'

    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete="cascade"), primary_key=True)
    message_id = db.Column(db.Integer, db.ForeignKey('messages.id', ondelete="cascade"), primary_key=True)


class User(db.Model):
    """User in the system."""

    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.Text, nullable=False, unique=True)
    username = db.Column(db.Text, nullable=False, unique=True)
    image_url = db.Column(db.Text, default="/static/images/default-pic.png")
    header_image_url = db.Column(db.Text, default="/static/images/warbler-hero.jpg")
    bio = db.Column(db.Text)
    location = db.Column(db.Text)
    password = db.Column(db.Text, nullable=False)

    messages = db.relationship('Message', backref='user', cascade='all, delete-orphan')

    liked_messages = db.relationship(
        'Message',
        secondary='likes',
        back_populates='liked_by_users'
    )

    followers = db.relationship(
        "User",
        secondary="follows",
        primaryjoin=(Follows.user_being_followed_id == id),
        secondaryjoin=(Follows.user_following_id == id),
        back_populates='following'
    )
    following = db.relationship(
        "User",
        secondary="follows",
        primaryjoin=(Follows.user_following_id == id),
        secondaryjoin=(Follows.user_being_followed_id == id),
        back_populates='followers'
    )

    def has_liked(self, message):
        """Check if the user has liked a specific message."""
        return message in self.liked_messages

    def __repr__(self):
        return f"<User #{self.id}: {self.username}, {self.email}>"

    def is_followed_by(self, other_user):
        """Check if this user is followed by another user."""
        return other_user in self.followers

    def is_following(self, other_user):
        """Check if this user is following another user."""
        return other_user in self.following

    @classmethod
    def signup(cls, username, email, password, image_url):
        """Sign up user with hashed password and add user to system."""
        hashed_pwd = bcrypt.generate_password_hash(password).decode('UTF-8')
        user = cls(
            username=username,
            email=email,
            password=hashed_pwd,
            image_url=image_url,
        )
        db.session.add(user)
        db.session.commit()
        return user

    @classmethod
    def authenticate(cls, username, password):
        """Find user with `username` and `password`."""
        user = cls.query.filter_by(username=username).first()

        if user and bcrypt.check_password_hash(user.password, password):
            return user
        return False


class Message(db.Model):
    """An individual message ("warble")."""

    __tablename__ = 'messages'

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(140), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)

    liked_by_users = db.relationship(
        'User',
        secondary='likes',
        back_populates='liked_messages'
    )


def connect_db(app):
    """Connect this database to provided Flask app."""
    db.app = app
    db.init_app(app)
