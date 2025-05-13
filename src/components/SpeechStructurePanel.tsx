
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Timer from "@/components/Timer";
import { Eye, Edit, ChevronRight } from "lucide-react";
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
        return 'border-l-4 border-l-blue-500 bg-blue-50/30';
      case 'roadmap':
        return 'border-l-4 border-l-purple-600 bg-purple-50/30';
      case 'rebuttal':
        return 'border-l-4 border-l-red-500 bg-red-50/30';
      case 'argument':
        return 'border-l-4 border-l-green-500 bg-green-50/30';
      case 'conclusion':
        return 'border-l-4 border-l-amber-500 bg-amber-50/30';
      default:
        return '';
    }
  };

  const getSectionTypeColor = (type: string) => {
    switch(type) {
      case 'opening':
        return 'text-blue-600';
      case 'roadmap':
        return 'text-purple-600';
      case 'rebuttal':
        return 'text-red-500';
      case 'argument':
        return 'text-green-600';
      case 'conclusion':
        return 'text-amber-600';
      default:
        return '';
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-between mb-6 gap-2 items-center">
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
            className="flex items-center gap-2 bg-white shadow-sm hover:bg-gray-50 transition-colors"
          >
            {isEditMode ? <Eye className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
            {isEditMode ? 'מצב הצגה' : 'מצב עריכה'}
          </Button>
        </div>
      </div>

      {isEditMode ? (
        <div className="space-y-5">
          {sections.map((section, index) => (
            <Card 
              key={index}
              className={`border transition-all ${!section.content ? 'border-dashed border-gray-300 hover:border-blue-300 hover:bg-blue-50/10' : 'shadow-sm hover:shadow'} ${getTypeStyles(section.type)}`}
              onDrop={(e) => handleDrop(e, index)}
              onDragOver={handleDragOver}
            >
              <CardHeader className="pb-2">
                <CardTitle className={getSectionTypeColor(section.type)}>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {section.content ? (
                  <MarkdownRenderer text={section.content} />
                ) : (
                  <div className="text-gray-400 py-8 text-center border-2 border-dashed border-gray-200 rounded-lg">
                    גרור תוכן לכאן
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="relative min-h-[60vh] flex flex-col bg-white rounded-lg shadow-sm border p-8">
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
                  className={`mb-10 p-6 ${idx === currentSection ? 'bg-blue-50/50 rounded-xl border border-blue-100 animate-pulse' : ''}`}
                >
                  <h2 className={`text-2xl font-bold mb-5 ${getSectionTypeColor(section.type)}`}>
                    {section.title}
                  </h2>
                  <div className="text-xl whitespace-pre-wrap leading-relaxed">
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
                className="px-8 py-6 bg-blue-600 hover:bg-blue-700 transition-colors group"
                size="lg"
              >
                לחלק הבא
                <ChevronRight className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SpeechStructurePanel;
