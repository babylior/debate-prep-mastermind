
import React from 'react';
import IdeaDumpTab from './IdeaDumpTab';
import ArgumentBuilderTab from './ArgumentBuilderTab';
import { Argument } from '@/hooks/usePrepStageState';

interface PrepTabContentProps {
  activeTab: string;
  notes: Record<string, string>;
  args: Argument[];
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

const PrepTabContent: React.FC<PrepTabContentProps> = ({
  activeTab,
  notes,
  args,
  onNotesChange,
  onAddArgument,
  onDeleteArgument,
  onDuplicateArgument,
  onUpdateArgument,
  onDragStart,
  onDragEnd,
  onDragOver
}) => {
  switch (activeTab) {
    case 'idea-dump':
      return (
        <IdeaDumpTab 
          notes={notes.ideaDump}
          onChange={(value) => onNotesChange('ideaDump', value)}
        />
      );
    
    case 'argument-builder':
      return (
        <ArgumentBuilderTab 
          notes={{
            problem: notes.problem,
            mechanism: notes.mechanism,
            framing: notes.framing,
            notes: notes.notes
          }}
          args={args}
          onNotesChange={onNotesChange}
          onAddArgument={onAddArgument}
          onDeleteArgument={onDeleteArgument}
          onDuplicateArgument={onDuplicateArgument}
          onUpdateArgument={onUpdateArgument}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        />
      );
    
    default:
      return null;
  }
};

export default PrepTabContent;
