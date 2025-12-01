'use client';

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { screenFormSchema, ScreenFormValues } from "@/lib/schemas";
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
import { Plus, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ScreenFormProps {
    defaultValues?: Partial<ScreenFormValues>;
    onSubmit: (data: ScreenFormValues) => void;
    onCancel: () => void;
}

export function ScreenForm({ defaultValues, onSubmit, onCancel }: ScreenFormProps) {
    const form = useForm<ScreenFormValues>({
        resolver: zodResolver(screenFormSchema),
        defaultValues: {
            title: defaultValues?.title || "",
            description: defaultValues?.description || "",
            tags: defaultValues?.tags || "",
            path: defaultValues?.path || "",
            componentName: defaultValues?.componentName || "",
            variables: defaultValues?.variables || [],
            functions: defaultValues?.functions || [],
            dependencies: defaultValues?.dependencies || "",
        },
    });

    const { fields: variableFields, append: appendVariable, remove: removeVariable } = useFieldArray({
        control: form.control,
        name: "variables",
    });

    const { fields: functionFields, append: appendFunction, remove: removeFunction } = useFieldArray({
        control: form.control,
        name: "functions",
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold">기본 정보</h3>
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel className="text-xs">제목</FormLabel>
                                <FormControl>
                                    <Input className="h-8 text-xs" placeholder="화면 제목" {...field} />
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
                                    <Textarea className="min-h-[60px] text-xs resize-none" placeholder="화면 설명" {...field} />
                                </FormControl>
                                <FormMessage className="text-[10px]" />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <FormField
                            control={form.control}
                            name="path"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel className="text-xs">경로 (Route)</FormLabel>
                                    <FormControl>
                                        <Input className="h-8 text-xs" placeholder="/dashboard/users" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-[10px]" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="componentName"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel className="text-xs">컴포넌트명</FormLabel>
                                    <FormControl>
                                        <Input className="h-8 text-xs" placeholder="UserListScreen" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-[10px]" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="dependencies"
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel className="text-xs">의존성 (쉼표로 구분)</FormLabel>
                                <FormControl>
                                    <Input className="h-8 text-xs" placeholder="useAuth, Button, Card" {...field} />
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
                                    <Input className="h-8 text-xs" placeholder="admin, list, table" {...field} />
                                </FormControl>
                                <FormMessage className="text-[10px]" />
                            </FormItem>
                        )}
                    />
                </div>

                <Separator />

                {/* 변수 목록 */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold">변수 (Variables)</h3>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-6 text-xs px-2"
                            onClick={() => appendVariable({ name: "", type: "", defaultValue: "", description: "" })}
                        >
                            <Plus className="h-3 w-3 mr-1" />
                            추가
                        </Button>
                    </div>

                    {variableFields.map((field, index) => (
                        <div key={field.id} className="flex gap-2 items-start p-3 border rounded-md bg-muted/20">
                            <div className="grid grid-cols-2 gap-2 flex-1">
                                <FormField
                                    control={form.control}
                                    name={`variables.${index}.name`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <Input className="h-7 text-xs" placeholder="변수명" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`variables.${index}.type`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <Input className="h-7 text-xs" placeholder="타입" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`variables.${index}.defaultValue`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <Input className="h-7 text-xs" placeholder="기본값" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`variables.${index}.description`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <Input className="h-7 text-xs" placeholder="설명" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => removeVariable(index)}
                            >
                                <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                        </div>
                    ))}
                </div>

                <Separator />

                {/* 함수 목록 */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold">함수 (Functions)</h3>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-6 text-xs px-2"
                            onClick={() => appendFunction({ name: "", returnType: "void", description: "" })}
                        >
                            <Plus className="h-3 w-3 mr-1" />
                            추가
                        </Button>
                    </div>

                    {functionFields.map((field, index) => (
                        <div key={field.id} className="flex gap-2 items-start p-3 border rounded-md bg-muted/20">
                            <div className="grid grid-cols-3 gap-2 flex-1">
                                <FormField
                                    control={form.control}
                                    name={`functions.${index}.name`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <Input className="h-7 text-xs" placeholder="함수명" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`functions.${index}.returnType`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <Input className="h-7 text-xs" placeholder="반환 타입" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`functions.${index}.description`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <Input className="h-7 text-xs" placeholder="설명" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => removeFunction(index)}
                            >
                                <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                        </div>
                    ))}
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
