
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Timer from "@/components/Timer";
import { useToast } from "@/components/ui/use-toast";
import { getNotes } from "@/utils/localStorage";
import { roleContent, DebateRole } from "@/utils/debateData";
import TeamNotesGrid from "@/components/TeamNotesGrid";
import InstructionPanel from './InstructionPanel';

interface ListeningStageProps {
  role: string;
  motion: string;
  onComplete: () => void;
}

const ListeningStage: React.FC<ListeningStageProps> = ({ role, motion, onComplete }) => {
  const { toast } = useToast();
  const roleData = roleContent[role as DebateRole];
  const debateTime = 7 * 60; // 7 minutes in seconds
  
  const [showInstructions, setShowInstructions] = useState(false);
  
  // Initialize from localStorage
  useEffect(() => {
    const savedNotes = getNotes();
    // Just loading notes for initialization
  }, []);
  
  const handleComplete = () => {
    onComplete();
    toast({
      title: "Moving to Speech Stage",
      description: "Get ready to deliver your speech!"
    });
  };
  
  return (
    <div className="max-w-full mx-auto p-2">
      <div className="bg-white rounded-lg shadow-sm border p-3 mb-3">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">{roleData.listening.title}</h1>
            <p className="text-gray-600 mt-1">{motion}</p>
          </div>
          <div className="flex gap-3 items-center">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowInstructions(!showInstructions)}
            >
              {showInstructions ? "Hide" : "Show"} Instructions
            </Button>
            <Timer 
              initialTime={debateTime}
              timerLabel="Speech Time"
              onComplete={() => toast({
                title: "Time's up!",
                description: "The current speech has ended."
              })}
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Left Column - Minimized instructions */}
        {showInstructions && (
          <div className="lg:col-span-2 space-y-3">
            <InstructionPanel 
              title="Instructions" 
              items={roleData.listening.instructions} 
            />
            
            {roleData.listening.keyPointsToNote && (
              <InstructionPanel 
                title="Key Points to Note" 
                items={roleData.listening.keyPointsToNote} 
              />
            )}
            
            <InstructionPanel 
              title="Tips" 
              items={roleData.listening.tips} 
            />
          </div>
        )}
        
        {/* Right Column - Now showing only TeamNotesGrid */}
        <div className={`${showInstructions ? 'lg:col-span-10' : 'lg:col-span-12'} flex flex-col`}>
          <div className="flex-grow">
            <TeamNotesGrid role={role} />
          </div>
          
          <div className="mt-4 text-right">
            <Button onClick={handleComplete} size="lg">
              Continue to Speech Stage
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListeningStage;
