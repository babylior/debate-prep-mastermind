
import React, { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Timer from "@/components/Timer";
import { useToast } from "@/components/ui/use-toast";
import { getNotes, saveNotes } from "@/utils/localStorage";
import { roleContent, DebateRole } from "@/utils/debateData";

interface PrepStageProps {
  role: string;
  motion: string;
  onComplete: () => void;
}

const PrepStage: React.FC<PrepStageProps> = ({ role, motion, onComplete }) => {
  const { toast } = useToast();
  const roleData = roleContent[role as DebateRole];
  
  const [notes, setNotes] = useState<Record<string, string>>({
    'problem': '',
    'mechanism': '',
    'arguments': '',
    'notes': ''
  });

  // Initialize notes from localStorage
  useEffect(() => {
    const savedNotes = getNotes();
    if (savedNotes && savedNotes.prep) {
      setNotes(prev => ({
        ...prev,
        ...savedNotes.prep
      }));
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
  };

  const handleTimerComplete = () => {
    toast({
      title: "Time's up!",
      description: "Your 15-minute preparation time is over.",
    });
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
          
          <Card>
            <CardHeader>
              <CardTitle>Key Arguments</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="List your main arguments..."
                className="min-h-[150px]"
                value={notes.arguments}
                onChange={(e) => handleNoteChange('arguments', e.target.value)}
              />
            </CardContent>
          </Card>
          
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
