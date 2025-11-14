"use client";

import * as React from 'react';
import ChatInterface from '@/components/chat-interface';
import { Logo } from '@/components/icons/logo';
import { BottomBar } from '@/components/bottom-bar';
import { AppStateProvider, useAppState } from '@/lib/app-context';
import { cn } from '@/lib/utils';
import { AudioPlayer } from '@/components/audio-player';
import { GuidedAction } from '@/components/guided-action';
import { ResourcesDialog } from '@/components/resources-dialog';

function PageContent() {
  const { moodHistory } = useAppState();
  
  const getMoodTheme = () => {
    if (moodHistory.length === 0) return 'theme-neutral';
    const latestMood = moodHistory[moodHistory.length - 1].moodScore;
    if (latestMood >= 7) return 'theme-happy';
    if (latestMood >= 4) return 'theme-neutral';
    return 'theme-low';
  }

  return (
    <div className={cn("flex h-dvh w-full flex-col bg-transparent transition-colors duration-1000", getMoodTheme())}>
      <header className="flex h-16 shrink-0 items-center justify-between px-4 md:px-6 glassmorphism sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center">
            <Logo className="h-5 w-5 text-primary" />
          </div>
          <h1 className="font-headline text-xl font-semibold text-foreground">
            SupportBot
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <AudioPlayer />
          <ResourcesDialog />
        </div>
      </header>
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute top-4 right-4 z-10">
          <GuidedAction />
        </div>
        <ChatInterface />
      </main>
      <footer className="sticky bottom-0 z-10">
        <BottomBar />
      </footer>
    </div>
  )
}


export default function Home() {
  return (
    <AppStateProvider>
      <PageContent />
    </AppStateProvider>
  );
}
