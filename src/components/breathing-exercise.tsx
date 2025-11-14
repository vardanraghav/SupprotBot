"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

const BreathingExercise = () => {
  const [phase, setPhase] = useState('Get Ready');
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) {
      setPhase('Get Ready');
      return;
    };

    const phases = ['Breathe In', 'Hold', 'Breathe Out', 'Hold'];
    let currentPhaseIndex = -1;
    
    // Immediately start with "Breathe In"
    currentPhaseIndex = 0;
    setPhase(phases[currentPhaseIndex]);

    const interval = setInterval(() => {
      currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
      setPhase(phases[currentPhaseIndex]);
    }, 4000); // 4 seconds per phase

    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className={cn("w-full h-full flex flex-col items-center justify-center transition-all", isRunning && 'breathing-glow')}>
        <div className="relative flex items-center justify-center w-64 h-64">
          <div className={cn("absolute inset-0 bg-primary/20 rounded-full transition-transform duration-1000", isRunning && "breathing-circle")}></div>
          <div className="relative z-10 text-center">
            <p className="text-4xl font-bold font-headline text-foreground transition-opacity duration-500">
              {phase}
            </p>
            {(phase === 'Breathe In' || phase === 'Breathe Out' || phase === 'Hold') && isRunning && (
              <p className="text-muted-foreground text-lg">(4 seconds)</p>
            )}
          </div>
        </div>
        <p className="mt-8 text-center text-muted-foreground max-w-xs">
          {isRunning ? "Follow the circle and instructions to regulate your breathing." : "A simple 4-4-4 breathing exercise to find your calm."}
        </p>
      </div>
       <Button onClick={() => setIsRunning(!isRunning)} size="lg" className="mt-8 rounded-full w-full max-w-xs">
          {isRunning ? 'Stop Exercise' : 'Begin Exercise'}
        </Button>
    </div>
  );
};

export default BreathingExercise;
