
import React from 'react';
import { Button } from "@/components/ui/button";
import { Lightbulb, Download, Repeat, ChevronLeft } from "lucide-react";
import ReviewLocations from "../ReviewLocations";
import { DebateRole, debateRoles } from "@/utils/debateData";
import { Section } from '@/hooks/useSpeechContent';
import ExportButtonWrapper from "./ExportButtonWrapper";
import EditableMotion from '../EditableMotion';

interface SpeechHeaderProps {
  role: string;
  motion: string;
  roleTitle?: string;
  sections: Section[];
  onTipsOpen: () => void;
  onReset: () => void;
  onMotionChange: (newMotion: string) => void;
}

const SpeechHeader: React.FC<SpeechHeaderProps> = ({ 
  role, 
  motion, 
  roleTitle, 
  sections,
  onTipsOpen, 
  onReset,
  onMotionChange
}) => {
  const currentRole = debateRoles.find(r => r.id === role);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-5 mb-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{roleTitle}</h1>
          <EditableMotion 
            motion={motion} 
            onMotionChange={onMotionChange} 
            className="mt-1"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            onClick={onTipsOpen}
            className="flex items-center gap-2 bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 transition-colors"
          >
            <Lightbulb className="h-4 w-4" />
            <span className="hidden sm:inline">טיפים</span>
          </Button>
          
          <ReviewLocations />
          
          <ExportButtonWrapper 
            motion={motion}
            roleName={currentRole?.name || ''}
            sections={sections}
          />
          
          <Button 
            variant="outline" 
            onClick={onReset}
            className="flex items-center gap-2 bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <Repeat className="h-4 w-4" />
            <span className="hidden sm:inline">התחל מחדש</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SpeechHeader;
