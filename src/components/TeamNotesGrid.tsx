import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface TeamNotesGridProps {
  notes: {
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
  onChange: (team: keyof TeamNotes, value: string) => void;
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

const TeamNotesGrid: React.FC<TeamNotesGridProps> = ({ notes, onChange }) => {
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
                value={notes[team]}
                onChange={(e) => onChange(team as keyof typeof notes, e.target.value)}
                className="min-h-[100px] resize-vertical"
                placeholder={`Note key arguments from ${team.toUpperCase()}...`}
              />
            </div>
            <div>
              <Label>Your Rebuttal</Label>
              <Textarea
                value={notes[`${team}Rebuttal`] || ''}
                onChange={(e) => onChange(`${team}Rebuttal` as keyof typeof notes, e.target.value)}
                className="min-h-[100px] resize-vertical"
                placeholder="How would you respond to this speaker's case?"
              />
            </div>
            <div>
              <Label>Case Comparison</Label>
              <Textarea
                value={notes[`${team}Comparison`] || ''}
                onChange={(e) => onChange(`${team}Comparison` as keyof typeof notes, e.target.value)}
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
