<h1>Gita Guidance 🕉️ </h1>
Gita Guidance is a modern, AI-powered web application that provides wisdom and answers from the Bhagavad Gita. Ask any question, look up specific verses, or receive a personalized daily verse to guide you on your path.

(Replace this placeholder with a screenshot of your running application!)

✨ Core Features
AI-Powered Q&A: Ask any life question, doubt, or query and receive a relevant verse and a detailed, AI-generated explanation inspired by the Bhagavad Gita.

Specific Verse Lookup: Have a favorite verse? Instantly look up any sloka by its chapter and verse number.

Daily Wisdom: Get a personalized "Verse for Today" tailored to your selected persona (e.g., Student, Professional, Spiritual Seeker).

Wisdom Journal: Bookmark your favorite verses and save them in a personal, easily accessible journal.

Multi-Language Verse Display: View verses in the original Sanskrit (Devanagari script), an English transliteration, and a clear English translation.

Themed UI: A beautiful, responsive interface with a spiritual theme, complete with seamless light and dark modes.

External Gita Resource: A direct link to the Gita Press, Gorakhpur's online version of the Bhagavad Gita for further reading.

🚀 Tech Stack
Frontend: React (with Vite)

Styling: Tailwind CSS

AI & Language Model: Google Gemini API

Icons: Lucide React

🛠️ Setup and Installation
Follow these steps to get the project running on your local machine.

1. Prerequisites
Make sure you have Node.js (version 16 or higher) and npm installed on your system.

2. Clone the Repository
git clone [https://github.com/your-username/gita-guidance.git](https://github.com/your-username/gita-guidance.git)
cd gita-guidance

3. Install Dependencies
Install all the required npm packages.

npm install

4. Set Up Your Environment Variables
This project requires an API key from Google AI Studio to connect to the Gemini API.

Create a new file in the root of your project directory called .env.

Open the .env file and add the following line, replacing YOUR_API_KEY_HERE with the key you obtained from Google AI Studio.

VITE_GEMINI_API_KEY=YOUR_API_KEY_HERE

Note: Using the VITE_ prefix is important for Vite projects to expose the environment variable to the frontend code.

Finally, you need to update the gita_guidance_app.jsx file to use this environment variable instead of a hardcoded key. Find the lines where apiKey is defined and change them to:

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

This is a more secure way to handle your API key.

5. Run the Application
Start the local development server.

npm run dev

The application should now be running at http://localhost:5173 (or the next available port).

💡 How to Use
Ask a Question: Type any question into the main search bar and press "Ask".

Get a Specific Verse: Use the "OR" section to enter a chapter and verse number, then click "Get Verse".

Change Persona: Use the dropdown menu below the answer section to change your persona and update the "Daily Wisdom" card.

Bookmark Verses: Click the bookmark icon on any verse card to save it to your Journal.

View Journal: Click the "Journal" button in the navigation bar to see all your saved verses.

🔮 Future Enhancements
Voice Input: Implement the microphone button to allow users to ask questions via speech.

User Profiles: Add user authentication to save journals and preferences across devices.

Community Section: Allow users to share reflections on verses.

Audio Pronunciation: Add a feature to listen to the correct Sanskrit pronunciation of each verse.

