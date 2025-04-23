
import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Copy, Move } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface DraggableArgumentCardProps {
  id: string;
  title: string;
  content: string;
  index: number;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onChange: (id: string, content: string) => void;
  onDragStart?: (index: number) => void;
  onDragEnd?: () => void;
}

const DraggableArgumentCard: React.FC<DraggableArgumentCardProps> = ({
  id,
  title,
  content,
  index,
  onDelete,
  onDuplicate,
  onChange,
  onDragStart,
  onDragEnd
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
    if (onDragStart) onDragStart(index);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    if (onDragEnd) onDragEnd();
  };

  const handleDuplicate = () => {
    onDuplicate(id);
    toast({
      title: "Argument duplicated",
      description: "A copy of this argument has been created."
    });
  };

  const handleDelete = () => {
    onDelete(id);
    toast({
      title: "Argument deleted",
      description: "The argument has been removed."
    });
  };

  return (
    <Card 
      className={`mb-4 cursor-move ${isDragging ? 'opacity-50 border-dashed border-2 border-gray-300' : ''} hover:shadow-md transition-shadow duration-200`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <CardHeader className="py-3 flex flex-row items-center justify-between bg-gray-50">
        <div className="flex items-center">
          <Move className="h-4 w-4 text-gray-400 mr-2" />
          <span className="font-medium">{title}</span>
        </div>
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm" onClick={handleDuplicate} className="h-8 w-8 p-0">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDelete} className="h-8 w-8 p-0 text-red-500 hover:text-red-700">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-3">
        <Textarea
          value={content}
          onChange={(e) => onChange(id, e.target.value)}
          className="min-h-[100px] border-0 focus-visible:ring-0 p-0 resize-none"
          placeholder="Write your argument here..."
        />
      </CardContent>
    </Card>
  );
};

export default DraggableArgumentCard;
