import { z } from 'zod';

export const projectSchema = z.object({
  projectName: z.string().min(1, '과제명을 입력하세요'),
  managingAgency: z.string().min(1, '주관기관을 입력하세요'),
  performPeriod: z.string().min(1, '수행기간을 입력하세요'),
  role: z.enum(['주관', '참여']),
  budget: z.number().nullable().optional(),
  result: z.enum(['성공', '실패', '진행중']),
  summary: z.string().nullable().optional(),
  keywords: z.string().nullable().optional(),
});

export type ProjectInput = z.infer<typeof projectSchema>;
