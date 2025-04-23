
import React, { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getNotes, saveNotes } from "@/utils/localStorage";
import { roleContent, DebateRole, debateRoles } from "@/utils/debateData";
import TeamNotesGrid from './TeamNotesGrid';
import { Plus } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface ListeningStageProps {
  role: string;
  motion: string;
  onComplete: () => void;
}

const ListeningStage: React.FC<ListeningStageProps> = ({ role, motion, onComplete }) => {
  const { toast } = useToast();
  const roleData = roleContent[role as DebateRole];
  const currentRole = debateRoles.find(r => r.id === role);
  const currentOrder = currentRole?.order || 1;
  
  // Determine which speakers come before this role
  const previousSpeakers = debateRoles
    .filter(r => r.order < currentOrder)
    .sort((a, b) => a.order - b.order);
  
  const [activeTab, setActiveTab] = useState<string>("notes");
  const [notes, setNotes] = useState<Record<string, string>>({
    'keyPoints': '',
    'rebuttals': '',
    'additionalNotes': ''
  });
  const [teamNotes, setTeamNotes] = useState({
    og: '',
    oo: '',
    cg: '',
    co: ''
  });
  const [interactivePrompts, setInteractivePrompts] = useState<Array<{id: string, question: string, answer: string, rebuttal: string}>>([]);
  
  // Initialize notes from localStorage
  useEffect(() => {
    const savedNotes = getNotes();
    if (savedNotes) {
      if (savedNotes.listening) {
        setNotes(prev => ({
          ...prev,
          ...savedNotes.listening
        }));
      }
      
      // Load team notes if they exist
      if (savedNotes.teamNotes) {
        setTeamNotes({
          og: savedNotes.teamNotes.og || '',
          oo: savedNotes.teamNotes.oo || '',
          cg: savedNotes.teamNotes.cg || '',
          co: savedNotes.teamNotes.co || ''
        });
      }
      
      // Load interactive prompts if they exist
      if (savedNotes.interactivePrompts) {
        setInteractivePrompts(savedNotes.interactivePrompts);
      } else {
        // Initialize with default prompts
        const defaultPrompts = [
          {
            id: '1', 
            question: "What was the strongest argument made by Opening Government?",
            answer: '',
            rebuttal: ''
          },
          {
            id: '2', 
            question: "What key evidence or examples did previous speakers use?",
            answer: '',
            rebuttal: ''
          },
          {
            id: '3', 
            question: "Where did you notice contradictions or weaknesses?",
            answer: '',
            rebuttal: ''
          }
        ];
        setInteractivePrompts(defaultPrompts);
        
        // Save the default prompts
        const notesToSave = savedNotes || {
          motion,
          role,
          prep: {},
          listening: {},
          speech: {},
          lastUpdated: Date.now()
        };
        notesToSave.interactivePrompts = defaultPrompts;
        saveNotes(notesToSave);
      }
    }
  }, [role, motion]);

  const handleNoteChange = (key: string, value: string) => {
    const updatedNotes = {
      ...notes,
      [key]: value
    };
    setNotes(updatedNotes);
    saveToLocalStorage('listening', updatedNotes);
  };

  const handleTeamNoteChange = (team: 'og' | 'oo' | 'cg' | 'co', value: string) => {
    const updatedTeamNotes = {
      ...teamNotes,
      [team]: value
    };
    setTeamNotes(updatedTeamNotes);
    saveToLocalStorage('teamNotes', updatedTeamNotes);
    
    // Show feedback
    toast({
      title: "Notes saved",
      description: `Your notes for ${team.toUpperCase()} have been saved.`
    });
  };

  const handlePromptAnswerChange = (id: string, field: 'answer' | 'rebuttal', value: string) => {
    const updatedPrompts = interactivePrompts.map(prompt => 
      prompt.id === id ? { ...prompt, [field]: value } : prompt
    );
    setInteractivePrompts(updatedPrompts);
    saveToLocalStorage('interactivePrompts', updatedPrompts);
    
    // Update rebuttals in speech section
    updateRebuttalInSpeech(updatedPrompts);
  };

  const addNewPrompt = () => {
    const newPrompt = {
      id: Date.now().toString(),
      question: "What important point should you address?",
      answer: '',
      rebuttal: ''
    };
    
    const updatedPrompts = [...interactivePrompts, newPrompt];
    setInteractivePrompts(updatedPrompts);
    saveToLocalStorage('interactivePrompts', updatedPrompts);
    
    toast({
      title: "New prompt added",
      description: "A new prompt has been added."
    });
  };

  const saveToLocalStorage = (key: string, data: any) => {
    const savedNotes = getNotes() || {
      motion,
      role,
      prep: {},
      listening: {},
      speech: {},
      lastUpdated: Date.now()
    };
    
    savedNotes[key] = data;
    saveNotes(savedNotes);
  };

  const updateRebuttalInSpeech = (prompts: typeof interactivePrompts) => {
    // Collect all rebuttals that have content
    const rebuttals = prompts
      .filter(prompt => prompt.rebuttal.trim())
      .map(prompt => prompt.rebuttal);
    
    if (rebuttals.length > 0) {
      const savedNotes = getNotes();
      if (savedNotes) {
        // Initialize speech if needed
        if (!savedNotes.speech) {
          savedNotes.speech = {};
        }
        
        // Add rebuttals to speech section
        savedNotes.speech.Rebuttals = rebuttals.join('\n\n');
        saveNotes(savedNotes);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <h1 className="text-2xl font-bold">{roleData.listening.title}</h1>
        <p className="text-gray-600 mt-1">{motion}</p>
        <p className="mt-3">{roleData.listening.description}</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 bg-white shadow-sm border">
          <TabsTrigger value="notes">Traditional Notes</TabsTrigger>
          <TabsTrigger value="teams">Team Grid</TabsTrigger>
          <TabsTrigger value="interactive">Interactive Prompts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="notes" className="mt-0">
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
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="teams" className="mt-0">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Team Notes Grid</h2>
            <p className="mb-4 text-gray-600">
              Take structured notes for each team as they speak. This will help you organize your thoughts and prepare rebuttals.
            </p>
            <TeamNotesGrid 
              notes={teamNotes} 
              onChange={handleTeamNoteChange} 
            />
          </div>
        </TabsContent>
        
        <TabsContent value="interactive" className="mt-0">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Interactive Prompts</h2>
            <p className="mb-4 text-gray-600">
              Answer these guiding questions and develop rebuttals. Your rebuttals will automatically appear in your Speech section.
            </p>
            
            <div className="space-y-6">
              {interactivePrompts.map((prompt) => (
                <Card key={prompt.id} className="hover:shadow-md transition-all duration-200">
                  <CardHeader>
                    <CardTitle className="text-lg">{prompt.question}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <CardDescription className="mb-2">Your Answer:</CardDescription>
                      <Textarea
                        placeholder="Write your answer here..."
                        className="min-h-[100px]"
                        value={prompt.answer}
                        onChange={(e) => handlePromptAnswerChange(prompt.id, 'answer', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <CardDescription className="mb-2">Your Rebuttal:</CardDescription>
                      <Textarea
                        placeholder="Write your rebuttal here..."
                        className="min-h-[100px]"
                        value={prompt.rebuttal}
                        onChange={(e) => handlePromptAnswerChange(prompt.id, 'rebuttal', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button onClick={addNewPrompt} className="w-full" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add New Prompt
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="text-right mt-6">
        <Button onClick={onComplete} size="lg">
          Continue to Speech Stage
        </Button>
      </div>
    </div>
  );
};

export default ListeningStage;
