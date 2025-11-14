"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useFirebaseApp } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/icons/logo';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

const getFirebaseErrorMessage = (error: any) => {
    if (error && error.code) {
        switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/invalid-credential':
                return 'No account found with this email or password.';
            case 'auth/wrong-password':
                return 'Incorrect password. Please try again.';
            case 'auth/email-already-in-use':
                return 'This email is already registered. Please log in.';
            case 'auth/weak-password':
                return 'The password is too weak. Please use at least 6 characters.';
            case 'auth/invalid-email':
                return 'Please enter a valid email address.';
            default:
                return error.message;
        }
    }
    return 'An unknown error occurred.';
}

const LoginPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const { toast } = useToast();
  const app = useFirebaseApp();
  const auth = getAuth(app);
  const router = useRouter();

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  const onLoginSubmit = async (data: LoginValues) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      if (user.email === 'admin@supportbot.app' && data.password === '7983977176') {
        toast({ title: 'Admin Login Successful', description: 'Welcome, Admin!' });
        router.push('/admin');
      } else {
        toast({ title: 'Login Successful', description: 'Welcome back!' });
        router.push('/');
      }

    } catch (error: any) {
      console.error("Login error:", error.code, error.message);
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: getFirebaseErrorMessage(error),
      });
    }
  };

  const onRegisterSubmit = async (data: RegisterValues) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await updateProfile(userCredential.user, { displayName: data.name });
      
      toast({ title: 'Registration Successful', description: 'Welcome to SupportBot!' });
      router.push('/');

    } catch (error: any