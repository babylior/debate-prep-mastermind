
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getNotes, saveNotes } from "@/utils/localStorage";
import { roleContent, DebateRole, debateRoles } from "@/utils/debateData";
import TeamNotesGrid from './TeamNotesGrid';
import { useToast } from "@/components/ui/use-toast";

interface ListeningStageProps {
  role: string;
  motion: string;
  onComplete: () => void;
}

const ListeningStage: React.FC<ListeningStageProps> = ({ role, motion, onComplete }) => {
  const { toast } = useToast();
  const roleData = roleContent[role as DebateRole];
  const currentRole = debateRoles.find(r => r.id === role);
  const currentOrder = currentRole?.order || 1;
  
  const [teamNotes, setTeamNotes] = useState({
    og: '',
    oo: '',
    cg: '',
    co: ''
  });
  
  // Initialize notes from localStorage
  useEffect(() => {
    const savedNotes = getNotes();
    if (savedNotes) {
      // Load team notes if they exist
      if (savedNotes.teamNotes) {
        setTeamNotes({
          og: savedNotes.teamNotes.og || '',
          oo: savedNotes.teamNotes.oo || '',
          cg: savedNotes.teamNotes.cg || '',
          co: savedNotes.teamNotes.co || ''
        });
      }
    }
  }, [role, motion]);

  const handleTeamNoteChange = (team: 'og' | 'oo' | 'cg' | 'co', value: string) => {
    const updatedTeamNotes = {
      ...teamNotes,
      [team]: value
    };
    setTeamNotes(updatedTeamNotes);
    saveToLocalStorage('teamNotes', updatedTeamNotes);
    
    toast({
      title: "Notes saved",
      description: `Your notes for ${team.toUpperCase()} have been saved.`
    });
  };

  const saveToLocalStorage = (key: string, data: any) => {
    const savedNotes = getNotes() || {
      motion,
      role,
      prep: {},
      listening: {},
      speech: {},
      lastUpdated: Date.now()
    };
    
    savedNotes[key] = data;
    saveNotes(savedNotes);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <h1 className="text-2xl font-bold">{roleData.listening.title}</h1>
        <p className="text-gray-600 mt-1">{motion}</p>
        <p className="mt-3">{roleData.listening.description}</p>
      </div>
      
      <div className="mb-6">
        <TeamNotesGrid 
          notes={teamNotes} 
          onChange={handleTeamNoteChange} 
        />
      </div>
      
      <div className="text-right mt-6">
        <Button onClick={onComplete} size="lg">
          Continue to Speech Stage
        </Button>
      </div>
    </div>
  );
};

export default ListeningStage;
