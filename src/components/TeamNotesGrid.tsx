
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getNotes, saveNotes } from "@/utils/localStorage";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface TeamNotesGridProps {
  role: string;
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

// Helper function to create an empty TeamNotes object with all required fields
const createEmptyTeamNotes = (): TeamNotes => ({
  og: '',
  oo: '',
  cg: '',
  co: '',
  ogRebuttal: '',
  ooRebuttal: '',
  cgRebuttal: '',
  coRebuttal: '',
  ogComparison: '',
  ooComparison: '',
  coComparison: '',
  cgComparison: '',
});

const TeamNotesGrid: React.FC<TeamNotesGridProps> = ({ role, onChange }) => {
  const [notes, setNotes] = useState<TeamNotes>(createEmptyTeamNotes());

  useEffect(() => {
    // Load notes from localStorage
    const savedNotes = getNotes();
    if (savedNotes && savedNotes.teamNotes) {
      setNotes(savedNotes.teamNotes);
    }
  }, []);

  const handleChange = (team: keyof TeamNotes, value: string) => {
    const updatedNotes = { ...notes, [team]: value };
    setNotes(updatedNotes);
    
    // Save to localStorage
    const savedNotes = getNotes() || {
      motion: '',
      role: role,
      prep: {},
      listening: {},
      speech: {},
      lastUpdated: Date.now(),
      teamNotes: createEmptyTeamNotes()
    };
    
    if (!savedNotes.teamNotes) {
      savedNotes.teamNotes = createEmptyTeamNotes();
    }
    
    savedNotes.teamNotes = updatedNotes;
    saveNotes(savedNotes);
    
    // Call parent onChange if provided
    if (onChange) {
      onChange(team, value);
    }
  };

  // Get team names and colors
  const teams = [
    { id: 'og', name: 'Opening Government', color: 'green' },
    { id: 'oo', name: 'Opening Opposition', color: 'blue' },
    { id: 'cg', name: 'Closing Government', color: 'yellow' },
    { id: 'co', name: 'Closing Opposition', color: 'red' }
  ];

  return (
    <div className="w-full h-full">
      <Table className="border rounded-lg shadow-sm">
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/5">Team</TableHead>
            <TableHead className="w-5/15">Arguments & Points</TableHead>
            <TableHead className="w-5/15">Your Rebuttal</TableHead>
            <TableHead className="w-4/15">Case Comparison</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.map((team) => (
            <TableRow key={team.id} className="hover:bg-muted/30">
              <TableCell className={`bg-debate-${team.id} bg-opacity-10 font-medium`}>
                <div className="flex items-center space-x-2">
                  <span className={`w-6 h-6 rounded-full bg-debate-${team.id} flex items-center justify-center text-white text-xs font-bold`}>
                    {team.id.toUpperCase()}
                  </span>
                  <span>{team.name}</span>
                </div>
              </TableCell>
              <TableCell className="p-0">
                <Textarea
                  value={notes[team.id as keyof TeamNotes] || ''}
                  onChange={(e) => handleChange(team.id as keyof TeamNotes, e.target.value)}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[180px] resize-none"
                  placeholder={`Note key arguments from ${team.name}...`}
                />
              </TableCell>
              <TableCell className="p-0">
                <Textarea
                  value={notes[`${team.id}Rebuttal` as keyof TeamNotes] || ''}
                  onChange={(e) => handleChange(`${team.id}Rebuttal` as keyof TeamNotes, e.target.value)}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[180px] resize-none"
                  placeholder="How would you respond to these arguments?"
                />
              </TableCell>
              <TableCell className="p-0">
                <Textarea
                  value={notes[`${team.id}Comparison` as keyof TeamNotes] || ''}
                  onChange={(e) => handleChange(`${team.id}Comparison` as keyof TeamNotes, e.target.value)}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[180px] resize-none"
                  placeholder="How does your case compare?"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TeamNotesGrid;
