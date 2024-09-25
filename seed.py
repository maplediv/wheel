"""Seed database with sample data from CSV Files."""

from csv import DictReader
from app import app, db  # Import the Flask app and db
from models import User, Message, Follows

# Run database operations within the app context
with app.app_context():
    db.drop_all()  # Drop all existing tables
    db.create_all()  # Create tables

    # Insert data from CSV files
    with open('generator/users.csv') as users:
        db.session.bulk_insert_mappings(User, DictReader(users))

    with open('generator/messages.csv') as messages:
        db.session.bulk_insert_mappings(Message, DictReader(messages))

    with open('generator/follows.csv') as follows:
        db.session.bulk_insert_mappings(Follows, DictReader(follows))

    # Commit the session
    db.session.commit()

    print("Database seeded successfully.")
