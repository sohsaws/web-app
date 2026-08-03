"use client";

import { useEffect, useRef, useState } from "react";

type SearchResult = {
  id: string;
  topic: string;
};

export function SuggestionsSearch() {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const listRef = useRef<HTMLInputElement>(null);
  const searchTimeout = useRef<number | undefined>(undefined);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (listRef.current && !listRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      if (searchTimeout.current) {
        window.clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  const handleSearch = async (value: string) => {
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: value,
        }),
      });

      if (!response.ok) {
        throw new Error("Search request failed");
      }

      const { results } = await response.json();
      setSuggestions(results);
    } catch (error) {
      console.error(error);
      setSuggestions([]);
    }
  };

  return (
    <div className="absolute w-full">
      <input
        ref={listRef}
        type="text"
        onFocus={() => setIsOpen(true)}
        value={inputValue}
        name="query"
        onChange={(e) => {
          const nextValue = e.target.value;
          setInputValue(nextValue);
          if (searchTimeout.current) {
            window.clearTimeout(searchTimeout.current);
          }
          searchTimeout.current = window.setTimeout(() => {
            handleSearch(nextValue);
          }, 250);
        }}
        placeholder="Your wish..."
        className="w-full h-10 bg-stone-950 text-white placeholder-gray-400 rounded-2xl px-6 py-4 pr-14 text-lg outline-none focus:ring-1 focus:ring-stone-50 transition-all"
      />

      <ul className="absolute top-12 left-0 w-full bg-stone-500">
        {isOpen &&
          suggestions.map((suggestion) => (
            <li key={suggestion.id} className="p-2 text-white">
              <p>{suggestion.topic}</p>
            </li>
          ))}
      </ul>
    </div>
  );
}
