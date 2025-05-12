
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
            <TabsTrigger value="categories">נטלים לפי קטגוריה</TabsTrigger>
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
          
          {/* Notes by Category Tab - In Hebrew */}
          <TabsContent value="categories" className="mt-0">
            <div className="p-4 space-y-1">
              <CategorySection 
                title="פוליטיקה" 
                icon={<Flag className="h-4 w-4" />}
                items={[
                  "מהי הבעיה שהמושיין מנסה לפתור?",
                  "מה הערך המרכזי בדיון? (חירות, שוויון, יציבות, צדק, דמוקרטיה)",
                  "מה השאלה המרכזית שתכריע את הדיבייט (Core Clash)?",
                  "אילו קלאשים צפויים לעלות?",
                  "מהן ההשלכות הרחבות ביותר של המדיניות?"
                ]}
              />
              
              <CategorySection 
                title="פריימינג" 
                icon={<Building className="h-4 w-4" />}
                items={[
                  "איך המדיניות הזו תיושם בפועל?",
                  "למה היא תעבוד/תיכשל? (Mechanism)",
                  "מה התוצאה הצפויה של המדיניות?",
                  "האם יש תופעות לוואי אפשריות?"
                ]}
              />
              
              <CategorySection 
                title="טיעונים" 
                icon={<ListOrdered className="h-4 w-4" />}
                items={[
                  "מי מרוויח ומי מפסיד מהמדיניות?",
                  "האם הפגיעה בזכויות מוצדקת?",
                  "האם המדיניות יוצרת או מצמצמת פערים חברתיים?",
                  "מה יקרה אם לא נפעל?"
                ]}
              />
              
              <CategorySection 
                title="כלכלה" 
                icon={<Coins className="h-4 w-4" />}
                items={[
                  "איך זה ישפיע על עושר, צמיחה, או נטל כלכלי?",
                  "מי יישא בעלויות?",
                  "האם יש חלופות יותר יעילות כלכלית?"
                ]}
              />
              
              <CategorySection 
                title="חברה" 
                icon={<Building className="h-4 w-4" />}
                items={[
                  "איך זה ישפיע על לכידות חברתית או פערים?",
                  "האם זה מעודד אחדות או יוצר קיטוב?",
                  "האם זה מצמצם פערים או מעמיק אותם?"
                ]}
              />
              
              <CategorySection 
                title="זכויות" 
                icon={<Shield className="h-4 w-4" />}
                items={[
                  "האם המדיניות פוגעת בזכויות יסוד, ואם כן, האם זה מוצדק?",
                  "האם יש חובה מוסרית לפעול?",
                  "האם יש אי-צדק שמחייב תיקון?"
                ]}
              />
              
              <CategorySection 
                title="בינלאומי" 
                icon={<Globe className="h-4 w-4" />}
                items={[
                  "האם זה מחזק את מעמד המדינה בזירה הגלובלית?",
                  "איך מדינות אחרות יגיבו למדיניות זו?",
                  "האם זה יוצר מתחים דיפלומטיים?"
                ]}
              />
              
              <CategorySection 
                title="אלטרנטיבות" 
                icon={<PlusCircle className="h-4 w-4" />}
                items={[
                  "מהן דרכים אחרות לפתרון הבעיה?",
                  "האם מדיניות שונה יכולה להשיג את אותה מטרה בפחות עלויות/פגיעות?",
                  "האם הסטטוס-קוו עדיף על המדיניות המוצעת?",
                  "למה האלטרנטיבה עדיפה על המדיניות?"
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
          <span className="mr-2 font-medium">{title}</span>
        </div>
        <span>{isOpen ? '−' : '+'}</span>
      </Button>
      
      {isOpen && (
        <div className="p-3 bg-gray-50">
          <ul className="list-disc pr-5 space-y-1.5 text-sm text-right">
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
