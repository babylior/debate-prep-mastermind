
import React from 'react';

interface MarkdownRendererProps {
  text: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ text }) => {
  if (!text) return null;
  
  // Process markdown formatting
  let formattedText = text
    // Bold: **text**
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic: *text*
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Highlight: ===text===
    .replace(/===(.*?)===/g, '<mark class="bg-yellow-200 px-1">$1</mark>');
  
  // Replace newlines with <br> tags
  formattedText = formattedText.replace(/\n/g, '<br />');

  return <div dangerouslySetInnerHTML={{ __html: formattedText }} />;
};

export default MarkdownRenderer;
