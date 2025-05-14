
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
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
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{roleData.listening.title}</h1>
            <p className="text-gray-600 mt-1">{motion}</p>
            <p className="mt-3">{roleData.listening.description}</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowInstructions(!showInstructions)}
          >
            {showInstructions ? "Hide" : "Show"} Instructions
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          <Timer 
            initialTime={debateTime}
            timerLabel="Speech Time"
            onComplete={() => toast({
              title: "Time's up!",
              description: "The current speech has ended."
            })}
          />
          
          {showInstructions && (
            <>
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
            </>
          )}
        </div>
        
        {/* Right Column - Now showing only TeamNotesGrid */}
        <div className="lg:col-span-2">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Team Notes</h2>
            <TeamNotesGrid role={role} />
          </Card>
          
          <div className="mt-6 text-right">
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
