"use client";

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppState } from '@/lib/app-context';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  relationship: z.string().min(2, "Relationship is required."),
  phone: z.string().regex(/^(\+\d{1,3}[- ]?)?\d{10}$/, "Please enter a valid phone number."),
  email: z.string().email("Please enter a valid email.").optional().or(z.literal('')),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const EmergencyContacts = () => {
  const { emergencyContacts, addEmergencyContact, removeEmergencyContact } = useAppState();
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', relationship: '', phone: '', email: '' },
  });

  const onSubmit: SubmitHandler<ContactFormValues> = (data) => {
     if (emergencyContacts.length >= 3) {
      toast({
        variant: "destructive",
        title: "Limit Reached",
        description: "You can add a maximum of 3 emergency contacts.",
      });
      return;
    }
    addEmergencyContact(data);
    toast({
      title: "Contact Added",
      description: `${data.name} has been added to your emergency contacts.`,
    });
    form.reset();
  };

  return (
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle>Emergency Contacts</CardTitle>
        <CardDescription>Add up to 3 trusted people who can be notified in a crisis. This is a vital part of your safety plan.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Contact Name</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Jane Doe" {...field} className="bg-background/50" />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="relationship"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Relationship</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Mother, Friend" {...field} className="bg-background/50" />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Phone / WhatsApp</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., +919876543210" {...field} className="bg-background/50" />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email (Optional)</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., jane.doe@example.com" {...field} className="bg-background/50" />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <Button type="submit" disabled={emergencyContacts.length >= 3}>Add Contact</Button>
          </form>
        </Form>
        
        <div className="space-y-4">
            <h4 className="font-medium">Your Contacts</h4>
            {emergencyContacts.length > 0 ? (
                <ul className="space-y-3">
                    {emergencyContacts.map(contact => (
                        <li key={contact.id} className="flex items-center justify-between p-3 rounded-md bg-secondary/50">
                           <div>
                             <p className="font-semibold">{contact.name} <span className="text-xs text-muted-foreground ml-2">({contact.relationship})</span></p>
                             <p className="text-sm text-muted-foreground">{contact.phone}{contact.email && `, ${contact.email}`}</p>
                           </div>
                           <Button variant="ghost" size="icon" onClick={() => removeEmergencyContact(contact.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                           </Button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-muted-foreground text-center py-4">You haven't added any emergency contacts yet.</p>
            )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyContacts;
