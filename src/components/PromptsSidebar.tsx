
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const PromptsSidebar: React.FC = () => {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const promptCategories = {
    rebuttal: [
      "What's the weakest assumption in their argument?",
      "How does their evidence fail to support their conclusion?",
      "What important stakeholder have they ignored?",
      "What's a better interpretation of their evidence?",
      "What's a key impact they haven't considered?"
    ],
    expansion: [
      "How can you deepen this argument with a specific example?",
      "What is the long-term significance of this point?",
      "How does this point connect to fundamental values or principles?",
      "What makes your analysis unique compared to other speakers?",
      "How can you address the strongest counter-arguments to this point?"
    ],
    critical: [
      "What are the competing priorities here?",
      "How would this idea work in practice, step by step?",
      "Who is most affected by this issue and why?",
      "What are the unintended consequences?",
      "What assumptions underlie your position?"
    ]
  };
  
  const handleCategoryClick = (category: string) => {
    setActiveCategory(category === activeCategory ? null : category);
  };
  
  const handlePromptClick = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    toast({
      title: "Copied to clipboard",
      description: "The prompt has been copied to your clipboard."
    });
  };

  return (
    <div className="flex flex-col space-y-4">
      <h3 className="font-medium text-base">Debate Prompts</h3>
      
      <Button 
        variant={activeCategory === 'rebuttal' ? 'default' : 'outline'} 
        onClick={() => handleCategoryClick('rebuttal')}
        className="justify-start"
      >
        Rebuttal Prompts
      </Button>
      
      <Button 
        variant={activeCategory === 'expansion' ? 'default' : 'outline'} 
        onClick={() => handleCategoryClick('expansion')}
        className="justify-start"
      >
        Expansion Tools
      </Button>
      
      <Button 
        variant={activeCategory === 'critical' ? 'default' : 'outline'} 
        onClick={() => handleCategoryClick('critical')}
        className="justify-start"
      >
        Critical Questions
      </Button>
      
      {activeCategory && (
        <Card>
          <CardContent className="pt-4">
            <ul className="space-y-2">
              {promptCategories[activeCategory as keyof typeof promptCategories].map((prompt, index) => (
                <li 
                  key={index} 
                  className="p-2 hover:bg-gray-100 rounded cursor-pointer" 
                  onClick={() => handlePromptClick(prompt)}
                >
                  {prompt}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PromptsSidebar;
