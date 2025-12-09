import React from 'react';

export default function Footer() {
  return (
    <footer className="glass-panel border-t border-stone-200 dark:border-dark-border pt-10 pb-6 text-center mt-auto transition-colors duration-300 relative z-20">
        <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-2">Let's Connect</h2>
            <p className="text-stone-500 dark:text-stone-400 mb-8">Feel free to reach out for collaborations or just a friendly hello!</p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
                {/* GitHub */}
                <a href="https://github.com/pathumkashmira" target="_blank" rel="noreferrer" className="group p-3 bg-stone-100 dark:bg-stone-800 rounded-full hover:bg-[#333] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-1">
                    <svg className="w-5 h-5 text-stone-600 dark:text-stone-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
                {/* Facebook */}
                <a href="https://web.facebook.com/pethumkashmira2" target="_blank" rel="noreferrer" className="group p-3 bg-stone-100 dark:bg-stone-800 rounded-full hover:bg-[#1877F2] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-1">
                    <svg className="w-5 h-5 text-stone-600 dark:text-stone-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                </a>
                {/* WhatsApp */}
                <a href="https://wa.me/94769667684" target="_blank" rel="noreferrer" className="group p-3 bg-stone-100 dark:bg-stone-800 rounded-full hover:bg-[#25D366] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-1">
                    <svg className="w-5 h-5 text-stone-600 dark:text-stone-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                </a>
                {/* LinkedIn */}
                <a href="https://www.linkedin.com/in/pethum-kashmira/" target="_blank" rel="noreferrer" className="group p-3 bg-stone-100 dark:bg-stone-800 rounded-full hover:bg-[#0077b5] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-1">
                    <svg className="w-5 h-5 text-stone-600 dark:text-stone-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                {/* Medium */}
                <a href="https://medium.com/@kpethumkashmira" target="_blank" rel="noreferrer" className="group p-3 bg-stone-100 dark:bg-stone-800 rounded-full hover:bg-black hover:text-white hover:dark:bg-white hover:dark:text-black transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-1">
                    <svg className="w-5 h-5 text-stone-600 dark:text-stone-400 group-hover:text-white group-hover:dark:text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M0 0v24h24v-24h-24zm11.378 12.013c0 2.502-1.916 4.532-4.281 4.532-2.364 0-4.281-2.03-4.281-4.532 0-2.503 1.917-4.534 4.281-4.534 2.365 0 4.281 2.031 4.281 4.534zm5.722 0c0 2.324-1.288 4.209-2.876 4.209-1.59 0-2.877-1.885-2.877-4.209s1.287-4.21 2.877-4.21c1.588 0 2.876 1.886 2.876 4.21zm4.187 0c0 2.149-.614 3.891-1.373 3.891-.758 0-1.372-1.742-1.372-3.891 0-2.148.614-3.89 1.372-3.89.759 0 1.373 1.742 1.373 3.89z"/></svg>
                </a>
            </div>

            <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center justify-center gap-1">
                © {new Date().getFullYear()} Pethum Kashmira. <span className="hidden md:inline"> | </span> <br className="md:hidden" />
                Designed & Developed with 
                {/* 🔥 Animated Heart SVG */}
                <svg className="w-4 h-4 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                in Polonnaruwa, Sri Lanka 🇱🇰
            </p>
        </div>
    </footer>
  );
}