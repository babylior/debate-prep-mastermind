
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getNotes } from "@/utils/localStorage";

interface ExportButtonProps {
  className?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ className }) => {
  const { toast } = useToast();

  const exportToPDF = () => {
    const notes = getNotes();
    
    if (!notes) {
      toast({
        title: "No notes to export",
        description: "You haven't created any notes yet.",
        variant: "destructive"
      });
      return;
    }

    // Create a text version of notes for download
    // In a real app, you'd use a proper PDF library
    let content = `# BP Debate Assistant Notes\n\n`;
    content += `Motion: ${notes.motion || 'Not specified'}\n`;
    content += `Role: ${notes.role || 'Not specified'}\n\n`;
    
    // Add prep notes
    content += `## Preparation Stage\n\n`;
    Object.entries(notes.prep).forEach(([key, value]) => {
      content += `### ${key}\n${value}\n\n`;
    });
    
    // Add listening notes
    content += `## Listening Stage\n\n`;
    Object.entries(notes.listening).forEach(([key, value]) => {
      content += `### ${key}\n${value}\n\n`;
    });
    
    // Add speech notes
    content += `## Speech Stage\n\n`;
    Object.entries(notes.speech).forEach(([key, value]) => {
      content += `### ${key}\n${value}\n\n`;
    });
    
    // Create a downloadable text file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debate-notes-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Notes exported",
      description: "Your debate notes have been downloaded successfully.",
    });
  };

  return (
    <Button 
      onClick={exportToPDF}
      variant="outline"
      className={`flex items-center ${className}`}
    >
      <Download className="h-4 w-4 mr-2" />
      Export Notes
    </Button>
  );
};

export default ExportButton;
