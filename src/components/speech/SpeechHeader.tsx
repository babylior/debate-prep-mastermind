
import React from 'react';
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import ReviewLocations from "../ReviewLocations";
import { DebateRole, debateRoles } from "@/utils/debateData";
import { Section } from '@/hooks/useSpeechContent';
import ExportButtonWrapper from "./ExportButtonWrapper";

interface SpeechHeaderProps {
  role: string;
  motion: string;
  roleTitle?: string;
  sections: Section[];
  onTipsOpen: () => void;
  onReset: () => void;
}

const SpeechHeader: React.FC<SpeechHeaderProps> = ({ 
  role, 
  motion, 
  roleTitle, 
  sections,
  onTipsOpen, 
  onReset 
}) => {
  const currentRole = debateRoles.find(r => r.id === role);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{roleTitle}</h1>
          <p className="text-gray-600 mt-1">{motion}</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={onTipsOpen}
            className="flex items-center gap-2"
          >
            <Lightbulb className="h-4 w-4" />
            <span className="hidden sm:inline">Tips</span>
          </Button>
          <ReviewLocations />
          <ExportButtonWrapper 
            motion={motion}
            roleName={currentRole?.name || ''}
            sections={sections}
          />
          <Button variant="outline" onClick={onReset}>
            Start Over
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SpeechHeader;
