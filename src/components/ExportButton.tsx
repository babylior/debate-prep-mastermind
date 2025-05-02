
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { getNotes } from "@/utils/localStorage";

interface ExportButtonProps {
  motion?: string;
  role?: string;
  sections?: Array<{
    title: string;
    content: string;
    type: string;
  }>;
}

const ExportButton: React.FC<ExportButtonProps> = ({ motion, role, sections }) => {
  const handleExport = () => {
    const savedNotes = getNotes();
    if (!savedNotes) return;
    
    // Get team positions if available
    const teamPositions = savedNotes.teamPositions || [];
    let position = '';
    
    // Find our team's position
    if (role && teamPositions.length > 0) {
      const teamRole = role.toLowerCase();
      let teamKey = '';
      
      if (teamRole.includes('og') || teamRole.includes('prime minister') || teamRole.includes('deputy prime')) {
        teamKey = 'og';
      } else if (teamRole.includes('oo') || teamRole.includes('leader of opposition') || teamRole.includes('deputy leader')) {
        teamKey = 'oo';
      } else if (teamRole.includes('cg') || teamRole.includes('member of government')) {
        teamKey = 'cg';
      } else if (teamRole.includes('co') || teamRole.includes('member of opposition')) {
        teamKey = 'co';
      }
      
      const teamPosition = teamPositions.find(t => t.teamKey === teamKey);
      if (teamPosition && teamPosition.position) {
        position = `-${teamPosition.position}`;
      }
    }
    
    // Prepare the content
    const exportSections = sections || 
      (savedNotes.speech?.sectionsData ? JSON.parse(savedNotes.speech.sectionsData) : []);
    
    const content = [];
    
    // Add motion and role
    content.push(`<h1 style="text-align: center; font-size: 24px; margin-bottom: 5px;">${savedNotes.motion || motion || 'BP Debate'}</h1>`);
    content.push(`<h2 style="text-align: center; font-size: 18px; color: #666; margin-top: 0;">${savedNotes.role || role || ''}</h2>`);
    content.push('<hr style="margin: 20px 0;">');
    
    // Add the speech content
    exportSections.forEach(section => {
      if (section.content) {
        content.push(`<h3 style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">${section.title}</h3>`);
        content.push(`<div style="white-space: pre-wrap; margin-bottom: 20px;">${section.content}</div>`);
      }
    });
    
    // Add reviews if available
    if (savedNotes.reviews) {
      content.push('<hr style="margin: 20px 0;">');
      content.push('<h3 style="font-size: 18px; font-weight: bold;">Reviews</h3>');
      
      if (savedNotes.reviews.general) {
        content.push('<h4 style="font-size: 16px; margin: 10px 0;">General Review</h4>');
        content.push(`<div style="margin-bottom: 15px;">${savedNotes.reviews.general}</div>`);
      }
      
      if (savedNotes.reviews.team) {
        content.push('<h4 style="font-size: 16px; margin: 10px 0;">Team Review</h4>');
        content.push(`<div style="margin-bottom: 15px;">${savedNotes.reviews.team}</div>`);
      }
      
      if (savedNotes.reviews.personal) {
        content.push('<h4 style="font-size: 16px; margin: 10px 0;">Personal Review</h4>');
        content.push(`<div style="margin-bottom: 15px;">${savedNotes.reviews.personal}</div>`);
      }
    }
    
    // Add notes from prep stage
    if (savedNotes.prep) {
      content.push('<hr style="margin: 20px 0;">');
      content.push('<h3 style="font-size: 18px; font-weight: bold;">Preparation Notes</h3>');
      
      if (savedNotes.prep.framing) {
        content.push('<h4 style="font-size: 16px; margin: 10px 0;">Framing</h4>');
        content.push(`<div style="margin-bottom: 15px;">${savedNotes.prep.framing}</div>`);
      }
      
      if (savedNotes.prep.problem) {
        content.push('<h4 style="font-size: 16px; margin: 10px 0;">Problem/Current Situation</h4>');
        content.push(`<div style="margin-bottom: 15px;">${savedNotes.prep.problem}</div>`);
      }
      
      if (savedNotes.prep.mechanism) {
        content.push('<h4 style="font-size: 16px; margin: 10px 0;">Mechanism/Solution</h4>');
        content.push(`<div style="margin-bottom: 15px;">${savedNotes.prep.mechanism}</div>`);
      }
    }
    
    // Create the full HTML document
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${savedNotes.motion || motion || 'BP Debate'}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          @media print {
            body {
              font-size: 12pt;
            }
            h1 { font-size: 16pt; }
            h2 { font-size: 14pt; }
            h3 { font-size: 13pt; }
            h4 { font-size: 12pt; }
          }
        </style>
      </head>
      <body>
        ${content.join('\n')}
      </body>
      </html>
    `;
    
    // Generate PDF-ready file
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Create file name with motion, role and position
    const fileName = `${(savedNotes.motion || motion || 'debate')
      .replace(/[^a-zA-Z0-9]/g, '-')
      .slice(0, 30)}_${(savedNotes.role || role || '')
      .replace(/[^a-zA-Z0-9]/g, '')
      .slice(0, 10)}${position}.html`;
    
    // Create download link
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleExport}
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      <span className="hidden sm:inline">Export</span>
    </Button>
  );
};

export default ExportButton;
