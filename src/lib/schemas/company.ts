import { z } from 'zod';

export const companySchema = z.object({
  businessNumber: z
    .string()
    .regex(/^\d{3}-\d{2}-\d{5}$/, '사업자등록번호 형식: 000-00-00000'),
  companyName: z.string().min(1, '회사명을 입력하세요'),
  representativeName: z.string().min(1, '대표자명을 입력하세요'),
  foundedDate: z.string().min(1, '설립일을 입력하세요'),
  address: z.string().min(1, '소재지를 입력하세요'),
  companyType: z.enum(['법인', '개인']),
  companyScale: z.string().min(1, '기업 규모를 선택하세요'),
  recentRevenue: z.number().nullable().optional(),
  debtRatio: z.number().nullable().optional(),
  researcherCount: z.number().int().nullable().optional(),
  patentCount: z.number().int().nullable().optional(),
  technologies: z.string().nullable().optional(),
  certifications: z.string().nullable().optional(),
});

export type CompanyInput = z.infer<typeof companySchema>;
