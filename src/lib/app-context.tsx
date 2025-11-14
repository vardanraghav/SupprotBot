
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { doc, setDoc, addDoc, collection, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

// A temporary, anonymous user ID for the session
const TEMP_USER_ID = 'local-user';

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
  sosEnabled: boolean;
  setSosEnabled: React.Dispatch<React.SetStateAction<boolean>>;
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
  
  const [sosEnabled, setSosEnabled] = useState(true);
  const firestore = useFirestore();

  const moodCollectionRef = collection(firestore, 'users', TEMP_USER_ID, 'moodEntries');
  const journalCollectionRef = collection(firestore, 'users', TEMP_USER_ID, 'journalEntries');
  const contactsCollectionRef = collection(firestore, 'users', TEMP_USER_ID, 'emergencyContacts');

  const { data: moodHistory = [], setData: setMoodHistory } = useCollection<MoodEntry>(moodCollectionRef);
  const { data: journalEntries = [], setData: setJournalEntries } = useCollection<JournalEntry>(journalCollectionRef);
  const { data: emergencyContacts = [], setData: setEmergencyContacts } = useCollection<EmergencyContact>(contactsCollectionRef);
  
  const [activePage, setActivePage] = useState<Page>('chat');

  const addMessage = (message: Omit<Message, 'id'>): Message => {
    const newMessage = { ...message, id: Date.now().toString() };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };
  
  const addMoodEntry = (entry: Omit<MoodEntry, 'id' | 'date'>) => {
    const newEntry = { 
      ...entry, 
      date: new Date().toISOString() 
    };
    addDoc(moodCollectionRef, newEntry);
  };

  const addJournalEntry = (entry: Omit<JournalEntry, 'id' | 'date'>) => {
    const newEntry = { 
      ...entry, 
      date: new Date().toISOString() 
    };
    addDoc(journalCollectionRef, newEntry);
  };

  const addEmergencyContact = (contact: Omit<EmergencyContact, 'id'>) => {
    addDoc(contactsCollectionRef, contact);
  };

  const removeEmergencyContact = (contactId: string) => {
    const docRef = doc(firestore, 'users', TEMP_USER_ID, 'emergencyContacts', contactId);
    deleteDoc(docRef);
  }
  
  const setFeedback = (messageId: string, isHelpful: boolean) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isHelpful } : msg
    ));
  };
  
  const value: AppState = {
    messages,
    setMessages,
    moodHistory: moodHistory as MoodEntry[],
    setMoodHistory: setMoodHistory as React.Dispatch<React.SetStateAction<MoodEntry[]>>,
    journalEntries: journalEntries as JournalEntry[],
    setJournalEntries: setJournalEntries as React.Dispatch<React.SetStateAction<JournalEntry[]>>,
    emergencyContacts: emergencyContacts as EmergencyContact[],
    setEmergencyContacts: setEmergencyContacts as React.Dispatch<React.SetStateAction<EmergencyContact[]>>,
    activePage,
    setActivePage,
    sosEnabled,
    setSosEnabled,
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
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Render children only on the client-side to avoid hydration errors
    // with Firestore data fetching.
    if (!isClient) {
      return null;
    }

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
