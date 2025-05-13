import { useState } from 'react';

interface TextFormatOptions {
  value: string;
  onChange: (value: string) => void;
}

export const useTextFormat = ({ value, onChange }: TextFormatOptions) => {
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<number | null>(null);

  const handleSelection = (e: React.MouseEvent<HTMLTextAreaElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.target as HTMLTextAreaElement;
    setSelectionStart(textarea.selectionStart);
    setSelectionEnd(textarea.selectionEnd);
  };

  // Return empty handlers to maintain compatibility with existing code
  return {
    handleSelection,
    handleBold: () => {},
    handleItalic: () => {},
    handleHighlight: () => {},
    handleRedColor: () => {},
    handleBlueColor: () => {},
    handleBlackColor: () => {},
  };
};
