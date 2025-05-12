
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Timer from "@/components/Timer";
import { Eye, Edit } from "lucide-react";
import MarkdownRenderer from './MarkdownRenderer';

interface SpeechStructurePanelProps {
  isEditMode: boolean;
  currentSection: number;
  sections: Array<{
    title: string;
    content: string;
    type: 'opening' | 'roadmap' | 'argument' | 'rebuttal' | 'conclusion';
  }>;
  onModeToggle: () => void;
  onNextSection: () => void;
  onDrop: (sectionIndex: number, itemId: string) => void;
  showTimer?: boolean;
}

const SpeechStructurePanel: React.FC<SpeechStructurePanelProps> = ({
  isEditMode,
  currentSection,
  sections,
  onModeToggle,
  onNextSection,
  onDrop,
  showTimer = false
}) => {
  const handleDrop = (e: React.DragEvent, sectionIndex: number) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain');
    onDrop(sectionIndex, itemId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="relative">
      <div className="flex justify-between mb-4 gap-2">
        <div>
          {showTimer && isEditMode && (
            <Timer 
              initialTime={7 * 60} // 7 minutes
              timerLabel="Speech Timer"
              onComplete={() => {}}
              autoStart={false}
            />
          )}
        </div>
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
              className={`border-2 border-dashed ${!section.content ? 'border-gray-300' : 'border-transparent'}`}
              onDrop={(e) => handleDrop(e, index)}
              onDragOver={handleDragOver}
            >
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {section.content ? (
                  <MarkdownRenderer text={section.content} />
                ) : (
                  'Drop content here'
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="relative min-h-[60vh] flex flex-col">
          {showTimer && (
            <div className="sticky top-4 right-4 flex justify-end mb-4">
              <Timer 
                initialTime={7 * 60}
                timerLabel="Speech Time"
                onComplete={() => {}}
                autoStart={false}
              />
            </div>
          )}
          
          <div className="overflow-y-auto max-w-3xl mx-auto w-full">
            {sections.map((section, idx) => (
              section.content ? (
                <div key={idx} className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                  <div className="text-xl whitespace-pre-wrap">
                    <MarkdownRenderer text={section.content} />
                  </div>
                </div>
              ) : null
            ))}
          </div>
          
          {currentSection < sections.length - 1 && (
            <Button 
              onClick={onNextSection}
              className="mt-4"
              size="lg"
            >
              Next Section
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default SpeechStructurePanel;
