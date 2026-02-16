"use client"

import { useState } from "react";

export default function FuseSearch() {
    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const { value } = e.target;
            const response = await fetch("/api/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: value,
                }),
            });
            const { results } = await response.json();
            setSuggestions(results);
        } catch(error) {
            console.log(error);
            alert("Something went wrong");
        }
    };

    return (
        <div className="relative">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value);
                    handleSearch(e);
                }}
                placeholder="Whatever you wish..."
                className="w-full h-10 bg-stone-950 text-white placeholder-gray-400 rounded-2xl px-6 py-4 pr-14 text-lg outline-none focus:ring-1 focus:ring-stone-50 transition-all"
              />
              <ul className="absolute top-12 left-0 w-full bg-stone-500">
                {suggestions.map((suggestion, index) => (
                    <li key={index} className="p-2 text-white">
                        <p>{suggestion.topic}</p>
                    </li>
                ))}
              </ul>
        </div>
    )

}