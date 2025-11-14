"use client";

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { useAppState } from '@/lib/app-context';

const PrivacySettings = () => {
  const { sosEnabled, setSosEnabled } = useAppState();

  return (
    <Card className="bg-transparent border-0 shadow-none">
      <CardHeader>
        <CardTitle>Privacy & Security</CardTitle>
        <CardDescription>Your privacy, your control. SupportBot is designed to be a private space where you can feel safe.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 rounded-lg border-2 border-dashed bg-background/50">
            <h4 className="font-semibold">Our Privacy Promise</h4>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-muted-foreground">
                <li><span className="font-medium text-foreground">Zero Judgment:</span> Your data is never used for external purposes.</li>
                <li><span className="font-medium text-foreground">Complete Control:</span> You can delete all your data at any time.</li>
                <li><span className="font-medium text-foreground">Consent-First:</span> Emergency features are only enabled with your permission.</li>
                <li><span className="font-medium text-foreground">No Chat Sharing:</span> We never share conversation content.</li>
            </ul>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg bg-background/50">
          <div className="space-y-1">
            <Label htmlFor="sos-consent" className="font-semibold">Enable 4-in-1 SOS System</Label>
            <p className="text-sm text-muted-foreground">Allow SupportBot to monitor vitals and notify contacts in a crisis.</p>
          </div>
          <Switch id="sos-consent" checked={sosEnabled} onCheckedChange={setSosEnabled} />
        </div>
        
        <div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">Delete My Data</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all your
                    mood history, journal entries, and other personal data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <p className="text-xs text-muted-foreground mt-2 text-center">This will not delete your emergency contacts.</p>
        </div>

      </CardContent>
    </Card>
  );
};

export default PrivacySettings;
