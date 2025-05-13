
import { useState } from 'react';
import { Argument } from '@/types/prepTypes';
import { getNotes, saveNotes } from "@/utils/localStorage";

export const useDragDrop = (prepArguments: Argument[], setPrepArguments: React.Dispatch<React.SetStateAction<Argument[]>>) => {
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  
  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };
  
  const handleDragEnd = () => {
    setDraggedItemIndex(null);
  };
  
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    
    const newArguments = [...prepArguments];
    const draggedItem = newArguments[draggedItemIndex];
    
    // Remove the dragged item
    newArguments.splice(draggedItemIndex, 1);
    // Insert it at the new position
    newArguments.splice(index, 0, draggedItem);
    
    setDraggedItemIndex(index);
    setPrepArguments(newArguments);
    
    // Save the new order to localStorage
    const savedNotes = getNotes();
    if (savedNotes) {
      savedNotes.prepArguments = newArguments;
      saveNotes(savedNotes);
    }
  };

  return {
    draggedItemIndex,
    handleDragStart,
    handleDragEnd,
    handleDragOver
  };
};
