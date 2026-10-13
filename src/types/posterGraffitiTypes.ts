export enum ApprovalStatus {
  PENDING = 'PENDING',               // 待审批
  COUNSELOR_APPROVED = 'COUNSELOR_APPROVED', // 辅导员/OA初审通过
  DEPT_APPROVED = 'DEPT_APPROVED',   // 部门领导审核通过
  UNION_APPROVED = 'UNION_APPROVED', // 学生会审批通过
  APPROVED = 'APPROVED',             // 终审通过(团委)
  REJECTED = 'REJECTED',             // 审批退回
  REVOKED = 'REVOKED'                // 已撤回
}

export enum ApplicantRole {
  STUDENT = 'STUDENT',               // 学生
  FACULTY = 'FACULTY'                // 教职工
}

export enum Campus {
  SIMING = '思明校区',
  XIANGAN = '翔安校区'
}

export interface OrganizationRole {
  id: string;
  orgName: string;                  // 组织单位名称
  orgType: '学生组织' | '学术社团' | '行政部门' | '学院党政';
  canApplyPoster: boolean;          // 是否可申请海报
  canApplyGraffiti: boolean;        // 是否可申请涂鸦
  counselor: string;                // 辅导员 / OA秘书
  counselorPhone: string;
  deptLeader: string;               // 部门审批负责人
  studentUnionReviewer: string;     // 团委/学生会审批员
  isBanned: boolean;                // 是否违规禁申
  banReason?: string;
  banUntil?: string;
}

export interface Inspector {
  id: string;
  name: string;
  studentId: string;
  phone: string;
  campus: Campus;
  assignedBoardIds: string[];      // 绑定的张贴栏/隧道区域
  status: 'ACTIVE' | 'DISABLED';
  joinedDate: string;
  totalInspections: number;
}

export interface InspectionLog {
  id: string;
  inspectorName: string;
  targetType: 'POSTER_BOARD' | 'TUNNEL_ZONE' | string;
  campus?: string;
  targetName: string;
  checkTime: string;
  result: 'NORMAL' | 'ABNORMAL' | string;
  notes: string;
  photoUrl?: string;
  photoUrls?: string[];
  actionTaken?: '未做任何处理' | '撕下海报' | string;
  actionNotes?: string;
}

export interface InspectionWarning {
  id: string;
  targetName: string;
  campus: Campus;
  responsibleInspector: string;
  phone: string;
  lastCheckTime: string;
  overdueHours: number;
  status: 'PENDING' | 'RESOLVED';
  createdTime: string;
}

export interface ViolationEvent {
  id: string;
  title?: string;
  campus: string;                       // 校区
  targetType: string;                   // 违规对象类型 ('公共海报栏' | '芙蓉隧道' 等)
  targetName: string;                   // 违规对象
  type: '未加盖印章/二维码' | '超期未清理' | '擅自覆盖他人作品' | '内容与审批不符' | '墙面/展板损坏' | string; // 违规类型
  description: string;                  // 异常描述/现场情况说明
  reportTime: string;                   // 上报时间
  reportedBy: string;                   // 上报人员
  status: 'PENDING' | 'PROCESSED' | string; // 状态：待处理 / 已处理
  handleTime?: string;                  // 处理时间
  handleMethod?: string;                // 处理方式 / 处理结果
  handledBy?: string;                   // 处理人员
  location?: string;
  photoUrl?: string;
  photoUrls?: string[];
  rectifyNotice?: string;
  rectifyDeadline?: string;

  // 现场上报额外信息
  siteAction?: string;                  // 现场处理措施
  siteNotes?: string;                   // 现场处理说明

  // 处理意见
  isTruthful?: '情况属实' | '情况不属实';     // 是否属实
  verifiedConclusion?: '不按要求张贴' | '篡改内容' | '未申报张贴' | string; // 核定违规结论
  verifiedFactNotes?: string;           // 核定事实说明
  processResult?: '不处理' | '发整改通知书' | '加入申请黑名单' | string; // 处理结果
}

export interface GraffitiTheme {
  id: string;
  name: string;                     // 毕业季、艺术探新、百年校庆等
  description: string;
  activeCount: number;
  createdBy?: string;               // 创建人
  createdAt: string;
}

