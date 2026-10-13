import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Calendar, 
  Sparkles, 
  Tag, 
  Building2, 
  X, 
  Eye,
  Filter,
  RotateCcw,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface HistoryGraffitiItem {
  id: string;
  date: string; // e.g. "2026年06月20日"
  year: string; // "2026"
  theme: string; // e.g. "毕业季 · 扬帆远航"
  title: string; // e.g. "《我爱你厦大 · 2026毕业季限定》"
  orgName: string;
  artistTeam: string;
  imageUrl: string;
  locationMeter?: string; // "S-120m 墙面"
  description: string;
}

export const MOCK_HISTORY_GRAFFITI: HistoryGraffitiItem[] = [
  {
    id: 'his-01',
    date: '2026年06月20日',
    year: '2026',
    theme: '毕业季 · 扬帆远航',
    title: '《我爱你厦大 · 2026毕业季限定》',
    orgName: '艺术学院青年志愿者协会',
    artistTeam: '2022级油画系毕业创作组',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1000&q=80',
    locationMeter: 'S-120m 墙面 (左壁)',
    description: '厦大芙蓉隧道最负盛名的经典打卡地，满载 2026 届毕业生对母校的深情寄语与永恒青春记忆。'
  },
  {
    id: 'his-02',
    date: '2026年05月15日',
    year: '2026',
    theme: '百年校庆 · 嘉庚精神',
    title: '《海丝嘉庚号 · 蓝海征途》',
    orgName: '海洋与地球学院团党委',
    artistTeam: '科考船青年先锋队',
    imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1000&q=80',
    locationMeter: 'S-210m 墙面 (右壁)',
    description: '致敬陈嘉庚先生倾资兴学宏愿，描绘深海科考与蓝色海洋梦想的新篇章。'
  },
  {
    id: 'his-03',
    date: '2025年11月18日',
    year: '2025',
    theme: '前沿科技 · 未来无界',
    title: '《Hello World · 算力星图》',
    orgName: '计算机科学与技术系',
    artistTeam: '计算机系极客俱乐部',
    imageUrl: 'https://images.unsplash.com/photo-1561055657-b9e0bf0fa360?w=1000&q=80',
    locationMeter: 'S-350m 墙面 (左壁)',
    description: '将二进制代码、AI大模型与星系漩涡融为一体，彰显厦大科技与人文的交织碰撞。'
  },
  {
    id: 'his-04',
    date: '2025年06月08日',
    year: '2025',
    theme: '毕业季 · 扬帆远航',
    title: '《凤凰花开 · 青春不散场》',
    orgName: '校学生会宣传部',
    artistTeam: '摄影与视觉艺术协会',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1000&q=80',
    locationMeter: 'S-480m 墙面 (右壁)',
    description: '六月凤凰花开满演武场，火红的花海与嘉庚建筑相互辉映，寄托历届学子的依依惜别之情。'
  },
  {
    id: 'his-05',
    date: '2024年10月24日',
    year: '2024',
    theme: '艺术探新 · 青春狂想',
    title: '《艺术探新 · 灵感视界》',
    orgName: '艺术学院团委',
    artistTeam: '视觉传达设计教研室',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1000&q=80',
    locationMeter: 'S-080m 墙面 (左壁)',
    description: '以大胆狂放的波普色彩碰撞古典水墨纹理，展现艺术学院学子不设限的灵感创造力。'
  },
  {
    id: 'his-06',
    date: '2024年05月20日',
    year: '2024',
    theme: '百年校庆 · 嘉庚精神',
    title: '《建南大礼堂 · 钟楼时光》',
    orgName: '建筑与土木工程学院',
    artistTeam: '建筑学系师生创作组',
    imageUrl: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1000&q=80',
    locationMeter: 'S-290m 墙面 (右壁)',
    description: '精细还原建南楼群经典飞檐与红砖骑楼，诉说跨越世纪的厦大校园文化建筑传奇。'
  },
  {
    id: 'his-07',
    date: '2023年06月18日',
    year: '2023',
    theme: '毕业季 · 扬帆远航',
    title: '《告别白城沙滩 · 远航致青春》',
    orgName: '人文学院团党委',
    artistTeam: '中文系文学社',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&q=80',
    locationMeter: 'S-160m 墙面 (左壁)',
    description: '白城海浪拍打沙滩，环岛路骑行的笑脸凝固在墙壁，记录下那一段永不褪色的海边岁月。'
  },
  {
    id: 'his-08',
    date: '2021年04月06日',
    year: '2021',
    theme: '百年校庆 · 嘉庚精神',
    title: '《厦大百年校庆 · 自强不息止于至善》',
    orgName: '厦门大学校团委',
    artistTeam: '校庆特邀艺术家与全校志愿者',
    imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1000&q=80',
    locationMeter: 'S-005m 入口壁面',
    description: '纪念厦门大学建校100周年特别巨幅画作，凝聚了“南方之强”百年来励精图治的辉煌历程。'
  }
];

