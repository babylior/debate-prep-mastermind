
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveMotion } from "@/utils/localStorage";
import { Pencil } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface EditableMotionProps {
  motion: string;
  onMotionChange: (newMotion: string) => void;
}

const EditableMotion: React.FC<EditableMotionProps> = ({ motion, onMotionChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMotion, setEditedMotion] = useState(motion);
  const { toast } = useToast();

  const handleSave = () => {
    if (!editedMotion.trim()) {
      toast({
        title: "Motion cannot be empty",
        description: "Please enter a valid motion.",
        variant: "destructive",
      });
      return;
    }

    saveMotion(editedMotion);
    onMotionChange(editedMotion);
    setIsEditing(false);
    
    toast({
      title: "Motion updated",
      description: "Your debate motion has been updated.",
    });
  };

  const handleCancel = () => {
    setEditedMotion(motion);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex space-x-2">
        <Input 
          value={editedMotion}
          onChange={(e) => setEditedMotion(e.target.value)}
          className="flex-grow"
          placeholder="This House Believes That..."
        />
        <Button size="sm" onClick={handleSave}>Save</Button>
        <Button size="sm" variant="outline" onClick={handleCancel}>Cancel</Button>
      </div>
    );
  }

  return (
    <p className="text-gray-600 flex items-center gap-2">
      {motion}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setIsEditing(true)}
        className="h-6 w-6 p-0"
      >
        <Pencil className="h-3 w-3" />
        <span className="sr-only">Edit motion</span>
      </Button>
    </p>
  );
};

export default EditableMotion;
