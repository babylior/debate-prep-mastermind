
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getNotes, saveNotes } from "@/utils/localStorage";
import { useToast } from "@/components/ui/use-toast";

interface TeamNotesGridProps {
  notes?: {
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
  };
  onChange?: (team: keyof TeamNotes, value: string) => void;
  role?: string;
  motion?: string;
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

const TeamNotesGrid: React.FC<TeamNotesGridProps> = ({ notes: propNotes, onChange: propOnChange, role, motion }) => {
  const { toast } = useToast();
  const [internalNotes, setInternalNotes] = useState<TeamNotes>({
    og: '',
    oo: '',
    cg: '',
    co: '',
    ogRebuttal: '',
    ooRebuttal: '',
    cgRebuttal: '',
    coComparison: '',
    cgComparison: '',
    coRebuttal: '',
    ogComparison: '',
    ooComparison: ''
  });

  // Load notes from localStorage if no notes prop is provided
  useEffect(() => {
    if (propNotes) {
      setInternalNotes(propNotes);
    } else if (role && motion) {
      const savedNotes = getNotes();
      if (savedNotes && savedNotes.teamNotes) {
        setInternalNotes(savedNotes.teamNotes);
      }
    }
  }, [propNotes, role, motion]);

  const handleChange = (team: keyof TeamNotes, value: string) => {
    const updatedNotes = {
      ...internalNotes,
      [team]: value
    };
    
    setInternalNotes(updatedNotes);
    
    if (propOnChange) {
      propOnChange(team, value);
    } else if (role && motion) {
      // If no onChange prop, save directly to localStorage
      const savedNotes = getNotes() || {
        motion,
        role,
        prep: {},
        listening: {},
        speech: {},
        lastUpdated: Date.now()
      };
      
      savedNotes.teamNotes = updatedNotes;
      saveNotes(savedNotes);
      
      toast({
        title: "Notes saved",
        description: `Your notes for ${team.toUpperCase()} have been saved.`
      });
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
                value={internalNotes[team as keyof TeamNotes] || ''}
                onChange={(e) => handleChange(team as keyof TeamNotes, e.target.value)}
                className="min-h-[100px] resize-vertical"
                placeholder={`Note key arguments from ${team.toUpperCase()}...`}
                autoResize
              />
            </div>
            <div>
              <Label>Your Rebuttal</Label>
              <Textarea
                value={internalNotes[`${team}Rebuttal` as keyof TeamNotes] || ''}
                onChange={(e) => handleChange(`${team}Rebuttal` as keyof TeamNotes, e.target.value)}
                className="min-h-[100px] resize-vertical"
                placeholder="How would you respond to this speaker's case?"
                autoResize
              />
            </div>
            <div>
              <Label>Case Comparison</Label>
              <Textarea
                value={internalNotes[`${team}Comparison` as keyof TeamNotes] || ''}
                onChange={(e) => handleChange(`${team}Comparison` as keyof TeamNotes, e.target.value)}
                className="min-h-[100px] resize-vertical"
                placeholder="How does your case compare to theirs?"
                autoResize
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TeamNotesGrid;
