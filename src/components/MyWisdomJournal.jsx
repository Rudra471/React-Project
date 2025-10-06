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

export default MyWisdomJournal;