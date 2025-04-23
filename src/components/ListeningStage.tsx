
import React, { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getNotes, saveNotes } from "@/utils/localStorage";
import { roleContent, DebateRole, debateRoles } from "@/utils/debateData";

interface ListeningStageProps {
  role: string;
  motion: string;
  onComplete: () => void;
}

const ListeningStage: React.FC<ListeningStageProps> = ({ role, motion, onComplete }) => {
  const roleData = roleContent[role as DebateRole];
  const currentRole = debateRoles.find(r => r.id === role);
  const currentOrder = currentRole?.order || 1;
  
  // Determine which speakers come before this role
  const previousSpeakers = debateRoles
    .filter(r => r.order < currentOrder)
    .sort((a, b) => a.order - b.order);
  
  const [notes, setNotes] = useState<Record<string, string>>({
    'keyPoints': '',
    'rebuttals': '',
    'additionalNotes': ''
  });

  // Initialize notes from localStorage
  useEffect(() => {
    const savedNotes = getNotes();
    if (savedNotes && savedNotes.listening) {
      setNotes(prev => ({
        ...prev,
        ...savedNotes.listening
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
    
    savedNotes.listening = updatedNotes;
    saveNotes(savedNotes);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <h1 className="text-2xl font-bold">{roleData.listening.title}</h1>
        <p className="text-gray-600 mt-1">{motion}</p>
        <p className="mt-3">{roleData.listening.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Instructions */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>What to Listen For</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="list-disc pl-5 space-y-1">
                {roleData.listening.instructions.map((instruction, idx) => (
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
                {roleData.listening.questions.map((question, idx) => (
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
                {roleData.listening.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          {previousSpeakers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Previous Speakers</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {previousSpeakers.map((speaker) => (
                    <li key={speaker.id} className="flex items-center">
                      <span className={`w-6 h-6 rounded-full ${speaker.teamColor} flex items-center justify-center text-white text-xs font-bold mr-2`}>
                        {speaker.order}
                      </span>
                      <span>{speaker.fullName} ({speaker.name})</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Right Column - Notes */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Key Points from Previous Speakers</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Note key arguments and framing from previous speakers..."
                className="min-h-[150px]"
                value={notes.keyPoints}
                onChange={(e) => handleNoteChange('keyPoints', e.target.value)}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Potential Rebuttals</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="List potential rebuttals to arguments you've heard..."
                className="min-h-[150px]"
                value={notes.rebuttals}
                onChange={(e) => handleNoteChange('rebuttals', e.target.value)}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add any additional observations or ideas..."
                className="min-h-[150px]"
                value={notes.additionalNotes}
                onChange={(e) => handleNoteChange('additionalNotes', e.target.value)}
              />
            </CardContent>
          </Card>
          
          <div className="text-right">
            <Button onClick={onComplete} size="lg">
              Continue to Speech Stage
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListeningStage;
