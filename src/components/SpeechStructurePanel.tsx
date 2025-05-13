
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

  const getTypeStyles = (type: string) => {
    switch(type) {
      case 'opening':
        return 'border-l-4 border-l-blue-500';
      case 'roadmap':
        return 'border-l-4 border-l-purple-500';
      case 'rebuttal':
        return 'border-l-4 border-l-red-500';
      case 'argument':
        return 'border-l-4 border-l-green-500';
      case 'conclusion':
        return 'border-l-4 border-l-amber-500';
      default:
        return '';
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-between mb-4 gap-2 items-center">
        {isEditMode && (
          <Timer 
            initialTime={7 * 60} // 7 minutes
            timerLabel="זמן נאום"
            autoStart={false}
            className="max-w-xs"
          />
        )}
        <div className={isEditMode ? "" : "ms-auto"}>
          <Button 
            variant="outline" 
            onClick={onModeToggle}
            className="flex items-center gap-2"
          >
            {isEditMode ? <Eye className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
            {isEditMode ? 'מצב הצגה' : 'מצב עריכה'}
          </Button>
        </div>
      </div>

      {isEditMode ? (
        <div className="space-y-4">
          {sections.map((section, index) => (
            <Card 
              key={index}
              className={`border ${!section.content ? 'border-dashed border-gray-300 hover:border-gray-400' : 'shadow-sm'} ${getTypeStyles(section.type)}`}
              onDrop={(e) => handleDrop(e, index)}
              onDragOver={handleDragOver}
            >
              <CardHeader className="pb-2">
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {section.content ? (
                  <MarkdownRenderer text={section.content} />
                ) : (
                  <div className="text-gray-400 py-4 text-center">גרור תוכן לכאן</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="relative min-h-[60vh] flex flex-col bg-white rounded-lg shadow-sm border p-6">
          {showTimer && (
            <div className="sticky top-4 right-4 flex justify-end mb-6">
              <Timer 
                initialTime={7 * 60}
                timerLabel="זמן נאום"
                onComplete={() => {}}
                autoStart={false}
                className="max-w-xs"
              />
            </div>
          )}
          
          <div className="overflow-y-auto max-w-3xl mx-auto w-full">
            {sections.map((section, idx) => (
              section.content ? (
                <div 
                  key={idx} 
                  className={`mb-8 p-4 ${idx === currentSection ? 'bg-gray-50 rounded-lg border animate-pulse' : ''}`}
                >
                  <h2 className={`text-2xl font-bold mb-4 ${getTypeStyles(section.type).replace('border-l-4', 'text')}`}>{section.title}</h2>
                  <div className="text-xl whitespace-pre-wrap">
                    <MarkdownRenderer text={section.content} />
                  </div>
                </div>
              ) : null
            ))}
          </div>
          
          {currentSection < sections.length - 1 && (
            <div className="mt-6 text-center">
              <Button 
                onClick={onNextSection}
                className="px-8"
                size="lg"
              >
                לחלק הבא
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SpeechStructurePanel;
