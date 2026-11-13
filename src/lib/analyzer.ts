// src/lib/analyzer.ts
import {
  AnalysisReportData,
  CustomerIntakeData,
  PracticalConstraintsData,
  SwipeChoiceItem,
} from '@/types/right-home';

export function buildCustomerAnalysis(
  intake: CustomerIntakeData,
  swipes: SwipeChoiceItem[],
  constraints: PracticalConstraintsData
): AnalysisReportData {
  const priorityItems = swipes.filter((s) => s.decision === 'priority');
  const considerItems = swipes.filter((s) => s.decision === 'consider');
  const notPriorityItems = swipes.filter((s) => s.decision === 'not_priority');
  const undecidedItems = swipes.filter((s) => s.decision === 'undecided');

  // Top 3 ưu tiên nổi bật: ưu tiên từ thẻ vuốt phải, nếu ít hơn 3 thì bổ sung từ thẻ cân nhắc
  const combinedTop = [
    ...priorityItems.map((i) => i.title),
    ...considerItems.map((i) => `${i.title} (đang cân nhắc)`),
  ];
  const topPriorities = combinedTop.slice(0, 3);

  // Xác định nhãn nhóm khách hàng dựa trên thông tin thực tế
  let segmentLabel = 'Người mua nhà lần đầu';
  if (intake.familyStatus === 'Vợ chồng trẻ chưa có con') {
    segmentLabel = 'Cặp vợ chồng trẻ';
  } else if (intake.familyStatus === 'Gia đình có con nhỏ') {
    segmentLabel = 'Gia đình trẻ có con nhỏ';
  } else if (intake.familyStatus === 'Gia đình nhiều thế hệ') {
    segmentLabel = 'Gia đình đa thế hệ';
  } else if (intake.familyStatus === 'Độc thân') {
    segmentLabel = 'Người trẻ độc thân';
  }

  // Phân tích các yếu tố đánh đổi (Rule-based Trade-off Engine)
  const tradeOffInsights: string[] = [];
  const priorityIds = new Set(priorityItems.map((i) => i.cardId));

  const wantsGreenOrQuiet =
    priorityIds.has('B1') || priorityIds.has('B2') || priorityIds.has('B3') || priorityIds.has('A5');
  const wantsCentral = priorityIds.has('C2') || priorityIds.has('C1');
  const isTightBudget =
    constraints.budgetRange === 'Dưới 2 tỷ' ||
    constraints.budgetRange === '2–3 tỷ' ||
    constraints.budgetRange === '3–4 tỷ';
  const wantsLargeSpace =
    priorityIds.has('A3') ||
    constraints.bedrooms === '3 phòng ngủ' ||
    constraints.bedrooms === '4 phòng ngủ trở lên';

  if (wantsGreenOrQuiet && wantsCentral && isTightBudget) {
    tradeOffInsights.push(
      `Bạn đang đồng thời ưu tiên không gian xanh/yên tĩnh, vị trí gần trung tâm và ngân sách ${constraints.budgetRange}. Trên thực tế, rất ít khu vực đáp ứng cả 3 yếu tố cùng lúc — bạn có thể cần cân nhắc dịch chuyển ra vành đai kết nối tốt hoặc điều chỉnh diện tích.`
    );
  }

  if (wantsLargeSpace && isTightBudget) {
    tradeOffInsights.push(
      `Nhu cầu ${constraints.bedrooms} hoặc phòng khách rộng trong tầm ngân sách ${constraints.budgetRange} thường yêu cầu lựa chọn khu vực xa trung tâm hơn hoặc các dự án ít tiện ích nội khu phức hợp.`
    );
  }

  if (
    constraints.financialCapacity === 'Có một phần vốn tự có, cần vay ngân hàng' &&
    (constraints.equityRatio === 'Dưới 20%' || constraints.equityRatio === '20–30%')
  ) {
    tradeOffInsights.push(
      'Với tỷ lệ vốn tự có hiện tại ở mức thận trọng, bạn nên ưu tiên tính toán dòng tiền trả góp hàng tháng không vượt quá 35–40% thu nhập gia đình và kiểm tra kỹ chính sách ân hạn nợ gốc.'
    );
  }

  if (priorityIds.has('D5') && priorityIds.has('D2')) {
    tradeOffInsights.push(
      'Bạn ưu tiên cả pháp lý rõ ràng lẫn khoản thanh toán ban đầu thấp. Các căn hộ đã có sổ hồng thường yêu cầu tỷ lệ thanh toán ban đầu cao hơn so với dự án đang xây dựng theo tiến độ.'
    );
  }

  if (constraints.tradeOffs.includes('Không muốn đánh đổi các tiêu chí đã chọn')) {
    tradeOffInsights.push(
      'Bạn chọn giữ nguyên toàn bộ các tiêu chí ưu tiên. Điều này giúp lọc rất kỹ các lựa chọn, nhưng thời gian tìm kiếm căn hộ phù hợp hoàn toàn có thể kéo dài hơn dự kiến.'
    );
  } else if (constraints.tradeOffs.length > 0 && tradeOffInsights.length === 0) {
    tradeOffInsights.push(
      `Sự cởi mở của bạn trong việc "${constraints.tradeOffs[0].toLowerCase()}" sẽ giúp mở rộng đáng kể số lượng căn hộ phù hợp trong tầm ngân sách ${constraints.budgetRange}.`
    );
  }

  if (tradeOffInsights.length === 0) {
    tradeOffInsights.push(
      'Các ưu tiên không gian sống và điều kiện tài chính hiện tại của bạn tương đối cân bằng. Bước tiếp theo nên tập trung rà soát chi phí vận hành thực tế và hành trình di chuyển hàng ngày.'
    );
  }

  const budgetLabel = constraints.customMaxBudget
    ? `${constraints.budgetRange} (tối đa ${constraints.customMaxBudget} tỷ)`
    : constraints.budgetRange;

  const constraintsCount = [
    constraints.budgetRange,
    constraints.bedrooms,
    constraints.preferredDistrict,
    constraints.purchaseTimeline,
    constraints.financialCapacity,
  ].filter(Boolean).length;

  return {
    customerProfile: {
      segmentLabel,
      intent: intake.initialIntent,
      budgetLabel,
      bedrooms: constraints.bedrooms,
      areaLabel: constraints.preferredDistrict || intake.targetArea,
      financialSummary: constraints.equityRatio
        ? `${constraints.financialCapacity} (vốn tự có ${constraints.equityRatio})`
        : constraints.financialCapacity,
    },
    topPriorities,
    considerItems: considerItems.map((i) => i.title),
    notPriorities: notPriorityItems.map((i) => i.title),
    tradeOffInsights,
    stats: {
      totalEvaluated: swipes.length - undecidedItems.length,
      priorityCount: priorityItems.length,
      considerCount: considerItems.length,
      constraintsCount,
    },
  };
}