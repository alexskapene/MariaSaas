import React from 'react';

interface Props {
    value: string;
    onChange: (val: string) => void;
}

export const SearchBar: React.FC<Props> = ({ value, onChange }) => (
    <div className="relative group">
        <input
            type="text"
            placeholder="Scanner ou chercher (Nom/Code)..."
            className="w-full pl-14 pr-4 py-5 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border-2 border-slate-100 dark:border-slate-800 outline-none focus:border-sky-500/50 focus:ring-4 focus:ring-sky-500/10 font-bold dark:text-white transition-all text-lg"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            autoFocus
        />
        <svg className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
    </div>
);