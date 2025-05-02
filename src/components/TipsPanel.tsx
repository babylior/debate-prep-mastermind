
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Lightbulb, 
  PlusCircle, 
  MessageCircle, 
  BookOpen, 
  ListOrdered,
  X
} from "lucide-react";
import { DebateRole } from "@/utils/debateData";

interface TipsPanelProps {
  role: DebateRole;
  content: {
    instructions?: string[];
    questions?: string[];
    tips?: string[];
  };
  isOpen: boolean;
  onClose: () => void;
}

const TipsPanel: React.FC<TipsPanelProps> = ({ role, content, isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-lg border-l z-40 overflow-y-auto transition-all duration-300">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="font-semibold">Guidance & Resources</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-4 space-y-3">
        {/* Section buttons */}
        <Button 
          variant={activeSection === 'instructions' ? 'default' : 'outline'} 
          className="w-full justify-start" 
          onClick={() => setActiveSection(activeSection === 'instructions' ? null : 'instructions')}
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Instructions
        </Button>
        
        <Button 
          variant={activeSection === 'questions' ? 'default' : 'outline'} 
          className="w-full justify-start" 
          onClick={() => setActiveSection(activeSection === 'questions' ? null : 'questions')}
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Key Questions
        </Button>
        
        <Button 
          variant={activeSection === 'tips' ? 'default' : 'outline'} 
          className="w-full justify-start" 
          onClick={() => setActiveSection(activeSection === 'tips' ? null : 'tips')}
        >
          <Lightbulb className="mr-2 h-4 w-4" />
          Tips & Strategies
        </Button>
      </div>
      
      {/* Content section */}
      {activeSection && content[activeSection] && (
        <div className="p-4 bg-gray-50 m-4 rounded-md">
          <h4 className="font-medium mb-2 capitalize">{activeSection}</h4>
          <ul className="list-disc pl-5 space-y-2">
            {content[activeSection]?.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TipsPanel;
