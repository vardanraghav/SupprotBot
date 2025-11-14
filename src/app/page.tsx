"use client";

import * as React from 'react';
import ChatInterface from '@/components/chat-interface';
import { Logo } from '@/components/icons/logo';
import { BottomBar } from '@/components/bottom-bar';
import { AppStateProvider, useAppState } from '@/lib/app-context';
import { AudioPlayer } from '@/components/audio-player';
import { GuidedAction } from '@/components/guided-action';
import { ResourcesDialog } from '@/components/resources-dialog';
import SettingsPage from '@/components/settings-page';

function PageContent() {
  const { moodHistory, activePage } = useAppState();

  React.useEffect(() => {
    const getMoodTheme = () => {
      if (moodHistory.length === 0) return 'theme-default';
      const latestMood = moodHistory[moodHistory.length - 1].moodScore;
      if (latestMood >= 8) return 'theme-happy';
      if (latestMood >= 6) return 'theme-neutral';
      if (latestMood >= 4) return 'theme-low';
      return 'theme-sad';
    };
    
    document.body.className = `font-body antialiased ${getMoodTheme()}`;
  }, [moodHistory]);

  return (
    <div className="flex h-dvh w-full flex-col bg-transparent">
      <header className="flex h-16 shrink-0 items-center justify-between px-4 md:px-6 glassmorphism sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center">
            <Logo className="h-5 w-5 text-primary" />
          </div>
          <h1 className="font-headline text-xl font-semibold text-foreground">
            {activePage === 'chat' ? 'SupportBot' : 'Settings'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {activePage === 'chat' && <AudioPlayer />}
          <ResourcesDialog />
        </div>
      </header>
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {activePage === 'chat' ? (
          <>
            <div className="absolute top-4 right-4 z-10">
              <GuidedAction />
            </div>
            <ChatInterface />
          </>
        ) : (
          <SettingsPage />
        )}
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
