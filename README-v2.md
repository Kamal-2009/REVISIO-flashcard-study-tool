# Revisio — AI-Powered Flashcard Study Tool

Revisio is a modern flashcard-based study application designed to help students turn their own study material into effective revision tools. Unlike traditional flashcard apps that rely on manual entry or pre-made decks, Revisio allows users to generate flashcards directly from their notes and PDFs using AI, while still keeping full control through editing and customization.

This version (v2) represents the evolution of the original CS50 project into a full single-page application with a React frontend, REST API backend, and AI-assisted card generation.

---

## What Revisio Does

Revisio allows users to:

- Create and manage flashcard decks  
- Study using an interactive flip-card interface  
- Upload PDFs or notes and automatically generate flashcards using AI  
- Edit, delete, and refine generated cards before saving  
- Keep all decks private and tied to their user account  

The focus of the app is to make **learning fast and personal** by turning a user’s own material into flashcards instead of relying on generic decks.

---

## Key Features

### AI-Powered PDF to Flashcards
Users can upload a PDF containing their notes or slides. Revisio extracts text from the document (including OCR for scanned PDFs) and sends it to an AI model, which generates structured flashcards. The generated cards are shown in the editor, where users can modify or delete them before saving.

### Manual Deck Creation
For users who prefer full control, decks can also be created entirely by hand through the flashcard editor.

### Interactive Study Mode
Flashcards use a smooth 3D flip animation. Users can move forward and backward through a deck and track their progress visually.

### Deck Management
Users can:
- Create decks
- Edit decks and cards
- Delete decks
- Study any deck they own  

All data is scoped to the logged-in user.

---

## Technology Stack

### Frontend
- React (Single Page Application)
- React Router for navigation
- Tailwind CSS for styling

### Backend
- Flask (Python)
- MySQL database
- SQLAlchemy ORM
- Flask sessions for authentication
- RESTful API for all data operations

### AI & PDF Processing
- PyMuPDF (fitz) for PDF parsing
- OCR for scanned PDFs
- OpenAI GPT-5 for flashcard generation from extracted text

---

## Project Structure
/
├── app.py # Flask backend
├── requirements.txt
├── frontend/ # React frontend
├── revisio-env/ # Python virtual environment
├── README.md # Original CS50 version
└── README-v2.md # This version


The frontend and backend are separated but live in the same repository.

---

## How the AI Pipeline Works

1. User uploads a PDF  
2. Backend extracts text from each page  
3. If a page has no selectable text, OCR is applied  
4. Extracted text is sent to the AI  
5. The AI returns flashcards in strict JSON format  
6. The frontend loads the cards into the deck editor  
7. The user edits and saves them  

This ensures the AI never writes directly to the database — the user stays in control.

---

## Why This Version Exists

The original Revisio was built for CS50 to demonstrate:
- Flask
- SQLAlchemy
- Authentication
- CRUD operations

This version expands on that foundation by adding:
- A React frontend
- A REST API architecture
- AI-based flashcard generation
- OCR and PDF processing
- A more polished user experience

It reflects growth from a course project into a real full-stack application.
