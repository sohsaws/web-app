"use client";

import { useState, useEffect, useRef } from "react";

type SearchResult = {
	id: string;
	topic: string;
};

export function SuggestionsSearch() {
	const [inputValue, setInputValue] = useState("");
	const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
	const [isOpen, setIsOpen] = useState(false);
	const listRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const handleClick = (e: MouseEvent) => {
			if (listRef.current && !listRef.current.contains(e.target as Node)) setIsOpen(false);
		};

		document.addEventListener("click", handleClick);
		return () => removeEventListener("click", handleClick);
	}, []);

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
		} catch (error) {
			console.log(error);
			alert("Something went wrong");
		}
	};

	return (
		<div className="absolute w-full">
			<input
				ref={listRef}
				type="text"
				onFocus={() => {
					if (isOpen) setIsOpen(false);
					else setIsOpen(true);
				}}
				value={inputValue}
				name="query"
				onChange={(e) => {
					setInputValue(e.target.value);
					handleSearch(e);
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
