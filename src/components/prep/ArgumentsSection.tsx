
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import DraggableArgumentCard from '@/components/DraggableArgumentCard';

interface Argument {
  id: string;
  claim: string;
  whyTrue: string;
  mechanism: string;
  impact: string;
  weighing: string;
}

interface ArgumentsSectionProps {
  args: Argument[]; // Changed from 'arguments' to 'args'
  onAdd: () => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onChange: (
    id: string,
    field: "claim" | "whyTrue" | "mechanism" | "impact" | "weighing",
    value: string
  ) => void;
  onDragStart: (index: number) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
}

const ArgumentsSection: React.FC<ArgumentsSectionProps> = ({
  args, // Changed from 'arguments' to 'args'
  onAdd,
  onDelete,
  onDuplicate,
  onChange,
  onDragStart,
  onDragEnd,
  onDragOver
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">טיעונים</h2>
        <Button onClick={onAdd} className="flex items-center gap-2 bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          הוסף טיעון
        </Button>
      </div>
      
      <div className="space-y-6">
        {args.map((arg, index) => ( // Changed from 'arguments' to 'args'
          <div 
            key={arg.id} 
            onDragOver={(e) => onDragOver(e, index)}
          >
            <DraggableArgumentCard
              id={arg.id}
              claim={arg.claim}
              whyTrue={arg.whyTrue}
              mechanism={arg.mechanism}
              impact={arg.impact}
              weighing={arg.weighing}
              index={index}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              onChange={onChange}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArgumentsSection;
