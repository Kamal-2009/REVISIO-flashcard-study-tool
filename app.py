from flask import Flask, flash,jsonify, redirect, render_template, request, session
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError
from werkzeug.security import check_password_hash, generate_password_hash
import os

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql://root:Kamal%40182006@localhost:3306/flashcard"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.secret_key = os.urandom(24)
db = SQLAlchemy(app)

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

@app.route('/')
def index():
    if "user" not in session:
        return render_template("index.html")
    
    user = User.query.filter_by(username = session["user"]).first()

    if not user:
        flash("Error logging In! User not found", "error")
        return redirect("/login")
    
    return render_template('index.html', user = session["user"], decks = user.decks)

@app.route('/add_deck', methods = ["GET", "POST"])
def add_deck():
    username = session.get("user")
    if not username:
        flash("You must be logged in to create a deck", "error")
        return redirect("/login")

    if request.method == "POST":
        name = request.form.get("name")
        description = request.form.get("description") or ""
        try:
            num_of_cards = int(request.form.get("num_of_cards"))
        except (TypeError, ValueError):
            flash("Number of Cards must be an Integer!", "error")
            return redirect("/add_deck") 
        
        if not name:
            flash("Name is Required.", "error")
            return redirect("/add_deck")
        elif len(description) > 255:
            flash("Description must be less than 255 characters!", "error")
            return redirect("/add_deck")
        elif num_of_cards < 1 or num_of_cards > 10:
            flash("Range: 1-10", "error")
            return redirect("/add_deck")
        
        if username:
            user = User.query.filter_by(username = username).first()
            if user:
                new_deck = Deck(name = name, description = description)
                user.decks.append(new_deck)
            else:
                flash("user not found", "error")
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
        
    else:
        return render_template('add_deck.html')

@app.route('/delete_deck')
def delete_deck():
    try:
        did = int(request.args.get("deck_id"))
    except (TypeError, ValueError):
        flash("Invalid deck id!", "error")
        return redirect("/")
    
    deck = Deck.query.get(did)

    if deck:
        db.session.delete(deck)
        db.session.commit()
        flash("Deck deleted Successfully!", "error")
        return redirect("/")
    else:
        flash("Deck not found!", "error")
        return redirect("/")
    
@app.route('/load_cards')
def load_cards():
    try:
        deck_id = int(request.args.get("deck_id"))
    except (TypeError, ValueError):
        flash("Invalid Deck Id!", "error")
        return redirect("/")

    cards = Card.query.filter_by(did = deck_id).all()

    cards_dict = [
        {"card_id" : c.card_id, "ques": c.ques, "ans": c.ans, "did": c.did}
        for c in cards
    ]
    return jsonify(cards_dict)

@app.route('/login', methods = ["GET", "POST"])
def login():
    if request.method == "POST":
        name = request.form.get("username")
        password = request.form.get("password")

        if not name or not password:
            flash("Username and Password is Required!", "error")
            return redirect("/login")

        user = User.query.filter_by(username = name).first()
        if not user:
            flash("Username Not Found. <a href='/register'>Register</a>", "error")
            return redirect("/login")
        
        if not check_password_hash(user.hash, password):
            flash("Invalid Password.", "error")
            return redirect("/login")
        
        session["user"] = name
        flash("Logged in Successfully!", "success")
        return redirect("/")

    else:
        return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    flash("Logged Out Successfully!", "success")
    return redirect("/")

@app.route('/register', methods = ["GET", "POST"])
def register():
    if request.method == "POST":
        name = request.form.get("username")
        email = request.form.get("email")
        password = request.form.get("password")
        confirm_password = request.form.get("cnf_pass")

        existing_user = User.query.filter(or_(User.username == name, User.email == email)).first()
        if existing_user:
            flash("Username or email already exists", "error")
            return redirect("/register")
        
        if password != confirm_password:
            flash("Passwords do not match", "error")
            return redirect("/register")
        
        hashed_password = generate_password_hash(password)
        new_user = User(username = name, email = email, hash = hashed_password)

        try:
            db.session.add(new_user)
            db.session.commit()
            flash("Registration Successful! <a href='/login'>Login</a>", "success")
            return redirect("/register")
        except IntegrityError:
            db.session.rollback()
            flash("Something went wrong. Try again.", "error")
            return redirect("/register")
    else:
        return render_template('register.html')

@app.route('/statistics')
def statistics():
    return '<h1>TODO</h1>'

@app.route('/study')
def study():
    deck_id = request.args.get("deck_id")
    deck_name = request.args.get("deck_name")
    if not deck_id or not deck_name:
        flash("error accessing deck", "error")
        return redirect("/")
    return render_template("study.html", deck_name = deck_name, deck_id = deck_id)

