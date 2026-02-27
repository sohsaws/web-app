"use client";

import { CircleAlert } from "lucide-react";
import { motion } from "framer-motion";

export default function Exclamation() {
    return (
        <div className="flex items-center">
            <motion.div
                whileHover={{ scale: 1.2 }}
                initial={{ scale: 1 }}
                className="cursor-pointer"
            >
                <CircleAlert size={20} strokeWidth={1.5} color="#d97706"/>
            </motion.div>
        </div>
    )
}