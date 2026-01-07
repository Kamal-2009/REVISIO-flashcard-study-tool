from flask import Flask, flash,jsonify, redirect, render_template, request, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_wtf.csrf import CSRFProtect
from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError
from werkzeug.security import check_password_hash, generate_password_hash
from dotenv import load_dotenv
import os

load_dotenv()

# Configure flask with sqlalchemy, sessions and csrf
app = Flask(__name__)
CORS(
    app,
    supports_credentials=True,
    origins=["http://localhost:5173"]
)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config.update(
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=False  # must be False on HTTP
)
app.secret_key = os.urandom(24)
db = SQLAlchemy(app)

# sqlalchemy ORMs
class Card(db.Model):
    __tablename__ = "cards"
    card_id = db.Column(db.Integer, primary_key = True)
    ques = db.Column(db.Text, nullable = False)
    ans = db.Column(db.Text, nullable = False)
    did = db.Column(db.Integer, db.ForeignKey("decks.deck_id"), nullable = False)

class Deck(db.Model):
    __tablename__= "decks"
    deck_id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(255), nullable = False)
    description = db.Column(db.String(255), nullable = True)
    uid = db.Column(db.Integer, db.ForeignKey("users.id"), nullable = False)
    cards = db.relationship("Card", backref="deck", lazy = True, cascade="all, delete")
    user = db.relationship("User", back_populates="decks")

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(100), nullable = False, unique = True)
    email = db.Column(db.String(100), nullable = False, unique = True)
    hash = db.Column(db.String(255), nullable = False)
    decks = db.relationship("Deck", back_populates="user", lazy = True, cascade="all, delete")

@app.route('/load_decks')
def load_decks():
    if "user" not in session:
        return jsonify({
            "success": False,
            "error": "Log In to access decks"
        }), 401
    
    user = User.query.filter_by(username = session["user"]).first()

    if not user:
        return jsonify({
            "success": False,
            "error": "User not found!"
        }), 404
    
    # response = [{ deck.deck_id : { "name": deck.name, "description": deck.description } for deck in user.decks } ]
    response = [{ "deck_id": deck.deck_id, "name": deck.name, "description": deck.description, "num": len(deck.cards)} for deck in user.decks]

    return jsonify({
        "success": True,
        "decks": response
    }), 200

# add decks
@app.route('/add_deck', methods = ["GET", "POST"])
def add_deck():
    # Check if logged in
    username = session.get("user")

    # if not logged in
    if not username:
        return jsonify({
            "success": False,
            "error": "Log In to create a deck!"
        }), 401

    # Create deck
    if request.method == "POST":
        # get name and description
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "Bad Request"}), 400
        name = data.get("name")
        description = data.get("description")
        cards = data.get("cards")
        
        # confirm data specifications
        if not name:
            return jsonify({
                "success": False,
                "error": "Name is required"
            }), 400
        elif len(description) > 255:
            return jsonify({
                "success": False,
                "error": "Description must be less than 255 characters!"
            }), 400
        
        # Add deck and card data return to default route
        user = User.query.filter_by(username = username).first()
        if user:
            new_deck = Deck(name = name, description = description)
            user.decks.append(new_deck)
        else:
            return jsonify({
                "success": False, 
                "error": "User not Found!"
            }), 404
        
        for card in cards:
            ques = card.get("ques")
            ans = card.get("ans")
            if not ques or not ans:
                continue
            
            new_card = Card(ques = ques, ans = ans)
            new_deck.cards.append(new_card)

        db.session.commit()
        return jsonify({
            "success": True,
            "message": "Deck added Successfully!"
        })
    
    # fill form to create deck
    else:
        return render_template('add_deck.html')

# delete a deck
@app.route('/delete_deck', methods=["POST"])
def delete_deck():
    # get deck id and cast into int, return error if invalid datatype
    did = request.get_json()
    
    # get deck from Deck table
    deck = Deck.query.get(did)
    
    # if found, delete deck and commit
    if deck:
        db.session.delete(deck)
        db.session.commit()
        return jsonify({
            "success": True
        }), 200
    # if deck not found
    else:
        flash("Deck not found!", "warning")
        return jsonify({
            "success": False,
            "error": "Deck not found!"
        }), 404
    
# load all cards from a given deck 
@app.route('/load_cards/<int:deck_id>')
def load_cards(deck_id):
    if "user" not in session:
        return jsonify ({
            "success": False,
            "error": "User not logged in!" 
        }), 401
    
    user = User.query.filter_by(username = session["user"]).first()

    if not user:
        return jsonify({
            "success": False,
            "error": "User not found!"
        }), 404
    
    if deck_id not in [deck.deck_id for deck in user.decks]:
        return jsonify({
            "success": False,
            "error": "Unauthorized access"
        }), 403
    
    deck = Deck.query.filter_by(deck_id = deck_id).first()

    # get cards belonging to deck
    cards = Card.query.filter_by(did = deck_id).all()

    # convert cards into dicts for JSON response
    cards_dict = [
        {"card_id" : c.card_id, "ques": c.ques, "ans": c.ans, "did": c.did}
        for c in cards
    ]
    # return json response
    return jsonify({
        "success": True,
        "deck": {"name": deck.name, "description": deck.description},
        "cards": cards_dict
    }), 200

# login
@app.route('/login', methods = ["GET", "POST"])
def login():
    # form submitted
    if request.method == "POST":
        # get username, password from query
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "Bad Request"}), 400
        name = data.get("username")
        password = data.get("password")

        # name/password not entered
        if not name or not password:
            return jsonify({
                "success": False,
                "error": "Username and Password is Required!"
            }), 400

        # query for user
        user = User.query.filter_by(username = name).first()
        # user not found, register
        if not user:
            return jsonify({
                "success": False,
                "error": "Username Not Found!"
            }), 404
        
        # check password
        if not check_password_hash(user.hash, password):
            return jsonify({
                "success": False,
                "error": "Invalid Password!"
            }), 400
        
        # save session
        session["user"] = name
        return jsonify({
            "success": True,
            "message": "Logged in Successfully!"
        }), 200

    # load form
    else:
        return render_template('login.html')

# log out
@app.route('/logout')
def logout():
    # clear user credentials and redirect
    session.clear()
    return jsonify({
        "success": True,
        "message": "Logged Out Successfully!"
    }), 200

# register
@app.route('/register', methods = ["GET", "POST"])
def register():
    if request.method == "POST":
        # get user details from form
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "Bad Request"}), 400
        name = data.get("username")
        email = data.get("email")
        password = data.get("password")
        confirm_password = data.get("cnfmpass")

        # user already exists in database
        existing_user = User.query.filter(or_(User.username == name, User.email == email)).first()
        if existing_user:
            return jsonify({
                "success": False,
                "error": "Username/Email already exists"
            }), 409
        
        # confirm password
        if password != confirm_password:
            return jsonify({
                "success": False,
                "error": "Passwords do not match"
            }), 400

        # generate password hash and create ORM for new user
        hashed_password = generate_password_hash(password)
        new_user = User(username = name, email = email, hash = hashed_password)

        # save user to database
        try:
            db.session.add(new_user)
            db.session.commit()
            return jsonify({
                "success": True,
                "message": "Registration Successful!!"
            }), 201
        except IntegrityError:
            db.session.rollback()
            return jsonify({
                "success": False,
                "error": "Something Went wrong!"
            }), 500
    # render registration form
    else:
        return render_template('register.html')

@app.route('/me')
def me():
    if "user" not in session:
        # not logged in
        return jsonify({
            "logged_in": False
        })
    
    return jsonify({
        "logged_in": True
   })