import React, { useEffect, useState } from 'react'

const TypewriterText = ({
    text,
    className = "",
  }: {
    text: string;
    className?: string;
  }) => {
    const [displayText, setDisplayText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
  
    useEffect(() => {
      if (currentIndex < text.length) {
        const timeout = setTimeout(() => {
          setDisplayText((prev) => prev + text[currentIndex]);
          setCurrentIndex((prev) => prev + 1);
        }, 50);
        return () => clearTimeout(timeout);
      }
    }, [currentIndex, text]);
  
    return <span className={className}>{displayText}</span>;
  };

export default TypewriterText
