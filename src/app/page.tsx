"use client"

import * as React from 'react';
import { Bot, Maximize, Mic, Settings, Sun, Moon } from 'lucide-react';
import ChatInterface from '@/components/chat-interface';
import BreathingExercise from '@/components/breathing-exercise';
import MoodTracker from '@/components/mood-tracker';
import JournalSection from '@/components/journal-section';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResourcesDialog } from '@/components/resources-dialog';
import { Logo } from '@/components/icons/logo';

export default function Home() {
  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <header className="flex h-16 items-center justify-between border-b px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="font-headline text-xl font-semibold text-foreground">
            SupportBot
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <ResourcesDialog />
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col md:flex-row overflow-hidden">
        <div className="flex-1 flex flex-col p-4 md:p-6">
          <ChatInterface />
        </div>
        <Separator orientation="vertical" className="hidden md:flex" />
        <aside className="w-full md:w-[380px] lg:w-[420px] border-t md:border-l p-4 md:p-0 overflow-y-auto">
            <Tabs defaultValue="mood" className="w-full h-full flex flex-col">
              <div className="px-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="mood">Mood</TabsTrigger>
                  <TabsTrigger value="journal">Journal</TabsTrigger>
                  <TabsTrigger value="breathing">Breathe</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="mood" className="flex-1 overflow-y-auto px-4 py-4">
                <MoodTracker />
              </TabsContent>
              <TabsContent value="journal" className="flex-1 overflow-y-auto px-4 py-4">
                <JournalSection />
              </TabsContent>
              <TabsContent value="breathing" className="flex-1 flex items-center justify-center p-4">
                <BreathingExercise />
              </TabsContent>
            </Tabs>
        </aside>
      </main>
    </div>
  );
}
