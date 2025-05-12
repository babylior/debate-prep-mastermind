
import { useState, useEffect } from 'react';
import { getNotes, saveNotes } from "@/utils/localStorage";
import { useToast } from "@/components/ui/use-toast";
import { DebateRole } from "@/utils/debateData";

export interface Section {
  title: string;
  content: string;
  type: 'opening' | 'roadmap' | 'rebuttal' | 'argument' | 'conclusion';
}

export interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: string;
}

export interface SpeechContent {
  argumentsList: ContentItem[];
  rebuttals: ContentItem[];
  framing: ContentItem[];
}

export function useSpeechContent(role: string) {
  const { toast } = useToast();
  const [sections, setSections] = useState<Section[]>([
    { title: 'Opening', content: '', type: 'opening' },
    { title: 'Roadmap', content: '', type: 'roadmap' },
    { title: 'Rebuttals', content: '', type: 'rebuttal' },
    { title: 'Arguments', content: '', type: 'argument' },
    { title: 'Conclusion', content: '', type: 'conclusion' }
  ]);
  
  const [content, setContent] = useState<SpeechContent>({
    argumentsList: [],
    rebuttals: [],
    framing: []
  });

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

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
      
      // Fix type error: Ensure all ids are strings
      if (savedNotes.prepArguments) {
        const prepArgs = savedNotes.prepArguments.map(arg => ({
          // Convert id to string explicitly to fix the type error
          id: String(arg.id), 
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
      
      // Load framing content - Ensure id is a string
      if (savedNotes.prep?.framing) {
        const framing = [{
          id: 'framing-1', // This is already a string
          title: 'Framing',
          content: savedNotes.prep.framing,
          type: 'framing' as const
        }];
        setContent(prev => ({ ...prev, framing }));
      } else if (savedNotes.prep?.problem) {
        // Fallback to problem definition if framing isn't available
        const framing = [{
          id: 'framing-1', // This is already a string
          title: 'Key Context',
          content: savedNotes.prep.problem,
          type: 'framing' as const
        }];
        setContent(prev => ({ ...prev, framing }));
      }
    }
  }, [role]);

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

  return { sections, content, saveStatus, setSections, setContent, handleDrop };
}
