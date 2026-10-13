import React, { useState } from 'react';
import {
  Search,
  RotateCcw,
  Plus,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Image as ImageIcon,
  Building2,
  Calendar,
  MapPin,
  FileText,
  User,
  QrCode,
  CheckCircle2,
  Upload,
  Palette
} from 'lucide-react';

export interface GraffitiItem {
  id: string;
  imageUrl: string;          // 图片
  theme: string;             // 涂鸦主题
  description: string;       // 构想说明
  area: string;              // 涂鸦区域
  unit: string;              // 涂鸦单位
  graffitiTime: string;      // 涂鸦时间
  artist?: string;           // 创作人
  contactPhone?: string;     // 联系电话
  qrCode?: string;           // 防伪码
}

// Preset Options for Theme and Unit Dropdowns
const THEME_OPTIONS = [
  '《我爱你厦大 · 毕业季》',
  '《海丝嘉庚号 · 蓝海征途》',
  '《Hello World · 算力星图》',
  '《凤凰花开 · 光影厦大》',
  '《赛博光影 · 创想未来》',
  '《赤子同心 · 华夏宏图》',
  '《绿野仙踪 · 生态家园》',
  '《万国筑梦 · 世界同辉》',
  '《厦大百年 · 嘉庚华章》'
];

const UNIT_OPTIONS = [
  '艺术学院青年志愿者协会',
  '海洋与地球学院团党委',
  '计算机科学与技术系',
  '校学生会宣传部',
  '物理科学与技术学院',
  '人文学院团委',
  '环境与生态学院',
  '海外教育学院/国际学院',
  '建筑与土木工程学院',
  '化学化工学院'
];

// Initial Mock Data
const INITIAL_GRAFFITI_LIST: GraffitiItem[] = [
  {
    id: 'gra-lib-1',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&q=80',
    theme: '《我爱你厦大 · 毕业季》',
    description: '厦大芙蓉隧道最负盛名的经典打卡地，满载毕业生对母校的深情寄语与永恒记忆，画面运用宏大视觉叙事。',
    area: 'K12+120.00 ~ K12+135.00 (左壁)',
    unit: '艺术学院青年志愿者协会',
    graffitiTime: '2026-05-20',
    artist: '2022级艺术学院毕业生团队',
    contactPhone: '13812345678',
    qrCode: 'XM-PVC-GRAFFITI-2026-001'
  },
  {
    id: 'gra-lib-2',
    imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80',
    theme: '《海丝嘉庚号 · 蓝海征途》',
    description: '致敬陈嘉庚先生倾资兴学宏愿，描绘深海科考与蓝色梦想的新篇章，包含嘉庚号科考船细节。',
    area: 'K12+210.00 ~ K12+225.00 (右壁)',
    unit: '海洋与地球学院团党委',
    graffitiTime: '2026-05-18',
    artist: '海洋先锋创作组',
    contactPhone: '13988887777',
    qrCode: 'XM-PVC-GRAFFITI-2026-002'
  },
  {
    id: 'gra-lib-3',
    imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80',
    theme: '《Hello World · 算力星图》',
    description: '将二进制代码与星系漩涡融为一体，彰显科技与人文的交织碰撞，展现信息学子未来畅想。',
    area: 'K12+350.00 ~ K12+365.00 (左壁)',
    unit: '计算机科学与技术系',
    graffitiTime: '2026-05-12',
    artist: '极客俱乐部创作组',
    contactPhone: '13655554444',
    qrCode: 'XM-PVC-GRAFFITI-2026-003'
  },
  {
    id: 'gra-lib-4',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
    theme: '《凤凰花开 · 光影厦大》',
    description: '六月凤凰花开满演武场，火红的花海与嘉庚建筑相互辉映，如诗如画，展现校园人文底蕴。',
    area: 'K12+480.00 ~ K12+495.00 (右壁)',
    unit: '校学生会宣传部',
    graffitiTime: '2026-05-08',
    artist: '摄影与视觉艺术协会',
    contactPhone: '13566668888',
    qrCode: 'XM-PVC-GRAFFITI-2026-004'
  },
  {
    id: 'gra-lib-5',
    imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&q=80',
    theme: '《赛博光影 · 创想未来》',
    description: '融合新媒体数字艺术与赛博朋克光效，重构芙蓉隧道空间感，为师生打造沉浸式光影长廊。',
    area: 'K12+510.00 ~ K12+525.00 (左壁)',
    unit: '物理科学与技术学院',
    graffitiTime: '2026-04-28',
    artist: '光电科技实验室',
    contactPhone: '13711112222',
    qrCode: 'XM-PVC-GRAFFITI-2026-005'
  },
  {
    id: 'gra-lib-6',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&q=80',
    theme: '《赤子同心 · 华夏宏图》',
    description: '画卷展现五千年来中华优秀传统文化的薪火相传，包含书法、京剧脸谱与现代航天梦。',
    area: 'K12+600.00 ~ K12+615.00 (右壁)',
    unit: '人文学院团委',
    graffitiTime: '2026-04-15',
    artist: '国学社与书画协会',
    contactPhone: '13922223333',
    qrCode: 'XM-PVC-GRAFFITI-2026-006'
  },
  {
    id: 'gra-lib-7',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
    theme: '《绿野仙踪 · 生态家园》',
    description: '倡导人与自然和谐共生理念，绘有国家珍稀动植物与绿色校园美景，色彩绚丽生动。',
    area: 'K12+720.00 ~ K12+735.00 (左壁)',
    unit: '环境与生态学院',
    graffitiTime: '2026-04-02',
    artist: '绿色志愿者协会',
    contactPhone: '13833334444',
    qrCode: 'XM-PVC-GRAFFITI-2026-007'
  },
  {
    id: 'gra-lib-8',
    imageUrl: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=800&q=80',
    theme: '《万国筑梦 · 世界同辉》',
    description: '展示厦门大学多元文明交流互鉴与国际化办学特色，多国留学生共同挥毫创作。',
    area: 'K12+830.00 ~ K12+845.00 (右壁)',
    unit: '海外教育学院/国际学院',
    graffitiTime: '2026-03-22',
    artist: '国际文化交流学会',
    contactPhone: '13644445555',
    qrCode: 'XM-PVC-GRAFFITI-2026-008'
  }
];

