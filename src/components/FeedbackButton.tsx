
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import FeedbackForm from './FeedbackForm';
import { getNotes } from '@/utils/localStorage';

interface FeedbackButtonProps {
  role: string;
  motion: string;
}

const FeedbackButton: React.FC<FeedbackButtonProps> = ({ role, motion }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsOpen(true);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button 
        onClick={handleOpenDialog} 
        className="bg-red-500 hover:bg-red-600 text-white"
      >
        Add Feedback & Rankings
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <FeedbackForm 
            motion={motion}
            position={role}
            onClose={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FeedbackButton;
