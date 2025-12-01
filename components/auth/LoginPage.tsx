'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export function LoginPage() {
    const { login, signup } = useAuthStore();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');

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
        <div className="h-screen flex items-center justify-center bg-muted/30">
            <Card className="w-[400px]">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">프로젝트 매니저</CardTitle>
                    <CardDescription>계정에 로그인하여 프로젝트를 관리하세요</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid w-full grid-cols-2 mb-6 p-1 bg-muted rounded-lg">
                        <button
                            className={`py-1.5 text-sm font-medium rounded-md transition-all ${isLogin ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                            onClick={() => setIsLogin(true)}
                        >
                            로그인
                        </button>
                        <button
                            className={`py-1.5 text-sm font-medium rounded-md transition-all ${!isLogin ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                            onClick={() => setIsLogin(false)}
                        >
                            회원가입
                        </button>
                    </div>

                    {isLogin ? (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">이메일</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <Button type="submit" className="w-full">로그인</Button>
                        </form>
                    ) : (
                        <form onSubmit={handleSignup} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="signup-email">이메일</Label>
                                <Input
                                    id="signup-email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signup-name">이름</Label>
                                <Input
                                    id="signup-name"
                                    type="text"
                                    placeholder="홍길동"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <Button type="submit" className="w-full">회원가입</Button>
                        </form>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center text-xs text-muted-foreground">
                    {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Supabase 연동 모드' : 'Mock 모드 (Supabase 미설정)'}
                </CardFooter>
            </Card>
        </div>
    );
}
