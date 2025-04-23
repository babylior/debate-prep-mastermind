
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer } from "@/components/Timer";
import { Eye, Edit } from "lucide-react";

interface SpeechStructurePanelProps {
  isEditMode: boolean;
  currentSection: number;
  sections: Array<{
    title: string;
    content: string;
  }>;
  onModeToggle: () => void;
  onNextSection: () => void;
}

const SpeechStructurePanel: React.FC<SpeechStructurePanelProps> = ({
  isEditMode,
  currentSection,
  sections,
  onModeToggle,
  onNextSection,
}) => {
  return (
    <div className="relative">
      <div className="flex justify-end mb-4 gap-2">
        <Button 
          variant="outline" 
          onClick={onModeToggle}
          className="flex items-center gap-2"
        >
          {isEditMode ? <Eye className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
          {isEditMode ? 'Presentation Mode' : 'Edit Mode'}
        </Button>
      </div>

      {isEditMode ? (
        <div className="space-y-4">
          {sections.map((section, index) => (
            <Card 
              key={index}
              className="border-2 border-dashed border-gray-300 p-4"
            >
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {section.content || 'Drag content here'}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="relative min-h-[60vh] flex flex-col items-center justify-center">
          <Timer 
            initialTime={7 * 60}
            timerLabel="Speech Time"
            onComplete={() => {}}
            className="absolute top-4 right-4"
          />
          <Card className="w-full max-w-3xl">
            <CardHeader>
              <CardTitle className="text-2xl">
                {sections[currentSection]?.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xl">
              {sections[currentSection]?.content}
            </CardContent>
          </Card>
          <Button 
            onClick={onNextSection}
            className="mt-4"
            size="lg"
          >
            Next Section
          </Button>
        </div>
      )}
    </div>
  );
};

export default SpeechStructurePanel;
