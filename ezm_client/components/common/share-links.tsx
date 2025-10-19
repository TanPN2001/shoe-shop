"use client"

import { useEffect, useState } from "react";

type Props = {
    title: string
    className?: string
}

export default function ShareLinks({ title, className }: Props) {
    const [url, setUrl] = useState<string>("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setUrl(window.location.href);
        }
    }, [])

    const encodedUrl = encodeURIComponent(url || "");
    const encodedTitle = encodeURIComponent(title || "");

    return (
        <div className={`flex flex-wrap gap-3 text-sm ${className ?? ""}`}>
            <a
                className="px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-500 transition-colors"
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
            >Facebook</a>
            <a
                className="px-3 py-2 rounded-md bg-sky-500 hover:bg-sky-400 transition-colors"
                href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
                target="_blank"
                rel="noopener noreferrer"
            >Twitter</a>
            <a
                className="px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 transition-colors"
                href={`https://wa.me/?text=${encodeURIComponent(title + " " )}${encodedUrl ? "%20" + encodedUrl : ""}`}
                target="_blank"
                rel="noopener noreferrer"
            >WhatsApp</a>
        </div>
    );
}


