// src/app/api/submissions/[id]/consultation/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.customerSubmission.update({
      where: { id },
      data: { requestedConsult: true },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Không tìm thấy hồ sơ' }, { status: 404 });
  }
}