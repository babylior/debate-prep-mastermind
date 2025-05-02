
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getNotes, saveNotes } from "@/utils/localStorage";
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { StatusBar } from "@/components/ui/status-bar";

interface TeamPosition {
  teamKey: 'og' | 'oo' | 'cg' | 'co';
  position: number | null;
}

const ReviewLocations: React.FC = () => {
  const { toast } = useToast();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [reviews, setReviews] = useState({
    general: '',
    team: '',
    personal: ''
  });
  
  const [teamPositions, setTeamPositions] = useState<TeamPosition[]>([
    { teamKey: 'og', position: null },
    { teamKey: 'oo', position: null },
    { teamKey: 'cg', position: null },
    { teamKey: 'co', position: null }
  ]);
  
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  
  const teamColors = {
    og: 'bg-debate-og',
    oo: 'bg-debate-oo',
    cg: 'bg-debate-cg',
    co: 'bg-debate-co'
  };
  
  const teamNames = {
    og: 'Opening Government',
    oo: 'Opening Opposition',
    cg: 'Closing Government',
    co: 'Closing Opposition'
  };
  
  // Load saved data when dialog opens
  const handleDialogOpen = () => {
    const savedNotes = getNotes();
    if (savedNotes?.reviews) {
      setReviews(savedNotes.reviews);
    }
    if (savedNotes?.teamPositions) {
      setTeamPositions(savedNotes.teamPositions);
    }
  };
  
  // Save review text
  const handleReviewChange = (field: keyof typeof reviews, value: string) => {
    setSaveStatus('saving');
    const updatedReviews = { ...reviews, [field]: value };
    setReviews(updatedReviews);
    
    try {
      const savedNotes = getNotes() || {};
      savedNotes.reviews = updatedReviews;
      saveNotes(savedNotes);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      toast({
        variant: "destructive",
        title: "Error saving reviews",
        description: "There was a problem saving your reviews. Please try again."
      });
    }
  };
  
  // Set team position
  const handlePositionSelect = (position: number) => {
    setSelectedPosition(position);
  };
  
  // Assign position to team
  const handleTeamClick = (teamKey: 'og' | 'oo' | 'cg' | 'co') => {
    if (selectedPosition === null) return;
    
    // Update positions
    const updatedPositions = teamPositions.map(team => 
      team.teamKey === teamKey 
        ? { ...team, position: selectedPosition } 
        : team.position === selectedPosition 
          ? { ...team, position: null } 
          : team
    );
    
    setTeamPositions(updatedPositions);
    
    // Save to localStorage
    try {
      const savedNotes = getNotes() || {};
      savedNotes.teamPositions = updatedPositions;
      saveNotes(savedNotes);
      toast({
        title: "Position updated",
        description: `Position ${selectedPosition} assigned to ${teamNames[teamKey]}`,
        duration: 2000
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error saving positions",
        description: "There was a problem saving the team positions."
      });
    }
  };
  
  return (
    <Dialog onOpenChange={(open) => { if (open) handleDialogOpen(); }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          Add Review & Locations
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Review & Team Positions</DialogTitle>
        </DialogHeader>
        
        {/* Reviews Section */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="general-review">General Review</Label>
            <Textarea 
              id="general-review" 
              placeholder="Overall debate review..." 
              value={reviews.general}
              onChange={(e) => handleReviewChange('general', e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <div>
            <Label htmlFor="team-review">Team Review</Label>
            <Textarea 
              id="team-review" 
              placeholder="Review of your team's performance..." 
              value={reviews.team}
              onChange={(e) => handleReviewChange('team', e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <div>
            <Label htmlFor="personal-review">Personal Review</Label>
            <Textarea 
              id="personal-review" 
              placeholder="Self-assessment..." 
              value={reviews.personal}
              onChange={(e) => handleReviewChange('personal', e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        
        {/* Team Positions Section */}
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Team Positions</h3>
          
          {/* Position Selection */}
          <div className="flex gap-2 mb-4">
            <Label className="flex items-center">Select position:</Label>
            {[1, 2, 3, 4].map(position => (
              <Button 
                key={position}
                variant={selectedPosition === position ? "default" : "outline"}
                size="sm"
                onClick={() => handlePositionSelect(position)}
                className="w-10 h-10 p-0"
              >
                {position}
              </Button>
            ))}
          </div>
          
          {/* Team Grid */}
          <div className="grid grid-cols-2 gap-4">
            {teamPositions.map(team => {
              const teamKey = team.teamKey as keyof typeof teamColors;
              return (
                <Card 
                  key={team.teamKey}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleTeamClick(teamKey)}
                >
                  <div className="flex justify-between items-center p-4">
                    <div className="flex items-center">
                      <div className={`${teamColors[teamKey]} w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-3`}>
                        {team.teamKey.toUpperCase()}
                      </div>
                      <span>{teamNames[teamKey]}</span>
                    </div>
                    {team.position && (
                      <div className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center font-bold">
                        {team.position}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
        
        <StatusBar status={saveStatus} position="bottom" />
      </DialogContent>
    </Dialog>
  );
};

export default ReviewLocations;
