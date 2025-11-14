"use client";

import React from 'react';
import EmergencyContacts from './emergency-contacts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

const SettingsPage = () => {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        <EmergencyContacts />
        <Card className="bg-transparent border-0 shadow-none">
            <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage how you receive alerts.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">Notification settings coming soon.</p>
            </CardContent>
        </Card>
         <Card className="bg-transparent border-0 shadow-none">
            <CardHeader>
                <CardTitle>Privacy</CardTitle>
                <CardDescription>Control your data and privacy.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">Privacy settings coming soon.</p>
            </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default SettingsPage;
