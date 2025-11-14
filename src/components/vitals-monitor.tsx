"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Heart, Activity, Wind, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from './ui/alert-dialog';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAppState } from '@/lib/app-context';
import { Progress } from './ui/progress';

// Simulation thresholds
const HR_PANIC_THRESHOLD = 130;
const SPO2_LOW_THRESHOLD = 92;

export function VitalsMonitor() {
  const [vitals, setVitals] = useState({
    heartRate: 75,
    bloodPressure: { systolic: 120, diastolic: 80 },
    spo2: 98,
  });
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertReason, setAlertReason] = useState('');
  const [countdown, setCountdown] = useState(10);
  const countdownRef = useRef<NodeJS.Timeout>();

  const { toast } = useToast();
  const { emergencyContacts } = useAppState();

  const stopCountdown = () => {
    if (countdownRef.current) {
        clearInterval(countdownRef.current);
    }
  }

  const handleOkay = () => {
    setAlertOpen(false);
    stopCountdown();
  };

  const triggerSOS = () => {
    console.log("SOS TRIGGERED");
    stopCountdown();
    setAlertOpen(false);

    if (emergencyContacts.length === 0) {
      toast({
        variant: 'destructive',
        title: "SOS Failed: No Contacts",
        description: "Please add emergency contacts in settings to use the SOS feature.",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationString = `Live location: https://www.google.com/maps?q=${latitude},${longitude}`;
        toast({
          variant: 'destructive',
          title: "SOS ALERT TRIGGERED",
          description: `Notifying emergency contacts. ${locationString}`,
          duration: 10000,
        });
      },
      () => {
        toast({
          variant: 'destructive',
          title: "SOS ALERT TRIGGERED",
          description: "Notifying emergency contacts. (Location permission denied)",
          duration: 10000,
        });
      }
    );
  };
  
  const startCountdown = () => {
    setCountdown(10);
    countdownRef.current = setInterval(() => {
        setCountdown(prev => {
            if(prev <= 1) {
                clearInterval(countdownRef.current as NodeJS.Timeout);
                triggerSOS();
                return 0;
            }
            return prev - 1;
        });
    }, 1000);
  }

  const triggerAlert = (reason: string) => {
    if (alertOpen) return;
    setAlertReason(reason);
    setAlertOpen(true);
    startCountdown();
  };

  useEffect(() => {
    const simulateVitals = () => {
      setVitals(prev => {
        const newHr = prev.heartRate + (Math.random() - 0.5) * 4;
        const newSpo2 = prev.spo2 + (Math.random() - 0.45) * 0.5;
        
        // Occasionally trigger an alert for demonstration
        if (Math.random() < 0.02) {
            triggerAlert("High heart rate detected (panic attack risk).");
            return { ...prev, heartRate: HR_PANIC_THRESHOLD + 10 };
        }
        if (Math.random() < 0.01) {
             triggerAlert("Low SpO2 detected (faint / collapse risk).");
            return { ...prev, spo2: SPO2_LOW_THRESHOLD - 5 };
        }

        return {
          heartRate: Math.max(50, Math.min(160, newHr)),
          spo2: Math.max(88, Math.min(100, newSpo2)),
          bloodPressure: {
            systolic: Math.round(115 + (Math.random() - 0.5) * 10),
            diastolic: Math.round(75 + (Math.random() - 0.5) * 10),
          },
        };
      });
    };

    const intervalId = setInterval(simulateVitals, 2000);

    return () => {
        clearInterval(intervalId);
        if(countdownRef.current) clearInterval(countdownRef.current);
    }
  }, [alertOpen]);

  return (
    <>
      <Card className="w-[280px] glassmorphism">
        <CardHeader className="p-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <span>Live Vitals</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span>Heart Rate</span>
            </div>
            <span className={cn(vitals.heartRate > HR_PANIC_THRESHOLD && "text-destructive font-bold")}>
              {Math.round(vitals.heartRate)} bpm
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              <span>SpO₂</span>
            </div>
            <span className={cn(vitals.spo2 < SPO2_LOW_THRESHOLD && "text-destructive font-bold")}>
                {vitals.spo2.toFixed(1)} %
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-gray-500" />
              <span>Blood Pressure</span>
            </div>
            <span>{vitals.bloodPressure.systolic}/{vitals.bloodPressure.diastolic}</span>
          </div>
        </CardContent>
      </Card>
      
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you okay?</AlertDialogTitle>
            <AlertDialogDescription>
              We noticed something unusual in your vitals: <span className="font-semibold">{alertReason}</span>
              <br/>
              Please respond. An SOS will be sent if there is no response.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
             <Progress value={countdown * 10} className="h-2" />
             <p className="text-center text-sm text-muted-foreground">Triggering SOS in {countdown} seconds...</p>
          </div>
          <AlertDialogFooter>
            <Button variant="destructive" onClick={triggerSOS}>I Need Help</Button>
            <Button variant="secondary" onClick={handleOkay}>I'm Okay</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
