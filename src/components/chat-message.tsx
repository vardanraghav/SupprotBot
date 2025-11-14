"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ThumbsDown, ThumbsUp, BrainCircuit } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useAppState, Message } from '@/lib/app-context';
import { Logo } from '@/components/icons/logo';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";


interface ChatMessageProps {
  message?: Message;
  isLoading?: boolean;
}

const ChatMessage = ({ message, isLoading = false }: ChatMessageProps) => {
  const { setFeedback } = useAppState();

  if (isLoading) {
    return (
      <div className="flex items-start gap-3">
        <Avatar className="h-9 w-9 border-2 border-primary/50">
            <div className="bg-primary/20 flex items-center justify-center h-full w-full">
              <Logo className="h-5 w-5 text-primary" />
            </div>
          </Avatar>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-5 w-48" />
        </div>
      </div>
    );
  }

  if (!message) return null;

  const isUser = message.role === 'user';

  const handleFeedback = (isHelpful: boolean) => {
    setFeedback(message.id, isHelpful);
  };

  return (
    <div className={cn('flex items-start gap-3 w-full', isUser && 'justify-end')}>
      {!isUser && (
        <Avatar className="h-9 w-9 border-2 border-primary/50">
           <div className="bg-primary/20 flex items-center justify-center h-full w-full">
              <Logo className="h-5 w-5 text-primary" />
            </div>
          <AvatarFallback>SB</AvatarFallback>
        </Avatar>
      )}

      <div className={cn("max-w-[72%] flex flex-col gap-1", isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'rounded-2xl p-3 px-4 text-foreground/90',
            isUser ? 'bg-primary text-primary-foreground rounded-br-md' : 'bg-card rounded-bl-md'
          )}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>

        {!isUser && message.rationale && (
           <Collapsible className="w-full">
            <CollapsibleTrigger asChild>
               <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-2 h-auto py-1 px-2">
                <BrainCircuit className="h-3 w-3" />
                Why this response?
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <p className="text-xs text-muted-foreground p-2 bg-card rounded-md mt-1">
                <strong>Rationale:</strong> {message.rationale}
              </p>
            </CollapsibleContent>
          </Collapsible>
        )}

        {!isUser && message.role === 'assistant' && (
          <div className="mt-1 flex items-center gap-2">
            {message.isHelpful === undefined ? (
              <>
                <p className="text-xs text-muted-foreground">Was this helpful?</p>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleFeedback(true)}>
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleFeedback(false)}>
                  <ThumbsDown className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <p className="text-xs text-muted-foreground italic">Thanks for your feedback!</p>
            )}
          </div>
        )}
      </div>

       {isUser && (
        <Avatar className="h-9 w-9">
          <AvatarFallback>You</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
