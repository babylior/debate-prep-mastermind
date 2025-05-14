
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getNotes, saveNotes } from "@/utils/localStorage";

interface TeamNotesGridProps {
  role: string; // Add this property
  onChange?: (team: keyof TeamNotes, value: string) => void;
}

interface TeamNotes {
    og: string;
    oo: string;
    cg: string;
    co: string;
    ogRebuttal?: string;
    ooRebuttal?: string;
    cgRebuttal?: string;
    coRebuttal?: string;
    ogComparison?: string;
    ooComparison?: string;
    cgComparison?: string;
    coComparison?: string;
}

const TeamNotesGrid: React.FC<TeamNotesGridProps> = ({ role, onChange }) => {
  const [notes, setNotes] = useState<TeamNotes>({
    og: '',
    oo: '',
    cg: '',
    co: '',
  });

  useEffect(() => {
    // Load notes from localStorage
    const savedNotes = getNotes();
    if (savedNotes?.teamNotes) {
      setNotes(savedNotes.teamNotes);
    }
  }, []);

  const handleChange = (team: keyof TeamNotes, value: string) => {
    const updatedNotes = { ...notes, [team]: value };
    setNotes(updatedNotes);
    
    // Save to localStorage
    const savedNotes = getNotes() || {};
    savedNotes.teamNotes = updatedNotes;
    saveNotes(savedNotes);
    
    // Call parent onChange if provided
    if (onChange) {
      onChange(team, value);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {['og', 'oo', 'cg', 'co'].map((team) => (
        <Card key={team} className={`border-l-4 border-${team === 'og' ? 'green' : team === 'oo' ? 'blue' : team === 'cg' ? 'yellow' : 'red'}-500 hover:shadow-md transition-all duration-200`}>
          <CardHeader className={`bg-${team === 'og' ? 'green' : team === 'oo' ? 'blue' : team === 'cg' ? 'yellow' : 'red'}-50 bg-opacity-50 pb-2`}>
            <CardTitle className="text-lg flex items-center">
              <span className={`w-6 h-6 rounded-full bg-${team === 'og' ? 'green' : team === 'oo' ? 'blue' : team === 'cg' ? 'yellow' : 'red'}-500 flex items-center justify-center text-white text-xs font-bold mr-2`}>
                {team.toUpperCase()}
              </span>
              {team === 'og' ? 'Opening Government' : 
               team === 'oo' ? 'Opening Opposition' :
               team === 'cg' ? 'Closing Government' : 'Closing Opposition'}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 space-y-4">
            <div>
              <Label>Arguments & Points</Label>
              <Textarea
                value={notes[team as keyof TeamNotes] || ''}
                onChange={(e) => handleChange(team as keyof TeamNotes, e.target.value)}
                className="min-h-[100px] resize-vertical"
                placeholder={`Note key arguments from ${team.toUpperCase()}...`}
              />
            </div>
            <div>
              <Label>Your Rebuttal</Label>
              <Textarea
                value={notes[`${team}Rebuttal` as keyof TeamNotes] || ''}
                onChange={(e) => handleChange(`${team}Rebuttal` as keyof TeamNotes, e.target.value)}
                className="min-h-[100px] resize-vertical"
                placeholder="How would you respond to this speaker's case?"
              />
            </div>
            <div>
              <Label>Case Comparison</Label>
              <Textarea
                value={notes[`${team}Comparison` as keyof TeamNotes] || ''}
                onChange={(e) => handleChange(`${team}Comparison` as keyof TeamNotes, e.target.value)}
                className="min-h-[100px] resize-vertical"
                placeholder="How does your case compare to theirs?"
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TeamNotesGrid;
