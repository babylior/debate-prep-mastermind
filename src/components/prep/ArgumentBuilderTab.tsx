
import React from 'react';
import FramingSection from './FramingSection';
import ArgumentsSection from './ArgumentsSection';
import RebuttalSection from './RebuttalSection';

interface Argument {
  id: string;
  claim: string;
  whyTrue: string;
  mechanism: string;
  impact: string;
  weighing: string;
}

interface ArgumentBuilderTabProps {
  notes: {
    problem: string;
    mechanism: string;
    framing: string;
    notes: string;
  };
  args: Argument[]; // Changed from 'arguments' to 'args'
  onNotesChange: (key: string, value: string) => void;
  onAddArgument: () => void;
  onDeleteArgument: (id: string) => void;
  onDuplicateArgument: (id: string) => void;
  onUpdateArgument: (
    id: string,
    field: "claim" | "whyTrue" | "mechanism" | "impact" | "weighing",
    value: string
  ) => void;
  onDragStart: (index: number) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
}

const ArgumentBuilderTab: React.FC<ArgumentBuilderTabProps> = ({
  notes,
  args, // Changed from 'arguments' to 'args'
  onNotesChange,
  onAddArgument,
  onDeleteArgument,
  onDuplicateArgument,
  onUpdateArgument,
  onDragStart,
  onDragEnd,
  onDragOver
}) => {
  return (
    <div className="space-y-6">
      {/* Framing Section */}
      <FramingSection 
        problem={notes.problem}
        mechanism={notes.mechanism}
        framing={notes.framing}
        onChange={onNotesChange}
      />
      
      {/* Arguments Section */}
      <ArgumentsSection 
        args={args} // Changed from 'arguments' to 'args'
        onAdd={onAddArgument}
        onDelete={onDeleteArgument}
        onDuplicate={onDuplicateArgument}
        onChange={onUpdateArgument}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      />
      
      {/* Rebuttals Section */}
      <RebuttalSection 
        notes={notes.notes}
        onChange={(value) => onNotesChange('notes', value)}
      />
    </div>
  );
};

export default ArgumentBuilderTab;
