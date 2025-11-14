"use client";

import * as React from 'react';
import ChatInterface from '@/components/chat-interface';
import { Logo } from '@/components/icons/logo';
import { BottomBar } from '@/components/bottom-bar';
import { AppStateProvider } from '@/lib/app-context';

export default function Home() {
  return (
    <AppStateProvider>
      <div className="flex h-dvh w-full flex-col bg-transparent">
        <header className="flex h-16 shrink-0 items-center justify-between px-4 md:px-6 glassmorphism sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center">
              <Logo className="h-5 w-5 text-primary" />
            </div>
            <h1 className="font-headline text-xl font-semibold text-foreground">
              SupportBot
            </h1>
          </div>
        </header>
        <main className="flex-1 flex flex-col overflow-hidden">
          <ChatInterface />
        </main>
        <footer className="sticky bottom-0 z-10">
          <BottomBar />
        </footer>
      </div>
    </AppStateProvider>
  );
}
