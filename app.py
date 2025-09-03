from flask import Flask, flash,jsonify, redirect, render_template, request, session
from flask_sqlalchemy import SQLAlchemy
from flask_wtf.csrf import CSRFProtect
from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError
from werkzeug.security import check_password_hash, generate_password_hash
import os

# Configure flask with sqlalchemy, sessions and csrf
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql://root:Kamal%40182006@localhost:3306/flashcard"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.secret_key = os.urandom(24)
csrf = CSRFProtect(app)
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

# default route
@app.route('/')
def index():
    # if not logged in
    if "user" not in session:
        return render_template("index.html")
    
    user = User.query.filter_by(username = session["user"]).first()

    # user not found
    if not user:
        flash("Error logging In! User not found", "danger")
        session.clear()
        return redirect("/login")
    
    # logged in
    return render_template('index.html', user = session["user"], decks = user.decks)

# add decks
@app.route('/add_deck', methods = ["GET", "POST"])
def add_deck():
    # Check if logged in
    username = session.get("user")

    # if not logged in
    if not username:
        flash("You must be logged in to create a deck", "info")
        return redirect("/login")

    # Create deck
    if request.method == "POST":
        # get name and description
        name = request.form.get("name")
        description = request.form.get("description") or ""

        # check for input type in no of cards
        try:
            num_of_cards = int(request.form.get("num_of_cards"))
        except (TypeError, ValueError):
            # Wrong type
            flash("Number of Cards must be an Integer!", "danger")
            return redirect("/add_deck") 
        
        # confirm data specifications
        if not name:
            flash("Name is Required.", "info")
            return redirect("/add_deck")
        elif len(description) > 255:
            flash("Description must be less than 255 characters!", "info")
            return redirect("/add_deck")
        elif num_of_cards < 1 or num_of_cards > 10:
            flash("Range: 1-10", "warning")
            return redirect("/add_deck")
        
        # Add deck and card data return to default route
        user = User.query.filter_by(username = username).first()
        if user:
            new_deck = Deck(name = name, description = description)
            user.decks.append(new_deck)
        else:
            flash("User not found", "danger")
            return redirect("/")
        
        for i in range(1, num_of_cards + 1):
            ques =  request.form.get(f"question{i}")
            ans = request.form.get(f"answer{i}")

            if not ques or not ans:
                continue

            new_card = Card(ques = ques, ans = ans)
            new_deck.cards.append(new_card)
        db.session.commit()
        flash("Deck Added Successfully!", "success")
        return redirect("/")
    
    # fill form to create deck
    else:
        return render_template('add_deck.html')

# delete a deck
@app.route('/delete_deck', methods=["POST"])
def delete_deck():
    # get deck id and cast into int, return error if invalid datatype
    try:
        did = int(request.form.get("deck_id"))
    except (TypeError, ValueError):
        flash("Invalid deck id!", "warning")
        return redirect("/")
    
    # get deck from Deck table
    deck = Deck.query.get(did)
    
    # if found, delete deck and commit
    if deck:
        db.session.delete(deck)
        db.session.commit()
        flash("Deck deleted Successfully!", "success")
        return redirect("/")
    # if deck not found
    else:
        flash("Deck not found!", "warning")
        return redirect("/")
    
# load all cards from a given deck 
@app.route('/load_cards')
def load_cards():
    # parse deck_id, must be an int
    try:
        deck_id = int(request.args.get("deck_id"))
    except (TypeError, ValueError):
        flash("Invalid Deck Id!", "danger")
        return redirect("/")

    # get cards belonging to deck
    cards = Card.query.filter_by(did = deck_id).all()

    # convert cards into dicts for JSON response
    cards_dict = [
        {"card_id" : c.card_id, "ques": c.ques, "ans": c.ans, "did": c.did}
        for c in cards
    ]
    # return json response
    return jsonify(cards_dict)

# login
@app.route('/login', methods = ["GET", "POST"])
def login():
    # form submitted
    if request.method == "POST":
        # get username, password from query
        name = request.form.get("username")
        password = request.form.get("password")

        # name/password not entered
        if not name or not password:
            flash("Username and Password is Required!", "warning")
            return redirect("/login")

        # query for user
        user = User.query.filter_by(username = name).first()
        # user not found, register
        if not user:
            flash("Username Not Found. <a href='/register'>Register here</a>", "warning")
            return redirect("/login")
        
        # check password
        if not check_password_hash(user.hash, password):
            flash("Invalid Password.", "warning")
            return redirect("/login")
        
        # save session
        session["user"] = name
        flash("Logged in Successfully!", "success")
        return redirect("/")

    # load form
    else:
        return render_template('login.html')

# log out
@app.route('/logout')
def logout():
    # clear user credentials and redirect
    session.clear()
    return redirect("/")

# register
@app.route('/register', methods = ["GET", "POST"])
def register():
    if request.method == "POST":
        # get user details from form
        name = request.form.get("username")
        email = request.form.get("email")
        password = request.form.get("password")
        confirm_password = request.form.get("cnf_pass")

        # user already exists in database
        existing_user = User.query.filter(or_(User.username == name, User.email == email)).first()
        if existing_user:
            flash("Username or email already exists", "info")
            return redirect("/register")
        
        # confirm password
        if password != confirm_password:
            flash("Passwords do not match", "warning")
            return redirect("/register")
        
        # generate password hash and create ORM for new user
        hashed_password = generate_password_hash(password)
        new_user = User(username = name, email = email, hash = hashed_password)

        # save user to database
        try:
            db.session.add(new_user)
            db.session.commit()
            flash("Registration Successful!", "success")
            return redirect("/login")
        except IntegrityError:
            db.session.rollback()
            flash("Something went wrong. Try again.", "danger")
            return redirect("/register")
    # render registration form
    else:
        return render_template('register.html')

# study a deck
@app.route('/study')
def study():
    # extract deck id and name
    deck_id = request.args.get("deck_id")
    deck_name = request.args.get("deck_name")
    if not deck_id or not deck_name:
        flash("error accessing deck", "warning")
        return redirect("/")
    return render_template("study.html", deck_name = deck_name, deck_id = deck_id)

