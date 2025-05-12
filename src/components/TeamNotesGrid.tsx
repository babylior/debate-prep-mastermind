
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTextFormat } from '@/hooks/useTextFormat';
import MarkdownRenderer from './MarkdownRenderer';

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
  // Create format handlers for each team type
  const createFormatHandlers = (team: keyof TeamNotes) => {
    return useTextFormat({
      value: notes[team] || '',
      onChange: (value) => onChange(team, value)
    });
  };
  
  const formatHandlers = {
    og: createFormatHandlers('og'),
    oo: createFormatHandlers('oo'),
    cg: createFormatHandlers('cg'),
    co: createFormatHandlers('co'),
    ogRebuttal: createFormatHandlers('ogRebuttal'),
    ooRebuttal: createFormatHandlers('ooRebuttal'),
    cgRebuttal: createFormatHandlers('cgRebuttal'),
    coRebuttal: createFormatHandlers('coRebuttal'),
    ogComparison: createFormatHandlers('ogComparison'),
    ooComparison: createFormatHandlers('ooComparison'),
    cgComparison: createFormatHandlers('cgComparison'),
    coComparison: createFormatHandlers('coComparison')
  };

  const getTeamColor = (team: string) => {
    switch(team) {
      case 'og': return 'green';
      case 'oo': return 'blue';
      case 'cg': return 'yellow';
      case 'co': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {['og', 'oo', 'cg', 'co'].map((team) => {
        const teamColor = getTeamColor(team);
        const teamKey = team as keyof typeof notes;
        const rebuttalKey = `${team}Rebuttal` as keyof typeof notes;
        const comparisonKey = `${team}Comparison` as keyof typeof notes;
        
        return (
          <Card key={team} className={`border-l-4 border-${teamColor}-500 hover:shadow-md transition-all duration-200`}>
            <CardHeader className={`bg-${teamColor}-50 bg-opacity-50 pb-2`}>
              <CardTitle className="text-lg flex items-center">
                <span className={`w-6 h-6 rounded-full bg-${teamColor}-500 flex items-center justify-center text-white text-xs font-bold mr-2`}>
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
                  value={notes[teamKey]}
                  onChange={(e) => onChange(teamKey, e.target.value)}
                  onKeyUp={formatHandlers[teamKey].handleSelection}
                  onMouseUp={formatHandlers[teamKey].handleSelection}
                  onBold={formatHandlers[teamKey].handleBold}
                  onItalic={formatHandlers[teamKey].handleItalic}
                  onHighlight={formatHandlers[teamKey].handleHighlight}
                  onRedColor={formatHandlers[teamKey].handleRedColor}
                  onBlueColor={formatHandlers[teamKey].handleBlueColor}
                  onBlackColor={formatHandlers[teamKey].handleBlackColor}
                  className="min-h-[100px] resize-vertical"
                  placeholder={`Note key arguments from ${team.toUpperCase()}...`}
                />
                {notes[teamKey] && (
                  <div className="mt-2 p-2 border rounded bg-gray-50">
                    <Label className="text-xs text-gray-500 mb-1">Preview:</Label>
                    <MarkdownRenderer text={notes[teamKey]} />
                  </div>
                )}
              </div>
              <div>
                <Label>Your Rebuttal</Label>
                <Textarea
                  value={notes[rebuttalKey] || ''}
                  onChange={(e) => onChange(rebuttalKey, e.target.value)}
                  onKeyUp={formatHandlers[rebuttalKey].handleSelection}
                  onMouseUp={formatHandlers[rebuttalKey].handleSelection}
                  onBold={formatHandlers[rebuttalKey].handleBold}
                  onItalic={formatHandlers[rebuttalKey].handleItalic}
                  onHighlight={formatHandlers[rebuttalKey].handleHighlight}
                  onRedColor={formatHandlers[rebuttalKey].handleRedColor}
                  onBlueColor={formatHandlers[rebuttalKey].handleBlueColor}
                  onBlackColor={formatHandlers[rebuttalKey].handleBlackColor}
                  className="min-h-[100px] resize-vertical"
                  placeholder="How would you respond to this speaker's case?"
                />
                {notes[rebuttalKey] && (
                  <div className="mt-2 p-2 border rounded bg-gray-50">
                    <Label className="text-xs text-gray-500 mb-1">Preview:</Label>
                    <MarkdownRenderer text={notes[rebuttalKey] || ''} />
                  </div>
                )}
              </div>
              <div>
                <Label>Case Comparison</Label>
                <Textarea
                  value={notes[comparisonKey] || ''}
                  onChange={(e) => onChange(comparisonKey, e.target.value)}
                  onKeyUp={formatHandlers[comparisonKey].handleSelection}
                  onMouseUp={formatHandlers[comparisonKey].handleSelection}
                  onBold={formatHandlers[comparisonKey].handleBold}
                  onItalic={formatHandlers[comparisonKey].handleItalic}
                  onHighlight={formatHandlers[comparisonKey].handleHighlight}
                  onRedColor={formatHandlers[comparisonKey].handleRedColor}
                  onBlueColor={formatHandlers[comparisonKey].handleBlueColor}
                  onBlackColor={formatHandlers[comparisonKey].handleBlackColor}
                  className="min-h-[100px] resize-vertical"
                  placeholder="How does your case compare to theirs?"
                />
                {notes[comparisonKey] && (
                  <div className="mt-2 p-2 border rounded bg-gray-50">
                    <Label className="text-xs text-gray-500 mb-1">Preview:</Label>
                    <MarkdownRenderer text={notes[comparisonKey] || ''} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default TeamNotesGrid;
