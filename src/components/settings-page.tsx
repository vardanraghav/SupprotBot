
"use client";

import React from 'react';
import EmergencyContacts from './emergency-contacts';
import NotificationSettings from './notification-settings';
import PrivacySettings from './privacy-settings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Bell, Shield, User } from 'lucide-react';
import { useAppState } from '@/lib/app-context';
import { Input } from './ui/input';
import { Label } from './ui/label';

const ProfileSettings = () => {
  return (
     <Card className="bg-transparent border-0 shadow-none">
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
        <CardDescription>This is a public app. No personal user data is stored.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
         <div className="flex items-center space-x-4">
            <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Anonymous User" className="bg-background/50" disabled />
            </div>
         </div>
      </CardContent>
    </Card>
  )
}


const SettingsPage = () => {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
         <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile"><User className="h-4 w-4 mr-2"/>Profile</TabsTrigger>
            <TabsTrigger value="contacts"><Users className="h-4 w-4 mr-2"/>Contacts</TabsTrigger>
            <TabsTrigger value="notifications"><Bell className="h-4 w-4 mr-2"/>Notifications</TabsTrigger>
            <TabsTrigger value="privacy"><Shield className="h-4 w-4 mr-2"/>Privacy</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <ProfileSettings />
          </TabsContent>
          <TabsContent value="contacts">
            <EmergencyContacts />
          </TabsContent>
          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>
          <TabsContent value="privacy">
            <PrivacySettings />
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
};

export default SettingsPage;
