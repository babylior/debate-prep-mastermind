
import React, { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Timer from "@/components/Timer";
import ExportButton from "@/components/ExportButton";
import { useToast } from "@/components/ui/use-toast";
import { getNotes, saveNotes } from "@/utils/localStorage";
import { roleContent, DebateRole } from "@/utils/debateData";

interface SpeechStageProps {
  role: string;
  motion: string;
  onReset: () => void;
}

const SpeechStage: React.FC<SpeechStageProps> = ({ role, motion, onReset }) => {
  const { toast } = useToast();
  const roleData = roleContent[role as DebateRole];
  
  const [speechNotes, setSpeechNotes] = useState<Record<string, string>>({});

  // Initialize template sections
  const templateSections = roleData.speech.templateSections || [];
  
  // Initialize notes from localStorage
  useEffect(() => {
    const savedNotes = getNotes();
    if (savedNotes && savedNotes.speech) {
      setSpeechNotes(savedNotes.speech);
    } else {
      // Initialize with empty sections
      const initial: Record<string, string> = {};
      templateSections.forEach(section => {
        initial[section.name] = '';
      });
      setSpeechNotes(initial);
    }
  }, [role, templateSections]);

  const handleNoteChange = (key: string, value: string) => {
    const updatedNotes = {
      ...speechNotes,
      [key]: value
    };
    setSpeechNotes(updatedNotes);
    
    // Save to localStorage
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
        {/* Left Column - Timer and Instructions */}
        <div className="lg:col-span-1 space-y-6">
          <Timer 
            initialTime={7 * 60} // 7 minutes in seconds
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
        
        {/* Right Column - Speech Builder */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold">Speech Builder</h2>
          
          {templateSections.map((section, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle>{section.name}</CardTitle>
                <CardDescription>{section.duration} - {section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder={`Write your ${section.name.toLowerCase()} here...`}
                  className="min-h-[100px]"
                  value={speechNotes[section.name] || ''}
                  onChange={(e) => handleNoteChange(section.name, e.target.value)}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpeechStage;
