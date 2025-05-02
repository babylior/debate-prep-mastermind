
import React, { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Timer from "@/components/Timer";
import { useToast } from "@/components/ui/use-toast";
import { getNotes, saveNotes } from "@/utils/localStorage";
import { roleContent, DebateRole } from "@/utils/debateData";
import DraggableArgumentCard from './DraggableArgumentCard';
import { Lightbulb, Plus } from 'lucide-react';
import TipsPanel from './TipsPanel';
import PrepTabs from './PrepTabs';
import { StatusBar } from '@/components/ui/status-bar';

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
  
  const [activeTab, setActiveTab] = useState<string>('framing');
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
  const [autoStartTimer, setAutoStartTimer] = useState(false); // Changed to false to allow starting timer before motion

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
      title: "Time's up!",
      description: "Your 15-minute preparation time is over.",
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
      title: "Argument added",
      description: "A new argument card has been added.",
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
      case 'framing':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Framing & Context</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Define the debate framing and key contexts..."
                  className="min-h-[150px]"
                  value={notes.framing}
                  onChange={(e) => handleNoteChange('framing', e.target.value)}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Problem/Current Situation</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Define the problem or current situation..."
                  className="min-h-[150px]"
                  value={notes.problem}
                  onChange={(e) => handleNoteChange('problem', e.target.value)}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Mechanism/Solution</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Describe your mechanism or approach..."
                  className="min-h-[150px]"
                  value={notes.mechanism}
                  onChange={(e) => handleNoteChange('mechanism', e.target.value)}
                />
              </CardContent>
            </Card>
          </div>
        );
      
      case 'idea-dump':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Idea Dump</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Write down all your ideas here. Don't worry about organization yet, just get your thoughts out..."
                className="min-h-[400px]"
                value={notes.ideaDump}
                onChange={(e) => handleNoteChange('ideaDump', e.target.value)}
              />
            </CardContent>
          </Card>
        );
      
      case 'argument-builder':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Arguments</h2>
              <Button onClick={addArgument}>
                <Plus className="h-4 w-4 mr-2" />
                Add Argument
              </Button>
            </div>
            
            {prepArguments.map((arg, index) => (
              <div 
                key={arg.id} 
                onDragOver={(e) => handleDragOver(e, index)}
              >
                <DraggableArgumentCard
                  id={arg.id}
                  claim={arg.claim}
                  whyTrue={arg.whyTrue}
                  mechanism={arg.mechanism}
                  impact={arg.impact}
                  weighing={arg.weighing}
                  index={index}
                  onDelete={deleteArgument}
                  onDuplicate={duplicateArgument}
                  onChange={updateArgument}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                />
              </div>
            ))}
          </div>
        );
      
      case 'rebuttal-builder':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Rebuttal Preparation</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Prepare potential rebuttals to opposing arguments..."
                className="min-h-[400px]"
                value={notes.notes}
                onChange={(e) => handleNoteChange('notes', e.target.value)}
              />
            </CardContent>
          </Card>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{roleData.prep.title}</h1>
          <p className="text-gray-600 mt-1">{motion || "Preparing without motion"}</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsTipsPanelOpen(true)}
            className="flex items-center gap-2"
          >
            <Lightbulb className="h-4 w-4" />
            <span className="hidden sm:inline">Tips & Resources</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - Timer */}
        <div className="lg:col-span-1">
          <Timer 
            initialTime={15 * 60} // 15 minutes in seconds
            timerLabel="Prep Time"
            onComplete={handleTimerComplete}
            autoStart={autoStartTimer}
          />
        </div>
        
        {/* Right Column - Tabbed Content */}
        <div className="lg:col-span-3 space-y-4">
          <PrepTabs 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
          
          {renderTabContent()}
          
          <div className="text-right mt-6">
            <Button onClick={onComplete} size="lg">
              Continue to Listening Stage
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
