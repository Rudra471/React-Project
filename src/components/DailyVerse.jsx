const DailyVerse = ({ persona, onBookmark, bookmarks }) => {
    const [verse, setVerse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDailyVerse = async () => {
            setIsLoading(true);
            const apiKey = ""; // API key will be injected in the execution environment
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
            
            const systemPrompt = `You are a wise spiritual guide deeply knowledgeable about the Bhagavad Gita. Your task is to provide an insightful daily verse. Respond ONLY with a valid JSON object that follows this exact schema: {"type": "OBJECT", "properties": {"chapter": {"type": "NUMBER"}, "verse": {"type": "NUMBER"}, "sanskrit": {"type": "STRING"}, "transliteration": {"type": "STRING"}, "translation": {"type": "STRING"}, "explanation": {"type": "STRING"}}, "required": ["chapter", "verse", "sanskrit", "transliteration", "translation", "explanation"]}. The 'explanation' should be inspiring and relevant for daily life. Do not include any text outside of the JSON object.`;
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
                const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                if (!response.ok) {
                    const errorBody = await response.json().catch(() => ({ error: { message: `API failed with status: ${response.status}` } }));
                    throw new Error(errorBody?.error?.message || `API failed with status: ${response.status}`);
                }
                const result = await response.json();
                const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;
                if (jsonText) setVerse(JSON.parse(jsonText)); else throw new Error("Invalid response structure from API.");
            } catch (error) {
                console.error("Failed to fetch daily verse:", error.message);
                setVerse({
                    chapter: 18, verse: 66,
                    sanskrit: "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।\nअहं त्वा सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥",
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

export default DailyVerse;