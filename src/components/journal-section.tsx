"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAppState } from '@/lib/app-context';
import { useToast } from "@/hooks/use-toast";
import { summarizeJournal } from '@/ai/flows/journal-summarization';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { BrainCircuit } from 'lucide-react';

const JournalSection = () => {
  const { journalEntries, addJournalEntry } = useAppState();
  const [currentEntry, setCurrentEntry] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSaveEntry = () => {
    if (!currentEntry.trim()) {
      toast({
        variant: "destructive",
        title: "Empty Entry",
        description: "Please write something before saving.",
      });
      return;
    }
    addJournalEntry({ content: currentEntry });
    setCurrentEntry('');
    toast({
      title: "Journal Entry Saved",
      description: "Your thoughts have been recorded.",
    });
  };

  const handleSummarize = async () => {
    if (journalEntries.length === 0) {
      toast({
        variant: "destructive",
        title: "No Entries",
        description: "There are no journal entries to summarize.",
      });
      return;
    }
    setIsLoading(true);
    setSummary('');
    try {
      const combinedEntries = journalEntries.map(e => e.content).join('\n\n');
      const result = await summarizeJournal({ journalEntries: combinedEntries });
      setSummary(result.summary);
    } catch (error) {
      console.error("Error summarizing journal:", error);
      toast({
        variant: "destructive",
        title: "Summarization Failed",
        description: "Could not generate a summary at this time.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <Card>
        <CardHeader>
          <CardTitle>Journal</CardTitle>
          <CardDescription>A private space for your thoughts.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="What's on your mind today?"
              value={currentEntry}
              onChange={(e) => setCurrentEntry(e.target.value)}
              rows={5}
            />
            <Button onClick={handleSaveEntry} className="w-full">Save Entry</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle>Weekly Summary</CardTitle>
          <CardDescription>AI-powered insights from your entries.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          {summary ? (
            <div className="space-y-2 text-sm p-3 bg-secondary/50 rounded-md">
               {summary.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
               ))}
            </div>
          ) : (
            <div className="text-center text-sm text-muted-foreground py-8">
              {isLoading ? "Generating your summary..." : "Click below to generate a summary of your week's entries."}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSummarize} disabled={isLoading} className="w-full">
            <BrainCircuit className="mr-2 h-4 w-4" />
            {isLoading ? 'Thinking...' : 'Summarize My Week'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default JournalSection;
