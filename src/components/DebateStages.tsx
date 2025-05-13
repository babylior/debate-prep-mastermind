
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import PrepStage from './PrepStage';
import ListeningStage from './ListeningStage';
import SpeechStage from './SpeechStage';
import { debateRoles, DebateRole } from '@/utils/debateData';
import { getNotes, getMotion, saveMotion } from '@/utils/localStorage';
import NavigationBar from './NavigationBar';
import EditableMotion from './EditableMotion';

interface DebateStagesProps {
  selectedRole: string;
  motion: string;
  onReset: () => void;
}

const DebateStages: React.FC<DebateStagesProps> = ({ selectedRole, motion: initialMotion, onReset }) => {
  const [activeStage, setActiveStage] = useState<string>('prep');
  const role = selectedRole as DebateRole;
  const [motion, setMotion] = useState(initialMotion);
  
  const currentRole = debateRoles.find(r => r.id === role);
  const teamColor = currentRole?.teamColor || '';
  
  // On mount, check if we have saved notes and adjust the active stage
  useEffect(() => {
    const savedNotes = getNotes();
    const savedMotion = getMotion();
    
    if (savedMotion) {
      setMotion(savedMotion);
    }
    
    // If we have saved notes, we may want to skip to a later stage
    if (savedNotes) {
      if (Object.keys(savedNotes.speech || {}).length > 0) {
        setActiveStage('speech');
      } else if (Object.keys(savedNotes.listening || {}).length > 0) {
        setActiveStage('listening');
      }
    }
  }, []);
  
  const handleStageChange = (stage: string) => {
    setActiveStage(stage);
  };
  
  const handlePrepComplete = () => {
    setActiveStage('listening');
  };
  
  const handleListeningComplete = () => {
    setActiveStage('speech');
  };

  const handleMotionChange = (newMotion: string) => {
    setMotion(newMotion);
    saveMotion(newMotion);
  };

  return (
    <div className="w-full">
      {/* Team and motion info at the top */}
      <div className="hidden lg:flex items-center mb-6 bg-white p-5 rounded-lg shadow-sm border">
        <div className={`${teamColor} w-16 h-16 rounded-full flex items-center justify-center text-white font-bold mr-4 shadow-md`}>
          {currentRole?.name || ''}
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-900">{currentRole?.fullName}</h1>
          <div className="mt-1">
            <EditableMotion
              motion={motion}
              onMotionChange={handleMotionChange}
              className="text-sm"
            />
          </div>
        </div>
      </div>
      
      {/* Persistent navigation bar */}
      <NavigationBar 
        activeStage={activeStage} 
        onStageChange={handleStageChange}
        role={role}
        motion={motion}
        onMotionChange={handleMotionChange}
      />
      
      <Tabs value={activeStage} onValueChange={handleStageChange} className="w-full">
        <TabsContent value="prep" className="m-0 mt-0 animate-fade-in">
          <PrepStage 
            role={role} 
            motion={motion} 
            onComplete={handlePrepComplete}
            onMotionChange={handleMotionChange}
          />
        </TabsContent>
        
        <TabsContent value="listening" className="m-0 mt-0 animate-fade-in">
          <ListeningStage 
            role={role} 
            motion={motion} 
            onComplete={handleListeningComplete}
            onMotionChange={handleMotionChange}
          />
        </TabsContent>
        
        <TabsContent value="speech" className="m-0 mt-0 animate-fade-in">
          <SpeechStage 
            role={role} 
            motion={motion} 
            onReset={onReset}
            onMotionChange={handleMotionChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DebateStages;
