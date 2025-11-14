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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

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
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onLoginSubmit = async (data: LoginValues) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      if (user.email === 'raghavvardan123@gmail.com' && data.password === '7983977176') {
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

    } catch (error: any) {
        console.error("Registration error:", error.code, error.message);
        toast({
            variant: 'destructive',
            title: 'Registration Failed',
            description: getFirebaseErrorMessage(error),
        });
    }
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-transparent p-4">
       <div className="absolute top-8 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center">
                <Logo className="h-5 w-5 text-primary" />
            </div>
            <h1 className="font-headline text-xl font-semibold text-foreground">
                SupportBot
            </h1>
        </div>
      <Card className="w-full max-w-md glassmorphism">
        <CardHeader>
          <CardTitle>{isLoginView ? 'Welcome Back' : 'Create an Account'}</CardTitle>
          <CardDescription>
            {isLoginView ? 'Log in to continue your wellness journey.' : 'Join us to start your path to wellness.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoginView ? (
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="admin@supportbot.app" {...field} className="bg-background/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} className="bg-background/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Log In</Button>
              </form>
            </Form>
          ) : (
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                <FormField
                  control={registerForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Name" {...field} className="bg-background/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" {...field} className="bg-background/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} className="bg-background/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Create Account</Button>
              </form>
            </Form>
          )}
          <div className="mt-4 text-center text-sm">
            {isLoginView ? "Don't have an account? " : "Already have an account? "}
            <Button variant="link" onClick={() => setIsLoginView(!isLoginView)} className="p-0 h-auto">
              {isLoginView ? 'Sign up' : 'Log in'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
