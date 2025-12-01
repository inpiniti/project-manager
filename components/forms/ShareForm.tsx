'use client';

import { useState, useEffect } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, X, User as UserIcon } from 'lucide-react';
import { Project } from '@/lib/types';

interface ShareFormProps {
    project: Project;
    onClose: () => void;
}

export function ShareForm({ project, onClose }: ShareFormProps) {
    const { shareProject, unshareProject } = useProjectStore();
    const { user: currentUser } = useAuthStore();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [sharedUsers, setSharedUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // 공유된 사용자 목록 로드
    const loadSharedUsers = async () => {
        if (!project.sharedWith || project.sharedWith.length === 0) {
            setSharedUsers([]);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, email, name')
                .in('id', project.sharedWith);

            if (error) throw error;
            setSharedUsers(data || []);
        } catch (err) {
            console.error('Failed to load shared users:', err);
        }
    };

    // 컴포넌트 마운트 시 공유 사용자 로드
    useEffect(() => {
        loadSharedUsers();
    }, [project.sharedWith]);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        if (email === currentUser?.email) {
            setError('You cannot invite yourself.');
            return;
        }

        setIsLoading(true);
        try {
            // Supabase에서 이메일로 사용자 검색
            const { data: targetUser, error: searchError } = await supabase
                .from('profiles')
                .select('id, email, name')
                .eq('email', email)
                .single();

            if (searchError || !targetUser) {
                setError('User with this email not found.');
                setIsLoading(false);
                return;
            }

            if (project.sharedWith?.includes(targetUser.id)) {
                setError('User already invited.');
                setIsLoading(false);
                return;
            }

            await shareProject(project.id, targetUser.id);
            await loadSharedUsers(); // 목록 새로고침
            setEmail('');
            setError('');
        } catch (err) {
            console.error('Failed to invite user:', err);
            setError('Error occurred while inviting.');
        }
        setIsLoading(false);
    };

    const handleUnshare = async (userId: string) => {
        if (confirm('Are you sure you want to remove this user?')) {
            await unshareProject(project.id, userId);
            await loadSharedUsers(); // 목록 새로고침
        }
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleInvite} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="invite-email">Invite User</Label>
                    <div className="flex gap-2">
                        <Input
                            id="invite-email"
                            type="email"
                            placeholder="Enter email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button type="submit" size="icon">
                            <UserPlus className="h-4 w-4" />
                        </Button>
                    </div>
                    {error && <p className="text-xs text-destructive">{error}</p>}
                </div>
            </form>

            <div className="space-y-2">
                <Label>Shared Users ({sharedUsers.length})</Label>
                <div className="border rounded-md divide-y max-h-[200px] overflow-y-auto">
                    {sharedUsers.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No users shared.
                        </div>
                    ) : (
                        sharedUsers.map((u) => (
                            <div key={u!.id} className="flex items-center justify-between p-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{u!.name}</p>
                                        <p className="text-xs text-muted-foreground">{u!.email}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                    onClick={() => handleUnshare(u!.id)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="flex justify-end pt-2">
                <Button variant="outline" onClick={onClose}>
                    Close
                </Button>
            </div>
        </div>
    );
}
