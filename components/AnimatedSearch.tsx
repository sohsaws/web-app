'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, LoaderPinwheel } from 'lucide-react';

export default function AnimatedSearch() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchValue.trim()) {
      console.log('Search submitted:', searchValue);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.button
            key="button"
            onClick={() => setIsExpanded(true)}
            className="bg-black hover:bg-zinc-300 rounded-full p-2.5 transition-colors"
            initial={{scale: 0.1, opacity: 1}}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Search className='text-white' size={20}/>
          </motion.button>
        ) : (
          <motion.form
            key="search"
            onSubmit={handleSubmit}
            className="relative"
            initial={{ width: 80, opacity: 0 }}
            animate={{ width: 500, opacity: 1 }}
            exit={{ width: 80, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Whatever you wish..."
                autoFocus
                onBlur={() => {
                  if (!searchValue.trim()) {
                    setIsExpanded(false);
                  }
                }}
                className="w-full h-10 bg-stone-950 text-white placeholder-gray-400 rounded-2xl px-6 py-4 pr-14 text-lg outline-none focus:ring-1 focus:ring-stone-50 transition-all"
              />
              <button
                type="submit"
                className="group absolute right-2 p-1 transition-colors"
              >
                <LoaderPinwheel className= 'group-hover:text-amber-100  text-white' size={24} />
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
