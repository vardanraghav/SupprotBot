"use client";

import * as React from 'react';
import { Smile, Book, Wind } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import MoodTracker from './mood-tracker';
import JournalSection from './journal-section';
import BreathingExercise from './breathing-exercise';
import { cn } from '@/lib/utils';

export function BottomBar() {
  const [activeSheet, setActiveSheet] = React.useState<string | null>(null);

  const tools = [
    { id: 'mood', icon: Smile, label: 'Mood', content: <MoodTracker onSave={() => setActiveSheet(null)} /> },
    { id: 'journal', icon: Book, label: 'Journal', content: <JournalSection /> },
    { id: 'breathe', icon: Wind, label: 'Breathe', content: <BreathingExercise /> },
  ];

  return (
    <div className="glassmorphism rounded-t-lg border-t">
      <div className="flex justify-around items-center p-2">
        {tools.map((tool) => (
          <Sheet key={tool.id} open={activeSheet === tool.id} onOpenChange={(isOpen) => setActiveSheet(isOpen ? tool.id : null)}>
            <SheetTrigger asChild>
              <Button variant="ghost" className={cn(
                "flex-col h-auto p-2 rounded-lg",
                activeSheet === tool.id && 'bg-primary/20 text-primary'
              )}>
                <tool.icon className="h-6 w-6 mb-1" />
                <span className="text-xs">{tool.label}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-full max-h-[90dvh] glassmorphism p-0">
              <SheetHeader className="p-4 border-b">
                 <SheetTitle className="text-center">{tool.label}</SheetTitle>
              </SheetHeader>
              {tool.content}
            </SheetContent>
          </Sheet>
        ))}
      </div>
    </div>
  );
}
