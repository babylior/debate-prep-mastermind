
import React from 'react';
import ExportButton from '../ExportButton';
import { Section } from '@/hooks/useSpeechContent';

interface ExportButtonWrapperProps {
  motion: string;
  roleName: string;
  sections: Section[];
}

const ExportButtonWrapper: React.FC<ExportButtonWrapperProps> = ({ 
  motion, roleName, sections 
}) => {
  // Transform sections to the expected format for ExportButton
  const formattedSections = sections.map(section => {
    // Add null checks to prevent errors
    const sectionContent = Array.isArray(section.content) 
      ? section.content.map(item => item?.content || '').join('\n') 
      : '';
    
    // Check if section.content exists and has at least one item
    const type = Array.isArray(section.content) && section.content.length > 0 && section.content[0]?.type
      ? section.content[0].type
      : 'argument';

    return {
      title: section.name,
      content: sectionContent,
      type
    };
  });

  return (
    <ExportButton
      motion={motion}
      role={roleName}
      sections={formattedSections}
    />
  );
};

export default ExportButtonWrapper;
