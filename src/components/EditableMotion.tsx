
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Edit, Check } from "lucide-react";
import { saveMotion } from "@/utils/localStorage";
import { useToast } from "@/components/ui/use-toast";

interface EditableMotionProps {
  motion: string;
  onMotionChange: (newMotion: string) => void;
  className?: string;
}

const EditableMotion: React.FC<EditableMotionProps> = ({ 
  motion, 
  onMotionChange,
  className = "" 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMotion, setEditedMotion] = useState(motion);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditedMotion(motion);
  }, [motion]);

  const handleSave = () => {
    if (editedMotion.trim() === '') {
      setEditedMotion('This house...');
      onMotionChange('This house...');
    } else {
      onMotionChange(editedMotion);
    }
    saveMotion(editedMotion || 'This house...');
    setIsEditing(false);
    
    toast({
      title: "Motion updated",
      description: "Your debate motion has been updated.",
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditedMotion(motion);
    }
  };

  if (isEditing) {
    return (
      <div className={`flex items-center ${className}`}>
        <input
          ref={inputRef}
          type="text"
          value={editedMotion}
          onChange={(e) => setEditedMotion(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border-b bg-transparent px-1 py-0.5 text-gray-600 focus:border-blue-500 focus:outline-none"
          placeholder="This house believes that..."
        />
        <Button 
          onClick={handleSave} 
          size="sm" 
          variant="ghost" 
          className="ml-1"
        >
          <Check className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex items-center group ${className}`}>
      <p className="text-gray-600">{motion || "This house..."}</p>
      <Button 
        onClick={() => setIsEditing(true)} 
        size="sm" 
        variant="ghost" 
        className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Edit className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

export default EditableMotion;
