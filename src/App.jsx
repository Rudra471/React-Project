import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic, Moon, Sun, Book, Bookmark, BookOpen, ChevronsDown, X } from 'lucide-react';

// --- Reusable Components ---

const VerseCard = ({ verse, onBookmark, isBookmarked, isExpanded = false }) => {
    const [view, setView] = useState('translation'); // 'sanskrit', 'transliteration', 'translation'
    const [showExplanation, setShowExplanation] = useState(isExpanded);

    if (!verse) return null;

    const views = {
        sanskrit: <p className="text-xl/relaxed text-center font-sanskrit whitespace-pre-wrap">{verse.sanskrit}</p>,
        transliteration: <p className="text-lg/relaxed text-center italic font-serif">{verse.transliteration}</p>,
        translation: <p className="text-lg/relaxed text-center font-serif">"{verse.translation}"</p>,
    };

    return (
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 dark:border-black/20 transition-all duration-300 animate-fade-in">
             <style>{`.animate-fade-in { animation: fadeIn 0.5s ease-in-out; } @keyframes fadeIn { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }`}</style>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-300 dark:from-orange-300 dark:to-amber-200">
                    Chapter {verse.chapter}, Verse {verse.verse}
                </h3>
                <button onClick={() => onBookmark(verse)} className={`transition-transform duration-200 hover:scale-125 ${isBookmarked ? 'text-amber-400' : 'text-slate-300 dark:text-slate-500'}`}>
                    <Bookmark className={isBookmarked ? 'fill-current' : ''} size={24} />
                </button>
            </div>

            <div className="min-h-[120px] flex items-center justify-center p-4">
                {views[view]}
            </div>

            <div className="flex justify-center items-center space-x-2 my-4">
                <button onClick={() => setView('sanskrit')} className={`px-3 py-1 text-sm rounded-full transition-colors ${view === 'sanskrit' ? 'bg-amber-400 text-white' : 'bg-white/20 dark:bg-black/20'}`}>Sanskrit</button>
                <button onClick={() => setView('transliteration')} className={`px-3 py-1 text-sm rounded-full transition-colors ${view === 'transliteration' ? 'bg-amber-400 text-white' : 'bg-white/20 dark:bg-black/20'}`}>Transliteration</button>
                <button onClick={() => setView('translation')} className={`px-3 py-1 text-sm rounded-full transition-colors ${view === 'translation' ? 'bg-amber-400 text-white' : 'bg-white/20 dark:bg-black/20'}`}>Translation</button>
            </div>
            
            <button onClick={() => setShowExplanation(!showExplanation)} className="w-full flex justify-center items-center p-2 text-sm text-slate-300 dark:text-slate-400 hover:text-white dark:hover:text-white transition-colors">
                <span>{showExplanation ? 'Hide' : 'Show'} Explanation</span>
                <ChevronsDown size={20} className={`ml-2 transition-transform duration-300 ${showExplanation ? 'rotate-180' : ''}`} />
            </button>

            {showExplanation && (
                <div className="mt-4 pt-4 border-t border-white/20 dark:border-black/30">
                    <h4 className="font-semibold mb-2 text-amber-500 dark:text-amber-300">Explanation & Context</h4>
                    <p className="text-base/relaxed text-slate-200 dark:text-slate-300">{verse.explanation}</p>
                </div>
            )}
        </div>
    );
};

