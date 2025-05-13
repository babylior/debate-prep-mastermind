
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import PrepStage from './PrepStage';
import ListeningStage from './ListeningStage';
import SpeechStage from './SpeechStage';
import { debateRoles, DebateRole } from '@/utils/debateData';
import { getNotes, getMotion } from '@/utils/localStorage';
import NavigationBar from './NavigationBar';

interface DebateStagesProps {
  selectedRole: string;
  motion: string;
  onReset: () => void;
}

const DebateStages: React.FC<DebateStagesProps> = ({ selectedRole, motion, onReset }) => {
  const [activeStage, setActiveStage] = useState<string>('prep');
  const role = selectedRole as DebateRole;
  
  const currentRole = debateRoles.find(r => r.id === role);
  const teamColor = currentRole?.teamColor || '';
  
  // On mount, check if we have saved notes and adjust the active stage
  useEffect(() => {
    const savedNotes = getNotes();
    const savedMotion = getMotion();
    
    // If we have saved notes and they match the current motion, we may want to skip to a later stage
    if (savedNotes && savedMotion === motion) {
      if (Object.keys(savedNotes.speech || {}).length > 0) {
        setActiveStage('speech');
      } else if (Object.keys(savedNotes.listening || {}).length > 0) {
        setActiveStage('listening');
      }
    }
  }, [motion]);
  
  const handleStageChange = (stage: string) => {
    setActiveStage(stage);
  };
  
  const handlePrepComplete = () => {
    setActiveStage('listening');
  };
  
  const handleListeningComplete = () => {
    setActiveStage('speech');
  };

  return (
    <div className="w-full">
      {/* Team and motion info at the top */}
      <div className="hidden lg:flex items-center mb-6 bg-white p-4 rounded-lg shadow-sm border">
        <div className={`${teamColor} w-14 h-14 rounded-full flex items-center justify-center text-white font-bold mr-4 shadow-md`}>
          {currentRole?.name || ''}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{currentRole?.fullName}</h1>
          <p className="text-gray-600 mt-1">{motion}</p>
        </div>
      </div>
      
      {/* Persistent navigation bar */}
      <NavigationBar 
        activeStage={activeStage} 
        onStageChange={handleStageChange}
        role={role}
        motion={motion}
      />
      
      <Tabs value={activeStage} onValueChange={handleStageChange} className="w-full">
        <TabsContent value="prep" className="m-0 mt-0 animate-fade-in">
          <PrepStage 
            role={role} 
            motion={motion} 
            onComplete={handlePrepComplete} 
          />
        </TabsContent>
        
        <TabsContent value="listening" className="m-0 mt-0 animate-fade-in">
          <ListeningStage 
            role={role} 
            motion={motion} 
            onComplete={handleListeningComplete} 
          />
        </TabsContent>
        
        <TabsContent value="speech" className="m-0 mt-0 animate-fade-in">
          <SpeechStage 
            role={role} 
            motion={motion} 
            onReset={onReset} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DebateStages;
