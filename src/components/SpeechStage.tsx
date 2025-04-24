
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import Timer from "@/components/Timer";
import ExportButton from "@/components/ExportButton";
import { useToast } from "@/components/ui/use-toast";
import { getNotes, saveNotes } from "@/utils/localStorage";
import { roleContent, DebateRole } from "@/utils/debateData";
import SpeechStructurePanel from "./SpeechStructurePanel";
import ContentPanel from "./ContentPanel";
import PromptsSidebar from "./PromptsSidebar";
import { Lightbulb } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

interface SpeechStageProps {
  role: string;
  motion: string;
  onReset: () => void;
}

interface Section {
  title: string;
  content: string;
  type: 'opening' | 'argument' | 'rebuttal' | 'conclusion' | 'extension';
}

const SpeechStage: React.FC<SpeechStageProps> = ({ role, motion, onReset }) => {
  const { toast } = useToast();
  const roleData = roleContent[role as DebateRole];
  
  const [isEditMode, setIsEditMode] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
  const [showPrompts, setShowPrompts] = useState(false);
  
  const getDefaultSections = (): Section[] => {
    if (role === 'pm' || role === 'lo') {
      return [
        { title: 'Introduction & Framing', content: '', type: 'opening' },
        { title: 'Roadmap', content: '', type: 'opening' },
        { title: 'Argument 1', content: '', type: 'argument' },
        { title: 'Argument 2', content: '', type: 'argument' },
        { title: 'Rebuttals', content: '', type: 'rebuttal' },
        { title: 'Conclusion', content: '', type: 'conclusion' }
      ];
    } else if (role === 'dpm' || role === 'dlo') {
      return [
        { title: 'Response to Opposition', content: '', type: 'rebuttal' },
        { title: 'Reinforce Partner Points', content: '', type: 'argument' },
        { title: 'New Argument', content: '', type: 'argument' },
        { title: 'Strategic Rebuttals', content: '', type: 'rebuttal' },
        { title: 'Summary & Comparison', content: '', type: 'conclusion' }
      ];
    } else if (role === 'mg' || role === 'mo') {
      return [
        { title: 'Debate Summary', content: '', type: 'opening' },
        { title: 'Extension Introduction', content: '', type: 'extension' },
        { title: 'Extension Justification', content: '', type: 'extension' },
        { title: 'Strategic Comparison', content: '', type: 'rebuttal' },
        { title: 'Summary', content: '', type: 'conclusion' }
      ];
    } else {
      return [
        { title: 'Opening', content: '', type: 'opening' },
        { title: 'Arguments', content: '', type: 'argument' },
        { title: 'Rebuttals', content: '', type: 'rebuttal' },
        { title: 'Conclusion', content: '', type: 'conclusion' }
      ];
    }
  };
  
  const [sections, setSections] = useState<Section[]>(getDefaultSections());
  
  const [content, setContent] = useState({
    argumentsList: [],
    rebuttals: [],
    framing: []
  });

  useEffect(() => {
    const savedNotes = getNotes();
    if (savedNotes) {
      if (savedNotes.speech && savedNotes.speech.sections) {
        // Fix: Parse string to array if it's a string, otherwise use it directly
        try {
          const savedSections = typeof savedNotes.speech.sections === 'string' 
            ? JSON.parse(savedNotes.speech.sections) as Section[]
            : savedNotes.speech.sections as Section[];
          
          if (Array.isArray(savedSections)) {
            setSections(savedSections);
          } else {
            setSections(getDefaultSections());
          }
        } catch (e) {
          setSections(getDefaultSections());
        }
      } else {
        setSections(getDefaultSections());
      }
      
      if (savedNotes.prepArguments) {
        const prepArgs = savedNotes.prepArguments.map((arg: any) => ({
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
            content: rebuttal as string,
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

  const getSortedSections = () => {
    const openingSections = sections.filter(section => section.type === 'opening');
    const rebuttalSections = sections.filter(section => section.type === 'rebuttal');
    const argumentSections = sections.filter(section => section.type === 'argument' || section.type === 'extension');
    const conclusionSections = sections.filter(section => section.type === 'conclusion');
    
    const framingSections: Section[] = content.framing.map(frame => ({
      title: frame.title,
      content: frame.content,
      type: 'opening'
    }));
    
    return [
      ...framingSections, 
      ...openingSections, 
      ...rebuttalSections, 
      ...argumentSections,
      ...conclusionSections
    ];
  };

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
        // Fix: Stringify sections array before saving
        const sectionsToSave = JSON.stringify(updatedSections);
        savedNotes.speech = { ...savedNotes.speech, sections: sectionsToSave };
        saveNotes(savedNotes);
      }
    }
  };

  const handleSectionContentChange = (index: number, newContent: string) => {
    const updatedSections = [...sections];
    updatedSections[index].content = newContent;
    setSections(updatedSections);
    
    const savedNotes = getNotes();
    if (savedNotes) {
      // Fix: Stringify sections array before saving
      const sectionsToSave = JSON.stringify(updatedSections);
      savedNotes.speech = { ...savedNotes.speech, sections: sectionsToSave };
      saveNotes(savedNotes);
    }
  };

  const togglePromptsSidebar = () => {
    setShowPrompts(!showPrompts);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{roleData.speech.title}</h1>
            <p className="text-gray-600 mt-1">{motion}</p>
          </div>
          <div className="flex space-x-3 items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Lightbulb className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <PromptsSidebar />
              </PopoverContent>
            </Popover>
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
            sortedSections={getSortedSections()}
            onModeToggle={handleModeToggle}
            onNextSection={handleNextSection}
            onDrop={handleDrop}
            onSectionContentChange={handleSectionContentChange}
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
