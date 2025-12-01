'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

const projectSchema = z.object({
    name: z.string().min(1, "프로젝트 이름을 입력해주세요"),
    description: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
    defaultValues?: Partial<ProjectFormValues>;
    onSubmit: (data: ProjectFormValues) => void;
    onCancel: () => void;
}

export function ProjectForm({ defaultValues, onSubmit, onCancel }: ProjectFormProps) {
    const form = useForm<ProjectFormValues>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            name: defaultValues?.name || "",
            description: defaultValues?.description || "",
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>프로젝트 이름</FormLabel>
                            <FormControl>
                                <Input placeholder="나의 멋진 프로젝트" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>설명 (선택)</FormLabel>
                            <FormControl>
                                <Textarea
                                    className="min-h-[100px] resize-none"
                                    placeholder="프로젝트에 대한 간단한 설명..."
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        취소
                    </Button>
                    <Button type="submit">프로젝트 생성</Button>
                </div>
            </form>
        </Form>
    );
}
