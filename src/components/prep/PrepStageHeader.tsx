
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
    <div className="bg-white rounded-lg shadow-sm border p-5 mb-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{roleData.prep.title}</h1>
          <EditableMotion 
            motion={motion} 
            onMotionChange={onMotionChange} 
            className="mt-1"
          />
        </div>
        
        <Button 
          variant="outline" 
          onClick={onOpenTipsPanel}
          className="flex items-center gap-2 bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 transition-colors md:self-start"
        >
          <Lightbulb className="h-4 w-4" />
          <span className="inline">טיפים ומקורות</span>
        </Button>
      </div>
    </div>
  );
};

export default PrepStageHeader;
