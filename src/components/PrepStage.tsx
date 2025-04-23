
import React, { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Timer from "@/components/Timer";
import { useToast } from "@/components/ui/use-toast";
import { getNotes, saveNotes } from "@/utils/localStorage";
import { roleContent, DebateRole } from "@/utils/debateData";
import DraggableArgumentCard from './DraggableArgumentCard';
import { Plus } from 'lucide-react';

interface PrepStageProps {
  role: string;
  motion: string;
  onComplete: () => void;
}

interface Argument {
  id: string;
  title: string;
  content: string;
}

const PrepStage: React.FC<PrepStageProps> = ({ role, motion, onComplete }) => {
  const { toast } = useToast();
  const roleData = roleContent[role as DebateRole];
  
  const [notes, setNotes] = useState<Record<string, string>>({
    'problem': '',
    'mechanism': '',
    'notes': ''
  });
  const [prepArguments, setPrepArguments] = useState<Argument[]>([]);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [autoStartTimer, setAutoStartTimer] = useState(true);

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
        const initialArg = {
          id: Date.now().toString(),
          title: 'Argument 1',
          content: ''
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
    
    // Provide subtle visual feedback
    toast({
      title: "Note saved",
      description: "Your notes have been saved.",
      duration: 1500
    });
  };

  const handleTimerComplete = () => {
    toast({
      title: "Time's up!",
      description: "Your 15-minute preparation time is over.",
    });
  };
  
  // Argument functions
  const addArgument = () => {
    const newArg = {
      id: Date.now().toString(),
      title: `Argument ${prepArguments.length + 1}`,
      content: ''
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
        id: Date.now().toString(),
        title: `${argToDuplicate.title} (Copy)`
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
  
  const updateArgument = (id: string, content: string) => {
    const updatedArgs = prepArguments.map(arg =>
      arg.id === id ? { ...arg, content } : arg
    );
    
    setPrepArguments(updatedArgs);
    
    // Save to localStorage
    const savedNotes = getNotes();
    if (savedNotes) {
      savedNotes.prepArguments = updatedArgs;
      saveNotes(savedNotes);
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

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <h1 className="text-2xl font-bold">{roleData.prep.title}</h1>
        <p className="text-gray-600 mt-1">{motion}</p>
        <p className="mt-3">{roleData.prep.description}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Timer and Instructions */}
        <div className="lg:col-span-1 space-y-6">
          <Timer 
            initialTime={15 * 60} // 15 minutes in seconds
            timerLabel="Prep Time"
            onComplete={handleTimerComplete}
            autoStart={autoStartTimer}
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="list-disc pl-5 space-y-1">
                {roleData.prep.instructions.map((instruction, idx) => (
                  <li key={idx}>{instruction}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Key Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                {roleData.prep.questions.map((question, idx) => (
                  <li key={idx}>{question}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1">
                {roleData.prep.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Notes */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Problem/Current Situation</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Define the problem or current situation..."
                className="min-h-[100px]"
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
                className="min-h-[100px]"
                value={notes.mechanism}
                onChange={(e) => handleNoteChange('mechanism', e.target.value)}
              />
            </CardContent>
          </Card>
          
          {/* Arguments section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Arguments</h2>
              <Button onClick={addArgument}>
                <Plus className="h-4 w-4 mr-2" />
                Add Argument
              </Button>
            </div>
            
            <div className="space-y-4">
              {prepArguments.map((arg, index) => (
                <div 
                  key={arg.id} 
                  onDragOver={(e) => handleDragOver(e, index)}
                >
                  <DraggableArgumentCard
                    id={arg.id}
                    title={arg.title}
                    content={arg.content}
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
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add any additional notes..."
                className="min-h-[100px]"
                value={notes.notes}
                onChange={(e) => handleNoteChange('notes', e.target.value)}
              />
            </CardContent>
          </Card>
          
          <div className="text-right">
            <Button onClick={onComplete} size="lg">
              Continue to Listening Stage
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrepStage;
