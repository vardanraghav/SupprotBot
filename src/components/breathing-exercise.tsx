"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const BreathingExercise = () => {
  const [phase, setPhase] = useState('Get Ready');
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning) return;

    const phases = ['Breathe In', 'Hold', 'Breathe Out', 'Hold'];
    let currentPhaseIndex = 0;

    const interval = setInterval(() => {
      currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
      setPhase(phases[currentPhaseIndex]);
    }, 4000); // 4 seconds per phase

    // Start with "Breathe In"
    setPhase('Breathe In');

    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className={cn("w-full h-full flex flex-col items-center justify-center", isRunning && 'breathing-glow')}>
      <div className="relative flex items-center justify-center w-64 h-64">
        <div className="absolute inset-0 bg-primary/20 rounded-full breathing-circle"></div>
        <div className="relative z-10 text-center">
          <p className="text-3xl font-bold font-headline text-foreground transition-opacity duration-500">
            {phase}
          </p>
          {(phase === 'Breathe In' || phase === 'Breathe Out') && (
            <p className="text-muted-foreground">(4 seconds)</p>
          )}
        </div>
      </div>
       <p className="mt-8 text-center text-muted-foreground">
        Follow the circle and instructions to regulate your breathing.
      </p>
    </div>
  );
};

export default BreathingExercise;
