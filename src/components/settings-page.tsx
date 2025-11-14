"use client";

import React from 'react';
import EmergencyContacts from './emergency-contacts';
import NotificationSettings from './notification-settings';
import PrivacySettings from './privacy-settings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Bell, Shield } from 'lucide-react';


const SettingsPage = () => {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
         <Tabs defaultValue="contacts" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="contacts"><Users className="h-4 w-4 mr-2"/>Contacts</TabsTrigger>
            <TabsTrigger value="notifications"><Bell className="h-4 w-4 mr-2"/>Notifications</TabsTrigger>
            <TabsTrigger value="privacy"><Shield className="h-4 w-4 mr-2"/>Privacy</TabsTrigger>
          </TabsList>
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
