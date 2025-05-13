
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getNotes } from '@/utils/localStorage';
import { DebateRole } from '@/utils/debateData';
import EditableMotion from './EditableMotion';

interface NavigationBarProps {
  activeStage: string;
  onStageChange: (stage: string) => void;
  role: DebateRole;
  motion: string;
  onMotionChange: (newMotion: string) => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ 
  activeStage, 
  onStageChange, 
  role,
  motion,
  onMotionChange 
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
    <div className="sticky top-16 z-10 bg-white border-b shadow-sm mb-6">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6">
        <Tabs value={activeStage} onValueChange={onStageChange} className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto bg-gray-100/70 p-1 rounded-xl">
            <TabsTrigger 
              value="prep" 
              className="relative transition-all data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm rounded-lg px-4 py-2 font-medium"
              data-active={content.prep}
            >
              הכנה
              {content.prep && (
                <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white animate-pulse"></span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="listening" 
              className="relative transition-all data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm rounded-lg px-4 py-2 font-medium"
              data-active={content.listening}
            >
              הקשבה
              {content.listening && (
                <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white animate-pulse"></span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="speech" 
              className="relative transition-all data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm rounded-lg px-4 py-2 font-medium"
              data-active={content.speech}
            >
              נאום
              {content.speech && (
                <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white animate-pulse"></span>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex justify-center mt-3 mb-1">
          <div className="text-sm font-medium bg-white px-4 py-1.5 rounded-full border shadow-sm text-gray-700 flex items-center">
            <EditableMotion 
              motion={motion} 
              onMotionChange={onMotionChange} 
            />
            <span className="text-gray-400 mx-2">•</span>
            <span className="font-semibold text-gray-800">{role}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
