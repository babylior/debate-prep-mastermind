
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface TeamNotesGridProps {
  notes: {
    og: string;
    oo: string;
    cg: string;
    co: string;
  };
  onChange: (team: 'og' | 'oo' | 'cg' | 'co', value: string) => void;
}

const TeamNotesGrid: React.FC<TeamNotesGridProps> = ({ notes, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="border-l-4 border-green-500 hover:shadow-md transition-all duration-200">
        <CardHeader className="bg-green-50 bg-opacity-50 pb-2">
          <CardTitle className="text-lg flex items-center">
            <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold mr-2">
              OG
            </span>
            Opening Government
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3">
          <Textarea
            value={notes.og}
            onChange={(e) => onChange('og', e.target.value)}
            className="min-h-[150px] resize-vertical"
            placeholder="Note key arguments from Opening Government..."
          />
        </CardContent>
      </Card>
      
      <Card className="border-l-4 border-blue-500 hover:shadow-md transition-all duration-200">
        <CardHeader className="bg-blue-50 bg-opacity-50 pb-2">
          <CardTitle className="text-lg flex items-center">
            <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold mr-2">
              OO
            </span>
            Opening Opposition
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3">
          <Textarea
            value={notes.oo}
            onChange={(e) => onChange('oo', e.target.value)}
            className="min-h-[150px] resize-vertical"
            placeholder="Note key arguments from Opening Opposition..."
          />
        </CardContent>
      </Card>
      
      <Card className="border-l-4 border-yellow-500 hover:shadow-md transition-all duration-200">
        <CardHeader className="bg-yellow-50 bg-opacity-50 pb-2">
          <CardTitle className="text-lg flex items-center">
            <span className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs font-bold mr-2">
              CG
            </span>
            Closing Government
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3">
          <Textarea
            value={notes.cg}
            onChange={(e) => onChange('cg', e.target.value)}
            className="min-h-[150px] resize-vertical"
            placeholder="Note key arguments from Closing Government..."
          />
        </CardContent>
      </Card>
      
      <Card className="border-l-4 border-red-500 hover:shadow-md transition-all duration-200">
        <CardHeader className="bg-red-50 bg-opacity-50 pb-2">
          <CardTitle className="text-lg flex items-center">
            <span className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold mr-2">
              CO
            </span>
            Closing Opposition
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3">
          <Textarea
            value={notes.co}
            onChange={(e) => onChange('co', e.target.value)}
            className="min-h-[150px] resize-vertical"
            placeholder="Note key arguments from Closing Opposition..."
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamNotesGrid;
