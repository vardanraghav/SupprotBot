"use client";

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Coffee, Wind, Sun } from 'lucide-react';
import { useAppState } from '@/lib/app-context';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { cn } from '@/lib/utils';

const actions = [
    { text: "Take a 5 min break", icon: Coffee },
    { text: "Stretch your back", icon: Sun },
    { text: "Try a breathing exercise", icon: Wind },
];

export function GuidedAction() {
    const [action, setAction] = useState<any | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const { moodHistory } = useAppState();

    useEffect(() => {
        // Only show if mood is low, and randomly
        const lastMood = moodHistory.length > 0 ? moodHistory[moodHistory.length-1].moodScore : null;
        if (lastMood !== null && lastMood < 5 && Math.random() > 0.6) {
             const randomAction = actions[Math.floor(Math.random() * actions.length)];
             setAction(randomAction);
             setIsVisible(true);
        }
    }, [moodHistory]);

    if (!isVisible || !action) return null;

    return (
        <Card className={cn(
            "w-[280px] glassmorphism animate-in fade-in-0 slide-in-from-top-4 duration-500",
            !isVisible && "animate-out fade-out-0 slide-out-to-top-4"
        )}>
            <CardHeader className="p-4">
                <CardTitle className="text-base flex items-center gap-2">
                    <action.icon className="h-5 w-5 text-primary" />
                    <span>Quick Suggestion</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <p className="text-sm">How about we: {action.text}?</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex gap-2">
                <Button className="flex-1" size="sm" onClick={() => setIsVisible(false)}>Got it</Button>
                <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)}>Later</Button>
            </CardFooter>
        </Card>
    );
}
