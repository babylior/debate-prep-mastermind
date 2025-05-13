
import React from 'react';
import { Button } from "@/components/ui/button";
import Timer from "@/components/Timer";
import { StatusBar } from '@/components/ui/status-bar';
import { roleContent, DebateRole } from "@/utils/debateData";
import TipsPanel from './TipsPanel';
import PrepTabs from './PrepTabs';
import PrepStageHeader from './prep/PrepStageHeader';
import PrepTabContent from './prep/PrepTabContent';
import { usePrepStageState } from '@/hooks/usePrepStageState';
import { PrepNotes } from '@/types/prepTypes';

interface PrepStageProps {
  role: string;
  motion: string;
  onComplete: () => void;
  onMotionChange: (newMotion: string) => void;
}

const PrepStage: React.FC<PrepStageProps> = ({ role, motion, onComplete, onMotionChange }) => {
  const roleData = roleContent[role as DebateRole];
  
  const {
    activeTab,
    setActiveTab,
    isTipsPanelOpen,
    setIsTipsPanelOpen,
    saveStatus,
    notes,
    prepArguments,
    handleNoteChange,
    handleTimerComplete,
    addArgument,
    deleteArgument,
    duplicateArgument,
    updateArgument,
    handleDragStart,
    handleDragEnd,
    handleDragOver
  } = usePrepStageState(role, motion);

  return (
    <div className="max-w-6xl mx-auto p-4" dir="rtl">
      <PrepStageHeader 
        role={role} 
        motion={motion} 
        onOpenTipsPanel={() => setIsTipsPanelOpen(true)}
        onMotionChange={onMotionChange}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - Timer */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="sticky top-24">
            <Timer 
              initialTime={15 * 60} // 15 minutes in seconds
              timerLabel="זמן הכנה"
              onComplete={handleTimerComplete}
              autoStart={true} // Start timer automatically
            />
          </div>
        </div>
        
        {/* Right Column - Tabbed Content */}
        <div className="lg:col-span-3 space-y-4 order-1 lg:order-2">
          <PrepTabs 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
          
          <PrepTabContent 
            activeTab={activeTab}
            notes={notes}
            args={prepArguments}
            onNotesChange={handleNoteChange}
            onAddArgument={addArgument}
            onDeleteArgument={deleteArgument}
            onDuplicateArgument={duplicateArgument}
            onUpdateArgument={updateArgument}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
          />
          
          <div className="text-left mt-6 lg:mt-10">
            <Button onClick={onComplete} size="lg" className="px-8 py-2">
              המשך לשלב ההקשבה
            </Button>
          </div>
        </div>
      </div>
      
      {/* Side Panel for Tips */}
      <TipsPanel 
        role={role as DebateRole} 
        content={{
          instructions: roleData.prep.instructions,
          questions: roleData.prep.questions,
          tips: roleData.prep.tips
        }}
        isOpen={isTipsPanelOpen}
        onClose={() => setIsTipsPanelOpen(false)}
      />
      
      <StatusBar status={saveStatus} />
    </div>
  );
};

export default PrepStage;
