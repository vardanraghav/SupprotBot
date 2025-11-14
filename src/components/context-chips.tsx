"use client";

import React from 'react';
import { Button } from './ui/button';
import { Zap, Moon, Brain, Leaf, MessageSquare, BookOpen } from 'lucide-react';

const chips = [
  { text: "Feeling down", icon: Moon },
  { text: "Anxiety", icon: Zap },
  { text: "Motivation", icon: Brain },
  { text: "Breathing", icon: Leaf },
  { text: "Write Journal", icon: BookOpen },
];

interface ContextChipsProps {
  onChipClick: (text: string) => void;
}

export const ContextChips: React.FC<ContextChipsProps> = ({ onChipClick }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
      {chips.map((chip, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          className="rounded-full bg-background/50 backdrop-blur-sm whitespace-nowrap"
          onClick={() => onChipClick(chip.text)}
        >
          <chip.icon className="h-4 w-4 mr-2" />
          {chip.text}
        </Button>
      ))}
    </div>
  );
};
