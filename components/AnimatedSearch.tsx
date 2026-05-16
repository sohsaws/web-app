"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, ArrowUp } from "lucide-react";
import FuseSearch from "./fuseSearch";

export default function AnimatedSearch() {
	const [isExpanded, setIsExpanded] = useState(false);
	return (
		<div className="flex items-center justify-center">
			<AnimatePresence mode="wait">
				{!isExpanded ? (
					<motion.button
						key="button"
						onClick={() => setIsExpanded(true)}
						className="bg-black hover:bg-zinc-300 rounded-full p-2 mt-1 transition-colors"
						initial={{ scale: 0.1, opacity: 1 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.1, opacity: 1 }}
						whileHover={{ scale: 1.2 }}
						whileTap={{ scale: 0.8 }}
					>
						<Search className="text-white" size={20} />
					</motion.button>
				) : (
					<motion.form
						key="search"
						className="relative"
						initial={{ width: 80, opacity: 0 }}
						animate={{ width: 500, opacity: 1 }}
						exit={{ width: 80, opacity: 0 }}
						transition={{ duration: 0.4, ease: "easeInOut" }}
					>
						<div className="relative flex items-center">
							<FuseSearch />
							<button
								type="submit"
								className="group absolute right-4 transition-colors"
							>
								<ArrowUp
									className="group-hover:text-zinc-300  text-white"
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
