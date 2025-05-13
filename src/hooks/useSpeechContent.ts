
import { useState, useEffect } from 'react';
import { roleContent } from '@/utils/debateData';
import { saveNotes, getNotes } from '@/utils/localStorage';

export interface Content {
  id: string;
  content: string;
  type: 'argument' | 'rebuttal' | 'framing';
}

export interface Section {
  id: string;
  name: string;
  duration: string;
  content: Content[];
  description?: string;
}

export interface SpeechContent {
  argumentsList: Content[];
  rebuttals: Content[];
  framing: Content[];
}

export const useSpeechContent = (role: string) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [content, setContent] = useState<SpeechContent>({
    argumentsList: [],
    rebuttals: [],
    framing: []
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Initialize with default sections from role data and load prep content
  useEffect(() => {
    const roleData = roleContent[role as keyof typeof roleContent];
    if (roleData && roleData.speech && roleData.speech.templateSections) {
      // Load from localStorage first if available
      const savedNotes = getNotes();
      
      if (savedNotes && savedNotes.speech) {
        if (savedNotes.speech.sections) {
          // Make sure we're getting the correct type
          const savedSections = savedNotes.speech.sections;
          if (Array.isArray(savedSections)) {
            setSections(savedSections as Section[]);
          }
        }
        
        if (savedNotes.speech.content) {
          // Make sure we're getting the correct type
          const savedContent = savedNotes.speech.content;
          // Ensure savedContent is properly typed
          if (typeof savedContent === 'object' && savedContent !== null) {
            setContent(savedContent as SpeechContent);
          }
        }
      } else {
        // Initialize with default sections
        const initialSections = roleData.speech.templateSections.map((section, index) => ({
          id: String(index), // Convert to string to fix type error
          name: section.name,
          duration: section.duration,
          description: section.description,
          content: []
        }));
        setSections(initialSections);
        
        // Load framing content from prep stage if available
        if (savedNotes && savedNotes.prep) {
          const prepNotes = savedNotes.prep;
          const framingContent: Content[] = [];
          
          // Add problem to framing if it exists and is not empty
          if (prepNotes.problem && prepNotes.problem.trim()) {
            framingContent.push({
              id: `framing-problem-${Date.now()}`,
              content: `**הבעיה/מצב נוכחי:**\n${prepNotes.problem}`,
              type: 'framing'
            });
          }
          
          // Add mechanism to framing if it exists and is not empty
          if (prepNotes.mechanism && prepNotes.mechanism.trim()) {
            framingContent.push({
              id: `framing-mechanism-${Date.now()}`,
              content: `**המנגנון/פתרון:**\n${prepNotes.mechanism}`,
              type: 'framing'
            });
          }
          
          // Add general framing if it exists and is not empty
          if (prepNotes.framing && prepNotes.framing.trim()) {
            framingContent.push({
              id: `framing-general-${Date.now()}`,
              content: `**פריימינג כללי:**\n${prepNotes.framing}`,
              type: 'framing'
            });
          }
          
          // Update content state with framing content
          if (framingContent.length > 0) {
            setContent(prev => ({
              ...prev,
              framing: framingContent
            }));
          }
        }
      }
    }
  }, [role]);

  // Save to localStorage whenever sections or content changes
  useEffect(() => {
    if (sections.length > 0) {
      setSaveStatus('saving');
      setTimeout(() => {
        const notes = getNotes() || {
          motion: '',
          role,
          prep: {},
          listening: {},
          speech: {},
          lastUpdated: Date.now()
        };
        
        if (!notes.speech) {
          notes.speech = {};
        }
        
        // Note: Fix type issues by using a type assertion
        const speechData = notes.speech as Record<string, unknown>;
        speechData.sections = sections;
        speechData.content = content;
        
        saveNotes(notes);
        setSaveStatus('saved');
      }, 1000);
    }
  }, [sections, content, role]);

  // Handle dropping content into sections
  const handleDrop = (sectionIndex: number, itemId: string) => {
    // Find the item from content
    const allContent = [
      ...content.argumentsList,
      ...content.rebuttals,
      ...content.framing
    ];
    
    const item = allContent.find(item => item.id === itemId);
    
    if (item) {
      // Update the sections
      const updatedSections = [...sections];
      
      // Ensure the section has a content array
      if (!updatedSections[sectionIndex].content) {
        updatedSections[sectionIndex].content = [];
      }
      
      const sectionContent = updatedSections[sectionIndex].content || [];
      
      // Check if item already exists in this section
      if (!sectionContent.some(content => content.id === itemId)) {
        updatedSections[sectionIndex] = {
          ...updatedSections[sectionIndex],
          content: [...sectionContent, item]
        };
        
        setSections(updatedSections);
      }
    }
  };

  return {
    sections,
    content,
    saveStatus,
    handleDrop
  };
};
