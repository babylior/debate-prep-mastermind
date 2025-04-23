import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Timer from "@/components/Timer";
import ExportButton from "@/components/ExportButton";
import { useToast } from "@/components/ui/use-toast";
import { getNotes, saveNotes } from "@/utils/localStorage";
import { roleContent, DebateRole } from "@/utils/debateData";
import DraggableArgumentCard from "./DraggableArgumentCard";
import { Plus } from 'lucide-react';

interface SpeechStageProps {
  role: string;
  motion: string;
  onReset: () => void;
}

interface Argument {
  id: string;
  claim: string;
  whyTrue: string;
  mechanism: string;
  impact: string;
  weighing: string;
}

const SpeechStage: React.FC<SpeechStageProps> = ({ role, motion, onReset }) => {
  const { toast } = useToast();
  const roleData = roleContent[role as DebateRole];
  
  const [roadmap, setRoadmap] = useState<string>('');
  const [speechNotes, setSpeechNotes] = useState<Record<string, string>>({});
  const [debateArguments, setDebateArguments] = useState<Argument[]>([]);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  const templateSections = roleData.speech.templateSections || [];
  
  useEffect(() => {
    const savedNotes = getNotes();
    if (savedNotes) {
      if (savedNotes.speech) {
        setSpeechNotes(savedNotes.speech);
      }
      if (savedNotes.roadmap) {
        setRoadmap(savedNotes.roadmap);
      }
      
      if (savedNotes.arguments) {
        setDebateArguments(savedNotes.arguments);
      } else {
        const initialArg: Argument = {
          id: Date.now().toString(),
          claim: '',
          whyTrue: '',
          mechanism: '',
          impact: '',
          weighing: ''
        };
        setDebateArguments([initialArg]);
        
        if (savedNotes) {
          savedNotes.arguments = [initialArg];
          saveNotes(savedNotes);
        }
      }
    }
  }, [role, templateSections]);

  const handleRoadmapChange = (value: string) => {
    setRoadmap(value);
    
    const savedNotes = getNotes() || {
      motion,
      role,
      prep: {},
      listening: {},
      speech: {},
      lastUpdated: Date.now()
    };
    
    savedNotes.roadmap = value;
    saveNotes(savedNotes);
  };

  const handleNoteChange = (key: string, value: string) => {
    const updatedNotes = {
      ...speechNotes,
      [key]: value
    };
    setSpeechNotes(updatedNotes);
    
    const savedNotes = getNotes() || {
      motion,
      role,
      prep: {},
      listening: {},
      speech: {},
      lastUpdated: Date.now()
    };
    
    savedNotes.speech = updatedNotes;
    saveNotes(savedNotes);
  };
  
  const handleTimerComplete = () => {
    toast({
      title: "Time's up!",
      description: "Your 7-minute speech time is over.",
    });
  };
  
  const addArgument = () => {
    const newArg: Argument = {
      id: Date.now().toString(),
      claim: '',
      whyTrue: '',
      mechanism: '',
      impact: '',
      weighing: ''
    };
    
    const updatedArgs = [...debateArguments, newArg];
    setDebateArguments(updatedArgs);
    
    const savedNotes = getNotes() || {
      motion,
      role,
      prep: {},
      listening: {},
      speech: {},
      lastUpdated: Date.now()
    };
    
    savedNotes.arguments = updatedArgs;
    saveNotes(savedNotes);
    
    toast({
      title: "Argument added",
      description: "A new argument card has been added."
    });
  };
  
  const deleteArgument = (id: string) => {
    const updatedArgs = debateArguments.filter(arg => arg.id !== id);
    setDebateArguments(updatedArgs);
    
    const savedNotes = getNotes();
    if (savedNotes) {
      savedNotes.arguments = updatedArgs;
      saveNotes(savedNotes);
    }
  };
  
  const duplicateArgument = (id: string) => {
    const argToDuplicate = debateArguments.find(arg => arg.id === id);
    if (argToDuplicate) {
      const newArg = {
        ...argToDuplicate,
        id: Date.now().toString()
      };
      
      const updatedArgs = [...debateArguments, newArg];
      setDebateArguments(updatedArgs);
      
      const savedNotes = getNotes();
      if (savedNotes) {
        savedNotes.arguments = updatedArgs;
        saveNotes(savedNotes);
      }
    }
  };
  
  const updateArgument = (
    id: string, 
    field: "claim" | "whyTrue" | "mechanism" | "impact" | "weighing", 
    value: string
  ) => {
    const updatedArgs = debateArguments.map(arg =>
      arg.id === id ? { ...arg, [field]: value } : arg
    );
    
    setDebateArguments(updatedArgs);
    
    const savedNotes = getNotes();
    if (savedNotes) {
      savedNotes.arguments = updatedArgs;
      saveNotes(savedNotes);
    }
  };
  
  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };
  
  const handleDragEnd = () => {
    setDraggedItemIndex(null);
  };
  
  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    
    const newArguments = [...debateArguments];
    const draggedItem = newArguments[draggedItemIndex];
    
    newArguments.splice(draggedItemIndex, 1);
    newArguments.splice(index, 0, draggedItem);
    
    setDraggedItemIndex(index);
    setDebateArguments(newArguments);
    
    const savedNotes = getNotes();
    if (savedNotes) {
      savedNotes.arguments = newArguments;
      saveNotes(savedNotes);
    }
  }, [debateArguments, draggedItemIndex]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{roleData.speech.title}</h1>
            <p className="text-gray-600 mt-1">{motion}</p>
            <p className="mt-3">{roleData.speech.description}</p>
          </div>
          <div className="flex space-x-3">
            <ExportButton />
            <Button variant="outline" onClick={onReset}>
              Start Over
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Timer 
            initialTime={7 * 60}
            timerLabel="Speech Time"
            onComplete={handleTimerComplete}
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Speech Structure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="list-disc pl-5 space-y-3">
                {templateSections.map((section, idx) => (
                  <li key={idx}>
                    <span className="font-medium">{section.name}</span> - {section.duration}
                  </li>
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
                {roleData.speech.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
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
                {roleData.speech.questions.map((question, idx) => (
                  <li key={idx}>{question}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Speech Builder</h2>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>🗺️ Speech Roadmap</CardTitle>
              <CardDescription>Plan the structure and flow of your speech</CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full min-h-[100px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Outline what you'll cover in this speech..."
                value={roadmap}
                onChange={(e) => handleRoadmapChange(e.target.value)}
              />
            </CardContent>
          </Card>
          
          {templateSections.map((section, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle>
                  {section.name !== 'Opening' && '🚩 '}{section.name}
                </CardTitle>
                <CardDescription>{section.duration} - {section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <textarea
                  placeholder={`Write your ${section.name.toLowerCase()} here...`}
                  className="w-full min-h-[100px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={speechNotes[section.name] || ''}
                  onChange={(e) => handleNoteChange(section.name, e.target.value)}
                />
              </CardContent>
            </Card>
          ))}
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Arguments</h2>
              <Button onClick={addArgument}>
                <Plus className="h-4 w-4 mr-2" />
                Add Argument
              </Button>
            </div>
            
            <div className="space-y-4">
              {debateArguments.map((arg, index) => (
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeechStage;
