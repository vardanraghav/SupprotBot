"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  rationale?: string;
  isHelpful?: boolean;
}

export interface MoodEntry {
  id: string;
  date: string;
  moodScore: number;
  tags?: string[];
  notes?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
}

// Context State
interface AppState {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  moodHistory: MoodEntry[];
  setMoodHistory: React.Dispatch<React.SetStateAction<MoodEntry[]>>;
  journalEntries: JournalEntry[];
  setJournalEntries: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
  addMessage: (message: Omit<Message, 'id'>) => Message;
  addMoodEntry: (entry: Omit<MoodEntry, 'id' | 'date'>) => void;
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'date'>) => void;
  setFeedback: (messageId: string, isHelpful: boolean) => void;
}

// Create Context
const AppContext = createContext<AppState | undefined>(undefined);

// Provider Component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: "Hello, I'm SupportBot. I'm here to listen and offer a safe space. How are you feeling today?",
    }
  ]);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  const addMessage = (message: Omit<Message, 'id'>): Message => {
    const newMessage = { ...message, id: Date.now().toString() };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };
  
  const addMoodEntry = (entry: Omit<MoodEntry, 'id' | 'date'>) => {
    const newEntry = { 
      ...entry, 
      id: Date.now().toString(), 
      date: new Date().toISOString() 
    };
    setMoodHistory(prev => [...prev, newEntry]);
  };

  const addJournalEntry = (entry: Omit<JournalEntry, 'id' | 'date'>) => {
    const newEntry = { 
      ...entry, 
      id: Date.now().toString(), 
      date: new Date().toISOString() 
    };
    setJournalEntries(prev => [...prev, newEntry]);
  };
  
  const setFeedback = (messageId: string, isHelpful: boolean) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isHelpful } : msg
    ));
  };

  const value = {
    messages,
    setMessages,
    moodHistory,
    setMoodHistory,
    journalEntries,
    setJournalEntries,
    addMessage,
    addMoodEntry,
    addJournalEntry,
    setFeedback
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Hook to use context
export const useAppState = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
};
