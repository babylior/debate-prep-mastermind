
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Timer from "@/components/Timer";
import ExportButton from "@/components/ExportButton";
import { useToast } from "@/components/ui/use-toast";
import { getNotes, saveNotes } from "@/utils/localStorage";
import { roleContent, DebateRole } from "@/utils/debateData";
import SpeechStructurePanel from "./SpeechStructurePanel";
import ContentPanel from "./ContentPanel";

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
  type: 'opening' | 'argument' | 'rebuttal' | 'conclusion';
}

const SpeechStage: React.FC<SpeechStageProps> = ({ role, motion, onReset }) => {
  const { toast } = useToast();
  const roleData = roleContent[role as DebateRole];
  
  const [isEditMode, setIsEditMode] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
  const [sections, setSections] = useState<Section[]>([
    { title: 'Opening', content: '', type: 'opening' },
    { title: 'Arguments', content: '', type: 'argument' },
    { title: 'Rebuttals', content: '', type: 'rebuttal' },
    { title: 'Conclusion', content: '', type: 'conclusion' }
  ]);
  
  const [content, setContent] = useState({
    argumentsList: [],
    rebuttals: [],
    framing: []
  });

  useEffect(() => {
    const savedNotes = getNotes();
    if (savedNotes) {
      if (savedNotes.prepArguments) {
        const prepArgs = savedNotes.prepArguments.map(arg => ({
          id: arg.id,
          title: arg.claim,
          content: `${arg.whyTrue}\n${arg.mechanism}\n${arg.impact}`,
          type: 'argument' as const
        }));
        setContent(prev => ({ ...prev, argumentsList: prepArgs }));
      }
      
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
      
      if (savedNotes.listening?.keyPoints) {
        const framing = [{
          id: 'framing-1',
          title: 'Key Points',
          content: savedNotes.listening.keyPoints,
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
      
      const savedNotes = getNotes();
      if (savedNotes) {
        // Store sections as a serialized object
        savedNotes.speech = { sectionsData: JSON.stringify(updatedSections) };
        saveNotes(savedNotes);
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
            <ExportButton />
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
    </div>
  );
};

export default SpeechStage;
