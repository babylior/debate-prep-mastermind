
import { useState } from 'react';
import { Argument } from '@/types/prepTypes';
import { getNotes, saveNotes } from "@/utils/localStorage";
import { useToast } from "@/components/ui/use-toast";

export const useArgumentsManager = (role: string, motion: string) => {
  const { toast } = useToast();
  const [prepArguments, setPrepArguments] = useState<Argument[]>([]);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const addArgument = () => {
    const newArg: Argument = {
      id: Date.now().toString(),
      claim: '',
      whyTrue: '',
      mechanism: '',
      impact: '',
      weighing: ''
    };
    
    const updatedArgs = [...prepArguments, newArg];
    setPrepArguments(updatedArgs);
    
    // Save to localStorage
    const savedNotes = getNotes() || {
      motion,
      role,
      prep: {},
      listening: {},
      speech: {},
      lastUpdated: Date.now()
    };
    
    savedNotes.prepArguments = updatedArgs;
    saveNotes(savedNotes);
    
    // Show feedback
    toast({
      title: "טיעון נוסף",
      description: "כרטיס טיעון חדש נוסף.",
    });
  };
  
  const deleteArgument = (id: string) => {
    const updatedArgs = prepArguments.filter(arg => arg.id !== id);
    setPrepArguments(updatedArgs);
    
    // Save to localStorage
    const savedNotes = getNotes();
    if (savedNotes) {
      savedNotes.prepArguments = updatedArgs;
      saveNotes(savedNotes);
    }
  };
  
  const duplicateArgument = (id: string) => {
    const argToDuplicate = prepArguments.find(arg => arg.id === id);
    if (argToDuplicate) {
      const newArg = {
        ...argToDuplicate,
        id: Date.now().toString()
      };
      
      const updatedArgs = [...prepArguments, newArg];
      setPrepArguments(updatedArgs);
      
      // Save to localStorage
      const savedNotes = getNotes();
      if (savedNotes) {
        savedNotes.prepArguments = updatedArgs;
        saveNotes(savedNotes);
      }
    }
  };
  
  const updateArgument = (
    id: string, 
    field: "claim" | "whyTrue" | "mechanism" | "impact" | "weighing", 
    value: string
  ) => {
    setSaveStatus('saving');
    const updatedArgs = prepArguments.map(arg =>
      arg.id === id ? { ...arg, [field]: value } : arg
    );
    
    setPrepArguments(updatedArgs);
    
    // Save to localStorage
    const savedNotes = getNotes();
    if (savedNotes) {
      savedNotes.prepArguments = updatedArgs;
      saveNotes(savedNotes);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  return {
    prepArguments,
    setPrepArguments,
    saveStatus,
    addArgument,
    deleteArgument,
    duplicateArgument,
    updateArgument,
    draggedItemIndex,
    setDraggedItemIndex
  };
};
