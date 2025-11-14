"use client";

import React, { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAppState } from '@/lib/app-context';
import { useToast } from "@/hooks/use-toast";
import { getMoodInsights } from '@/ai/flows/mood-insights';
import { suggestTags } from '@/ai/flows/tagging-autobucket';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { BrainCircuit, X, Smile, Meh, Frown } from 'lucide-react';

const MoodEmoji = ({ mood }: { mood: number }) => {
  if (mood > 7) return <Smile className="h-6 w-6 text-green-400" />;
  if (mood > 4) return <Meh className="h-6 w-6 text-yellow-400" />;
  return <Frown className="h-6 w-6 text-red-400" />;
}

const MoodTracker = ({ onSave }: { onSave?: () => void }) => {
  const { moodHistory, addMoodEntry } = useAppState();
  const [mood, setMood] = useState(5);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [notes, setNotes] = useState('');
  const [insights, setInsights] = useState<{ averageMood: number; frequentTriggers: string[]; notableIncidents: string[]; } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  const { toast } = useToast();

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentTag) {
      e.preventDefault();
      if (!tags.includes(currentTag)) {
        setTags([...tags, currentTag]);
      }
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleSuggestTags = async () => {
    if(!notes.trim()){
      toast({variant: "destructive", title: "Notes are empty", description: "Please write some notes to get tag suggestions."});
      return;
    }
    setIsLoading(true);
    try {
      const {tags: suggested} = await suggestTags({text: notes});
      const newTags = [...new Set([...tags, ...suggested])];
      setTags(newTags);
      toast({title: "Tags suggested", description: "We've added some suggestions based on your notes."});
    } catch(e) {
      toast({variant: "destructive", title: "Failed to suggest tags"});
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = () => {
    addMoodEntry({ moodScore: mood, tags, notes });
    toast({
      title: "Mood logged",
      description: "Your mood has been saved for today.",
    });
    setMood(5);
    setTags([]);
    setNotes('');
    if (onSave) onSave();
  };

  const handleGetInsights = async () => {
     if (moodHistory.length === 0) {
      toast({variant: "destructive", title: "No mood history", description: "Log your mood to get weekly insights."});
      return;
    }
    setIsLoading(true);
    setInsights(null);
    try {
      const result = await getMoodInsights({ moodHistory });
      setInsights(result);
      setShowInsights(true);
    } catch (error) {
      console.error("Error getting mood insights:", error);
      toast({variant: "destructive", title: "Failed to get insights"});
    } finally {
      setIsLoading(false);
    }
  };
  
  if (showInsights && insights) {
     return (
       <Card className="glassmorphism border-none shadow-none">
        <CardHeader>
          <CardTitle>Weekly Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
              <p><strong>Average Mood:</strong> {insights.averageMood.toFixed(1)}/10</p>
              <p><strong>Frequent Triggers:</strong> {insights.frequentTriggers.join(', ')}</p>
              <div>
                <strong>Notable Incidents:</strong>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  {insights.notableIncidents.map((note, i) => <li key={i}>{note}</li>)}
                </ul>
              </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => setShowInsights(false)}>Back to Logging</Button>
        </CardFooter>
      </Card>
     )
  }

  return (
    <div className="space-y-6 p-4">
      <Card className="glassmorphism border-none shadow-none">
        <CardHeader>
          <CardTitle>How are you feeling right now?</CardTitle>
          <CardDescription>Log your mood for this moment.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Mood Score: {mood}/10</label>
              <MoodEmoji mood={mood} />
            </div>
            <Slider
              value={[mood]}
              onValueChange={(value) => setMood(value[0])}
              max={10}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tags</label>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary" className="pr-1 text-sm py-1">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="ml-1.5 rounded-full p-0.5 hover:bg-destructive/50">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Input
              placeholder="Type a tag and press Enter"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={handleTagKeyDown}
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (optional)</label>
            <Textarea
              placeholder="Any thoughts to add?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-background/50"
            />
            <Button variant="outline" size="sm" onClick={handleSuggestTags} disabled={isLoading || !notes}>Suggest Tags</Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button onClick={handleSubmit} className="w-full" size="lg">Log Mood</Button>
          <Button variant="ghost" className="w-full" onClick={handleGetInsights} disabled={isLoading}>
            <BrainCircuit className="mr-2 h-4 w-4" />
            {isLoading ? 'Analyzing...' : 'Generate Weekly Insights'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MoodTracker;
