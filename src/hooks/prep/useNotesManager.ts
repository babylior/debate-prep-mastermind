
import { useState } from 'react';
import { PrepNotes, SaveStatus } from '@/types/prepTypes';
import { getNotes, saveNotes } from "@/utils/localStorage";

export const useNotesManager = (role: string, motion: string) => {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [notes, setNotes] = useState<PrepNotes>({
    'problem': '',
    'mechanism': '',
    'framing': '',
    'ideaDump': '',
    'notes': ''
  });
  
  const handleNoteChange = (key: keyof PrepNotes, value: string) => {
    setSaveStatus('saving');
    
    // Update the notes state
    setNotes(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Save to localStorage
    const savedNotes = getNotes() || {
      motion,
      role,
      prep: {},
      listening: {},
      speech: {},
      lastUpdated: Date.now()
    };
    
    if (!savedNotes.prep) {
      savedNotes.prep = {};
    }
    
    savedNotes.prep[key] = value;
    saveNotes(savedNotes);
    
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  return {
    notes,
    setNotes,
    saveStatus,
    setSaveStatus,
    handleNoteChange
  };
};
