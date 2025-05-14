
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { roleContent, DebateRole } from "@/utils/debateData";
import { getNotes, saveNotes } from "@/utils/localStorage";

interface InteractivePrompt {
  id: string;
  question: string;
  answer: string;
}

interface InteractiveListeningPromptsProps {
  role: string; // Add this property
  motion: string; // Add this property
}

const InteractiveListeningPrompts: React.FC<InteractiveListeningPromptsProps> = ({
  role,
  motion,
}) => {
  const [prompts, setPrompts] = useState<InteractivePrompt[]>([]);

  useEffect(() => {
    // Generate prompts from roleContent questions
    const roleData = roleContent[role as DebateRole];
    const questions = roleData?.listening?.questions || [];
    
    const newPrompts = questions.map((question, index) => ({
      id: `prompt-${index}`,
      question,
      answer: '',
    }));
    
    // Load any saved answers from localStorage
    const savedNotes = getNotes();
    if (savedNotes?.interactivePrompts) {
      const savedPrompts = savedNotes.interactivePrompts;
      
      // Merge saved answers with current prompts
      newPrompts.forEach(prompt => {
        if (savedPrompts[prompt.id]) {
          prompt.answer = savedPrompts[prompt.id];
        }
      });
    }
    
    setPrompts(newPrompts);
  }, [role]);

  const handleChange = (id: string, answer: string) => {
    // Update state
    const updatedPrompts = prompts.map(prompt => 
      prompt.id === id ? { ...prompt, answer } : prompt
    );
    setPrompts(updatedPrompts);
    
    // Save to localStorage
    const savedNotes = getNotes() || {};
    const promptAnswers = savedNotes.interactivePrompts || {};
    promptAnswers[id] = answer;
    
    savedNotes.interactivePrompts = promptAnswers;
    saveNotes(savedNotes);
  };

  return (
    <div className="space-y-4">
      {prompts.map((prompt) => (
        <Card key={prompt.id}>
          <CardHeader>
            <CardTitle className="text-lg">{prompt.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={prompt.answer}
              onChange={(e) => handleChange(prompt.id, e.target.value)}
              placeholder="Write your answer here..."
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default InteractiveListeningPrompts;
