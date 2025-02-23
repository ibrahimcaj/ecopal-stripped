import { useEffect, useState } from 'react';

export const useTypewriter = (text: string[], speed: number = 100): string => {
  const [currentText, setCurrentText] = useState<string>('');
  const [currentTextIndex, setCurrentTextIndex] = useState<number>(0);
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(true);

  useEffect(() => {
    if (isTyping) {
      // set interval to type characters at the given speed
      const interval = setInterval(() => {
        // if all texts have been typed, reset everything
        if (currentTextIndex === text.length) {
          setCurrentText('');
          setCurrentTextIndex(0);
          setCurrentCharIndex(0);
          return;
        }

        // if the current text is fully typed, pause and then move to the next text
        if (currentCharIndex === text[currentTextIndex].length) {
          setIsTyping(false);
          setTimeout(() => {
            setIsTyping(true);
            setCurrentText('');
            setCurrentTextIndex((prev) => (prev + 1) % text.length);
            setCurrentCharIndex(0);
          }, 1000);
          return;
        }

        // update the current text with the next character
        setCurrentText(text[currentTextIndex].slice(0, currentCharIndex + 1));
        setCurrentCharIndex((prev) => prev + 1);
      }, speed);

      // clear interval on cleanup
      return () => clearInterval(interval);
    }
  }, [currentCharIndex, currentTextIndex, speed, text]);

  return currentText;
};
