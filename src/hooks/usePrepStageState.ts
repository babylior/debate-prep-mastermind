
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { getNotes, saveNotes } from "@/utils/localStorage";
import { Argument } from '@/types/prepTypes';
import { useNotesManager } from './prep/useNotesManager';
import { useArgumentsManager } from './prep/useArgumentsManager';
import { useDragDrop } from './prep/useDragDrop';

export type { Argument };

export const usePrepStageState = (role: string, motion: string) => {
  const { toast } = useToast();
  
  // Changed default tab to 'argument-builder' instead of 'idea-dump'
  const [activeTab, setActiveTab] = useState<string>('argument-builder');
  const [isTipsPanelOpen, setIsTipsPanelOpen] = useState<boolean>(false);
  
  // Use the extracted hooks
  const { 
    notes, 
    setNotes, 
    saveStatus, 
    handleNoteChange 
  } = useNotesManager(role, motion);
  
  const {
    prepArguments,
    setPrepArguments,
    addArgument,
    deleteArgument,
    duplicateArgument,
    updateArgument
  } = useArgumentsManager(role, motion);
  
  const {
    draggedItemIndex,
    handleDragStart,
    handleDragEnd,
    handleDragOver
  } = useDragDrop(prepArguments, setPrepArguments);

  // Initialize notes from localStorage
  useEffect(() => {
    const savedNotes = getNotes();
    if (savedNotes) {
      if (savedNotes.prep) {
        setNotes(prev => ({
          ...prev,
          ...savedNotes.prep
        }));
      }
      
      if (savedNotes.prepArguments) {
        setPrepArguments(savedNotes.prepArguments);
      } else {
        // Initialize with one empty argument
        const initialArg: Argument = {
          id: Date.now().toString(),
          claim: '',
          whyTrue: '',
          mechanism: '',
          impact: '',
          weighing: ''
        };
        setPrepArguments([initialArg]);
        
        // Save the initial argument
        if (savedNotes) {
          savedNotes.prepArguments = [initialArg];
          saveNotes(savedNotes);
        }
      }
    }
  }, [role]);

  const handleTimerComplete = () => {
    toast({
      title: "הזמן נגמר!",
      description: "זמן ההכנה של 15 דקות הסתיים.",
    });
  };

  return {
    activeTab,
    setActiveTab,
    isTipsPanelOpen,
    setIsTipsPanelOpen,
    saveStatus,
    notes,
    prepArguments,
    handleNoteChange,
    handleTimerComplete,
    addArgument,
    deleteArgument,
    duplicateArgument,
    updateArgument,
    handleDragStart,
    handleDragEnd,
    handleDragOver
  };
};
