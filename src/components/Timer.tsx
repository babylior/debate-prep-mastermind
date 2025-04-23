
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

interface TimerProps {
  initialTime: number; // time in seconds
  timerLabel: string;
  onComplete?: () => void;
  autoStart?: boolean;
}

const Timer: React.FC<TimerProps> = ({ initialTime, timerLabel, onComplete, autoStart = false }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);

  // Format time into mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progressPercentage = (timeLeft / initialTime) * 100;
  
  // Determine color based on time left
  const getColorClass = (): string => {
    if (progressPercentage > 66) return 'bg-green-500';
    if (progressPercentage > 33) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  useEffect(() => {
    let interval: number | undefined;
    
    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsRunning(false);
            if (onComplete) onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, onComplete]);

  const toggleTimer = () => {
    setIsRunning(prev => !prev);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(initialTime);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow p-4 sticky top-24">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-gray-700">{timerLabel}</h3>
        <span className={`text-xl font-bold ${timeLeft < 60 ? 'text-red-600 animate-pulse' : ''}`}>
          {formatTime(timeLeft)}
        </span>
      </div>

      <div className="w-full bg-gray-200 h-3 rounded-full mb-4">
        <div
          className={`h-3 rounded-full transition-all ${getColorClass()}`}
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      <div className="flex justify-center space-x-3">
        <Button 
          variant="outline"
          size="sm"
          onClick={toggleTimer}
          className={`${isRunning ? 'bg-red-50 hover:bg-red-100 text-red-600' : 'bg-green-50 hover:bg-green-100 text-green-600'}`}
        >
          {isRunning ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
          {isRunning ? 'Pause' : 'Start'}
        </Button>
        
        <Button 
          variant="outline"
          size="sm"
          onClick={resetTimer}
          className="bg-blue-50 hover:bg-blue-100 text-blue-600"
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>
    </div>
  );
};

export default Timer;
