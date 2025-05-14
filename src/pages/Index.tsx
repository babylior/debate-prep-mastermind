
import React, { useState, useEffect } from 'react';
import RoleSelection from '@/components/RoleSelection';
import DebateStages from '@/components/DebateStages';
import { getRole, getMotion, clearNotes } from '@/utils/localStorage';

const Index = () => {
  const [stage, setStage] = useState<'selection' | 'debate'>('selection');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [motion, setMotion] = useState<string>('');
  
  // Check if we have saved data on mount
  useEffect(() => {
    const savedRole = getRole();
    const savedMotion = getMotion();
    
    if (savedRole && savedMotion) {
      setSelectedRole(savedRole);
      setMotion(savedMotion);
      setStage('debate');
    }
  }, []);
  
  const handleRoleSelection = (role: string, motion: string) => {
    setSelectedRole(role);
    setMotion(motion);
    setStage('debate');
  };
  
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your debate session? All notes will be cleared.')) {
      clearNotes();
      setStage('selection');
      setSelectedRole('');
      setMotion('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">BP Debate Assistant</h1>
          {stage === 'debate' && (
            <button 
              onClick={handleReset} 
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Switch Role
            </button>
          )}
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {stage === 'selection' ? (
          <RoleSelection onComplete={handleRoleSelection} />
        ) : (
          <DebateStages 
            selectedRole={selectedRole} 
            motion={motion} 
            onReset={handleReset} 
          />
        )}
      </main>
      
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 py-4 text-center text-gray-500 text-sm">
        BP Debate Assistant &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default Index;