interface HistoryGraffitiViewProps {
  onClose: () => void;
}

export default function HistoryGraffitiView({ onClose }: HistoryGraffitiViewProps) {
  // Filter States
  const [selectedTheme, setSelectedTheme] = useState<string>('全部主题');
  const [searchTitle, setSearchTitle] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('全部时间');
  
  // Active viewing item modal for high-res preview
  const [activePreviewImage, setActivePreviewImage] = useState<HistoryGraffitiItem | null>(null);

  // Available Themes & Years options
  const themesList = [
    '全部主题',
    '毕业季 · 扬帆远航',
    '百年校庆 · 嘉庚精神',
    '艺术探新 · 青春狂想',
    '前沿科技 · 未来无界'
  ];

  const yearsList = [
    '全部时间',
    '2026年',
    '2025年',
    '2024年',
    '2023年',
    '2021年'
  ];

  // Filtered Items logic
  const filteredItems = useMemo(() => {
    return MOCK_HISTORY_GRAFFITI.filter(item => {
      // Theme filter
      if (selectedTheme !== '全部主题' && item.theme !== selectedTheme) {
        return false;
      }
      // Year filter
      if (selectedYear !== '全部时间') {
        const yearClean = selectedYear.replace('年', '');
        if (item.year !== yearClean) return false;
      }
      // Title search
      if (searchTitle.trim() !== '') {
        const query = searchTitle.trim().toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchOrg = item.orgName.toLowerCase().includes(query);
        const matchArtist = item.artistTeam.toLowerCase().includes(query);
        if (!matchTitle && !matchOrg && !matchArtist) return false;
      }
      return true;
    });
  }, [selectedTheme, searchTitle, selectedYear]);

  const handleResetFilters = () => {
    setSelectedTheme('全部主题');
    setSearchTitle('');
    setSelectedYear('全部时间');
  };

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-900 font-sans flex flex-col justify-between">
      
      {/* 头部 (Header) - 与主系统一致 */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 py-3 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Sparkles size={18} />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                厦门大学线上展示系统
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                  芙蓉隧道历史涂鸦典藏库
                </span>
              </h1>
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200/80 flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>返回 3D 芙蓉隧道</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 space-y-8">
        
        {/* Top Search & Filter Bar (顶部搜索条件) */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 space-y-4">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Filter size={15} className="text-blue-600" />
              <span>历史涂鸦多维检索</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                已检索到 <strong className="text-blue-600 font-bold">{filteredItems.length}</strong> 幅典藏画作
              </span>
              {(selectedTheme !== '全部主题' || searchTitle !== '' || selectedYear !== '全部时间') && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw size={12} />
                  <span>重置条件</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            
            {/* 1. 主题 (Theme Select) */}
            <div className="space-y-1.5">
              <label className="text-slate-600 font-bold flex items-center gap-1">
                <Tag size={13} className="text-blue-600" />
                <span>创作主题：</span>
              </label>
              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
              >
                {themesList.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* 2. 作品名称 (Title Search Input) */}
            <div className="space-y-1.5">
              <label className="text-slate-600 font-bold flex items-center gap-1">
                <Search size={13} className="text-blue-600" />
                <span>作品名称 / 团队：</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="输入作品名称、创作团队关键字..."
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-3.5 pr-8 py-2 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
                {searchTitle && (
                  <button
                    onClick={() => setSearchTitle('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* 3. 创作时间 (Creation Time / Year Filter) */}
            <div className="space-y-1.5">
              <label className="text-slate-600 font-bold flex items-center gap-1">
                <Calendar size={13} className="text-blue-600" />
                <span>创作时间：</span>
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
              >
                {yearsList.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

          </div>

        </div>

        {/* Premium Centered Timeline Section (高级居中双侧交替时间轴) */}
        <div className="relative py-4">
          
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search size={22} />
              </div>
              <h3 className="text-sm font-bold text-slate-700">未检索到匹配的历史涂鸦</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                请尝试更换“创作主题”、“创作时间”或清空搜索关键词。
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-blue-700 transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <RotateCcw size={13} />
                <span>重置所有筛选</span>
              </button>
            </div>
          ) : (
            <div className="relative min-h-[400px]">
              
              {/* Central Timeline Vertical Line */}
              <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-1 -translate-x-1/2 bg-gradient-to-b from-blue-500 via-indigo-500 to-sky-400 rounded-full shadow-xs z-0" />

              <div className="space-y-10 relative z-10">
                {filteredItems.map((item, index) => {
                  const isEven = index % 2 === 0;

                  return (
                    <div 
                      key={item.id} 
                      className={`relative flex flex-col md:flex-row items-center ${
                        isEven ? 'md:flex-row-reverse' : ''
                      }`}
                    >
                      
                      {/* Timeline Center Node Badge */}
                      <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-6 z-20 flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full bg-white border-4 border-blue-600 shadow-md flex items-center justify-center transition-transform hover:scale-125">
                          <div className="w-2 h-2 rounded-full bg-blue-600" />
                        </div>
                      </div>

                      {/* Content Card Side (Half Width on Desktop) */}
                      <div className={`w-full pl-12 md:pl-0 md:w-[calc(50%-2.5rem)] ${
                        isEven ? 'md:mr-auto md:pr-0' : 'md:ml-auto md:pl-0'
                      }`}>
                        
                        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 overflow-hidden group p-5 space-y-4">
                          
                          {/* Header: Date & Theme */}
                          <div className="flex items-center justify-between gap-2 flex-wrap border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1 rounded-xl text-xs font-bold font-mono shadow-2xs">
                                <Calendar size={13} />
                                {item.date}
                              </span>
                              <span className="bg-indigo-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-lg shadow-2xs">
                                {item.theme}
                              </span>
                            </div>

                            {item.locationMeter && (
                              <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                                {item.locationMeter}
                              </span>
                            )}
                          </div>

                          {/* Work Title */}
                          <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {item.title}
                          </h3>

                          {/* Artwork Image Container */}
                          <div 
                            onClick={() => setActivePreviewImage(item)}
                            className="w-full aspect-[16/9] bg-slate-100 rounded-xl overflow-hidden relative shadow-xs cursor-pointer group/img border border-slate-200/80"
                          >
                            <img 
                              src={item.imageUrl} 
                              alt={item.title} 
                              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500" 
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/35 transition-colors flex items-center justify-center">
                              <span className="opacity-0 group-hover/img:opacity-100 bg-white/95 text-slate-900 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md transition-opacity flex items-center gap-1.5">
                                <Eye size={14} className="text-blue-600" /> 点击放大图像
                              </span>
                            </div>
                          </div>

                          {/* Organization & Description */}
                          <div className="space-y-2 text-xs text-slate-600 pt-1">
                            <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                              <Building2 size={14} className="text-blue-600 flex-shrink-0" />
                              <span>{item.orgName} · {item.artistTeam}</span>
                            </div>

                            <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                              {item.description}
                            </p>
                          </div>

                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </div>

      </main>

      {/* 尾部 (Footer) - 与主系统一致 */}
      <footer className="bg-white border-t border-slate-200/80 mt-8 py-6 px-6 text-slate-500 text-xs text-center space-y-2">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center space-y-1.5">
          <p className="font-bold text-slate-700">
            版权所有 © 厦门大学党委宣传部 · 校团委 · 校园公共文化设施管理委员会
          </p>
          <p className="text-[11px] text-slate-400">
            地址：福建省厦门市思明区思明南路422号 邮编：361005 | 技术支持：厦大巡检与数字文化工作台
          </p>
          <p className="text-[10px] text-slate-400 font-mono">
            闽ICP备05001000号 · 厦大信息网络中心监制
          </p>
        </div>
      </footer>

      {/* Image Lightbox Detail Modal */}
      <AnimatePresence>
        {activePreviewImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl p-6 relative text-slate-900 space-y-4"
            >
              <button
                onClick={() => setActivePreviewImage(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer z-10"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2 pr-8">
                <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-lg">
                  {activePreviewImage.theme}
                </span>
                <span className="text-xs text-slate-500 font-mono font-medium">
                  {activePreviewImage.date}
                </span>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 pr-8">{activePreviewImage.title}</h3>

              <div className="h-72 bg-slate-100 rounded-2xl overflow-hidden relative flex items-center justify-center border border-slate-200/80 shadow-inner">
                <img src={activePreviewImage.imageUrl} alt={activePreviewImage.title} className="w-full h-full object-cover" />
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs text-slate-700">
                <p>创作单位：<strong className="text-slate-900">{activePreviewImage.orgName}</strong></p>
                <p>创作团队：<strong className="text-slate-900">{activePreviewImage.artistTeam}</strong></p>
                <p>位置分布：<strong className="text-blue-600">{activePreviewImage.locationMeter || '芙蓉隧道墙面'}</strong></p>
                <p className="pt-2 text-slate-600 leading-relaxed border-t border-slate-200/80">{activePreviewImage.description}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
