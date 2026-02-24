"use client";

import { useRef } from "react";

export default function AvatarUpload(data: {image: string}) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
            <div className="flex-1">
                  <h3 className="text-sm font-medium text-white mb-1">Profile Picture</h3>
                  <p className="text-xs text-neutral-500 mb-4">
                    Supports JPG, PNG or GIF. Max 2 MB.
                  </p>
                  <div className="flex gap-3">
                    <input
                        ref={fileInputRef} 
                        type="file"
                        accept="image/*"
                        className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer px-4 py-2 text-xs font-medium text-neutral-300 bg-zinc-950 border border-white/10 rounded-md shadow-sm hover:bg-neutral-900 hover:border-white/20 focus:ring-1 focus:ring-neutral-700 outline-none transition-all"
                    >
                      Upload New
                    </button>
                    <button
                      type="button"
                      className="cursor-pointer px-4 py-2 text-xs font-medium text-neutral-500 hover:text-red-400 outline-none transition-colors"
                    >
                      Remove
                    </button>
                  </div>
            </div>
        );
}
