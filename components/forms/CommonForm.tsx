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
                                <FormLabel className="text-xs">Title</FormLabel>
                                <FormControl>
                                    <Input className="h-8 text-xs" placeholder="Enter title" {...field} />
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
                                <FormLabel className="text-xs">Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        className="min-h-[100px] text-xs resize-none"
                                        placeholder="Enter description"
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
                                <FormLabel className="text-xs">Tags (comma separated)</FormLabel>
                                <FormControl>
                                    <Input className="h-8 text-xs" placeholder="tag1, tag2" {...field} />
                                </FormControl>
                                <FormMessage className="text-[10px]" />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={onCancel} className="h-8 text-xs">
                        Cancel
                    </Button>
                    <Button type="submit" className="h-8 text-xs">Save</Button>
                </div>
            </form>
        </Form>
    );
}
