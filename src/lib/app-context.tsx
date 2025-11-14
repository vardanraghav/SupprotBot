"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useUser, useCollection, useDoc } from '@/firebase';
import { doc, setDoc, addDoc, collection, deleteDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

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
  isAdmin: boolean;
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
  
  const { user } = useUser();
  const firestore = useFirestore();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user && user.email === 'raghavvardan123@gmail.com') {
      setIsAdmin(true);
      console.log("Admin logged in");
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  // Firestore-backed state
  const { data: moodHistory = [], setData: setMoodHistory } = useCollection<MoodEntry>(
    user ? collection(firestore, 'users', user.uid, 'moodEntries') : null
  );
  const { data: journalEntries = [], setData: setJournalEntries } = useCollection<JournalEntry>(
    user ? collection(firestore, 'users', user.uid, 'journalEntries') : null
  );
  const { data: emergencyContacts = [], setData: setEmergencyContacts } = useCollection<EmergencyContact>(
    user ? collection(firestore, 'users', user.uid, 'emergencyContacts') : null
  );
  
  const [activePage, setActivePage] = useState<Page>('chat');

  const addMessage = (message: Omit<Message, 'id'>): Message => {
    const newMessage = { ...message, id: Date.now().toString() };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };
  
  const addMoodEntry = (entry: Omit<MoodEntry, 'id' | 'date'>) => {
    if (!user) return;
    const newEntry = { 
      ...entry, 
      date: new Date().toISOString() 
    };
    const collectionRef = collection(firestore, 'users', user.uid, 'moodEntries');
    addDoc(collectionRef, newEntry);
  };

  const addJournalEntry = (entry: Omit<JournalEntry, 'id' | 'date'>) => {
     if (!user) return;
    const newEntry = { 
      ...entry, 
      date: new Date().toISOString() 
    };
    const collectionRef = collection(firestore, 'users', user.uid, 'journalEntries');
    addDoc(collectionRef, newEntry);
  };

  const addEmergencyContact = (contact: Omit<EmergencyContact, 'id'>) => {
    if (!user) return;
    const collectionRef = collection(firestore, 'users', user.uid, 'emergencyContacts');
    addDoc(collectionRef, contact);
  };

  const removeEmergencyContact = (contactId: string) => {
    if (!user) return;
    const docRef = doc(firestore, 'users', user.uid, 'emergencyContacts', contactId);
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
    isAdmin,
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
