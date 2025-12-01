'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { baseItemSchema } from "@/lib/schemas";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type CommonFormValues = z.infer<typeof baseItemSchema>;

interface CommonFormProps {
    defaultValues?: Partial<CommonFormValues>;
    onSubmit: (data: CommonFormValues) => void;
    onCancel: () => void;
}

export function CommonForm({ defaultValues, onSubmit, onCancel }: CommonFormProps) {
    const form = useForm<CommonFormValues>({
        resolver: zodResolver(baseItemSchema),
        defaultValues: {
            title: defaultValues?.title || "",
            description: defaultValues?.description || "",
            tags: defaultValues?.tags || "",
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-3">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel className="text-xs">제목</FormLabel>
                                <FormControl>
                                    <Input className="h-8 text-xs" placeholder="제목을 입력하세요" {...field} />
                                </FormControl>
                                <FormMessage className="text-[10px]" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel className="text-xs">설명</FormLabel>
                                <FormControl>
                                    <Textarea
                                        className="min-h-[100px] text-xs resize-none"
                                        placeholder="설명을 입력하세요"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-[10px]" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel className="text-xs">태그 (쉼표로 구분)</FormLabel>
                                <FormControl>
                                    <Input className="h-8 text-xs" placeholder="태그1, 태그2" {...field} />
                                </FormControl>
                                <FormMessage className="text-[10px]" />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={onCancel} className="h-8 text-xs">
                        취소
                    </Button>
                    <Button type="submit" className="h-8 text-xs">저장</Button>
                </div>
            </form>
        </Form>
    );
}
