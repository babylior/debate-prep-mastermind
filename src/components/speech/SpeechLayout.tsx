
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusBar } from "@/components/ui/status-bar";
import ContentPanel from "../ContentPanel";
import SpeechStructurePanel from "../SpeechStructurePanel";
import { SpeechContent, Section } from "@/hooks/useSpeechContent";

interface SpeechLayoutProps {
  isEditMode: boolean;
  currentSection: number;
  sections: Section[];
  content: SpeechContent;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  onModeToggle: () => void;
  onNextSection: () => void;
  onDrop: (sectionIndex: number, itemId: string) => void;
}

const SpeechLayout: React.FC<SpeechLayoutProps> = ({
  isEditMode,
  currentSection,
  sections,
  content,
  saveStatus,
  onModeToggle,
  onNextSection,
  onDrop
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <SpeechStructurePanel
          isEditMode={isEditMode}
          currentSection={currentSection}
          sections={sections}
          onModeToggle={onModeToggle}
          onNextSection={onNextSection}
          onDrop={onDrop}
          showTimer={true} // Enable 7-minute timer
        />
      </div>
      
      {isEditMode && (
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <CardDescription>
                Drag items into your speech structure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContentPanel
                argumentsList={content.argumentsList || []}
                rebuttals={content.rebuttals || []}
                framing={content.framing || []}
              />
            </CardContent>
          </Card>
        </div>
      )}

      <StatusBar status={saveStatus} />
    </div>
  );
};

export default SpeechLayout;
