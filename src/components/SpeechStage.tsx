
import React, { useState } from 'react';
import { roleContent, DebateRole } from "@/utils/debateData";
import SpeechHeader from "./speech/SpeechHeader";
import SpeechLayout from "./speech/SpeechLayout";
import TipsPanel from './TipsPanel';
import { useSpeechContent } from '@/hooks/useSpeechContent';
import ExportButton from "./ExportButton";

interface SpeechStageProps {
  role: string;
  motion: string;
  onReset: () => void;
}

const SpeechStage: React.FC<SpeechStageProps> = ({ role, motion, onReset }) => {
  const roleData = roleContent[role as DebateRole];
  
  const [isEditMode, setIsEditMode] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
  const [isTipsPanelOpen, setIsTipsPanelOpen] = useState<boolean>(false);
  
  const { 
    sections, 
    content, 
    saveStatus, 
    handleDrop 
  } = useSpeechContent(role);

  const handleModeToggle = () => {
    setIsEditMode(!isEditMode);
    if (!isEditMode) {
      setCurrentSection(0);
    }
  };

  const handleNextSection = () => {
    setCurrentSection(prev => Math.min(prev + 1, sections.length - 1));
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <SpeechHeader
        role={role}
        motion={motion}
        roleTitle={roleData.speech.title}
        onTipsOpen={() => setIsTipsPanelOpen(true)}
        onReset={onReset}
      />

      <SpeechLayout
        isEditMode={isEditMode}
        currentSection={currentSection}
        sections={sections}
        content={content}
        saveStatus={saveStatus}
        onModeToggle={handleModeToggle}
        onNextSection={handleNextSection}
        onDrop={handleDrop}
      />

      {/* Tips Panel */}
      <TipsPanel 
        role={role as DebateRole} 
        content={{
          instructions: roleData.speech.instructions || [],
          tips: roleData.speech.tips || []
        }}
        isOpen={isTipsPanelOpen}
        onClose={() => setIsTipsPanelOpen(false)}
      />
    </div>
  );
};

export default SpeechStage;
