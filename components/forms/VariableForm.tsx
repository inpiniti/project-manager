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

const variableSchema = z.object({
    name: z.string().min(1, "변수명을 입력해주세요"),
    type: z.string().min(1, "타입을 입력해주세요"),
    defaultValue: z.string().optional(),
    description: z.string().optional(),
});

type VariableFormValues = z.infer<typeof variableSchema>;

interface VariableFormProps {
    defaultValues?: Partial<VariableFormValues>;
    onSubmit: (data: VariableFormValues) => void;
    onCancel: () => void;
}

export function VariableForm({ defaultValues, onSubmit, onCancel }: VariableFormProps) {
    const form = useForm<VariableFormValues>({
        resolver: zodResolver(variableSchema),
        defaultValues: {
            name: defaultValues?.name || "",
            type: defaultValues?.type || "",
            defaultValue: defaultValues?.defaultValue || "",
            description: defaultValues?.description || "",
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-3">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel className="text-xs">변수명</FormLabel>
                                <FormControl>
                                    <Input className="h-8 text-xs" placeholder="userName" {...field} />
                                </FormControl>
                                <FormMessage className="text-[10px]" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel className="text-xs">타입</FormLabel>
                                <FormControl>
                                    <Input className="h-8 text-xs" placeholder="string" {...field} />
                                </FormControl>
                                <FormMessage className="text-[10px]" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="defaultValue"
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel className="text-xs">기본값 (선택)</FormLabel>
                                <FormControl>
                                    <Input className="h-8 text-xs" placeholder="''" {...field} />
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
                                <FormLabel className="text-xs">설명 (선택)</FormLabel>
                                <FormControl>
                                    <Textarea
                                        className="min-h-[60px] text-xs resize-none"
                                        placeholder="변수에 대한 설명"
                                        {...field}
                                    />
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
