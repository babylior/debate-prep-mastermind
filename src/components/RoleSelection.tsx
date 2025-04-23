
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { saveMotion, saveRole } from "@/utils/localStorage";
import { debateRoles, teamPositions, TeamPosition } from "@/utils/debateData";

interface RoleSelectionProps {
  onComplete: (role: string, motion: string) => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ onComplete }) => {
  const [motion, setMotion] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  
  // Group roles by team position
  const rolesByTeam = debateRoles.reduce<Record<TeamPosition, typeof debateRoles>>((acc, role) => {
    const teamPosition = role.teamPosition;
    if (!acc[teamPosition]) {
      acc[teamPosition] = [];
    }
    acc[teamPosition].push(role);
    return acc;
  }, {} as Record<TeamPosition, typeof debateRoles>);
  
  const handleContinue = () => {
    if (!motion.trim()) {
      alert('Please enter a motion');
      return;
    }
    if (!selectedRole) {
      alert('Please select your role');
      return;
    }
    
    saveMotion(motion);
    saveRole(selectedRole);
    onComplete(selectedRole, motion);
  };
  
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">BP Debate Assistant</CardTitle>
          <CardDescription>Enter the motion and select your role</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="motion" className="block text-sm font-medium mb-1">
              Debate Motion
            </label>
            <Input
              id="motion"
              placeholder="This House Believes That..."
              value={motion}
              onChange={(e) => setMotion(e.target.value)}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">Select Your Role</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(rolesByTeam).map(([team, roles]) => (
          <Card key={team} className={`border-l-4 border-debate-${team.toLowerCase()}`}>
            <CardHeader className={`bg-debate-${team.toLowerCase()} bg-opacity-10 pb-2`}>
              <CardTitle className="text-lg">{teamPositions[team as TeamPosition]}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 gap-3">
                {roles
                  .sort((a, b) => a.order - b.order)
                  .map((role) => (
                    <Button
                      key={role.id}
                      variant={selectedRole === role.id ? "default" : "outline"}
                      className={`justify-start ${selectedRole === role.id ? '' : 'hover:bg-gray-100'}`}
                      onClick={() => setSelectedRole(role.id)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          <span className={`w-8 h-8 rounded-full ${role.teamColor} flex items-center justify-center text-white font-bold mr-3`}>
                            {role.order}
                          </span>
                          <span>{role.fullName} ({role.name})</span>
                        </div>
                      </div>
                    </Button>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-center mt-6">
        <Button 
          size="lg" 
          disabled={!motion.trim() || !selectedRole}
          onClick={handleContinue}
          className="px-8"
        >
          Continue to Prep
        </Button>
      </div>
    </div>
  );
};

export default RoleSelection;
