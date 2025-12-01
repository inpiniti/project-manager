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

const objectSchema = z.object({
    name: z.string().min(1, "객체명을 입력해주세요"),
    type: z.string().min(1, "타입을 입력해주세요"),
    properties: z.string().optional(),
    description: z.string().optional(),
});

type ObjectFormValues = z.infer<typeof objectSchema>;

interface ObjectFormProps {
    defaultValues?: Partial<ObjectFormValues>;
    onSubmit: (data: ObjectFormValues) => void;
    onCancel: () => void;
}

export function ObjectForm({ defaultValues, onSubmit, onCancel }: ObjectFormProps) {
    const form = useForm<ObjectFormValues>({
        resolver: zodResolver(objectSchema),
        defaultValues: {
            name: defaultValues?.name || "",
            type: defaultValues?.type || "",
            properties: defaultValues?.properties || "",
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
                                <FormLabel className="text-xs">객체명</FormLabel>
                                <FormControl>
                                    <Input className="h-8 text-xs" placeholder="UserData" {...field} />
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
                                    <Input className="h-8 text-xs" placeholder="interface" {...field} />
                                </FormControl>
                                <FormMessage className="text-[10px]" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="properties"
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel className="text-xs">속성 (선택)</FormLabel>
                                <FormControl>
                                    <Textarea
                                        className="min-h-[60px] text-xs resize-none"
                                        placeholder="id: string; name: string;"
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
                                        placeholder="객체에 대한 설명"
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
