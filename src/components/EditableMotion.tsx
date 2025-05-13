
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
      // Position cursor at the end of text
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, [isEditing]);

  useEffect(() => {
    setEditedMotion(motion);
  }, [motion]);

  const handleSave = () => {
    const finalMotion = editedMotion.trim() === '' ? 'This house...' : editedMotion;
    onMotionChange(finalMotion);
    saveMotion(finalMotion);
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
          className="border-b-2 border-blue-400 bg-transparent px-2 py-0.5 text-gray-700 focus:border-blue-600 focus:outline-none transition-colors w-full"
          placeholder="This house believes that..."
        />
        <Button 
          onClick={handleSave} 
          size="sm" 
          variant="ghost" 
          className="ml-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
        >
          <Check className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex items-center group ${className}`}>
      <p className="text-gray-700 font-medium">{motion || "This house..."}</p>
      <Button 
        onClick={() => setIsEditing(true)} 
        size="sm" 
        variant="ghost" 
        className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-blue-600 hover:bg-blue-50"
      >
        <Edit className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

export default EditableMotion;
