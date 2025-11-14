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

export interface EmergencyContact {
    id: string;
    name: string;
    relationship: string;
    phone: string;
    email?: string;
}

type Page = 'chat' | 'settings';

// Context State
interface AppState {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  moodHistory: MoodEntry[];
  setMoodHistory: React.Dispatch<React.SetStateAction<MoodEntry[]>>;
  journalEntries: JournalEntry[];
  setJournalEntries: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
  emergencyContacts: EmergencyContact[];
  setEmergencyContacts: React.Dispatch<React.SetStateAction<EmergencyContact[]>>;
  activePage: Page;
  setActivePage: React.Dispatch<React.SetStateAction<Page>>;
  addMessage: (message: Omit<Message, 'id'>) => Message;
  addMoodEntry: (entry: Omit<MoodEntry, 'id' | 'date'>) => void;
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'date'>) => void;
  setFeedback: (messageId: string, isHelpful: boolean) => void;
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  removeEmergencyContact: (contactId: string) => void;
}

// Create Context
const AppContext = createContext<AppState | undefined>(undefined);

// Provider Component
export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: "I'm SupportBot, and I'm here with you. It's a safe space to share what's on your mind. How are you feeling today?",
    }
  ]);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [activePage, setActivePage] = useState<Page>('chat');

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

  const addEmergencyContact = (contact: Omit<EmergencyContact, 'id'>) => {
    const newContact = { ...contact, id: Date.now().toString() };
    setEmergencyContacts(prev => [...prev, newContact]);
  };

  const removeEmergencyContact = (contactId: string) => {
    setEmergencyContacts(prev => prev.filter(c => c.id !== contactId));
  }
  
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
    emergencyContacts,
    setEmergencyContacts,
    activePage,
    setActivePage,
    addMessage,
    addMoodEntry,
    addJournalEntry,
    setFeedback,
    addEmergencyContact,
    removeEmergencyContact
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};


// Main App Provider Wrapper
export const AppProvider = ({ children }: { children: ReactNode }) => {
    return (
        <AppStateProvider>
            {children}
        </AppStateProvider>
    )
}


// Hook to use context
export const useAppState = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
};
