
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusBar } from "@/components/ui/status-bar";
import ContentPanel from "../ContentPanel";
import SpeechStructurePanel from "../SpeechStructurePanel";
import { SpeechContent, Section } from "@/hooks/useSpeechContent";

// Define the expected content type for the SpeechStructurePanel
interface PanelContent {
  title: string;
  content: string;
  type: "argument" | "rebuttal" | "opening" | "roadmap" | "conclusion";
}

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
  // Transform sections to the format expected by SpeechStructurePanel
  const formattedSections: PanelContent[] = sections.map(section => {
    // Ensure section.content exists and is an array before calling map
    const contentText = Array.isArray(section.content) 
      ? section.content.map(item => item.content).join('\n')
      : '';
    
    // Determine section type based on content or name
    const contentType = Array.isArray(section.content) && section.content.length > 0 && section.content[0]?.type === 'rebuttal'
      ? 'rebuttal'
      : section.name.toLowerCase().includes('opening')
        ? 'opening'
        : section.name.toLowerCase().includes('roadmap')
          ? 'roadmap'
          : section.name.toLowerCase().includes('conclusion')
            ? 'conclusion'
            : 'argument';
    
    return {
      title: section.name,
      content: contentText,
      type: contentType
    };
  });

  // Transform content for ContentPanel
  const transformedContent = {
    argumentsList: content.argumentsList.map(item => ({
      id: item.id,
      title: item.content.split('\n')[0] || 'Argument',
      content: item.content,
      type: item.type
    })),
    rebuttals: content.rebuttals.map(item => ({
      id: item.id,
      title: item.content.split('\n')[0] || 'Rebuttal',
      content: item.content,
      type: item.type
    })),
    framing: content.framing.map(item => ({
      id: item.id,
      title: item.content.split('\n')[0] || 'Framing',
      content: item.content,
      type: item.type
    }))
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <SpeechStructurePanel
          isEditMode={isEditMode}
          currentSection={currentSection}
          sections={formattedSections}
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
                argumentsList={transformedContent.argumentsList}
                rebuttals={transformedContent.rebuttals}
                framing={transformedContent.framing}
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
