
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getNotes, saveNotes } from "@/utils/localStorage";
import { roleContent, DebateRole, debateRoles } from "@/utils/debateData";
import TeamNotesGrid from './TeamNotesGrid';
import { useToast } from "@/components/ui/use-toast";
import { StatusBar } from "@/components/ui/status-bar";
import { Lightbulb } from "lucide-react";
import TipsPanel from './TipsPanel';
import EditableMotion from './EditableMotion';

interface ListeningStageProps {
  role: string;
  motion: string;
  onComplete: () => void;
  onMotionChange: (newMotion: string) => void;
}

const ListeningStage: React.FC<ListeningStageProps> = ({ role, motion, onComplete, onMotionChange }) => {
  const { toast } = useToast();
  const roleData = roleContent[role as DebateRole];
  
  const [teamNotes, setTeamNotes] = useState({
    og: '',
    oo: '',
    cg: '',
    co: '',
    ogRebuttal: '',
    ooRebuttal: '',
    cgRebuttal: '',
    coRebuttal: '',
    ogComparison: '',
    ooComparison: '',
    cgComparison: '',
    coComparison: ''
  });

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isTipsPanelOpen, setIsTipsPanelOpen] = useState<boolean>(false);
  
  useEffect(() => {
    const savedNotes = getNotes();
    if (savedNotes) {
      if (savedNotes.teamNotes) {
        setTeamNotes({
          og: savedNotes.teamNotes.og || '',
          oo: savedNotes.teamNotes.oo || '',
          cg: savedNotes.teamNotes.cg || '',
          co: savedNotes.teamNotes.co || '',
          ogRebuttal: savedNotes.teamNotes.ogRebuttal || '',
          ooRebuttal: savedNotes.teamNotes.ooRebuttal || '',
          cgRebuttal: savedNotes.teamNotes.cgRebuttal || '',
          coRebuttal: savedNotes.teamNotes.coRebuttal || '',
          ogComparison: savedNotes.teamNotes.ogComparison || '',
          ooComparison: savedNotes.teamNotes.ooComparison || '',
          cgComparison: savedNotes.teamNotes.cgComparison || '',
          coComparison: savedNotes.teamNotes.coComparison || ''
        });
      }
    }
  }, [role, motion]);

  const handleTeamNoteChange = (team: keyof typeof teamNotes, value: string) => {
    setSaveStatus('saving');
    const updatedTeamNotes = {
      ...teamNotes,
      [team]: value
    };
    setTeamNotes(updatedTeamNotes);
    
    try {
      saveToLocalStorage('teamNotes', updatedTeamNotes);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      toast({
        variant: "destructive",
        title: "Error saving notes",
        description: "There was a problem saving your notes. Please try again."
      });
    }
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
    <div className="max-w-6xl mx-auto p-4" dir="rtl">
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{roleData.listening.title}</h1>
          <EditableMotion 
            motion={motion} 
            onMotionChange={onMotionChange} 
            className="mt-1"
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsTipsPanelOpen(true)}
            className="flex items-center gap-2"
          >
            <Lightbulb className="h-4 w-4" />
            <span className="hidden sm:inline">טיפים ומקורות</span>
          </Button>
        </div>
      </div>
      
      <div className="mb-6">
        <Card className="p-4 mb-4">
          <p className="text-gray-700 text-sm mb-2">
            רשום הערות על כל קבוצה בזמן שאתה מקשיב לנאומים האחרים.
          </p>
        </Card>
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

      {/* Side Panel for Tips */}
      <TipsPanel 
        role={role as DebateRole} 
        content={{
          instructions: roleData.listening.instructions,
          questions: roleData.listening.questions || [],
          tips: roleData.listening.tips
        }}
        isOpen={isTipsPanelOpen}
        onClose={() => setIsTipsPanelOpen(false)}
      />

      <StatusBar status={saveStatus} />
    </div>
  );
};

export default ListeningStage;
