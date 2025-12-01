'use client';

import { useState, useEffect } from 'react';
import { useUiStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function LoginPage() {
    const { login, signup, isLoggingIn, isSigningUp, error, isAuthenticated } = useAuthStore();
    const { setCurrentView } = useUiStore();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            setCurrentView('projectList');
        }
    }, [isAuthenticated, setCurrentView]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        await login(email);
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !name) return;

        const success = await signup(email, name);
        if (success) {
            setIsLogin(true);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-muted/30 relative">
            <Button
                variant="ghost"
                className="absolute top-4 left-4 gap-2"
                onClick={() => setCurrentView('projectList')}
            >
                <ArrowLeft className="h-4 w-4" />
                Back
            </Button>
            <Card className="w-[400px]">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Project Manager</CardTitle>
                    <CardDescription>Log in to manage your projects</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid w-full grid-cols-2 mb-6 p-1 bg-muted rounded-lg">
                        <button
                            className={`py-1.5 text-sm font-medium rounded-md transition-all ${isLogin ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                            onClick={() => setIsLogin(true)}
                        >
                            Log In
                        </button>
                        <button
                            className={`py-1.5 text-sm font-medium rounded-md transition-all ${!isLogin ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                            onClick={() => setIsLogin(false)}
                        >
                            Sign Up
                        </button>
                    </div>

                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                {error}
                            </AlertDescription>
                        </Alert>
                    )}

                    {isLogin ? (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoggingIn}>
                                {isLoggingIn ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Logging in...
                                    </>
                                ) : 'Log In'}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleSignup} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="signup-email">Email</Label>
                                <Input
                                    id="signup-email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signup-name">Name</Label>
                                <Input
                                    id="signup-name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isSigningUp}>
                                {isSigningUp ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing up...
                                    </>
                                ) : 'Sign Up'}
                            </Button>
                        </form>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center text-xs text-muted-foreground">
                    {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Supabase Mode' : 'Mock Mode (Supabase not configured)'}
                </CardFooter>
            </Card>
        </div>
    );
}
