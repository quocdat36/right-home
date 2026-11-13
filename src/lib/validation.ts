// src/lib/validation.ts
import { z } from 'zod';

export const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;

export const intakeSchema = z.object({
  fullName: z.string().trim().min(2, 'Vui lòng nhập họ và tên hợp lệ'),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s.-]/g, ''))
    .refine((v) => phoneRegex.test(v), 'Số điện thoại Việt Nam chưa đúng định dạng'),
  targetArea: z.string().trim().min(2, 'Vui lòng chọn hoặc nhập khu vực bạn muốn mua nhà'),
  email: z
    .string()
    .trim()
    .email('Email chưa đúng định dạng')
    .optional()
    .or(z.literal('')),
  ageGroup: z.string().optional().default(''),
  occupation: z.string().optional().default(''),
  familyStatus: z.string().optional().default(''),
  initialIntent: z.string().min(1, 'Vui lòng chọn nhu cầu ban đầu'),
  privacyConsent: z.literal(true, {
    errorMap: () => ({ message: 'Vui lòng đồng ý với chính sách lưu trữ thông tin để tiếp tục' }),
  }),
});

export const submissionPayloadSchema = z.object({
  idempotencyKey: z.string().min(8),
  intake: intakeSchema,
  swipes: z.array(
    z.object({
      cardId: z.string(),
      group: z.enum(['A', 'B', 'C', 'D', 'E']),
      title: z.string(),
      decision: z.enum(['priority', 'not_priority', 'consider', 'undecided']),
    })
  ),
  constraints: z.object({
    budgetRange: z.string().min(1),
    customMaxBudget: z.string().optional().default(''),
    bedrooms: z.string().min(1),
    preferredDistrict: z.string().min(1),
    workplaceLocation: z.string().optional().default(''),
    purchaseTimeline: z.string().min(1),
    financialCapacity: z.string().min(1),
    equityRatio: z.string().optional().default(''),
    tradeOffs: z.array(z.string()),
  }),
});