import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EffectItem } from '@/lib/types';
import { useEffect } from 'react';

const formSchema = z.object({
    dependencies: z.string().min(1, 'Dependencies are required (e.g., [])'),
    code: z.string().min(1, 'Code is required'),
    description: z.string().optional(),
});

interface EffectFormProps {
    onSubmit: (data: z.infer<typeof formSchema>) => void;
    onCancel: () => void;
    defaultValues?: Partial<EffectItem>;
}

export function EffectForm({ onSubmit, onCancel, defaultValues }: EffectFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            dependencies: defaultValues?.dependencies || '[]',
            code: defaultValues?.code || '',
            description: defaultValues?.description || '',
        },
    });

    useEffect(() => {
        if (defaultValues) {
            form.reset({
                dependencies: defaultValues.dependencies || '[]',
                code: defaultValues.code || '',
                description: defaultValues.description || '',
            });
        }
    }, [defaultValues, form]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="dependencies"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Dependencies</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. [userId, data]" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Code</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="useEffect logic here..."
                                    className="min-h-[150px] font-mono"
                                    {...field}
                                />
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
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Describe what this effect does" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit">Save</Button>
                </div>
            </form>
        </Form>
    );
}
