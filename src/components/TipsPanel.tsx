import React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button";
import { DebateRole } from '@/utils/debateData';
import { Separator } from "@/components/ui/separator"

// Update this interface to ensure questions is always provided
interface TipsPanelContent {
  instructions: string[];
  questions: string[]; // Make sure this is required
  tips: string[];
}

interface TipsPanelProps {
  role: DebateRole;
  content: TipsPanelContent;
  isOpen: boolean;
  onClose: () => void;
}

const TipsPanel: React.FC<TipsPanelProps> = ({ role, content, isOpen, onClose }) => {
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="bg-white text-black">
        <DrawerHeader>
          <DrawerTitle>טיפים ומקורות השראה</DrawerTitle>
          <DrawerDescription>עצות ורעיונות שיעזרו לך להתכונן</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 space-y-4">
          <div>
            <h3 className="text-lg font-semibold">הוראות הכנה</h3>
            <ul className="list-disc list-inside">
              {content.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ul>
          </div>
          <Separator />
          <div>
            <h3 className="text-lg font-semibold">שאלות מנחות</h3>
            <ul className="list-decimal list-inside">
              {content.questions.map((question, index) => (
                <li key={index}>{question}</li>
              ))}
            </ul>
          </div>
          <Separator />
          <div>
            <h3 className="text-lg font-semibold">טיפים</h3>
            <ul className="list-disc list-inside">
              {content.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose>
            <Button variant="outline">סגור</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default TipsPanel;
