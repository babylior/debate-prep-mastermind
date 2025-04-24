
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
      <div className="hidden lg:flex items-center mb-6">
        <div className={`${teamColor} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mr-3`}>
          {currentRole?.name || ''}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{currentRole?.fullName}</h1>
          <p className="text-gray-600">{motion}</p>
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
        <TabsContent value="prep" className="m-0 mt-0">
          <PrepStage 
            role={role} 
            motion={motion} 
            onComplete={handlePrepComplete} 
          />
        </TabsContent>
        
        <TabsContent value="listening" className="m-0 mt-0">
          <ListeningStage 
            role={role} 
            motion={motion} 
            onComplete={handleListeningComplete} 
          />
        </TabsContent>
        
        <TabsContent value="speech" className="m-0 mt-0">
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
