'use client';

import { usePostStore } from "@/store/postStore";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

export function PostDetail() {
    const { currentPost, comments, fetchComments, createComment, deleteComment, setCurrentPost } = usePostStore();
    const { user } = useAuthStore();
    const [commentContent, setCommentContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (currentPost) {
            fetchComments(currentPost.id);
        }
    }, [currentPost, fetchComments]);

    if (!currentPost) {
        return null;
    }

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentContent.trim()) return;

        setIsSubmitting(true);
        await createComment(currentPost.id, commentContent);
        setCommentContent('');
        setIsSubmitting(false);
    };

    const handleDeleteComment = async (commentId: string) => {
        if (confirm('댓글을 삭제하시겠습니까?')) {
            await deleteComment(commentId);
        }
    };

    return (
        <div className="h-screen flex flex-col bg-background">
            {/* Header */}
            <div className="border-b px-6 py-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPost(null)}
                    className="h-8 mb-3"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    목록으로
                </Button>
                <h1 className="text-xl font-bold mb-2">{currentPost.title}</h1>
                <p className="text-sm text-muted-foreground">
                    {currentPost.authorName} · {formatDistanceToNow(currentPost.createdAt, { addSuffix: true, locale: ko })}
                </p>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1">
                <div className="max-w-4xl mx-auto px-6 py-6">
                    {/* Post Content */}
                    <Card className="mb-6">
                        <CardContent className="pt-6">
                            <p className="whitespace-pre-wrap text-sm">
                                {currentPost.content}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Comments Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-semibold">
                                댓글 {comments.length}개
                            </h2>
                        </div>

                        {/* Comment Form */}
                        {user && (
                            <Card>
                                <CardContent className="pt-4">
                                    <form onSubmit={handleSubmitComment} className="space-y-3">
                                        <Textarea
                                            placeholder="댓글을 입력하세요..."
                                            value={commentContent}
                                            onChange={(e) => setCommentContent(e.target.value)}
                                            className="min-h-[80px] resize-none text-sm"
                                        />
                                        <div className="flex justify-end">
                                            <Button
                                                type="submit"
                                                size="sm"
                                                disabled={isSubmitting || !commentContent.trim()}
                                                className="h-8"
                                            >
                                                댓글 작성
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        )}

                        {/* Comments List */}
                        <div className="space-y-3">
                            {comments.length === 0 ? (
                                <div className="text-center py-8 text-sm text-muted-foreground">
                                    아직 댓글이 없습니다.
                                </div>
                            ) : (
                                comments.map((comment) => (
                                    <Card key={comment.id}>
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <CardTitle className="text-sm font-medium">
                                                        {comment.authorName}
                                                    </CardTitle>
                                                    <CardDescription className="text-xs">
                                                        {formatDistanceToNow(comment.createdAt, { addSuffix: true, locale: ko })}
                                                    </CardDescription>
                                                </div>
                                                {user?.id === comment.authorId && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteComment(comment.id)}
                                                        className="h-7 w-7 p-0"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                )}
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm whitespace-pre-wrap">
                                                {comment.content}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}
