
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface InteractivePrompt {
  id: string;
  question: string;
  answer: string;
}

interface InteractiveListeningPromptsProps {
  prompts: InteractivePrompt[];
  onChange: (id: string, answer: string) => void;
}

const InteractiveListeningPrompts: React.FC<InteractiveListeningPromptsProps> = ({
  prompts,
  onChange,
}) => {
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
              onChange={(e) => onChange(prompt.id, e.target.value)}
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
