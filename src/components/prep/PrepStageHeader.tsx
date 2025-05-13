
import React from 'react';
import { Button } from "@/components/ui/button";
import { Lightbulb } from 'lucide-react';
import { roleContent, DebateRole } from "@/utils/debateData";
import EditableMotion from '../EditableMotion';

interface PrepStageHeaderProps {
  role: string;
  motion: string;
  onOpenTipsPanel: () => void;
  onMotionChange: (newMotion: string) => void;
}

const PrepStageHeader: React.FC<PrepStageHeaderProps> = ({ 
  role, 
  motion, 
  onOpenTipsPanel,
  onMotionChange
}) => {
  const roleData = roleContent[role as DebateRole];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">{roleData.prep.title}</h1>
        <EditableMotion 
          motion={motion} 
          onMotionChange={onMotionChange} 
          className="mt-1"
        />
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
