// src/types/right-home.ts
export type FlowStep =
  | 'landing'
  | 'intake'
  | 'swipe'
  | 'constraints'
  | 'analyzing'
  | 'report';

export type CardGroupId = 'A' | 'B' | 'C' | 'D' | 'E';

export type SwipeDecision = 'priority' | 'not_priority' | 'consider' | 'undecided';

export interface DiscoveryCard {
  id: string;
  group: CardGroupId;
  groupTitle: string;
  title: string;
  description: string;
  imagePath: string;
  categoryTag: string;
}

export interface SwipeChoiceItem {
  cardId: string;
  group: CardGroupId;
  title: string;
  decision: SwipeDecision;
}

export interface CustomerIntakeData {
  fullName: string;
  phone: string;
  targetArea: string;
  email: string;
  ageGroup: string;
  occupation: string;
  familyStatus: string;
  initialIntent: string;
  privacyConsent: boolean;
}

export interface PracticalConstraintsData {
  budgetRange: string;
  customMaxBudget: string;
  bedrooms: string;
  preferredDistrict: string;
  workplaceLocation: string;
  purchaseTimeline: string;
  financialCapacity: string;
  equityRatio: string;
  tradeOffs: string[];
}

export interface AnalysisReportData {
  customerProfile: {
    segmentLabel: string;
    intent: string;
    budgetLabel: string;
    bedrooms: string;
    areaLabel: string;
    financialSummary: string;
  };
  topPriorities: string[];
  considerItems: string[];
  notPriorities: string[];
  tradeOffInsights: string[];
  stats: {
    totalEvaluated: number;
    priorityCount: number;
    considerCount: number;
    constraintsCount: number;
  };
}