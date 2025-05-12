
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
  const formattedSections = sections.map(section => ({
    title: section.name,
    content: section.content.map(item => item.content).join('\n'),
    type: section.content[0]?.type || 'argument'
  }));

  return (
    <ExportButton
      motion={motion}
      role={roleName}
      sections={formattedSections}
    />
  );
};

export default ExportButtonWrapper;
