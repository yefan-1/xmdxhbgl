export interface FeatureItem {
  id: number;
  systemName: string;       // 系统名称
  blockName: string;        // 块名称
  featurePoint: string;     // 功能点
  description: string;      // 功能点描述
  code?: string;            // 模块编号
  targetRoles?: string;     // 适用对象/角色
}

export const SYSTEM_FEATURE_CATALOG: FeatureItem[] = [
  // ==========================================
  // 子系统一：后台管理系统
  // ==========================================
  {
    id: 1,
    systemName: '后台管理系统',
    blockName: '系统首页与监控中心',
    featurePoint: '全局态势主控大屏',
    description: '综合纵览全校（思明校区、翔安校区）海报张贴栏实时占用率、芙蓉隧道 3D 涂鸦分布图谱、今日巡检任务打卡进度及违规警报事件统计，提供全局数字孪生大屏。',
    code: 'SYS-DASHBOARD',
    targetRoles: '全角色 / 管理员 / 校团委'
  },
  {
    id: 2,
    systemName: '后台管理系统',
    blockName: '系统首页与监控中心',
    featurePoint: '多角色权限动态切换',
    description: '支持辅导员/OA秘书、单位负责人、学生会负责人、校团委、教职工、学生等6类角色一键切换，动态渲染专属导航树、专属待办任务角标与审批工作台。',
    code: 'SYS-ROLE-SWITCH',
    targetRoles: '超级管理员 / 各级审批人员'
  },
  {
    id: 3,
    systemName: '后台管理系统',
    blockName: '系统首页与监控中心',
    featurePoint: '全局智能检索与操作指引库',
    description: '全站菜单、功能点快捷搜索，内置标准作业程序(SOP)操作指引引导弹窗与直达跳转，支持精准定位任意业务节点。',
    code: 'SYS-SEARCH-GUIDE',
    targetRoles: '全角色'
  },
  {
    id: 4,
    systemName: '后台管理系统',
    blockName: '系统首页与监控中心',
    featurePoint: '个人中心与审计日志管理',
    description: '支持个人基本资料维护、常用业务功能收藏夹、导出报表文件下载管理以及系统登录鉴权全要素安全审计日志追踪。',
    code: 'SYS-USER-CENTER',
    targetRoles: '全角色'
  },
  {
    id: 5,
    systemName: '后台管理系统',
    blockName: '系统首页与监控中心',
    featurePoint: '多标签页(Tabs)多任务交互体系',
    description: '支持多业务模块多标签页并行打开、标签拖拽排序、右键快捷关闭其它/关闭所有，大幅提升高频业务切换效率。',
    code: 'SYS-TABS-NAV',
    targetRoles: '后台管理员'
  },

  // 1. 海报张贴管理
  {
    id: 6,
    systemName: '后台管理系统',
    blockName: '海报张贴管理',
    featurePoint: '海报张贴可视化选位申请 (POS-02)',
    description: '支持按校区、楼栋、具体展栏进行可视化选格选座（如 A1-A12 格位）；自动计算张贴周期与失效天数，支持海报原图设计稿上传、宣发主题/主办单位填报及防伪二维码预生成。',
    code: 'POS-02',
    targetRoles: '学生 / 教职工 / 社团负责人'
  },
  {
    id: 7,
    systemName: '后台管理系统',
    blockName: '海报张贴管理',
    featurePoint: '四级审批工作台 (POS-03)',
    description: '完整构建“辅导员初审 ➔ 单位负责人审核 ➔ 学生会统筹 ➔ 校团委终审”四级审批全闭环，支持原图高清查看、合规快速核对、批量审批通过、驳回理由回填及完整审批流时间线存证。',
    code: 'POS-03',
    targetRoles: '辅导员 / 单位负责人 / 学生会 / 校团委'
  },
  {
    id: 8,
    systemName: '后台管理系统',
    blockName: '海报张贴管理',
    featurePoint: '巡检二维码核发与管理 (POS-03-TUANWEI)',
    description: '校团委终审通过后自动生成专属加密防伪二维码，支持一键批量导出打印防伪不干胶标签，支持生成移动巡检核销凭证。',
    code: 'POS-03-TUANWEI',
    targetRoles: '校团委审批主管'
  },
  {
    id: 9,
    systemName: '后台管理系统',
    blockName: '海报张贴管理',
    featurePoint: '线上海报栏数字化展厅 (POS-10)',
    description: '按校区及建筑网格分类聚合展示全校当前正在生效张贴的所有数字海报，支持缩放鉴赏、活动搜索、主办方筛选与实时展期剩余倒计时监控。',
    code: 'POS-10',
    targetRoles: '全校师生 / 访客 / 管理员'
  },
  {
    id: 10,
    systemName: '后台管理系统',
    blockName: '海报张贴管理',
    featurePoint: '海报全生命周期历史库 (POS-09)',
    description: '对全校已审批、在展、超期、下架海报实施全生命周期数字化归档，支持按学院、活动类型、时间跨度多维检索，保留高清原图与审批档案。',
    code: 'POS-09',
    targetRoles: '校团委 / 档案管理员'
  },
  {
    id: 11,
    systemName: '后台管理系统',
    blockName: '海报张贴管理',
    featurePoint: '物理张贴栏空间管理 (POS-01)',
    description: '管理全校各实体张贴栏物理坐标位置、规格尺寸、版面格位划分（如A1-A12）、使用状态控制（正常/修缮/停用）及容积率预警。',
    code: 'POS-01',
    targetRoles: '物业后勤 / 校团委设施管理员'
  },
  {
    id: 12,
    systemName: '后台管理系统',
    blockName: '海报张贴管理',
    featurePoint: '海报数据统计分析 (POS-11)',
    description: '可视化大屏图表呈现各学院/社团张贴频次排行、各张贴栏热度占用率热力图、申请审批通过率趋势及超期违规事件环比走势分析。',
    code: 'POS-11',
    targetRoles: '校团委决策层 / 数据分析师'
  },

  // 2. 芙蓉隧道涂鸦管理
  {
    id: 13,
    systemName: '后台管理系统',
    blockName: '芙蓉隧道涂鸦管理',
    featurePoint: '隧道涂鸦区域精准申请 (GRA-02)',
    description: '以 5cm 为最小单位精确划定 1.1 公里芙蓉隧道南北两侧墙面区间，支持起止米数定位、创作设计草案提交及团队资质申报。',
    code: 'GRA-02',
    targetRoles: '学生团队 / 学院组织 / 创作者'
  },
  {
    id: 14,
    systemName: '后台管理系统',
    blockName: '芙蓉隧道涂鸦管理',
    featurePoint: '隧道涂鸦区域审批 (GRA-02-APPROVAL)',
    description: '对涂鸦墙面申请区间进行空间冲突检测、使用年限(1年期)合规审查与配额核定，杜绝占用冲突与空间重叠。',
    code: 'GRA-02-APPROVAL',
    targetRoles: '校团委场地管理组'
  },
  {
    id: 15,
    systemName: '后台管理系统',
    blockName: '芙蓉隧道涂鸦管理',
    featurePoint: '涂鸦终稿内容报批 (GRA-06)',
    description: '提交终稿设计画作彩图、创作人员名单、所用环保涂料品类清单及现场安全文明施工承诺书，落实责任到人。',
    code: 'GRA-06',
    targetRoles: '获批涂鸦团队主创'
  },
  {
    id: 16,
    systemName: '后台管理系统',
    blockName: '芙蓉隧道涂鸦管理',
    featurePoint: '涂鸦内容多维深度审查 (GRA-06-APPROVAL)',
    description: '开展思想政治导向、文化艺术水准、环保施工安全的三级内容深度审查，支持在线标注修改意见与批复归档。',
    code: 'GRA-06-APPROVAL',
    targetRoles: '校团委文化艺术指导委员会'
  },
  {
    id: 17,
    systemName: '后台管理系统',
    blockName: '芙蓉隧道涂鸦管理',
    featurePoint: '数字化涂鸦作品库 (GRA-14)',
    description: '高精度数字化档案收录芙蓉隧道经典历史名作（如《我爱你，再见》等），记录作者院系、创作年份、艺术释义与历史更迭版本。',
    code: 'GRA-14',
    targetRoles: '全校师生 / 校史档案中心'
  },
  {
    id: 18,
    systemName: '后台管理系统',
    blockName: '芙蓉隧道涂鸦管理',
    featurePoint: '涂鸦区域高精标定管理 (GRA-01)',
    description: '1100米双侧墙面高精度网格化标定，关联获批单位 1 年期使用权，自动绑定并管理实体墙面 PVC 永固防伪二维码铭牌。',
    code: 'GRA-01',
    targetRoles: '校团委设施主管 / 物业保障处'
  },
  {
    id: 19,
    systemName: '后台管理系统',
    blockName: '芙蓉隧道涂鸦管理',
    featurePoint: '涂鸦数据统计分析 (GRA-16)',
    description: '全隧道墙面有效覆盖率、各院系创作占比、涂鸦保留年限分布及重点文化点位人气指数多维分析图表展示。',
    code: 'GRA-16',
    targetRoles: '校团委决策层'
  },
  {
    id: 20,
    systemName: '后台管理系统',
    blockName: '芙蓉隧道涂鸦管理',
    featurePoint: '线上芙蓉隧道孪生映射 (GRA-15)',
    description: 'Web 端轻量化快速体验芙蓉隧道 1.1 公里全线涂鸦数字化镜像分布，联动 3D 沉浸式漫游模块无缝切换。',
    code: 'GRA-15',
    targetRoles: '全角色 / 访客'
  },

  // 3. 巡检管理
  {
    id: 21,
    systemName: '后台管理系统',
    blockName: '巡检管理',
    featurePoint: '巡检员档案与网格包干 (PUB-02)',
    description: '学生会及物业巡检员花名册录入、责任包干网格划分、值班轮换排班与移动端登录权限认证及履职评分管理。',
    code: 'PUB-02',
    targetRoles: '学生会巡检主管 / 保卫处'
  },
  {
    id: 22,
    systemName: '后台管理系统',
    blockName: '巡检管理',
    featurePoint: '巡检记录与轨迹存证 (PUB-03)',
    description: '汇聚全校张贴栏与涂鸦区域的巡检打卡时间、GPS定位点、核验照片与巡检合格率综合台账，支持按点位及巡检员回溯追溯。',
    code: 'PUB-03',
    targetRoles: '学生会巡检组 / 校团委'
  },
  {
    id: 23,
    systemName: '后台管理系统',
    blockName: '巡检管理',
    featurePoint: '巡检预警与超时报警 (PUB-04)',
    description: '对长期未巡检网格触发“超时未巡”黄/红级预警；对在展超期未撤除的海报自动生成清理催办预警通知，督促闭环整改。',
    code: 'PUB-04',
    targetRoles: '巡检调度员 / 网格责任人'
  },
  {
    id: 24,
    systemName: '后台管理系统',
    blockName: '巡检管理',
    featurePoint: '违规事件全流程闭环处理 (PUB-05)',
    description: '对未经审批张贴、覆盖他人、涂鸦破坏、虚假伪造等现场违规事件立案建档，生成整改工单、跟踪现场拆除取证与闭环销单。',
    code: 'PUB-05',
    targetRoles: '巡检监管员 / 纪律监察组'
  },

  // 4. 公共设置
  {
    id: 25,
    systemName: '后台管理系统',
    blockName: '公共设置',
    featurePoint: '组织角色与信用积分管理 (PUB-01)',
    description: '管理全校学生社团、学院团委、学生组织、职能部门账号，建立组织张贴信用分，支持违规冻结、黑名单列入与申诉恢复。',
    code: 'PUB-01',
    targetRoles: '校团委系统管理员'
  },
  {
    id: 26,
    systemName: '后台管理系统',
    blockName: '公共设置',
    featurePoint: '多级审批流程与角色设置 (PUB-08)',
    description: '配置四级海报审批流与涂鸦审批流节点人员、委托代批规则、审批抄送及各级权限矩阵细粒度管控。',
    code: 'PUB-08',
    targetRoles: '系统管理员'
  },
  {
    id: 27,
    systemName: '后台管理系统',
    blockName: '公共设置',
    featurePoint: '涂鸦创作主题管理 (PUB-06)',
    description: '迎新季、校庆日、毕业季等官方专项涂鸦创作主题与规范指南发布、申报开放窗口期控制与优秀作品评奖设置。',
    code: 'PUB-06',
    targetRoles: '校团委宣传部'
  },
  {
    id: 28,
    systemName: '后台管理系统',
    blockName: '公共设置',
    featurePoint: '巡检规则与扣分机制配置 (PUB-07)',
    description: '自定义各网格巡检最低频次、违规判定标准、扣分细则及整改时限自动提醒阈值，建立制度化长效管理标准。',
    code: 'PUB-07',
    targetRoles: '校团委管理层'
  },

  // ==========================================
  // 子系统二：巡检系统 (移动端)
  // ==========================================
  {
    id: 29,
    systemName: '巡检系统 (移动端)',
    blockName: '移动巡检工作台',
    featurePoint: '今日巡检态势与概览看板',
    description: '实时展示今日值班巡检员身份、所属包干网格、已巡点位进度、待巡点位清单与异常发现统计，指导每日巡检节奏。',
    code: 'MOB-DASHBOARD',
    targetRoles: '移动端巡检员'
  },
  {
    id: 30,
    systemName: '巡检系统 (移动端)',
    blockName: '移动巡检工作台',
    featurePoint: '高频任务快捷直达通道',
    description: '移动端顶置“扫码查验”、“点位巡检”、“违规速报”、“异常预警”、“巡检记录”等核心操作入口，适配手机单手便捷交互。',
    code: 'MOB-QUICK-NAV',
    targetRoles: '移动端巡检员'
  },
  {
    id: 31,
    systemName: '巡检系统 (移动端)',
    blockName: '扫码查验与真伪核验',
    featurePoint: '海报防伪二维码极速扫码核验',
    description: '手机镜头扫描海报上的加密二维码，瞬间比对后台备案数据库，校验展期合法性、张贴栏格位一致性与申请单位真伪。',
    code: 'MOB-SCAN-POSTER',
    targetRoles: '移动端巡检员'
  },
  {
    id: 32,
    systemName: '巡检系统 (移动端)',
    blockName: '扫码查验与真伪核验',
    featurePoint: '隧道 PVC 铭牌核验',
    description: '扫描隧道墙面 PVC 永固铭牌二维码，核验 5cm 标定区间合法性、创作团队及批复作品图稿，判断是否存在越界涂鸦。',
    code: 'MOB-SCAN-TUNNEL',
    targetRoles: '移动端巡检员'
  },
  {
    id: 33,
    systemName: '巡检系统 (移动端)',
    blockName: '现场点位巡检',
    featurePoint: '点位多级联动筛选定位',
    description: '按思明校区/翔安校区、建筑区域（如三民楼、芙蓉一等）、具体张贴栏及隧道段筛选待巡目标点位，查看点位信息。',
    code: 'MOB-SPOT-FILTER',
    targetRoles: '移动端巡检员'
  },
  {
    id: 34,
    systemName: '巡检系统 (移动端)',
    blockName: '现场点位巡检',
    featurePoint: '现场拍照存证打卡',
    description: '集成手机相机模拟拍摄，自动附加巡检时间、点位防伪水印，完成现场履职存证打卡。',
    code: 'MOB-SPOT-PHOTO',
    targetRoles: '移动端巡检员'
  },
  {
    id: 35,
    systemName: '巡检系统 (移动端)',
    blockName: '现场点位巡检',
    featurePoint: '巡检项目逐项核查 (单行不换行表格与平滑按钮)',
    description: '对“未张贴二维码”、“超期未清理”、“覆盖他人海报”、“与备案不符”、“展板表面破损”等核验项，采用单行清晰表格及绿色正常/红色异常平滑分段按钮逐项判定。',
    code: 'MOB-SPOT-CHECKLIST',
    targetRoles: '移动端巡检员'
  },
  {
    id: 36,
    systemName: '巡检系统 (移动端)',
    blockName: '现场点位巡检',
    featurePoint: '巡检异常处置弹窗与取证',
    description: '当核查结论异常时自动触发模态弹窗，提供“现场下架/拆除”、“限期联系整改”、“补办审批手续”、“违规上报工单”四种处置方式，支持多行异常描述与预设快捷标签。',
    code: 'MOB-ABNORMAL-MODAL',
    targetRoles: '移动端巡检员'
  },
  {
    id: 37,
    systemName: '巡检系统 (移动端)',
    blockName: '现场点位巡检',
    featurePoint: '异常现场多图拍照取证',
    description: '在异常处理模态窗内支持现场连续拍摄多张高清取证照片，提供照片预览缩略图、一键删除重拍及实时上传入档。',
    code: 'MOB-ABNORMAL-PHOTOS',
    targetRoles: '移动端巡检员'
  },
  {
    id: 38,
    systemName: '巡检系统 (移动端)',
    blockName: '现场点位巡检',
    featurePoint: '巡检总结论与一键提交',
    description: '自动汇聚各分项核查结果计算总结论（合格/异常），支持一键提交并自动更新后台巡检台账与网格健康度指数。',
    code: 'MOB-SPOT-SUBMIT',
    targetRoles: '移动端巡检员'
  },
  {
    id: 39,
    systemName: '巡检系统 (移动端)',
    blockName: '违规事件快速上报',
    featurePoint: '突发违规现场急报工单',
    description: '针对未经审批私自张贴、恶意涂画、商业小广告或公物损毁，支持巡检员紧急拍照、定位并秒级推送至后台违规事件工单池。',
    code: 'MOB-INCIDENT-REPORT',
    targetRoles: '移动端巡检员'
  },
  {
    id: 40,
    systemName: '巡检系统 (移动端)',
    blockName: '个人中心与历史存证',
    featurePoint: '个人巡检工时档案与历史回溯',
    description: '统计个人累计巡检点位数、发现异常数、巡检合格率，提供历史所有巡检记录列表与现场照片快速回溯查阅。',
    code: 'MOB-PROFILE-HISTORY',
    targetRoles: '移动端巡检员'
  },

  // ==========================================
  // 子系统三：线上展示系统 (公众端)
  // ==========================================
  {
    id: 41,
    systemName: '线上展示系统 (公众端)',
    blockName: '3D 沉浸式芙蓉隧道漫游',
    featurePoint: 'Three.js 驱动 3D 隧道场景孪生建模',
    description: '基于 Three.js 物理渲染引擎，高精度构建 1.1 公里芙蓉隧道筒状空间、地面光影、墙面涂鸦连续画卷与空间景深透视。',
    code: 'PUB-3D-ENGINE',
    targetRoles: '全校师生 / 校友 / 广大公众'
  },
  {
    id: 42,
    systemName: '线上展示系统 (公众端)',
    blockName: '3D 沉浸式芙蓉隧道漫游',
    featurePoint: '第一人称自由漫游与自动巡航控制',
    description: '支持鼠标/触控拖拽视角旋转、滚轮推进缩放、键盘行走导航，支持一键启动沿隧道中轴线的自动化全景平滑漫游巡航。',
    code: 'PUB-3D-NAVIGATION',
    targetRoles: '全校师生 / 广大公众'
  },
  {
    id: 43,
    systemName: '线上展示系统 (公众端)',
    blockName: '3D 沉浸式芙蓉隧道漫游',
    featurePoint: '经典涂鸦点位交互解说弹窗',
    description: '点击隧道两侧涂鸦模型交互热点，弹出作品名称、创作者院系、创作理念、高清细节大图及历史故事解读。',
    code: 'PUB-3D-HOTSPOT',
    targetRoles: '全校师生 / 广大公众'
  },
  {
    id: 44,
    systemName: '线上展示系统 (公众端)',
    blockName: '3D 沉浸式芙蓉隧道漫游',
    featurePoint: '涂鸦在线点赞与互动送花',
    description: '公众可在 3D 场景中为喜爱的涂鸦名作在线点赞、送上厦大之花，实时更新涂鸦作品的人气排名与互动计数。',
    code: 'PUB-3D-LIKE',
    targetRoles: '全校师生 / 广大公众'
  },
  {
    id: 45,
    systemName: '线上展示系统 (公众端)',
    blockName: '3D 沉浸式芙蓉隧道漫游',
    featurePoint: '时光机历史涂鸦档案回溯对比',
    description: '点击特定墙段切换历史年份版本，直观对比同一墙面历年涂鸦艺术的更迭演进，记录厦大校园文化珍贵变迁记忆。',
    code: 'PUB-3D-TIMEMACHINE',
    targetRoles: '全校师生 / 校史爱好者'
  },
  {
    id: 46,
    systemName: '线上展示系统 (公众端)',
    blockName: '线上海报数字展栏',
    featurePoint: '双校区线上海报展栏在线聚合',
    description: '集中聚合展示思明校区与翔安校区各宣传栏当前正在展出的全校学术、文体、公益活动海报，打破物理地域限制。',
    code: 'PUB-POSTER-BOARD',
    targetRoles: '全校师生 / 广大公众'
  },
  {
    id: 47,
    systemName: '线上展示系统 (公众端)',
    blockName: '线上海报数字展栏',
    featurePoint: '海报多维检索与分类筛选',
    description: '支持按学术讲座、文体艺术、志愿公益、社团招新等多标签即时筛选，支持按活动名称或主办方关键字搜索。',
    code: 'PUB-POSTER-FILTER',
    targetRoles: '全校师生 / 广大公众'
  },
  {
    id: 48,
    systemName: '线上展示系统 (公众端)',
    blockName: '线上海报数字展栏',
    featurePoint: '海报高清画廊预览与活动详情',
    description: '画廊式大图弹窗鉴赏海报设计，清晰查看活动时间、举办地点、主办单位及活动报名二维码。',
    code: 'PUB-POSTER-PREVIEW',
    targetRoles: '全校师生 / 广大公众'
  },
  {
    id: 49,
    systemName: '线上展示系统 (公众端)',
    blockName: '线上海报数字展栏',
    featurePoint: '校园文化打卡数字地图',
    description: '以手绘与矢量校园地图形式标定全校各海报张贴栏物理点位与芙蓉隧道出入口，提供校园文化路线打卡导引。',
    code: 'PUB-CAMPUS-MAP',
    targetRoles: '全校师生 / 广大公众'
  }
];