export default function GraffitiLibraryModule() {
  // Main Data State
  const [graffitiList, setGraffitiList] = useState<GraffitiItem[]>(INITIAL_GRAFFITI_LIST);

  // Search Input States
  const [searchUnitInput, setSearchUnitInput] = useState('');
  const [startDateInput, setStartDateInput] = useState('');
  const [endDateInput, setEndDateInput] = useState('');
  const [searchAreaInput, setSearchAreaInput] = useState('');
  const [searchThemeInput, setSearchThemeInput] = useState('');

  // Applied Filter States
  const [appliedFilters, setAppliedFilters] = useState({
    unit: '',
    startDate: '',
    endDate: '',
    area: '',
    theme: ''
  });

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedViewItem, setSelectedViewItem] = useState<GraffitiItem | null>(null);

  // New Item Form State (Strict 1 Row 1 Field)
  // Fields: 涂鸦主题, 涂鸦单位, 涂鸦区域, 涂鸦时间, 创作人, 构想说明, 图片
  const [newItemTheme, setNewItemTheme] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('');
  const [newItemArea, setNewItemArea] = useState('');
  const [newItemTime, setNewItemTime] = useState(new Date().toISOString().split('T')[0]);
  const [newItemArtist, setNewItemArtist] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Handle Search & Reset
  const handleSearch = () => {
    setAppliedFilters({
      unit: searchUnitInput.trim(),
      startDate: startDateInput,
      endDate: endDateInput,
      area: searchAreaInput.trim(),
      theme: searchThemeInput.trim()
    });
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchUnitInput('');
    setStartDateInput('');
    setEndDateInput('');
    setSearchAreaInput('');
    setSearchThemeInput('');
    setAppliedFilters({
      unit: '',
      startDate: '',
      endDate: '',
      area: '',
      theme: ''
    });
    setCurrentPage(1);
  };

  // Handle Image Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Filter Logic
  const filteredList = graffitiList.filter((item) => {
    if (appliedFilters.unit && !item.unit.toLowerCase().includes(appliedFilters.unit.toLowerCase())) {
      return false;
    }
    if (appliedFilters.area && !item.area.toLowerCase().includes(appliedFilters.area.toLowerCase())) {
      return false;
    }
    if (appliedFilters.theme && !item.theme.toLowerCase().includes(appliedFilters.theme.toLowerCase())) {
      return false;
    }
    if (appliedFilters.startDate && item.graffitiTime < appliedFilters.startDate) {
      return false;
    }
    if (appliedFilters.endDate && item.graffitiTime > appliedFilters.endDate) {
      return false;
    }
    return true;
  });

  // Pagination Logic
  const totalCount = filteredList.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const pagedList = filteredList.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const currentStart = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const currentEnd = Math.min(currentPage * pageSize, totalCount);

  // Submit Add New Graffiti Item
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTheme || !newItemUnit || !newItemArea.trim()) {
      alert('请填写必要的信息：涂鸦主题、涂鸦单位、涂鸦区域');
      return;
    }

    const defaultImages = [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&q=80',
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80',
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80',
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80'
    ];
    const finalImage = uploadedImagePreview || defaultImages[Math.floor(Math.random() * defaultImages.length)];

    const newItem: GraffitiItem = {
      id: `gra-lib-${Date.now()}`,
      imageUrl: finalImage,
      theme: newItemTheme,
      unit: newItemUnit,
      area: newItemArea.trim(),
      graffitiTime: newItemTime || new Date().toISOString().split('T')[0],
      artist: newItemArtist.trim() || newItemUnit,
      description: newItemDescription.trim() || '无构想说明描述',
      qrCode: `XM-PVC-GRAFFITI-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`
    };

    setGraffitiList([newItem, ...graffitiList]);
    setIsAddModalOpen(false);

    // Reset Form
    setNewItemTheme('');
    setNewItemUnit('');
    setNewItemArea('');
    setNewItemTime(new Date().toISOString().split('T')[0]);
    setNewItemArtist('');
    setNewItemDescription('');
    setUploadedImagePreview(null);

    showToast('成功新增涂鸦作品！');
  };

  return (
    <div className="p-6 bg-gray-50/60 min-h-screen space-y-6 text-gray-800 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 size={18} />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* 1. 标题 Header: 纯线条竖标 + 粗体标题（无二级标题），最右侧添加“新增涂鸦作品”按钮 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-1.5 h-6 bg-blue-600 rounded-full mr-3 shadow-sm"></div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">
            涂鸦作品库
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-sm shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-2"
        >
          <Plus size={16} />
          <span>新增涂鸦作品</span>
        </button>
      </div>

      {/* 2. 查询条件 Card: 涂鸦单位、涂鸦时间(时间段)、涂鸦区域、主题 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/80 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 涂鸦单位 */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 tracking-wide">涂鸦单位</label>
            <input
              type="text"
              value={searchUnitInput}
              onChange={(e) => setSearchUnitInput(e.target.value)}
              placeholder="请输入涂鸦单位..."
              className="w-full bg-gray-50/80 border border-gray-200/60 rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          {/* 涂鸦时间 (时间段) */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 tracking-wide">涂鸦时间</label>
            <div className="flex items-center gap-1.5 bg-gray-50/80 border border-gray-200/60 rounded-xl px-3 py-1.5 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <input
                type="date"
                value={startDateInput}
                onChange={(e) => setStartDateInput(e.target.value)}
                className="bg-transparent text-xs text-gray-800 outline-none w-full cursor-pointer"
              />
              <span className="text-gray-400 font-medium text-xs">-</span>
              <input
                type="date"
                value={endDateInput}
                onChange={(e) => setEndDateInput(e.target.value)}
                className="bg-transparent text-xs text-gray-800 outline-none w-full cursor-pointer"
              />
            </div>
          </div>

          {/* 涂鸦区域 */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 tracking-wide">涂鸦区域</label>
            <input
              type="text"
              value={searchAreaInput}
              onChange={(e) => setSearchAreaInput(e.target.value)}
              placeholder="请输入涂鸦区域 (如: K12+120)..."
              className="w-full bg-gray-50/80 border border-gray-200/60 rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          {/* 主题 */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 tracking-wide">主题</label>
            <input
              type="text"
              value={searchThemeInput}
              onChange={(e) => setSearchThemeInput(e.target.value)}
              placeholder="请输入主题..."
              className="w-full bg-gray-50/80 border border-gray-200/60 rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>
        </div>

        {/* 查询与重置按钮 */}
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100/60">
          <button
            type="button"
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold px-8 py-2.5 rounded-xl text-xs shadow-sm shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center"
          >
            <span>查询</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-100/90 hover:bg-gray-200 active:scale-95 text-gray-600 font-bold px-8 py-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center"
          >
            <span>重置</span>
          </button>
        </div>
      </div>

      {/* 3. 列表 Card (包含表格与分页) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
        {/* 数据表格 - 第一列和最后一列固定，最后一列宽度加大 */}
        <div className="overflow-x-auto relative">
          <table className="w-full min-w-[1050px] text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                {/* 固定第一列 */}
                <th className="py-4 px-6 w-28 sticky left-0 bg-gray-50 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)]">
                  图片
                </th>
                <th className="py-4 px-6 w-52">主题</th>
                <th className="py-4 px-6 min-w-[220px]">构想说明</th>
                <th className="py-4 px-6 w-48">涂鸦区域</th>
                <th className="py-4 px-6 w-52">涂鸦单位</th>
                <th className="py-4 px-6 w-36">涂鸦时间</th>
                {/* 固定最后一列 - 宽度加大至 w-44 (176px) */}
                <th className="py-4 px-6 text-center w-44 min-w-[176px] sticky right-0 bg-gray-50 z-20 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.08)]">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {pagedList.length > 0 ? (
                pagedList.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/40 transition-colors group">
                    {/* 固定第一列：图片 */}
                    <td className="py-3.5 px-6 sticky left-0 bg-white group-hover:bg-blue-50/50 transition-colors z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)]">
                      <div
                        onClick={() => setSelectedViewItem(item)}
                        className="w-16 h-12 rounded-lg overflow-hidden border border-gray-200/80 shadow-sm group relative cursor-pointer bg-gray-100"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.theme}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Eye size={14} />
                        </div>
                      </div>
                    </td>

                    {/* 主题 */}
                    <td className="py-3.5 px-6 font-bold text-gray-900">
                      {item.theme}
                    </td>

                    {/* 构想说明 */}
                    <td className="py-3.5 px-6 text-gray-600 max-w-xs">
                      <p className="line-clamp-2 leading-relaxed" title={item.description}>
                        {item.description}
                      </p>
                    </td>

                    {/* 涂鸦区域 */}
                    <td className="py-3.5 px-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md font-mono text-[11px] font-medium border border-gray-200/60">
                        <MapPin size={12} className="text-gray-400" />
                        {item.area}
                      </span>
                    </td>

                    {/* 涂鸦单位 */}
                    <td className="py-3.5 px-6 font-medium text-gray-800">
                      {item.unit}
                    </td>

                    {/* 涂鸦时间 */}
                    <td className="py-3.5 px-6 text-gray-500 font-mono">
                      {item.graffitiTime}
                    </td>

                    {/* 固定最后一列：操作 (自适应或扩展按钮样式，宽度加大至 w-44) */}
                    <td className="py-3.5 px-6 text-center w-44 min-w-[176px] sticky right-0 bg-white group-hover:bg-blue-50/50 transition-colors z-10 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.08)]">
                      <button
                        type="button"
                        onClick={() => setSelectedViewItem(item)}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200/80 hover:border-blue-300 font-bold px-4 py-1.5 rounded-lg text-xs inline-flex items-center gap-1.5 transition-all shadow-2xs active:scale-95 cursor-pointer"
                      >
                        <Eye size={14} />
                        <span>查看详情</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ImageIcon size={32} className="text-gray-300 stroke-[1.5]" />
                      <p className="text-xs font-medium">未找到符合条件的涂鸦作品</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 4. 分页组件 (与海报张贴审批完全一致) */}
        <div className="px-6 py-4 bg-white border-t border-gray-100 flex items-center justify-between flex-wrap gap-4 text-xs text-gray-500">
          <div>
            显示第 <span className="font-bold text-gray-800">{currentStart}</span> 到{' '}
            <span className="font-bold text-gray-800">{currentEnd}</span> 条记录，共{' '}
            <span className="font-bold text-gray-800">{totalCount}</span> 条
          </div>

          <div className="flex items-center gap-4">
            {/* 每页显示数量选择 */}
            <div className="flex items-center gap-2">
              <span>每页显示</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-700 outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value={10}>10 条</option>
                <option value={20}>20 条</option>
                <option value={50}>50 条</option>
              </select>
            </div>

            {/* 页码按钮 */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`min-w-[28px] h-7 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 查看涂鸦作品详情 Modal (字段与“新增涂鸦作品”一致：涂鸦主题、涂鸦单位、涂鸦区域、涂鸦时间、创作人、构想说明、图片) */}
      {selectedViewItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                <h3 className="text-base font-bold text-gray-900">涂鸦作品详情</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedViewItem(null)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Body (Strict 1 Row 1 Field Order) */}
            <div className="p-6 space-y-4">
              {/* 1. 涂鸦主题 */}
              <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100">
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block mb-1">
                  1. 涂鸦主题
                </span>
                <h2 className="text-base font-black text-gray-900">{selectedViewItem.theme}</h2>
                {selectedViewItem.qrCode && (
                  <div className="flex items-center gap-1.5 text-xs text-blue-700 font-mono font-medium mt-1">
                    <QrCode size={13} />
                    <span>防伪存证码: {selectedViewItem.qrCode}</span>
                  </div>
                )}
              </div>

              {/* 2. 涂鸦单位 */}
              <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-100 space-y-1">
                <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                  <Building2 size={12} />
                  <span>2. 涂鸦单位</span>
                </span>
                <p className="text-xs font-bold text-gray-900">{selectedViewItem.unit}</p>
              </div>

              {/* 3. 涂鸦区域 */}
              <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-100 space-y-1">
                <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                  <MapPin size={12} />
                  <span>3. 涂鸦区域</span>
                </span>
                <p className="text-xs font-bold text-gray-900 font-mono">{selectedViewItem.area}</p>
              </div>

              {/* 4. 涂鸦时间 */}
              <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-100 space-y-1">
                <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                  <Calendar size={12} />
                  <span>4. 涂鸦时间</span>
                </span>
                <p className="text-xs font-bold text-gray-900 font-mono">{selectedViewItem.graffitiTime}</p>
              </div>

              {/* 5. 创作人 */}
              <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-100 space-y-1">
                <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                  <User size={12} />
                  <span>5. 创作人</span>
                </span>
                <p className="text-xs font-bold text-gray-900">
                  {selectedViewItem.artist || '无填报创作人信息'}
                </p>
              </div>

              {/* 6. 构想说明 */}
              <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-100 space-y-1.5">
                <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                  <FileText size={12} />
                  <span>6. 构想说明</span>
                </span>
                <p className="text-xs text-gray-700 leading-relaxed font-normal">
                  {selectedViewItem.description}
                </p>
              </div>

              {/* 7. 图片 */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                  <ImageIcon size={12} />
                  <span>7. 图片</span>
                </span>
                <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-slate-900 max-h-80 flex items-center justify-center">
                  <img
                    src={selectedViewItem.imageUrl}
                    alt={selectedViewItem.theme}
                    className="w-full h-full object-contain max-h-80"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end bg-gray-50/50">
              <button
                type="button"
                onClick={() => setSelectedViewItem(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-6 py-2 rounded-xl text-xs transition-all cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 新增涂鸦作品 Modal (严格遵守 1 行 1 字段的规范: 涂鸦主题、涂鸦单位、涂鸦区域、涂鸦时间、创作人、构想说明、图片) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                <h3 className="text-base font-bold text-gray-900">新增涂鸦作品</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form (1 Row 1 Field) */}
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              {/* 1. 涂鸦主题 (下拉选择) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">
                  1. 涂鸦主题 <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={newItemTheme}
                  onChange={(e) => setNewItemTheme(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                >
                  <option value="">请选择涂鸦主题...</option>
                  {THEME_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. 涂鸦单位 (下拉选择) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">
                  2. 涂鸦单位 <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={newItemUnit}
                  onChange={(e) => setNewItemUnit(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                >
                  <option value="">请选择涂鸦单位...</option>
                  {UNIT_OPTIONS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. 涂鸦区域 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">
                  3. 涂鸦区域 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="请输入涂鸦区域 (如: K12+120.00 ~ K12+135.00 (左壁))"
                  value={newItemArea}
                  onChange={(e) => setNewItemArea(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* 4. 涂鸦时间 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">
                  4. 涂鸦时间 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={newItemTime}
                  onChange={(e) => setNewItemTime(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                />
              </div>

              {/* 5. 创作人 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">5. 创作人</label>
                <input
                  type="text"
                  placeholder="请输入创作人 / 创作团队"
                  value={newItemArtist}
                  onChange={(e) => setNewItemArtist(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* 6. 构想说明 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">6. 构想说明</label>
                <textarea
                  rows={3}
                  placeholder="请输入涂鸦作品的构想说明与艺术涵义..."
                  value={newItemDescription}
                  onChange={(e) => setNewItemDescription(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                />
              </div>

              {/* 7. 图片 (文件上传) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">7. 图片</label>
                {uploadedImagePreview ? (
                  <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-slate-900 group">
                    <img
                      src={uploadedImagePreview}
                      alt="Upload preview"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setUploadedImagePreview(null)}
                        className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-sm transition-all cursor-pointer"
                      >
                        重新上传图片
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer bg-gray-50/50 hover:bg-blue-50/30 transition-all group">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload size={18} />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-gray-700">点击选择或拖拽涂鸦作品图片上传</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">支持 PNG, JPG, JPEG, WEBP 格式</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold px-5 py-2.5 rounded-xl text-xs transition-all cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
                >
                  确认保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
