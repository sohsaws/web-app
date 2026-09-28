"use client";

import { ArrowUp, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { SuggestionsSearch } from "./suggestions-search.client";

export function AnimatedSearch() {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="flex h-10 w-full max-w-[min(500px,calc(100vw-2rem))] items-center justify-center px-4">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.button
            type="button"
            key="button"
            onClick={() => setIsExpanded(true)}
            className="group rounded-full bg-black p-2 transition-colors duration-200 hover:bg-white"
            initial={{ scale: 0.1, opacity: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.1, opacity: 1 }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
          >
            <Search
              className="text-white transition-colors duration-200 group-hover:text-black"
              size={20}
            />
          </motion.button>
        ) : (
          <motion.form
            key="search"
            className="relative flex h-10 w-full items-center"
            initial={{ width: 80, opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            exit={{ width: 80, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <div className="relative flex h-10 w-full items-center">
              <SuggestionsSearch />
              <button
                type="submit"
                className="group absolute right-4 transition-colors"
              >
                <ArrowUp
                  className="group-hover:text-zinc-300 text-white transition-colors duration-200"
                  size={24}
                />
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
