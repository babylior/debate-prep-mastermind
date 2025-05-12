
import React from 'react';

interface MarkdownRendererProps {
  text: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ text }) => {
  if (!text) return null;
  
  // Process markdown formatting
  let formattedText = text
    // Bold: **text**
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-black">$1</strong>')
    // Italic: *text*
    .replace(/\*(.*?)\*/g, '<em class="italic text-black">$1</em>')
    // Highlight: ===text===
    .replace(/===(.*?)===/g, '<mark class="bg-yellow-200 px-1 rounded-sm transition-all duration-200">$1</mark>')
    // Color formatting: @@color:text@@
    .replace(/@@purple:(.*?)@@/g, '<span class="text-purple-600">$1</span>')
    .replace(/@@blue:(.*?)@@/g, '<span class="text-blue-600">$1</span>')
    .replace(/@@green:(.*?)@@/g, '<span class="text-green-600">$1</span>');
  
  // Replace newlines with <br> tags
  formattedText = formattedText.replace(/\n/g, '<br />');

  return <div dangerouslySetInnerHTML={{ __html: formattedText }} className="prose" />;
};

export default MarkdownRenderer;
