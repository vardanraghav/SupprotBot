"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, SendHoriz, Mic, CornerDownLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAppState, Message } from '@/lib/app-context';
import { empatheticConversation } from '@/ai/flows/empathetic-conversation';
import crisisKeywords from '@/lib/crisis_keywords.json';
import ChatMessage from './chat-message';
import { ScrollArea } from './ui/scroll-area';
import { useToast } from "@/hooks/use-toast";

const CrisisMessage = () => (
    <div className="rounded-lg border-2 border-destructive bg-destructive/10 p-4 text-destructive-foreground">
      <h3 className="font-bold">It sounds like you're going through a lot.</h3>
      <p className="text-sm mt-2">
        If you are in immediate distress, please reach out for help. You are not alone.
      </p>
      <div className="mt-4 text-sm">
        <p><strong>Emergency Helpline (India):</strong> 988</p>
        <p><strong>Global Crisis Text Line:</strong> Text "HOME" to 741741</p>
      </div>
      <p className="text-xs mt-3">
        I am an AI and not equipped to handle a crisis, but these resources can help.
      </p>
    </div>
  );


const ChatInterface = () => {
  const { messages, addMessage, moodHistory, setMessages } = useAppState();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const checkForCrisis = (text: string): boolean => {
    const lowercasedText = text.toLowerCase();
    return crisisKeywords.keywords.some(keyword => lowercasedText.includes(keyword.term));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    addMessage({ role: 'user', content: input });
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    if (checkForCrisis(currentInput)) {
      setTimeout(() => {
        setMessages(prev => [...prev, {id: Date.now().toString(), role: 'system', content: ''}]);
        setIsLoading(false);
      }, 1000);
      return;
    }

    try {
      const lastMood = moodHistory.length > 0 ? moodHistory[moodHistory.length - 1] : undefined;
      
      const aiResponse = await empatheticConversation({
        userInput: currentInput,
        moodScore: lastMood?.moodScore,
        moodTags: lastMood?.tags,
        moodNotes: lastMood?.notes,
      });

      addMessage({
        role: 'assistant',
        content: aiResponse.response,
        rationale: aiResponse.rationale,
      });

    } catch (error) {
      console.error("Error getting AI response:", error);
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: "There was a problem communicating with the AI. Please try again.",
      })
      addMessage({
        role: 'assistant',
        content: "I'm having a little trouble connecting right now. Please give me a moment and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 -mx-4" ref={scrollAreaRef}>
        <div className="px-4 space-y-6 pb-4">
          {messages.map((msg, index) =>
            msg.role === 'system' ? (
              <CrisisMessage key={index} />
            ) : (
              <ChatMessage key={msg.id} message={msg} />
            )
          )}
          {isLoading && <ChatMessage isLoading />}
        </div>
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="relative mt-4">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Share what's on your mind..."
          className="w-full resize-none pr-24 pl-10 py-3 text-base"
          rows={1}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
            <Button variant="ghost" size="icon" type="button">
                <Paperclip className="h-5 w-5 text-muted-foreground" />
            </Button>
        </div>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <SendHoriz className="h-5 w-5" />
          </Button>
        </div>
      </form>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        SupportBot is an AI and may make mistakes. It is not a replacement for a therapist. In a crisis, please seek professional help.
      </p>
    </div>
  );
};

export default ChatInterface;
