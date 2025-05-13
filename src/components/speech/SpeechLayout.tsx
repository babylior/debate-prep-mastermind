
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
    // Check if section.content exists and is an array before calling map
    const contentText = Array.isArray(section.content) && section.content.length > 0
      ? section.content.map(item => item.content || '').join('\n')
      : '';
    
    // Determine section type based on content or name
    // Add null checks to prevent accessing toLowerCase on undefined
    const sectionName = section.name || ''; // Default to empty string if undefined
    const contentType = Array.isArray(section.content) && 
                       section.content.length > 0 && 
                       section.content[0]?.type === 'rebuttal'
      ? 'rebuttal'
      : sectionName.toLowerCase().includes('opening')
        ? 'opening'
        : sectionName.toLowerCase().includes('roadmap')
          ? 'roadmap'
          : sectionName.toLowerCase().includes('conclusion')
            ? 'conclusion'
            : 'argument';
    
    return {
      title: section.name || '', // Default to empty string if undefined
      content: contentText,
      type: contentType
    };
  });

  // Transform content for ContentPanel
  const transformedContent = {
    argumentsList: content.argumentsList.map(item => ({
      id: item.id,
      title: (item.content || '').split('\n')[0] || 'Argument',
      content: item.content || '',
      type: item.type
    })),
    rebuttals: content.rebuttals.map(item => ({
      id: item.id,
      title: (item.content || '').split('\n')[0] || 'Rebuttal',
      content: item.content || '',
      type: item.type
    })),
    framing: content.framing.map(item => ({
      id: item.id,
      title: (item.content || '').split('\n')[0] || 'Framing',
      content: item.content || '',
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
        <div className="lg:col-span-1 lg:sticky lg:top-24 lg:self-start">
          <Card className="border shadow-sm">
            <CardHeader className="pb-2 border-b bg-gray-50">
              <CardTitle>תוכן</CardTitle>
              <CardDescription>
                גרור פריטים למבנה הנאום שלך
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 bg-white">
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