const DailyVerse = ({ persona, onBookmark, bookmarks }) => {
    const [verse, setVerse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDailyVerse = async () => {
            setIsLoading(true);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second timeout

            const apiKey = "AIzaSyC1JrhyMexDkY3vqUrVQeax9OcyM0AAcYE"; // PASTE YOUR API KEY HERE
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
            
            const systemPrompt = `You are a wise spiritual guide deeply knowledgeable about the Bhagavad Gita. Your task is to provide an insightful daily verse randomly from full geeta. Respond ONLY with a valid JSON object that follows this exact schema: {"type": "OBJECT", "properties": {"chapter": {"type": "NUMBER"}, "verse": {"type": "NUMBER"}, "sanskrit": {"type": "STRING"}, "transliteration": {"type": "STRING"}, "translation": {"type": "STRING"}, "explanation": {"type": "STRING"}}, "required": ["chapter", "verse", "sanskrit", "transliteration", "translation", "explanation"]}. The 'explanation' should be inspiring and relevant for daily life. Do not include any text outside of the JSON object.`;
            const userPrompt = `Please provide an inspiring verse from the Bhagavad Gita suitable for a ${persona}.`;

            const payload = {
                contents: [{ parts: [{ text: userPrompt }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] },
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "OBJECT",
                        properties: { "chapter": { "type": "NUMBER" }, "verse": { "type": "NUMBER" }, "sanskrit": { "type": "STRING" }, "transliteration": { "type": "STRING" }, "translation": { "type": "STRING" }, "explanation": { "type": "STRING" } },
                    }
                }
            };
            
            try {
                const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: controller.signal });
                clearTimeout(timeoutId);

                if (!response.ok) {
                    const errorBody = await response.json().catch(() => ({ error: { message: `API failed with status: ${response.status}` } }));
                    throw new Error(errorBody?.error?.message || `API failed with status: ${response.status}`);
                }
                const result = await response.json();
                const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;
                if (jsonText) setVerse(JSON.parse(jsonText)); else throw new Error("Invalid response structure from API.");
            } catch (error) {
                clearTimeout(timeoutId);
                if (error.name === 'AbortError') {
                    console.error("Failed to fetch daily verse: Request timed out.");
                } else {
                    console.error("Failed to fetch daily verse:", error.message);
                }
                setVerse({
                    chapter: 18,
                    verse: 66,
                    sanskrit: "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रજ।\nअहं त्वा सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥",
                    transliteration: "sarva-dharmān parityajya mām ekaṁ śaraṇaṁ vraja...",
                    translation: "Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reactions. Do not fear.",
                    explanation: "This is a default verse displayed due to an error. It emphasizes surrender and faith as the ultimate path to liberation from fear and suffering."
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchDailyVerse();
    }, [persona]);

    return (
        <div className="w-full max-w-2xl mx-auto my-8">
            <h2 className="text-2xl font-bold text-center mb-4 text-white">Your Gita Wisdom for Today</h2>
            {isLoading ? (
                <div className="text-center p-8"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div><p className="text-sm mt-2 text-slate-400">Preparing your daily wisdom...</p></div>
            ) : verse ? (
                 <VerseCard verse={verse} onBookmark={onBookmark} isBookmarked={bookmarks.some(b => b.chapter === verse.chapter && b.verse === verse.verse)} isExpanded={true} />
            ) : (
                <p className="text-center text-slate-400">Could not load daily wisdom.</p>
            )}
        </div>
    );
};

