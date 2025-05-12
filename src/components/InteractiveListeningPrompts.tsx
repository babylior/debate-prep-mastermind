
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTextFormat } from '@/hooks/useTextFormat';
import MarkdownRenderer from './MarkdownRenderer';

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
      {prompts.map((prompt) => {
        const { handleSelection, handleBold, handleItalic, handleHighlight } = useTextFormat({
          value: prompt.answer,
          onChange: (value) => onChange(prompt.id, value)
        });

        return (
          <Card key={prompt.id}>
            <CardHeader>
              <CardTitle className="text-lg">{prompt.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={prompt.answer}
                onChange={(e) => onChange(prompt.id, e.target.value)}
                onKeyUp={handleSelection}
                onMouseUp={handleSelection}
                onBold={handleBold}
                onItalic={handleItalic}
                onHighlight={handleHighlight}
                placeholder="Write your answer here..."
                className="min-h-[100px]"
              />
              {prompt.answer && (
                <div className="mt-2 p-2 border rounded bg-gray-50">
                  <Label className="text-xs text-gray-500 mb-1">Preview:</Label>
                  <MarkdownRenderer text={prompt.answer} />
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default InteractiveListeningPrompts;
