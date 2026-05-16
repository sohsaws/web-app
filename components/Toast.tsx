"use client";

import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function MyToast() {
	const searchParams = useSearchParams();

	useEffect(() => {
		if (searchParams.get("reason") === "unauthorized") {
			toast.warning("Please login to access this page");
		}
	}, []);
}
