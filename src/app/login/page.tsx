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

      if (user.email === 'admin@supportbot.app') {
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
      
      if (userCredential.user.email === 'admin@supportbot.app') {
        toast({ title: 'Admin Registration Successful', description: 'Welcome, Admin!' });
        router.push('/admin');
      } else {
        toast({ title: 'Registration Successful', description: 'Welcome to SupportBot!' });
        router.push('/');
      }

    } catch (error: any) {
      console.error("Signup error:", error.code, error.message);
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: getFirebaseErrorMessage(error),
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent p-4">
      <Card className="w-full max-w-md glassmorphism">
        <CardHeader className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center mb-4">
                <Logo className="h-7 w-7 text-primary" />
            </div>
          <CardTitle className="text-2xl">{isLoginView ? 'Welcome Back' : 'Create an Account'}</CardTitle>
          <CardDescription>
            {isLoginView ? "Sign in to continue your journey." : "Join us to start your path to wellness."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoginView ? (
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" {...loginForm.register('email')} className="bg-background/50" />
                {loginForm.formState.errors.email && (
                  <p className="text-xs text-destructive">{loginForm.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...loginForm.register('password')} className="bg-background/50"/>
                 {loginForm.formState.errors.password && (
                  <p className="text-xs text-destructive">{loginForm.formState.errors.password.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={loginForm.formState.isSubmitting}>
                {loginForm.formState.isSubmitting ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          ) : (
            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" {...registerForm.register('name')} className="bg-background/50"/>
                 {registerForm.formState.errors.name && (
                  <p className="text-xs text-destructive">{registerForm.formState.errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" {...registerForm.register('email')} className="bg-background/50"/>
                 {registerForm.formState.errors.email && (
                  <p className="text-xs text-destructive">{registerForm.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...registerForm.register('password')} className="bg-background/50"/>
                 {registerForm.formState.errors.password && (
                  <p className="text-xs text-destructive">{registerForm.formState.errors.password.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={registerForm.formState.isSubmitting}>
                 {registerForm.formState.isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          )}
          <div className="mt-4 text-center text-sm">
            {isLoginView ? "Don't have an account? " : 'Already have an account? '}
            <Button variant="link" onClick={() => setIsLoginView(!isLoginView)} className="p-0 h-auto">
              {isLoginView ? 'Sign up' : 'Sign in'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
