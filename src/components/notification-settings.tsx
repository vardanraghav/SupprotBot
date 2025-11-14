"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

const NotificationSettings = () => {
  return (
    <Card className="bg-transparent border-0 shadow-none">
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>Choose how and when SupportBot reaches out to you. Your peace of mind is the priority.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-lg bg-background/50">
          <div className="space-y-1">
            <Label htmlFor="daily-reminder" className="font-semibold">Daily Mood Reminders</Label>
            <p className="text-sm text-muted-foreground">A gentle nudge to check in with yourself each evening.</p>
          </div>
          <Switch id="daily-reminder" />
        </div>
        <div className="flex items-center justify-between p-4 rounded-lg bg-background/50">
          <div className="space-y-1">
            <Label htmlFor="breathing-reminder" className="font-semibold">Breathing Reminders</Label>
            <p className="text-sm text-muted-foreground">Suggest a breathing exercise during stressful times.</p>
          </div>
          <Switch id="breathing-reminder" />
        </div>
         <div className="flex items-center justify-between p-4 rounded-lg bg-background/50">
          <div className="space-y-1">
            <Label htmlFor="journal-prompts" className="font-semibold">Journal Prompts</Label>
            <p className="text-sm text-muted-foreground">Receive an inspiring prompt at the end of the day.</p>
          </div>
          <Switch id="journal-prompts" />
        </div>
        <div className="flex items-center justify-between p-4 rounded-lg bg-background/50">
          <div className="space-y-1">
            <Label htmlFor="weekly-insights" className="font-semibold">Weekly Insights Summary</Label>
            <p className="text-sm text-muted-foreground">Get your AI-powered weekly summary every Sunday.</p>
          </div>
          <Switch id="weekly-insights" checked />
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
