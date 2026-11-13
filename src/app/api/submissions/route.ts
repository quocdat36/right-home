// src/app/api/submissions/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { submissionPayloadSchema } from '@/lib/validation';
import { buildCustomerAnalysis } from '@/lib/analyzer';

function generateCustomerCode() {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `RH-${datePart}-${randomPart}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = submissionPayloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { idempotencyKey, intake, swipes, constraints } = parsed.data;

    // 1. Chống gửi trùng nếu người dùng nhấn lại hoặc mạng chập chờn
    const existing = await prisma.customerSubmission.findUnique({
      where: { idempotencyKey },
      select: { id: true, customerCode: true },
    });
    if (existing) {
      return NextResponse.json(existing, { status: 200 });
    }

    // 2. Tính lại báo cáo phân tích phía server để đảm bảo toàn vẹn dữ liệu
    const report = buildCustomerAnalysis(intake, swipes, constraints);

    const priorityTags = swipes.filter((s) => s.decision === 'priority').map((s) => s.title);
    const considerTags = swipes.filter((s) => s.decision === 'consider').map((s) => s.title);
    const notPriorityTags = swipes.filter((s) => s.decision === 'not_priority').map((s) => s.title);
    const undecidedTags = swipes.filter((s) => s.decision === 'undecided').map((s) => s.title);

    // 3. Lưu vào Database
    const created = await prisma.customerSubmission.create({
      data: {
        customerCode: generateCustomerCode(),
        idempotencyKey,
        fullName: intake.fullName,
        phone: intake.phone,
        email: intake.email || null,
        targetArea: intake.targetArea,
        ageGroup: intake.ageGroup || null,
        occupation: intake.occupation || null,
        familyStatus: intake.familyStatus || null,
        initialIntent: intake.initialIntent,
        privacyConsent: intake.privacyConsent,
        budgetRange: constraints.budgetRange,
        customMaxBudget: constraints.customMaxBudget
          ? parseFloat(constraints.customMaxBudget)
          : null,
        bedrooms: constraints.bedrooms,
        preferredDistrict: constraints.preferredDistrict,
        workplaceLocation: constraints.workplaceLocation || null,
        purchaseTimeline: constraints.purchaseTimeline,
        financialCapacity: constraints.financialCapacity,
        equityRatio: constraints.equityRatio || null,
        tradeOffs: constraints.tradeOffs,
        swipeChoices: swipes,
        priorityTags,
        considerTags,
        notPriorityTags,
        undecidedTags,
        analysisReport: report as object,
      },
    });

    // 4. Kích hoạt đồng bộ Excel Online & Thông báo (chạy bất đồng bộ an toàn)
    // Ghi chú: Sẽ được triển khai chi tiết ở Bước 8 & 9 với POWER_AUTOMATE_EXCEL_WEBHOOK & RESEND_API_KEY
    await triggerIntegrations(created);

    return NextResponse.json(
      { id: created.id, customerCode: created.customerCode },
      { status: 201 }
    );
  } catch (error) {
    console.error('[POST /api/submissions]', error);
    return NextResponse.json(
      { error: 'Lỗi hệ thống khi lưu hồ sơ. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
}

async function triggerIntegrations(record: {
  id: string;
  customerCode: string;
  fullName: string;
  phone: string;
  budgetRange: string;
  preferredDistrict: string;
  initialIntent: string;
  createdAt: Date;
  priorityTags: string[];
}) {
  // Điểm tích hợp 1: Đồng bộ vào bảng RIGHT_HOME_CUSTOMERS qua Power Automate Webhook
  const excelWebhook = process.env.EXCEL_POWER_AUTOMATE_URL;
  if (excelWebhook) {
    try {
      const res = await fetch(excelWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerCode: record.customerCode,
          createdAt: record.createdAt.toISOString(),
          fullName: record.fullName,
          phone: record.phone,
          budgetRange: record.budgetRange,
          preferredDistrict: record.preferredDistrict,
          initialIntent: record.initialIntent,
          topPriorities: record.priorityTags.join(', '),
          status: 'Mới',
        }),
      });
      await prisma.customerSubmission.update({
        where: { id: record.id },
        data: {
          excelSyncStatus: res.ok ? 'SUCCESS' : 'FAILED',
          excelSyncError: res.ok ? null : `HTTP ${res.status}`,
          excelSyncedAt: res.ok ? new Date() : null,
        },
      });
    } catch (err) {
      await prisma.customerSubmission.update({
        where: { id: record.id },
        data: {
          excelSyncStatus: 'FAILED',
          excelSyncError: err instanceof Error ? err.message : 'Network error',
        },
      });
    }
  }
}