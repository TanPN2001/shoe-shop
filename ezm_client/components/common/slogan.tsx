"use client"
import "./slogan.css"
import { useEffect, useState } from "react";
import { Orbitron } from "next/font/google";

const CommonSlogan = ({ className = "" }: { text: string; className?: string }) => {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 1000);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return <div>
        <span className={`bouncing-text ${className}`}>
            {(() => {
                // Danh sách các slogan để chuyển đổi
                const slogans = [
                    "SIGNATURE",
                    "LIFESTYLE",
                    "DOMINATION",
                    "AMBITION"
                ];
                // State để lưu index slogan hiện tại và trạng thái fade
                const [currentIndex, setCurrentIndex] = useState(0);
                const [isFading, setIsFading] = useState(false);
                const [isFadingIn, setIsFadingIn] = useState(true);

                useEffect(() => {
                    // Khi mới mount hoặc đổi slogan thì fade in
                    setIsFadingIn(true);
                    const fadeInTimeout = setTimeout(() => {
                        setIsFadingIn(false);
                    }, 800); // thời gian fadeIn

                    // Mỗi 3.5s sẽ fade out, sau đó đổi slogan và fade in
                    const interval = setInterval(() => {
                        setIsFading(true);
                        setTimeout(() => {
                            setCurrentIndex((prev) => (prev + 1) % slogans.length);
                            setIsFading(false);
                            setIsFadingIn(true);
                            setTimeout(() => setIsFadingIn(false), 800);
                        }, 800); // thời gian fadeOut
                    }, 3500);

                    return () => {
                        clearInterval(interval);
                        clearTimeout(fadeInTimeout);
                    };
                }, []);

                const currentSlogan = slogans[currentIndex];

                return currentSlogan.split('').map((char, index) => (
                    <span
                        key={index}
                        className={`bouncing-char ${isAnimating ? 'animate' : ''} ${isFading ? 'fade-out' : ''} ${isFadingIn ? 'fade-in' : ''}`}
                        style={{
                            animationDelay: `${index * 0.1}s`,
                            display: char === ' ' ? 'inline' : 'inline-block'
                        }}
                    >
                        {char}
                    </span>
                ));
            })()}
        </span>
        <p className={`font-ezman text-white text-3xl lg:text-6xl`}>Inspired From <span className="text-ezman-red">Anonymous </span></p>
    </div>
};

export default CommonSlogan