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

export default VerseCard;