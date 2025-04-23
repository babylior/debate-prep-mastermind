
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DraggableContentCardProps {
  id: string;
  title: string;
  content: string;
  type: 'argument' | 'rebuttal' | 'framing';
}

const DraggableContentCard: React.FC<DraggableContentCardProps> = ({
  id,
  title,
  content,
  type
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', id);
  };

  return (
    <Card
      draggable
      onDragStart={handleDragStart}
      className="cursor-move hover:shadow-md transition-shadow"
    >
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{content}</p>
      </CardContent>
    </Card>
  );
};

export default DraggableContentCard;
