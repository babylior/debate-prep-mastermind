
import { useEffect, useCallback } from 'react';

export const useAutoResize = (textareaRef: React.RefObject<HTMLTextAreaElement>) => {
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to allow shrinking
      textarea.style.height = 'auto';
      // Set new height based on scroll height
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [textareaRef]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Initial height adjustment
    adjustHeight();

    // Adjust on input
    const handleInput = () => adjustHeight();
    textarea.addEventListener('input', handleInput);

    return () => {
      textarea.removeEventListener('input', handleInput);
    };
  }, [adjustHeight]);

  return adjustHeight;
};
