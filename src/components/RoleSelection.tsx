import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { saveMotion, saveRole } from "@/utils/localStorage";
import { debateRoles, teamPositions, TeamPosition } from "@/utils/debateData";
import { useToast } from "@/components/ui/use-toast";
import { Play } from "lucide-react";
interface RoleSelectionProps {
  onComplete: (role: string, motion: string) => void;
}
const RoleSelection: React.FC<RoleSelectionProps> = ({
  onComplete
}) => {
  const [motion, setMotion] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<TeamPosition | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const {
    toast
  } = useToast();

  // Group roles by team position
  const rolesByTeam = debateRoles.reduce<Record<TeamPosition, typeof debateRoles>>((acc, role) => {
    const teamPosition = role.teamPosition;
    if (!acc[teamPosition]) {
      acc[teamPosition] = [];
    }
    acc[teamPosition].push(role);
    return acc;
  }, {} as Record<TeamPosition, typeof debateRoles>);
  const handleTeamSelect = (team: TeamPosition) => {
    setSelectedTeam(team);
    setSelectedRole(''); // Clear role selection when team changes
  };
  const handleStartPrep = () => {
    if (!selectedRole) {
      toast({
        title: "Role required",
        description: "Please select your role before starting prep.",
        variant: "destructive"
      });
      return;
    }

    // Use default motion if none is provided
    const defaultMotion = motion.trim() || "This house...";
    saveMotion(defaultMotion);
    saveRole(selectedRole);
    onComplete(selectedRole, defaultMotion);
    toast({
      title: "Prep started",
      description: "Your preparation has started."
    });
  };

  // Get team color class
  const getTeamColorClass = (team: TeamPosition) => {
    switch (team) {
      case 'OG':
        return 'bg-green-500';
      case 'OO':
        return 'bg-blue-500';
      case 'CG':
        return 'bg-yellow-500';
      case 'CO':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  const getTeamBorderClass = (team: TeamPosition) => {
    switch (team) {
      case 'OG':
        return 'border-green-500';
      case 'OO':
        return 'border-blue-500';
      case 'CG':
        return 'border-yellow-500';
      case 'CO':
        return 'border-red-500';
      default:
        return 'border-gray-500';
    }
  };
  const getTeamBgClass = (team: TeamPosition) => {
    switch (team) {
      case 'OG':
        return 'bg-green-50';
      case 'OO':
        return 'bg-blue-50';
      case 'CG':
        return 'bg-yellow-50';
      case 'CO':
        return 'bg-red-50';
      default:
        return 'bg-gray-50';
    }
  };
  return <div className="max-w-4xl mx-auto p-4 space-y-8">
      <Card className="border-t-4 border-t-primary">
        <CardHeader>
          
          
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="motion" className="block text-lg font-medium mb-2"> Motion</label>
            <Input id="motion" placeholder="This House Believes That..." value={motion} onChange={e => setMotion(e.target.value)} className="w-full text-lg py-6" />
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center">
        <h2 className="text-xl font-semibold my-4">Select Your Team</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {Object.entries(teamPositions).map(([team, label]) => <button key={team} onClick={() => handleTeamSelect(team as TeamPosition)} className={`
                p-4 rounded-lg transition-all duration-300 border-2
                ${selectedTeam === team ? `${getTeamBorderClass(team as TeamPosition)} ${getTeamBgClass(team as TeamPosition)}` : 'border-transparent hover:border-gray-200'}
              `}>
              <div className="flex flex-col items-center justify-center space-y-2">
                <span className={`w-10 h-10 rounded-full ${getTeamColorClass(team as TeamPosition)} flex items-center justify-center text-white font-bold text-lg`}>
                  {team}
                </span>
                <span className="font-medium">{label}</span>
              </div>
            </button>)}
        </div>
      </div>
        
      {selectedTeam && <div className="bg-white p-6 rounded-lg shadow-sm border animate-fade-in">
          <h3 className="text-lg font-semibold mb-4">Select Your Role in {teamPositions[selectedTeam]}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rolesByTeam[selectedTeam].sort((a, b) => a.order - b.order).map(role => <Button key={role.id} variant={selectedRole === role.id ? "default" : "outline"} className={`justify-start ${selectedRole === role.id ? role.teamColor : 'hover:bg-gray-100'}`} onClick={() => setSelectedRole(role.id)}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <span className={`w-8 h-8 rounded-full ${selectedRole === role.id ? 'bg-white text-black' : role.teamColor + ' text-white'} flex items-center justify-center font-bold mr-3`}>
                        {role.order}
                      </span>
                      <span>{role.fullName} ({role.name})</span>
                    </div>
                  </div>
                </Button>)}
          </div>
        </div>}
      
      <div className="flex justify-center mt-8">
        <Button size="lg" disabled={!selectedRole} onClick={handleStartPrep} className="px-8 py-6 text-lg">
          <Play className="mr-2 h-5 w-5" />
          Start Prep
        </Button>
      </div>
    </div>;
};
export default RoleSelection;