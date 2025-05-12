
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
  return (
    <ExportButton
      motion={motion}
      role={roleName}
      sections={sections}
    />
  );
};

export default ExportButtonWrapper;
