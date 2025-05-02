import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Timer from "@/components/Timer";
import ExportButton from "@/components/ExportButton";
import { useToast } from "@/components/ui/use-toast";
import { getNotes, saveNotes } from "@/utils/localStorage";
import { roleContent, DebateRole, debateRoles } from "@/utils/debateData";
import SpeechStructurePanel from "./SpeechStructurePanel";
import ContentPanel from "./ContentPanel";
import ReviewLocations from "./ReviewLocations";
import { StatusBar } from "@/components/ui/status-bar";
import { Lightbulb } from "lucide-react";
import TipsPanel from './TipsPanel';

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

interface Section {
  title: string;
  content: string;
  type: 'opening' | 'roadmap' | 'rebuttal' | 'argument' | 'conclusion';
}

const SpeechStage: React.FC<SpeechStageProps> = ({ role, motion, onReset }) => {
  const { toast } = useToast();
  const roleData = roleContent[role as DebateRole];
  const currentRole = debateRoles.find(r => r.id === role);
  
  const [isEditMode, setIsEditMode] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
  const [sections, setSections] = useState<Section[]>([
    { title: 'Opening', content: '', type: 'opening' },
    { title: 'Roadmap', content: '', type: 'roadmap' },
    { title: 'Rebuttals', content: '', type: 'rebuttal' },
    { title: 'Arguments', content: '', type: 'argument' },
    { title: 'Conclusion', content: '', type: 'conclusion' }
  ]);
  
  const [content, setContent] = useState({
    argumentsList: [],
    rebuttals: [],
    framing: []
  });

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isTipsPanelOpen, setIsTipsPanelOpen] = useState<boolean>(false);

  useEffect(() => {
    const savedNotes = getNotes();
    if (savedNotes) {
      // Load saved speech sections if they exist
      if (savedNotes.speech?.sectionsData) {
        try {
          const parsedSections = JSON.parse(savedNotes.speech.sectionsData);
          setSections(parsedSections);
        } catch (e) {
          console.error("Error parsing saved sections", e);
        }
      }
      
      // Fixed type error: Ensure all ids are strings
      if (savedNotes.prepArguments) {
        const prepArgs = savedNotes.prepArguments.map(arg => ({
          id: String(arg.id), // Convert to string explicitly
          title: arg.claim,
          content: `${arg.whyTrue}\n${arg.mechanism}\n${arg.impact}`,
          type: 'argument' as const
        }));
        setContent(prev => ({ ...prev, argumentsList: prepArgs }));
      }
      
      // Load rebuttals from team notes
      if (savedNotes.teamNotes) {
        const rebuttals = Object.entries(savedNotes.teamNotes)
          .filter(([_, value]) => value)
          .map(([team, rebuttal], index) => ({
            id: `rebuttal-${index}`,
            title: `Rebuttal to ${team.toUpperCase()}`,
            content: rebuttal,
            type: 'rebuttal' as const
          }));
        setContent(prev => ({ ...prev, rebuttals }));
      }
      
      // Load framing content - Fix type error by ensuring id is a string
      if (savedNotes.prep?.framing) {
        const framing = [{
          id: 'framing-1', // Ensure this is a string
          title: 'Framing',
          content: savedNotes.prep.framing,
          type: 'framing' as const
        }];
        setContent(prev => ({ ...prev, framing }));
      } else if (savedNotes.prep?.problem) {
        // Fallback to problem definition if framing isn't available
        const framing = [{
          id: 'framing-1', // Ensure this is a string
          title: 'Key Context',
          content: savedNotes.prep.problem,
          type: 'framing' as const
        }];
        setContent(prev => ({ ...prev, framing }));
      }
    }
  }, [role]);

  const handleModeToggle = () => {
    setIsEditMode(!isEditMode);
    if (!isEditMode) {
      setCurrentSection(0);
    }
  };

  const handleNextSection = () => {
    setCurrentSection(prev => Math.min(prev + 1, sections.length - 1));
  };

  const handleDrop = (sectionIndex: number, itemId: string) => {
    setSaveStatus('saving');
    const allContent = [
      ...content.argumentsList,
      ...content.rebuttals,
      ...content.framing
    ];
    const droppedItem = allContent.find(item => item.id === itemId);
    
    if (droppedItem) {
      const updatedSections = sections.map((section, index) => {
        if (index === sectionIndex) {
          return {
            ...section,
            content: section.content 
              ? `${section.content}\n\n${droppedItem.content}`
              : droppedItem.content
          };
        }
        return section;
      });
      
      setSections(updatedSections);
      
      try {
        const savedNotes = getNotes();
        if (savedNotes) {
          savedNotes.speech = { 
            sectionsData: JSON.stringify(updatedSections),
            lastUpdated: Date.now()
          };
          saveNotes(savedNotes);
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus('idle'), 2000);
        }
      } catch (error) {
        setSaveStatus('error');
        toast({
          variant: "destructive",
          title: "Error saving speech",
          description: "There was a problem saving your speech content. Please try again."
        });
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{roleData.speech.title}</h1>
            <p className="text-gray-600 mt-1">{motion}</p>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setIsTipsPanelOpen(true)}
              className="flex items-center gap-2"
            >
              <Lightbulb className="h-4 w-4" />
              <span className="hidden sm:inline">Tips</span>
            </Button>
            <ReviewLocations />
            <ExportButton 
              motion={motion}
              role={currentRole?.name || ''}
              sections={sections}
            />
            <Button variant="outline" onClick={onReset}>
              Start Over
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SpeechStructurePanel
            isEditMode={isEditMode}
            currentSection={currentSection}
            sections={sections}
            onModeToggle={handleModeToggle}
            onNextSection={handleNextSection}
            onDrop={handleDrop}
            showTimer={true} // Enable 7-minute timer
          />
        </div>
        
        {isEditMode && (
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
                <CardDescription>
                  Drag items into your speech structure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContentPanel
                  argumentsList={content.argumentsList}
                  rebuttals={content.rebuttals}
                  framing={content.framing}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Tips Panel */}
      <TipsPanel 
        role={role as DebateRole} 
        content={{
          instructions: roleData.speech.instructions || [],
          tips: roleData.speech.tips || []
        }}
        isOpen={isTipsPanelOpen}
        onClose={() => setIsTipsPanelOpen(false)}
      />

      <StatusBar status={saveStatus} />
    </div>
  );
};

export default SpeechStage;
