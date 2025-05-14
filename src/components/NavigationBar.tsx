
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getNotes } from '@/utils/localStorage';
import { DebateRole } from '@/utils/debateData';

interface NavigationBarProps {
  activeStage: string;
  onStageChange: (stage: string) => void;
  role: DebateRole;
  motion: string;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ 
  activeStage, 
  onStageChange, 
  role,
  motion 
}) => {
  // Check if we have content in each stage
  const hasContent = () => {
    const notes = getNotes();
    return {
      prep: Boolean(notes?.prep && Object.values(notes.prep).some(val => val)),
      listening: Boolean(notes?.listening && Object.values(notes.listening).some(val => val)),
      speech: Boolean(notes?.speech && Object.values(notes.speech).some(val => val))
    };
  };

  const content = hasContent();

  return (
    <div className="sticky top-0 z-10 bg-white border-b shadow-sm mb-6">
      <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6">
        <Tabs value={activeStage} onValueChange={onStageChange} className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
            <TabsTrigger 
              value="prep" 
              className="relative"
              data-active={content.prep}
            >
              Prep
              {content.prep && (
                <span className="absolute top-0 right-1 h-2 w-2 rounded-full bg-green-500"></span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="listening" 
              className="relative"
              data-active={content.listening}
            >
              Listening
              {content.listening && (
                <span className="absolute top-0 right-1 h-2 w-2 rounded-full bg-green-500"></span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="speech" 
              className="relative"
              data-active={content.speech}
            >
              Speech
              {content.speech && (
                <span className="absolute top-0 right-1 h-2 w-2 rounded-full bg-green-500"></span>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center justify-center mt-2">
          <p className="text-sm text-gray-500 italic">
            {motion} ({role})
          </p>
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
