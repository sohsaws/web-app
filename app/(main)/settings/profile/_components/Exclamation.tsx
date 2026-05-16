"use client";

import { CircleAlert } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Exclamation() {
	return (
		<div className="flex items-center">
			<motion.div
				whileHover={{ scale: 1.2 }}
				initial={{ scale: 1 }}
				className="cursor-pointer"
			>
				<Link href="/verify-email/pending">
					<CircleAlert size={20} strokeWidth={1.5} color="#d97706" />
				</Link>
			</motion.div>
		</div>
	);
}
