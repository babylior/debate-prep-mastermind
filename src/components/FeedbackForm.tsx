
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import html2pdf from 'html2pdf.js';

interface FeedbackFormProps {
  motion: string;
  position: string;
  onClose: () => void;
}

interface TeamRanking {
  teamColor: string;
  rank: number | null;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ motion, position, onClose }) => {
  const { toast } = useToast();
  const [generalFeedback, setGeneralFeedback] = useState('');
  const [teamFeedback, setTeamFeedback] = useState('');
  const [individualFeedback, setIndividualFeedback] = useState('');
  const [teamRankings, setTeamRankings] = useState<TeamRanking[]>([
    { teamColor: 'bg-blue-500', rank: null },
    { teamColor: 'bg-red-500', rank: null },
    { teamColor: 'bg-yellow-500', rank: null },
    { teamColor: 'bg-green-500', rank: null }
  ]);
  const [selectedRank, setSelectedRank] = useState<number | null>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);

  // Handle dragging a rank from the numbers list
  const handleDragStart = (e: React.DragEvent, rank: number) => {
    e.dataTransfer.setData('text/plain', rank.toString());
    setSelectedRank(rank);
  };

  // Handle dropping a rank onto a team
  const handleDrop = (e: React.DragEvent, teamIndex: number) => {
    e.preventDefault();
    const rank = parseInt(e.dataTransfer.getData('text/plain'));
    
    // Remove this rank from any team that might have it
    const updatedRankings = teamRankings.map(team => 
      team.rank === rank ? { ...team, rank: null } : team
    );
    
    // Assign the rank to the target team
    updatedRankings[teamIndex].rank = rank;
    setTeamRankings(updatedRankings);
    setSelectedRank(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const exportToPDF = () => {
    if (!feedbackRef.current) return;
    
    const options = {
      margin: 1,
      filename: `${motion.replace(/\s+/g, '_')}_${position}_${getHighestRank()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().from(feedbackRef.current).set(options).save();
    
    toast({
      title: "Feedback Exported",
      description: "Your feedback and rankings have been exported as a PDF."
    });
  };

  const getHighestRank = (): string => {
    const highestRank = Math.min(...teamRankings.filter(team => team.rank !== null).map(team => team.rank as number));
    return highestRank ? highestRank.toString() : 'Unranked';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Feedback and Rankings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">General Feedback</h3>
            <Textarea
              value={generalFeedback}
              onChange={(e) => setGeneralFeedback(e.target.value)}
              placeholder="Enter general feedback about the debate"
              className="min-h-[100px] resize-none"
            />
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Team Feedback</h3>
            <Textarea
              value={teamFeedback}
              onChange={(e) => setTeamFeedback(e.target.value)}
              placeholder="Enter feedback about the teams' performance"
              className="min-h-[100px] resize-none"
            />
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Individual Feedback</h3>
            <Textarea
              value={individualFeedback}
              onChange={(e) => setIndividualFeedback(e.target.value)}
              placeholder="Enter feedback about individual performance"
              className="min-h-[100px] resize-none"
            />
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Team Rankings</h3>
            <p className="text-sm text-gray-500 mb-4">Drag ranks (1-4) to assign positions to each team</p>
            
            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4].map(rank => (
                <div 
                  key={rank}
                  draggable
                  onDragStart={(e) => handleDragStart(e, rank)}
                  className={`
                    w-10 h-10 mx-2 rounded-full bg-gray-100 border border-gray-300 
                    flex items-center justify-center cursor-grab
                    ${selectedRank === rank ? 'opacity-50' : ''}
                  `}
                >
                  {rank}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              {teamRankings.map((team, index) => (
                <div
                  key={index}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragOver={handleDragOver}
                  className={`
                    h-20 rounded-lg border-2 border-dashed border-gray-300
                    flex items-center justify-center ${team.teamColor} text-white
                  `}
                >
                  {team.rank ? (
                    <span className="text-2xl font-bold">{team.rank}</span>
                  ) : (
                    <span>Drop rank here</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={exportToPDF}>
              Export PDF
            </Button>
          </div>
        </div>
      </CardContent>

      <div className="hidden">
        <div ref={feedbackRef} className="p-4">
          <h1 className="text-2xl font-bold mb-4">{motion}</h1>
          <p className="mb-4">Position: {position}</p>
          
          <h2 className="text-xl font-bold mt-6 mb-2">General Feedback</h2>
          <p>{generalFeedback}</p>
          
          <h2 className="text-xl font-bold mt-6 mb-2">Team Feedback</h2>
          <p>{teamFeedback}</p>
          
          <h2 className="text-xl font-bold mt-6 mb-2">Individual Feedback</h2>
          <p>{individualFeedback}</p>
          
          <h2 className="text-xl font-bold mt-6 mb-2">Team Rankings</h2>
          <table className="w-full mt-2 border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Team</th>
                <th className="border border-gray-300 p-2">Rank</th>
              </tr>
            </thead>
            <tbody>
              {teamRankings.map((team, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">Team {index + 1}</td>
                  <td className="border border-gray-300 p-2">{team.rank || 'Unranked'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
};

export default FeedbackForm;
