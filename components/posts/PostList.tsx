'use client';

import { usePostStore } from "@/store/postStore";
import { useAuthStore } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, MessageSquare, Pencil, Trash2, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

export function PostList() {
    const { posts, fetchPosts, deletePost, setCurrentPost } = usePostStore();
    const { user } = useAuthStore();
    const { setCurrentView } = useUiStore();
    const [showCreateForm, setShowCreateForm] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handlePostClick = (post: any) => {
        setCurrentPost(post);
    };

    const handleDelete = async (e: React.MouseEvent, postId: string) => {
        e.stopPropagation();
        if (confirm('정말 삭제하시겠습니까?')) {
            await deletePost(postId);
        }
    };

    return (
        <div className="h-screen flex flex-col bg-background">
            {/* Header */}
            <div className="border-b px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentView('projectList')}
                        className="h-8"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        뒤로가기
                    </Button>
                    <h1 className="text-xl font-bold">문의 게시판</h1>
                </div>
                <Button
                    size="sm"
                    onClick={() => setShowCreateForm(true)}
                    className="h-8"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    새 글 작성
                </Button>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1 px-6 py-4">
                {showCreateForm && (
                    <CreatePostForm onClose={() => setShowCreateForm(false)} />
                )}

                <div className="space-y-3 max-w-4xl mx-auto">
                    {posts.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>아직 작성된 글이 없습니다.</p>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <Card
                                key={post.id}
                                className="cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => handlePostClick(post)}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-base mb-1">
                                                {post.title}
                                            </CardTitle>
                                            <CardDescription className="text-xs">
                                                {post.authorName} · {formatDistanceToNow(post.createdAt, { addSuffix: true, locale: ko })}
                                            </CardDescription>
                                        </div>
                                        {user?.id === post.authorId && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => handleDelete(e, post.id)}
                                                className="h-7 w-7 p-0 ml-2"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {post.content}
                                    </p>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}

function CreatePostForm({ onClose }: { onClose: () => void }) {
    const { createPost } = usePostStore();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        setIsSubmitting(true);
        await createPost(title, content);
        setIsSubmitting(false);
        onClose();
    };

    return (
        <Card className="mb-6 max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="text-base">새 글 작성</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <Input
                        placeholder="제목"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="h-9"
                    />
                    <Textarea
                        placeholder="내용을 입력하세요..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="min-h-[120px] resize-none"
                    />
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="h-8"
                        >
                            취소
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !title.trim() || !content.trim()}
                            className="h-8"
                        >
                            작성
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
