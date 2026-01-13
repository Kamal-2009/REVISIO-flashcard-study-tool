from flask import Flask, flash,jsonify, request, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError
from werkzeug.security import check_password_hash, generate_password_hash
from dotenv import load_dotenv
import os
import pymupdf
from openai import OpenAI
import json

load_dotenv()

# Configure flask with sqlalchemy, sessions and csrf
app = Flask(__name__)
CORS(
    app,
    supports_credentials=True,
    origins=[
        "http://localhost:5173",
        "https://revisio-api.onrender.com",
        "https://revisio-pi.vercel.app"
    ]
)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config.update(
    SESSION_COOKIE_SAMESITE="None",
    SESSION_COOKIE_SECURE=True  # must be False on HTTP
)
app.secret_key = os.urandom(24)
db = SQLAlchemy(app)
client = OpenAI()

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

with app.app_context():
    db.create_all()

@app.route('/load_decks')
def load_decks():
    # Check if user logged in
    if "user" not in session:
        return jsonify({
            "success": False,
            "error": "Log In to access decks"
        }), 401
    
    # get user details
    user = User.query.filter_by(username = session["user"]).first()

    # user not found
    if not user:
        return jsonify({
            "success": False,
            "error": "User not found!"
        }), 404
    
    # make list of decks for JSON response
    response = [{ "deck_id": deck.deck_id, "name": deck.name, "description": deck.description, "num": len(deck.cards)} for deck in user.decks]

    return jsonify({
        "success": True,
        "decks": response
    }), 200

# add decks
@app.route('/add_deck', methods = ['POST'])
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
        
    # get each card's details and add it to deck
    for card in cards:
        ques = card.get("ques")
        ans = card.get("ans")
        if not ques or not ans:
            continue
            
        new_card = Card(ques = ques, ans = ans)
        new_deck.cards.append(new_card)

    try:
        db.session.commit()
        return jsonify({
            "success": True,
            "message": "Deck added Succcessfuly!"
        }), 200
    except IntegrityError:
        db.session.rollback()
        return jsonify({
            "success": False,
            "error": "Something went wrong!"
        }), 500
    

# delete a deck
@app.route('/delete_deck', methods = ['POST'])
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
    
@app.route('/edit_deck', methods = ['POST'])
def edit_deck():
    if "user" not in session:
        return jsonify({
            "success": False,
            "error": "User not logged in!"
        }), 401
    
    user = User.query.filter_by(username = session["user"]).first()

    if not user:
        return jsonify({
            "success": False,
            "error": "User not found!"
        }), 404
    
    data = request.get_json()
    if not data:
        return jsonify({ "success": False, "error": "Bad Request"}), 400
    deck_id = int(data.get("deck_id"))
    new_name = data.get("name")
    new_description = data.get("description")
    new_cards = data.get("cards")

    if deck_id not in [deck.deck_id for deck in user.decks]:
        return jsonify({
            "success": False,
            "error": "Unauthorized access"
        }), 403
    
    deck = Deck.query.filter_by(deck_id = deck_id).first()
    deck.name = new_name
    deck.description = new_description

    cards = Card.query.filter_by(did = deck_id).all()

    for card in cards:
        for new_card in new_cards:
            if card.card_id == new_card["card_id"]:
                card.ques = new_card["ques"]
                card.ans = new_card["ans"]

    for new_card in new_cards:
        if new_card["card_id"] not in [card.card_id for card in cards]:
            deck.cards.append(Card(ques = new_card["ques"], ans = new_card["ans"]))

    try:
        db.session.commit()
        return jsonify({
            "success": True,
            "message": "Deck Edited Succcessfuly!"
        }), 200
    except IntegrityError:
        db.session.rollback()
        return jsonify({
            "success": False,
            "error": "Something went wrong!"
        }), 500

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
@app.route('/login', methods = ['POST'])
def login():
        
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

# log out
@app.route('/logout')
def logout():
    # clear user credentials
    session.clear()
    return jsonify({
        "success": True,
        "message": "Logged Out Successfully!"
    }), 200

# register
@app.route('/register', methods = ['POST'])
def register():
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

@app.route('/ai/generate', methods = ['POST'])
def generate():
    if "user" not in session:
        return jsonify({
            "success": False, 
            "error": "User not Logged in"
        }), 400
    
    f = request.files["file"]
    pdf_bytes = f.read()
    doc = pymupdf.Document(stream=pdf_bytes)

    if doc.page_count > 10:
        return jsonify({
            "success": False,
            "error": "PDF can at most be 10 pages long"
        }), 400

    request_text = """You are a flashcard generator.
                        Return ONLY valid JSON in this format:

                        [
                        { "id": "string", "ques": "string", "ans": "string" }
                        ]

                        Rules:
                        - id must be a unique string for each card (e.g., a UUID)
                        - No markdown
                        - No explanations
                        - No text before or after JSON
                        - Generate high-quality questions and concise, correct answers

                    Below is the content you will use: 
                    
    """
    for page in doc:
        text = page.get_text()
        if not text:
            tp = page.get_textpage_ocr()
            text = page.get_text(textpage = tp)
        request_text += text
    
    response = client.responses.create(
        model="gpt-5-nano",
        input=request_text
    )
    
    generated_cards = json.loads(response.output_text)

    return jsonify({ 
        "success": True,
        "cards": generated_cards
    }), 200