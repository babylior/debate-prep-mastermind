
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PrepStage from './PrepStage';
import ListeningStage from './ListeningStage';
import SpeechStage from './SpeechStage';
import { debateRoles, DebateRole } from '@/utils/debateData';
import { getNotes, getMotion } from '@/utils/localStorage';

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
  
  const handlePrepComplete = () => {
    setActiveStage('listening');
  };
  
  const handleListeningComplete = () => {
    setActiveStage('speech');
  };

  return (
    <div className="w-full">
      <div className="flex items-center mb-6">
        <div className={`${teamColor} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mr-3`}>
          {currentRole?.name || ''}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{currentRole?.fullName}</h1>
          <p className="text-gray-600">{motion}</p>
        </div>
      </div>
      
      <Tabs value={activeStage} onValueChange={setActiveStage} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-6">
          <TabsTrigger value="prep" disabled={activeStage === 'listening' || activeStage === 'speech'}>Prep</TabsTrigger>
          <TabsTrigger value="listening" disabled={activeStage === 'speech'}>Listening</TabsTrigger>
          <TabsTrigger value="speech">Speech</TabsTrigger>
        </TabsList>
        
        <TabsContent value="prep">
          <PrepStage 
            role={role} 
            motion={motion} 
            onComplete={handlePrepComplete} 
          />
        </TabsContent>
        
        <TabsContent value="listening">
          <ListeningStage 
            role={role} 
            motion={motion} 
            onComplete={handleListeningComplete} 
          />
        </TabsContent>
        
        <TabsContent value="speech">
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
