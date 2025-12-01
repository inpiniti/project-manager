import { z } from "zod";

// 공통 스키마
export const baseItemSchema = z.object({
    title: z.string().min(1, "제목을 입력해주세요"),
    description: z.string().min(1, "설명을 입력해주세요"),
    tags: z.string().optional(), // 쉼표로 구분된 문자열로 입력받아 배열로 변환
});

// 1. 화면 (Screen) 스키마
export const variableSchema = z.object({
    name: z.string().min(1, "변수명을 입력해주세요"),
    type: z.string().min(1, "타입을 입력해주세요"),
    defaultValue: z.string().optional(),
    description: z.string().optional(),
});

export const functionSchema = z.object({
    name: z.string().min(1, "함수명을 입력해주세요"),
    returnType: z.string().min(1, "반환 타입을 입력해주세요"),
    description: z.string().optional(),
    // 파라미터는 일단 복잡도를 줄이기 위해 제외하거나 나중에 추가
});

export const screenFormSchema = baseItemSchema.extend({
    path: z.string().min(1, "경로를 입력해주세요"),
    componentName: z.string().min(1, "컴포넌트명을 입력해주세요"),
    variables: z.array(variableSchema).optional().default([]),
    functions: z.array(functionSchema).optional().default([]),
    dependencies: z.string().optional(), // 쉼표로 구분
});

export type ScreenFormValues = z.infer<typeof screenFormSchema>;
