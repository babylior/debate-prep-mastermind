
import { useState, useCallback } from 'react';

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

  const applyFormat = useCallback((format: 'bold' | 'italic' | 'highlight' | 'red' | 'blue' | 'black') => {
    if (selectionStart === null || selectionEnd === null || selectionStart === selectionEnd) {
      return;
    }

    const beforeSelection = value.substring(0, selectionStart);
    const selection = value.substring(selectionStart, selectionEnd);
    const afterSelection = value.substring(selectionEnd);

    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `${beforeSelection}**${selection}**${afterSelection}`;
        break;
      case 'italic':
        formattedText = `${beforeSelection}*${selection}*${afterSelection}`;
        break;
      case 'highlight':
        formattedText = `${beforeSelection}===${selection}===${afterSelection}`;
        break;
      case 'red':
        formattedText = `${beforeSelection}@@red:${selection}@@${afterSelection}`;
        break;
      case 'blue':
        formattedText = `${beforeSelection}@@blue:${selection}@@${afterSelection}`;
        break;
      case 'black':
        formattedText = `${beforeSelection}@@black:${selection}@@${afterSelection}`;
        break;
      default:
        return;
    }

    onChange(formattedText);
  }, [value, selectionStart, selectionEnd, onChange]);

  const handleBold = useCallback(() => applyFormat('bold'), [applyFormat]);
  const handleItalic = useCallback(() => applyFormat('italic'), [applyFormat]);
  const handleHighlight = useCallback(() => applyFormat('highlight'), [applyFormat]);
  const handleRedColor = useCallback(() => applyFormat('red'), [applyFormat]);
  const handleBlueColor = useCallback(() => applyFormat('blue'), [applyFormat]);
  const handleBlackColor = useCallback(() => applyFormat('black'), [applyFormat]);

  return {
    handleSelection,
    handleBold,
    handleItalic,
    handleHighlight,
    handleRedColor,
    handleBlueColor,
    handleBlackColor,
  };
};