const MyWisdomJournal = ({ bookmarks, onBookmark, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-900 dark:to-black w-full max-w-3xl h-[90vh] rounded-2xl p-6 shadow-2xl border border-white/10 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">My Wisdom Journal</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20 transition-colors"><X className="text-white" size={24} /></button>
                </div>
                <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                    {bookmarks.length > 0 ? (
                        bookmarks.map(verse => (
                             <VerseCard key={`${verse.chapter}.${verse.verse}`} verse={verse} onBookmark={onBookmark} isBookmarked={true} />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                            <Bookmark size={48} className="mb-4"/><p className="text-center">Your bookmarked verses will appear here.</p><p className="text-sm text-slate-500">Click the bookmark icon on any verse to save it.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Main Application Component ---

export default function App() {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [query, setQuery] = useState('');
    const [answer, setAnswer] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [persona, setPersona] = useState('professional');
    const [bookmarks, setBookmarks] = useState([]);
    const [showJournal, setShowJournal] = useState(false);
    const [chapterInput, setChapterInput] = useState('');
    const [verseInput, setVerseInput] = useState('');

    const answerRef = useRef(null);

    useEffect(() => {
        if (isDarkMode) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }, [isDarkMode]);
    
    const callGeminiAPI = async (userPrompt, systemPrompt) => {
        setIsLoading(true);
        setAnswer(null);
        setError(null);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const apiKey = "AIzaSyC1JrhyMexDkY3vqUrVQeax9OcyM0AAcYE"; // PASTE YOUR API KEY HERE
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        const payload = {
            contents: [{ parts: [{ text: userPrompt }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: { type: "OBJECT", properties: { "chapter": { "type": "NUMBER" }, "verse": { "type": "NUMBER" }, "sanskrit": { "type": "STRING" }, "transliteration": { "type": "STRING" }, "translation": { "type": "STRING" }, "explanation": { "type": "STRING" } }, }
            }
        };

        try {
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: controller.signal });
            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({ error: { message: `API error: ${response.status} ${response.statusText}` } }));
                throw new Error(errorBody?.error?.message || `API error: ${response.status} ${response.statusText}`);
            }
            const result = await response.json();
            const candidate = result.candidates?.[0];
            if (candidate && candidate.content?.parts?.[0]?.text) {
                const parsedAnswer = JSON.parse(candidate.content.parts[0].text);
                setAnswer(parsedAnswer);
            } else {
                throw new Error("Invalid response structure from API.");
            }
        } catch (err) {
            clearTimeout(timeoutId);
            if (err.name === 'AbortError') {
                console.error("API Call failed: Request timed out.");
                setError("The request took too long. Please check your connection and try again.");
            } else {
                console.error("API Call failed:", err.message);
                setError("Sorry, I couldn't retrieve wisdom at this moment. Please check your API key and try again.");
            }
        } finally {
            setIsLoading(false);
            setTimeout(() => { answerRef.current?.scrollIntoView({ behavior: 'smooth' }); }, 100);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query) return;
        const systemPrompt = `You are a wise spiritual guide deeply knowledgeable about the Bhagavad Gita. A user is asking a question. Your task is to find the most relevant verse (sloka) from the Bhagavad Gita in both english and hindi and in two or three lines that addresses their query. Then, provide a detailed explanation. Respond ONLY with a valid JSON object that follows this exact schema: {"type": "OBJECT", "properties": {"chapter": {"type": "NUMBER"}, "verse": {"type": "NUMBER"}, "sanskrit": {"type": "STRING"}, "transliteration": {"type": "STRING"}, "translation": {"type": "STRING"}, "explanation": {"type": "STRING"}}, "required": ["chapter", "verse", "sanskrit", "transliteration", "translation", "explanation"]}. The 'explanation' should connect the verse to the user's question, offer practical wisdom, and maintain a compassionate, guiding tone. Do not include any text outside of the JSON object.`;
        const userPrompt = `User query: "${query}"`;
        callGeminiAPI(userPrompt, systemPrompt);
    };
    
    const handleVerseLookup = async (e) => {
        e.preventDefault();
        if (!chapterInput || !verseInput) {
            setError("Please provide both chapter and verse.");
            setAnswer(null); // Clear previous answer
            return;
        }
        const systemPrompt = `You are a wise spiritual guide deeply knowledgeable about the Bhagavad Gita. Your task is to provide the full details for a specific verse requested by the user. Respond ONLY with a valid JSON object that follows this exact schema: {"type": "OBJECT", "properties": {"chapter": {"type": "NUMBER"}, "verse": {"type": "NUMBER"}, "sanskrit": {"type": "STRING"}, "transliteration": {"type": "STRING"}, "translation": {"type": "STRING"}, "explanation": {"type": "STRING"}}, "required": ["chapter", "verse", "sanskrit", "transliteration", "translation", "explanation"]}. Provide a detailed explanation of the verse's meaning, context, and practical application. Do not include any text outside of the JSON object.`;
        const userPrompt = `Please provide Bhagavad Gita Chapter ${chapterInput}, Verse ${verseInput}.`;
        callGeminiAPI(userPrompt, systemPrompt);
    };

    const toggleBookmark = (verse) => {
        setBookmarks(prev => {
            const isBookmarked = prev.some(b => b.chapter === verse.chapter && b.verse === verse.verse);
            if (isBookmarked) return prev.filter(b => !(b.chapter === verse.chapter && b.verse === verse.verse));
            else return [...prev, verse];
        });
    };

    return (
        <div className={`min-h-screen font-sans text-white bg-gradient-to-br from-orange-200 via-orange-300 to-amber-300 dark:from-slate-900 dark:via-slate-800 dark:to-gray-900 transition-colors duration-500`}>
           <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Tiro+Devanagari+Sanskrit&display=swap'); .font-sans { font-family: 'Inter', sans-serif; } .font-sanskrit { font-family: 'Tiro Devanagari Sanskrit', serif; }`}</style>
            <header className="sticky top-0 z-40 bg-white/10 dark:bg-black/20 backdrop-blur-lg">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center space-x-2"><img src="https://placehold.co/40x40/f97316/ffffff?text=ॐ" alt="Gita Icon" className="rounded-full" /><h1 className="text-xl font-bold tracking-tight">Gita Guidance</h1></div>
                    <div className="flex items-center space-x-4">
                        <a href="https://sanskritacademy.delhi.gov.in/sites/default/files/2022-09/final_geeta.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-sm hover:text-amber-300 transition-colors">
                            <BookOpen size={20} /><span>Read Gita</span>
                        </a>
                        <button onClick={() => setShowJournal(true)} className="flex items-center space-x-2 text-sm hover:text-amber-300 transition-colors"><Book size={20} /><span>Journal ({bookmarks.length})</span></button>
                        <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full hover:bg-white/20 dark:hover:bg-black/20 transition-colors">{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
                    </div>
                </div>
            </header>
            <main className="container mx-auto px-4 py-8 md:py-16">
                <div className="text-center mb-12"><h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-black dark:from-white dark:to-slate-300">Find Timeless Wisdom</h2><p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Ask any question, doubt, or query. Receive guidance and solutions inspired directly from the Bhagavad Gita.</p></div>
                <div className="max-w-2xl mx-auto mb-12">
                    <form onSubmit={handleSearch} className="relative">
                        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="What is the purpose of life?" className="w-full pl-12 pr-24 py-4 rounded-full bg-white/20 dark:bg-black/30 border border-white/30 dark:border-black/30 focus:ring-2 focus:ring-amber-400 focus:outline-none placeholder-slate-500 dark:placeholder-slate-400 shadow-lg" />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2"><Search className="text-slate-500 dark:text-slate-400" /></div>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2"><button type="button" className="p-2 rounded-full hover:bg-white/30 dark:hover:bg-black/40 transition-colors"><Mic size={20} className="text-slate-500 dark:text-slate-400"/></button><button type="submit" className="px-4 py-2 bg-amber-500 hover:bg-amber-600 rounded-full text-white font-semibold transition-colors">Ask</button></div>
                    </form>
                </div>
                
                <div className="text-center my-8 relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-white/20 dark:border-black/30"></div></div>
                    <div className="relative flex justify-center"><span className="bg-orange-200 dark:bg-slate-800 px-2 text-sm text-slate-500 dark:text-slate-400">OR</span></div>
                </div>

                <div className="max-w-sm mx-auto mb-12">
                    <form onSubmit={handleVerseLookup} className="flex items-center gap-2 sm:gap-4">
                        <input type="number" value={chapterInput} onChange={(e) => setChapterInput(e.target.value)} placeholder="Ch." className="w-20 p-3 rounded-full bg-white/20 dark:bg-black/30 border border-white/30 dark:border-black/30 focus:ring-2 focus:ring-amber-400 focus:outline-none text-center placeholder-slate-500 dark:placeholder-slate-400" min="1" max="18"/>
                        <input type="number" value={verseInput} onChange={(e) => setVerseInput(e.target.value)} placeholder="Verse" className="w-20 p-3 rounded-full bg-white/20 dark:bg-black/30 border border-white/30 dark:border-black/30 focus:ring-2 focus:ring-amber-400 focus:outline-none text-center placeholder-slate-500 dark:placeholder-slate-400" min="1"/>
                        <button type="submit" className="flex-grow px-4 py-3 bg-amber-500 hover:bg-amber-600 rounded-full text-white font-semibold transition-colors">Get Verse</button>
                    </form>
                </div>

                <div ref={answerRef} className="max-w-2xl mx-auto">
                    {error && (<div className="text-center p-4 mb-4 bg-red-500/20 text-red-300 rounded-lg"><p>{error}</p></div>)}
                    {isLoading && (<div className="text-center py-8"><div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div><p className="mt-4 text-slate-500 dark:text-slate-400">Seeking wisdom from the cosmos...</p></div>)}
                    {answer && (<VerseCard verse={answer} onBookmark={toggleBookmark} isBookmarked={bookmarks.some(b => b.chapter === answer.chapter && b.verse === answer.verse)} isExpanded={true} />)}
                </div>

                <div className="text-center mt-16">
                     <label htmlFor="persona-select" className="mr-4 text-slate-600 dark:text-slate-400">I am a:</label>
                     <select id="persona-select" value={persona} onChange={(e) => setPersona(e.target.value)} className="bg-white/20 dark:bg-black/30 rounded-full px-4 py-2 border border-white/30 dark:border-black/30 focus:ring-2 focus:ring-amber-400 focus:outline-none"><option value="professional">Professional</option><option value="student">Student</option><option value="seeker">Spiritual Seeker</option></select>
                </div>
                <DailyVerse persona={persona} onBookmark={toggleBookmark} bookmarks={bookmarks} />
            </main>
            {showJournal && <MyWisdomJournal bookmarks={bookmarks} onBookmark={toggleBookmark} onClose={() => setShowJournal(false)} />}
            <footer className="text-center py-8 border-t border-white/20 dark:border-black/20"><p className="text-sm text-slate-600 dark:text-slate-400">Embrace the wisdom. Find your path.</p></footer>
        </div>
    );
}

