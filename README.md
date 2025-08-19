# flashcard-study-tool

📚 Flashcard Study Tool – Project Plan
🔹 Core Features (MVP)

User Accounts

Users can register, log in, and log out.

Each user has their own set of decks.

Deck Management

Create a new deck (e.g., “Biology Terms”).

View list of all decks.

Delete a deck.

Flashcards

Add cards with “Question” + “Answer.”

Edit or delete cards.

View all cards in a deck.

Study Mode

Show one card at a time.

Button to “flip” the card.

Next/Previous navigation.

🔹 Stretch Goals (Nice Extras)

Progress Tracking

Mark card as “Got it” or “Need practice.”

Show stats (% correct, streaks, etc.).

Tagging & Search

Allow searching within decks.

Add tags like “history,” “math.”

Spaced Repetition

Schedule harder cards to appear more often (like Anki).

Mobile-Friendly UI

Responsive design with Bootstrap or Tailwind.

🔹 Tech Stack

Backend: Flask (Python)

Database: SQLite (CS50’s default is fine)

users table → id, username, hash(password)

decks table → id, user_id, name

cards table → id, deck_id, question, answer, last_reviewed, score

Frontend: HTML, CSS, JavaScript

Optional: Bootstrap/Tailwind for styling

Templates: Jinja2 for dynamic HTML

🔹 Step-by-Step Build

Set up Flask project (app.py, templates/, static/).

User authentication (use werkzeug.security for password hashing).

Database models for users, decks, and cards.

Deck CRUD (create, read, delete decks).

Card CRUD (add, view, edit, delete cards).

Study mode with flip button + next/prev.

(Stretch) Add progress tracking or stats dashboard.

Polish UI with a clean design.

🔹 Demo Presentation Tips

Show login/registration → create a deck → add a few cards.

Enter study mode → flip through cards.

End by showing any extra feature (like stats or search).
