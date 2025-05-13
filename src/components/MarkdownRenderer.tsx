import React from 'react';

interface MarkdownRendererProps {
  text: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ text }) => {
  if (!text) return null;
  
  // Only keep basic line breaks
  let formattedText = text.replace(/\n/g, '<br />');
  
  return <div dangerouslySetInnerHTML={{ __html: formattedText }} className="prose" />;
};

export default MarkdownRenderer;
