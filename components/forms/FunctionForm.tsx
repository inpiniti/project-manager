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

const functionSchema = z.object({
    name: z.string().min(1, "함수명을 입력해주세요"),
    returnType: z.string().min(1, "반환 타입을 입력해주세요"),
    parameters: z.string().optional(),
    description: z.string().optional(),
});

type FunctionFormValues = z.infer<typeof functionSchema>;

interface FunctionFormProps {
    defaultValues?: Partial<FunctionFormValues>;
    onSubmit: (data: FunctionFormValues) => void;
    onCancel: () => void;
}

export function FunctionForm({ defaultValues, onSubmit, onCancel }: FunctionFormProps) {
    const form = useForm<FunctionFormValues>({
        resolver: zodResolver(functionSchema),
        defaultValues: {
            name: defaultValues?.name || "",
            returnType: defaultValues?.returnType || "",
            parameters: defaultValues?.parameters || "",
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
                                <FormLabel className="text-xs">함수명</FormLabel>
                                <FormControl>
                                    <Input className="h-8 text-xs" placeholder="handleClick" {...field} />
                                </FormControl>
                                <FormMessage className="text-[10px]" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="returnType"
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel className="text-xs">반환 타입</FormLabel>
                                <FormControl>
                                    <Input className="h-8 text-xs" placeholder="void" {...field} />
                                </FormControl>
                                <FormMessage className="text-[10px]" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="parameters"
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel className="text-xs">파라미터 (선택)</FormLabel>
                                <FormControl>
                                    <Textarea
                                        className="min-h-[60px] text-xs resize-none"
                                        placeholder="event: MouseEvent&#10;userId: string"
                                        {...field}
                                    />
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
                                        placeholder="함수에 대한 설명"
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
