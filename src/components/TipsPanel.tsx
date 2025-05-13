
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
      <DrawerContent className="bg-gradient-to-b from-white to-gray-50 text-black">
        <DrawerHeader>
          <DrawerTitle className="text-2xl font-bold text-gray-800">טיפים ומקורות השראה</DrawerTitle>
          <DrawerDescription className="text-gray-600">עצות ורעיונות שיעזרו לך להתכונן</DrawerDescription>
        </DrawerHeader>
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              הוראות הכנה
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {content.instructions.map((instruction, index) => (
                <li key={index} className="py-1">{instruction}</li>
              ))}
            </ul>
          </div>
          
          <Separator className="bg-gray-200" />
          
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              שאלות מנחות
            </h3>
            <ul className="list-decimal list-inside space-y-2 text-gray-700">
              {content.questions.map((question, index) => (
                <li key={index} className="py-1">{question}</li>
              ))}
            </ul>
          </div>
          
          <Separator className="bg-gray-200" />
          
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
              טיפים
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {content.tips.map((tip, index) => (
                <li key={index} className="py-1">{tip}</li>
              ))}
            </ul>
          </div>
        </div>
        <DrawerFooter className="border-t bg-white">
          <DrawerClose>
            <Button variant="default" className="px-8 py-2 bg-blue-600 hover:bg-blue-700 transition-colors">סגור</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default TipsPanel;
