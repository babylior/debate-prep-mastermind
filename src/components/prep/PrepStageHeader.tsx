
import React from 'react';
import { Button } from "@/components/ui/button";
import { Lightbulb } from 'lucide-react';
import { roleContent, DebateRole } from "@/utils/debateData";

interface PrepStageHeaderProps {
  role: string;
  motion: string;
  onOpenTipsPanel: () => void;
}

const PrepStageHeader: React.FC<PrepStageHeaderProps> = ({ 
  role, 
  motion, 
  onOpenTipsPanel 
}) => {
  const roleData = roleContent[role as DebateRole];

  return (
    <div className="bg-white rounded-lg shadow-md border p-4 mb-6 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">{roleData.prep.title}</h1>
        <p className="text-gray-600 mt-1">{motion || "הכנה ללא מושיין"}</p>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={onOpenTipsPanel}
          className="flex items-center gap-2"
        >
          <Lightbulb className="h-4 w-4" />
          <span className="hidden sm:inline">טיפים ומקורות</span>
        </Button>
      </div>
    </div>
  );
};

export default PrepStageHeader;
