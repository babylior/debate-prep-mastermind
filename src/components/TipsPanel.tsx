
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Lightbulb, 
  PlusCircle, 
  MessageCircle, 
  BookOpen, 
  ListOrdered,
  X,
  Flag,
  Building,
  Coins,
  Shield,
  Globe
} from "lucide-react";
import { DebateRole } from "@/utils/debateData";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
  const [activeTab, setActiveTab] = useState("main");
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-lg border-l z-40 overflow-y-auto transition-all duration-300">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="font-semibold">Guidance & Resources</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Tabs navigation */}
      <div className="px-4 pt-4">
        <Tabs 
          defaultValue="main" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="main">Main Tips</TabsTrigger>
            <TabsTrigger value="categories">Notes by Category</TabsTrigger>
          </TabsList>
          
          {/* Main Tips Tab */}
          <TabsContent value="main" className="mt-0">
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
          </TabsContent>
          
          {/* Notes by Category Tab */}
          <TabsContent value="categories" className="mt-0">
            <div className="p-4 space-y-1">
              <CategorySection 
                title="Politics" 
                icon={<Flag className="h-4 w-4" />}
                items={[
                  "What problem is the motion trying to solve?",
                  "What is the central value in this debate? (liberty, equality, stability, justice, democracy)",
                  "What is the central question that will decide the debate (Core Clash)?",
                  "What clashes are likely to arise?",
                  "What are the broadest implications of this policy?"
                ]}
              />
              
              <CategorySection 
                title="Framing" 
                icon={<Building className="h-4 w-4" />}
                items={[
                  "How will this policy be implemented in practice?",
                  "Why will it work/fail? (Mechanism)",
                  "What is the expected outcome of the policy?",
                  "Are there possible side effects?"
                ]}
              />
              
              <CategorySection 
                title="Arguments" 
                icon={<ListOrdered className="h-4 w-4" />}
                items={[
                  "Who benefits and who loses from the policy?",
                  "Is the infringement on rights justified?",
                  "Does the policy create or reduce social gaps?",
                  "What happens if we don't act?"
                ]}
              />
              
              <CategorySection 
                title="Economy" 
                icon={<Coins className="h-4 w-4" />}
                items={[
                  "How will this affect wealth, growth, or economic burden?",
                  "Who will bear the costs?",
                  "Are there more cost-effective alternatives?"
                ]}
              />
              
              <CategorySection 
                title="Society" 
                icon={<Building className="h-4 w-4" />}
                items={[
                  "How will this affect social cohesion or gaps?",
                  "Does it encourage unity or create polarization?",
                  "Does it reduce gaps or deepen them?"
                ]}
              />
              
              <CategorySection 
                title="Rights" 
                icon={<Shield className="h-4 w-4" />}
                items={[
                  "Does the policy violate fundamental rights, and if so, is it justified?",
                  "Is there a moral obligation to act?",
                  "Is there an injustice that requires correction?"
                ]}
              />
              
              <CategorySection 
                title="International" 
                icon={<Globe className="h-4 w-4" />}
                items={[
                  "Does this strengthen the country's position globally?",
                  "How will other countries react to this policy?",
                  "Does it create diplomatic tensions?"
                ]}
              />
              
              <CategorySection 
                title="Alternatives" 
                icon={<PlusCircle className="h-4 w-4" />}
                items={[
                  "What are other ways to solve the problem?",
                  "Could a different policy achieve the same goal with fewer costs/violations?",
                  "Is the status quo better than the proposed policy?",
                  "Why is the alternative preferable to the policy?"
                ]}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Helper component for category sections
const CategorySection = ({ title, icon, items }: { 
  title: string; 
  icon: React.ReactNode;
  items: string[] 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border rounded-lg overflow-hidden mb-2">
      <Button 
        variant="ghost" 
        className="w-full justify-between p-3 h-auto"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          {icon}
          <span className="ml-2 font-medium">{title}</span>
        </div>
        <span>{isOpen ? '−' : '+'}</span>
      </Button>
      
      {isOpen && (
        <div className="p-3 bg-gray-50">
          <ul className="list-disc pl-5 space-y-1.5 text-sm">
            {items.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TipsPanel;
