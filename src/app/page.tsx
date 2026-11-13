// src/app/page.tsx
'use client';

import { useMemo, useState } from 'react';
import { ProgressHeader } from '@/components/ProgressHeader';
import { LandingScreen } from '@/components/LandingScreen';
import { IntakeForm } from '@/components/IntakeForm';
import { SwipeDiscovery } from '@/components/SwipeDiscovery';
import { ConstraintsForm } from '@/components/ConstraintsForm';
import { AnalysisScreen } from '@/components/AnalysisScreen';
import { ReportScreen } from '@/components/ReportScreen';
import { buildCustomerAnalysis } from '@/lib/analyzer';
import {
  CustomerIntakeData,
  FlowStep,
  PracticalConstraintsData,
  SwipeChoiceItem,
} from '@/types/right-home';

export default function RightHomePage() {
  const [step, setStep] = useState<FlowStep>('landing');
  const [idempotencyKey] = useState(() =>
    typeof crypto !== 'undefined' ? crypto.randomUUID() : `rh-${Date.now()}`
  );

  const [intake, setIntake] = useState<CustomerIntakeData>({
    fullName: '',
    phone: '',
    targetArea: '',
    email: '',
    ageGroup: '',
    occupation: '',
    familyStatus: '',
    initialIntent: 'Mua nhà để ở.',
    privacyConsent: false,
  });

  const [swipes, setSwipes] = useState<SwipeChoiceItem[]>([]);

  const [constraints, setConstraints] = useState<PracticalConstraintsData>({
    budgetRange: '',
    customMaxBudget: '',
    bedrooms: '',
    preferredDistrict: '',
    workplaceLocation: '',
    purchaseTimeline: '',
    financialCapacity: '',
    equityRatio: '',
    tradeOffs: [],
  });

  const [submissionMeta, setSubmissionMeta] = useState<{ id: string; code: string }>({
    id: '',
    code: '',
  });

  const report = useMemo(
    () => buildCustomerAnalysis(intake, swipes, constraints),
    [intake, swipes, constraints]
  );

  return (
    <main className="min-h-screen bg-[#F2EBDD]">
      <ProgressHeader currentStep={step} />

      {step === 'landing' && <LandingScreen onStart={() => setStep('intake')} />}

      {step === 'intake' && (
        <IntakeForm
          initialData={intake}
          onBackToLanding={() => setStep('landing')}
          onComplete={(data) => {
            setIntake(data);
            setStep('swipe');
          }}
        />
      )}

      {step === 'swipe' && (
        <SwipeDiscovery
          initialSwipes={swipes}
          onBack={() => setStep('intake')}
          onComplete={(choices) => {
            setSwipes(choices);
            setStep('constraints');
          }}
        />
      )}

      {step === 'constraints' && (
        <ConstraintsForm
          initialData={constraints}
          onBack={() => setStep('swipe')}
          onSubmit={(data) => {
            setConstraints(data);
            setStep('analyzing');
          }}
        />
      )}

      {step === 'analyzing' && (
        <AnalysisScreen
          idempotencyKey={idempotencyKey}
          intake={intake}
          swipes={swipes}
          constraints={constraints}
          report={report}
          onSuccess={(id, code) => {
            setSubmissionMeta({ id, code });
            setStep('report');
          }}
        />
      )}

      {step === 'report' && (
        <ReportScreen
          submissionId={submissionMeta.id}
          customerCode={submissionMeta.code}
          customerName={intake.fullName}
          report={report}
          swipes={swipes}
        />
      )}
    </main>
  );
}