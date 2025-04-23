
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import Timer from "@/components/Timer";
import { Eye, Edit } from "lucide-react";

interface Section {
  title: string;
  content: string;
  type: 'opening' | 'argument' | 'rebuttal' | 'conclusion' | 'extension';
}

interface SpeechStructurePanelProps {
  isEditMode: boolean;
  currentSection: number;
  sections: Section[];
  onModeToggle: () => void;
  onNextSection: () => void;
  onDrop: (sectionIndex: number, itemId: string) => void;
  onSectionContentChange: (sectionIndex: number, newContent: string) => void;
}

const SpeechStructurePanel: React.FC<SpeechStructurePanelProps> = ({
  isEditMode,
  currentSection,
  sections,
  onModeToggle,
  onNextSection,
  onDrop,
  onSectionContentChange
}) => {
  const handleDrop = (e: React.DragEvent, sectionIndex: number) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain');
    onDrop(sectionIndex, itemId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
    onSectionContentChange(index, e.target.value);
  };

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
              className={`border-2 border-dashed ${!section.content ? 'border-gray-300' : 'border-transparent'}`}
              onDrop={(e) => handleDrop(e, index)}
              onDragOver={handleDragOver}
            >
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  value={section.content} 
                  onChange={(e) => handleContentChange(e, index)}
                  placeholder="Drop content here or type directly"
                  className="min-h-[120px]"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="relative">
          <div className="mb-6">
            <Timer 
              initialTime={7 * 60}
              timerLabel="Speech Time"
              onComplete={() => {}}
              autoStart={false}
            />
          </div>
          
          <ScrollArea className="h-[70vh]">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-2xl">
                  Full Speech
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-8">
                {sections.map((section, index) => (
                  <div key={index} className="mb-8">
                    <h2 className="text-xl font-bold mb-3">{section.title}</h2>
                    <div className="whitespace-pre-wrap text-lg">
                      {section.content || 'No content added yet'}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default SpeechStructurePanel;
