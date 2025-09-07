# REVISIO - A Flashcard Study Tool
#### Video Demo:  https://youtu.be/l95GWDNdOvs
#### Description: 
For my CS50x Final Project, I created a web application called **Revisio**, which is a flashcard study tool designed to help students review and memorize material more effectively. The inspiration for Revisio came from my own study habits. While I found that digital flashcard systems like Anki are very powerful, they are also complex, heavy, and sometimes overwhelming for new users. I wanted to build a much simpler system that I could understand from the inside out, while also reinforcing what I had learned during the course about databases, web frameworks, and authentication.

---

### Purpose and Motivation

The main purpose of Revisio is to give users a lightweight but functional platform to create and review flashcards. Flashcards remain one of the most effective study methods, but most apps available today come with a large number of extra features, plugins, or syncing requirements. My goal was to focus on the core idea: a user should be able to log in, create a question and answer pair, and then use it for review later. Everything else is secondary.

From a learning perspective, my motivation was to apply the concepts of web programming, database design, and user authentication in a real project. Throughout CS50, I had built smaller, isolated projects such as finance, trivia, and search, but this final project was the first opportunity to design something end-to-end that could potentially be used by others.

---

### Features

The core features of Revisio are:

1. **User Authentication**  
   - New users can register with a username and password.  
   - Passwords are hashed using Werkzeug before storage in the database.  
   - Sessions are managed so that each user can stay logged in securely.

2. **Flashcard Creation**  
   - Users can create flashcards by entering a question and an answer.  
   - Each flashcard is linked to the specific user who created it.  
   - Data is stored in a MySQL database using SQLAlchemy as the ORM.

3. **Flashcard Viewing**  
   - Users can view all the flashcards they have created.  
   - Cards are displayed in a simple format that makes them easy to read.  
   - Each user only has access to their own data, so privacy is ensured.
   
4. **Vanilla JavaScript Enhancements**  
   - Implemented a simple internal API using JavaScript to fetch and display flashcards dynamically without reloading the page.  
   - Added a **flip animation** for cards using CSS and JavaScript, so that clicking a flashcard flips it to reveal the answer.

5. **Responsive Design**  
   - The HTML templates use basic CSS to remain clean and usable across devices.  
   - The goal was not to make the interface fancy, but functional and distraction-free.

---

### Technology Stack

Revisio is implemented using the following technologies:

- **Flask (Python)** as the main backend web framework.  
- **MySQL** as the database engine.  
- **SQLAlchemy** to map database tables to Python objects and simplify queries.  
- **Flask-WTF and CSRFProtect** for secure form handling.  
- **Werkzeug Security** for password hashing.  
- **HTML/CSS** for templates and styling.  

---

### Project Structure

The project is organized into the following key files and directories:

- `app.py` – main Flask application containing routes and logic.  
- `templates/` – contains the HTML templates rendered by Flask.  
- `static/` – contains the CSS stylesheet and other static files.  
- `requirements.txt` – lists all dependencies required to run the project.  

This organization keeps the code modular and separates concerns between logic, presentation, and data.

---

### Challenges Faced

One of the main challenges was getting MySQL configured properly. Since many CS50 examples use SQLite, switching to MySQL required me to learn how to set up the URI connection, manage migrations, and handle database errors. 

Another difficulty was ensuring that users could only see their own flashcards. At first, I accidentally displayed all cards in the database to every logged-in user. Fixing this required adding filtering logic so that flashcards are always tied to the currently logged-in user’s ID.

---

### Lessons Learned

Building Revisio taught me much more than just how to put together a Flask app. I learned the importance of structuring a project, documenting the code, and making design decisions early. I also gained hands-on experience with SQLAlchemy relationships and migrations. Beyond the technical skills, I learned that simplicity is often better than complexity. Instead of chasing every feature I could think of, I focused on getting the basics right and making sure they worked reliably.

---