export interface QRCodeBinding {
  id: string;
  qrCode: string;                   // 二维码编号 XM-QR-2026-XXXX
  type: 'ADHESIVE_POSTER' | 'PVC_GRAFFITI'; // 不干胶二维码 / PVC二维码
  targetTitle: string;
  orgName: string;
  validFrom: string;
  validTo: string;
  boundTime: string;
  status: 'BOUND' | 'PRINTED' | 'EXPIRED';
}

export interface PosterBoardColumn {
  colIndex: number;                 // 列编号 1-6
  isOccupied: boolean;
  currentPosterId?: string;
  currentPosterTitle?: string;
  orgName?: string;
  validTo?: string;
}

export interface PosterBoard {
  id: string;
  name: string;                     // 例：三家村1号张贴栏
  campus: Campus;
  locationDetail: string;           // 详细位置，例：思明校区三家村小广场东侧
  totalColumns: number;             // 按列划分，例：6列
  status: 'ACTIVE' | 'DISABLED';    // 停用状态
  disableReason?: string;
  estimatedRestoreDate?: string;
  inspectorName: string;
  columns: PosterBoardColumn[];
}

export interface PosterApplication {
  id: string;
  title: string;                    // 活动海报名称
  applicantName: string;
  applicantRole: ApplicantRole;
  orgName: string;
  contactPhone: string;
  posterImageUrl: string;
  boardIds: string[];               // 可选多个张贴栏位置
  selectedColumns: { boardId: string; colIndices: number[] }[]; // 选座锁定列
  posterSize: 'A0' | 'A1' | 'A2' | '定制展幅';
  startDate: string;
  endDate: string;                  // 最少1天，最长3天
  daysCount: number;
  status: ApprovalStatus;
  currentStep: string;              // 当前审批环节：辅导员初审 / 部门领导审核 / 学生会审批 / 团委终审 / 审批通过
  approvalLogs: {
    step: string;
    reviewer: string;
    action: 'APPROVED' | 'REJECTED';
    comment: string;
    timestamp: string;
  }[];
  qrCode?: string;                  // 绑定的不干胶二维码
  submittedAt: string;
}

export interface GraffitiArea {
  id: string;
  sectionCode: string;              // 区域编号 例：S-120m ~ S-125m (每列5cm-5m)
  side: 'LEFT' | 'RIGHT';           // 左侧 / 右侧
  meterStart: number;
  meterEnd: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
  currentOwnerOrg?: string;         // 当前拥有使用权的单位
  ownershipValidTo?: string;        // 使用权到期日（有效期一年）
}

export interface AreaUsageApplication {
  id: string;
  applicantName: string;
  orgName: string;
  applicantRole: ApplicantRole;
  phone: string;
  areaId: string;
  sectionCode: string;
  usagePlan: string;                // 使用计划概述
  applyTermYears: number;           // 默认1年
  status: ApprovalStatus;
  submittedAt: string;
  approvalLogs: { step: string; reviewer: string; action: string; comment: string; timestamp: string; }[];
}

export interface GraffitiSubmission {
  id: string;
  title: string;                    // 涂鸦作品名称 例：《毕业季·我爱你厦大》
  areaId: string;
  sectionCode: string;
  side: 'LEFT' | 'RIGHT';
  themeId: string;                  // 涂鸦主题分类
  themeName: string;
  applicantName: string;
  orgName: string;
  artistTeam: string;               // 创作团队/画手
  artworkImageUrl: string;
  creationStartDate: string;
  creationEndDate: string;
  status: ApprovalStatus;
  qrCode?: string;                  // 绑定的PVC二维码
  submittedAt: string;
  likesCount: number;
  approvalLogs: { step: string; reviewer: string; action: string; comment: string; timestamp: string; }[];
}

export interface Murals3DItem {
  id: string;
  title: string;
  artist: string;
  orgName: string;
  theme: string;
  side: 'LEFT' | 'RIGHT';
  meterPosition: number;            // 隧道米数，例：125m
  imageUrl: string;
  year: string;
  likes: number;
  description: string;
  qrCode: string;
}
