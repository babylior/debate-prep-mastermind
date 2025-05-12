import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Timer from "@/components/Timer";
import { useToast } from "@/components/ui/use-toast";
import { getNotes, saveNotes } from "@/utils/localStorage";
import { roleContent, DebateRole } from "@/utils/debateData";
import { Lightbulb } from 'lucide-react';
import TipsPanel from './TipsPanel';
import PrepTabs from './PrepTabs';
import { StatusBar } from '@/components/ui/status-bar';
import IdeaDumpTab from './prep/IdeaDumpTab';
import ArgumentBuilderTab from './prep/ArgumentBuilderTab';

interface PrepStageProps {
  role: string;
  motion: string;
  onComplete: () => void;
}

interface Argument {
  id: string;
  claim: string;
  whyTrue: string;
  mechanism: string;
  impact: string;
  weighing: string;
}

const PrepStage: React.FC<PrepStageProps> = ({ role, motion, onComplete }) => {
  const { toast } = useToast();
  const roleData = roleContent[role as DebateRole];
  
  const [activeTab, setActiveTab] = useState<string>('idea-dump');
  const [isTipsPanelOpen, setIsTipsPanelOpen] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  
  const [notes, setNotes] = useState<Record<string, string>>({
    'problem': '',
    'mechanism': '',
    'framing': '',
    'ideaDump': '',
    'notes': ''
  });
  
  const [prepArguments, setPrepArguments] = useState<Argument[]>([]);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

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

  const handleNoteChange = (key: string, value: string) => {
    setSaveStatus('saving');
    const updatedNotes = {
      ...notes,
      [key]: value
    };
    setNotes(updatedNotes);
    
    // Save to localStorage
    const savedNotes = getNotes() || {
      motion,
      role,
      prep: {},
      listening: {},
      speech: {},
      lastUpdated: Date.now()
    };
    
    savedNotes.prep = updatedNotes;
    saveNotes(savedNotes);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handleTimerComplete = () => {
    toast({
      title: "הזמן נגמר!",
      description: "זמן ההכנה של 15 דקות הסתיים.",
    });
  };
  
  // Argument functions
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
  
  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };
  
  const handleDragEnd = () => {
    setDraggedItemIndex(null);
  };
  
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    
    const newArguments = [...prepArguments];
    const draggedItem = newArguments[draggedItemIndex];
    
    // Remove the dragged item
    newArguments.splice(draggedItemIndex, 1);
    // Insert it at the new position
    newArguments.splice(index, 0, draggedItem);
    
    setDraggedItemIndex(index);
    setPrepArguments(newArguments);
    
    // Save the new order to localStorage
    const savedNotes = getNotes();
    if (savedNotes) {
      savedNotes.prepArguments = newArguments;
      saveNotes(savedNotes);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'idea-dump':
        return (
          <IdeaDumpTab 
            notes={notes.ideaDump}
            onChange={(value) => handleNoteChange('ideaDump', value)}
          />
        );
      
      case 'argument-builder':
        return (
          <ArgumentBuilderTab 
            notes={{
              problem: notes.problem,
              mechanism: notes.mechanism,
              framing: notes.framing,
              notes: notes.notes
            }}
            args={prepArguments} // Changed from 'arguments' to 'args'
            onNotesChange={handleNoteChange}
            onAddArgument={addArgument}
            onDeleteArgument={deleteArgument}
            onDuplicateArgument={duplicateArgument}
            onUpdateArgument={updateArgument}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4" dir="rtl">
      <div className="bg-white rounded-lg shadow-md border p-4 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{roleData.prep.title}</h1>
          <p className="text-gray-600 mt-1">{motion || "הכנה ללא מושיין"}</p>
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
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - Timer */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="sticky top-4">
            <Timer 
              initialTime={15 * 60} // 15 minutes in seconds
              timerLabel="זמן הכנה"
              onComplete={handleTimerComplete}
              autoStart={false}
            />
          </div>
        </div>
        
        {/* Right Column - Tabbed Content */}
        <div className="lg:col-span-3 space-y-4 order-1 lg:order-2">
          <PrepTabs 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
          
          {renderTabContent()}
          
          <div className="text-left mt-6 lg:mt-10">
            <Button onClick={onComplete} size="lg" className="px-8 py-2">
              המשך לשלב ההקשבה
            </Button>
          </div>
        </div>
      </div>
      
      {/* Side Panel for Tips */}
      <TipsPanel 
        role={role as DebateRole} 
        content={{
          instructions: roleData.prep.instructions,
          questions: roleData.prep.questions,
          tips: roleData.prep.tips
        }}
        isOpen={isTipsPanelOpen}
        onClose={() => setIsTipsPanelOpen(false)}
      />
      
      <StatusBar status={saveStatus} />
    </div>
  );
};

export default PrepStage;
