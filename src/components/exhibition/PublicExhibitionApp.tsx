import React, { useState } from 'react';
import Tunnel3DView from './Tunnel3DView';
import HistoryGraffitiView from './HistoryGraffitiView';
import { MOCK_POSTER_BOARDS, MOCK_POSTER_APPLICATIONS } from '../../data/posterGraffitiMock';
import { Campus, PosterApplication } from '../../types/posterGraffitiTypes';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Eye, 
  QrCode, 
  Layers, 
  CheckCircle2, 
  Building2, 
  Grid, 
  Heart,
  ArrowLeft,
  ChevronRight,
  Info,
  ChevronDown,
  X,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SystemFeatureCatalogModal from '../common/SystemFeatureCatalogModal';

interface PublicExhibitionAppProps {
  initialTab?: '3D_TUNNEL' | 'POSTER_GALLERY';
  onBackToLanding?: () => void;
}

export default function PublicExhibitionApp({ initialTab = 'POSTER_GALLERY', onBackToLanding }: PublicExhibitionAppProps) {
  const [activeTab, setActiveTab] = useState<'3D_TUNNEL' | 'POSTER_GALLERY'>(initialTab);
  const [selectedCampus, setSelectedCampus] = useState<Campus>(Campus.SIMING);
  const [selectedBoardId, setSelectedBoardId] = useState<string>('board-siming-1');
  const [selectedTheme, setSelectedTheme] = useState<string>('全部主题');
  const [viewingPoster, setViewingPoster] = useState<PosterApplication | null>(null);
  const [showBoardInfo, setShowBoardInfo] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [showFeatureCatalog, setShowFeatureCatalog] = useState<boolean>(false);

  if (isHistoryOpen) {
    return <HistoryGraffitiView onClose={() => setIsHistoryOpen(false)} />;
  }

  // Available Boards per campus
  const simingBoards = [
    { id: 'board-siming-1', name: '三家村 1 号张贴栏' },
    { id: 'board-siming-1-2', name: '三家村 2 号张贴栏' },
    { id: 'board-siming-3', name: '芙蓉餐厅侧栏' },
    { id: 'board-siming-2', name: '群贤楼主海报栏' },
    { id: 'board-siming-4', name: '南光餐厅主干道海报栏' },
  ];

  const xianganBoards = [
    { id: 'board-xiangan-1', name: '竞丰餐厅前张贴栏' },
    { id: 'board-xiangan-2', name: '德旺图书馆旁宣传栏' },
    { id: 'board-xiangan-3', name: '一期食堂西侧展板' },
  ];

  const activeBoardList = selectedCampus === Campus.SIMING ? simingBoards : xianganBoards;
  const currentBoardName = activeBoardList.find(b => b.id === selectedBoardId)?.name || activeBoardList[0].name;

  // Custom poster columns mock data for the 4 columns depicted in screenshot
  const columnPosters = [
    {
      colIndex: 1,
      title: '2026年厦门大学迎新草地音乐节',
      orgName: '校学生会宣传部',
      imgUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
      qrCode: 'XM-POSTER-2026-0881',
      validPeriod: '2026-08-08 ~ 2026-08-10',
      size: 'A1 标准展幅'
    },
    {
      colIndex: 2,
      title: '校园十佳歌手大赛总决赛',
      orgName: '校学生艺术团',
      imgUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
      qrCode: 'XM-POSTER-2026-0885',
      validPeriod: '2026-08-09 ~ 2026-08-12',
      size: 'A1 标准展幅'
    },
    {
      colIndex: 3,
      title: '“校长杯”羽毛球超级联赛',
      orgName: '体育教学部 · 羽毛球协会',
      imgUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80',
      qrCode: 'XM-POSTER-2026-0890',
      validPeriod: '2026-08-10 ~ 2026-08-15',
      size: 'A1 标准展幅'
    },
    {
      colIndex: 4,
      title: '人工智能与机器人前沿学术讲座',
      orgName: '计算机科学与技术系',
      imgUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
      qrCode: 'XM-POSTER-2026-0882',
      validPeriod: '2026-08-08 ~ 2026-08-09',
      size: 'A2 标准展幅'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-900 font-sans flex flex-col justify-between">
      
      {/* 头部 (Header) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 py-3 shadow-xs space-y-3">
        {/* Title row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Sparkles size={18} />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight">
                厦门大学线上展示系统
              </h1>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFeatureCatalog(true)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-black transition-all border border-emerald-200/90 flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="查看并下载系统完整功能清单"
            >
              <FileSpreadsheet size={14} className="text-emerald-600" />
              <span>功能清单下载</span>
            </button>
            {onBackToLanding && (
              <button
                onClick={onBackToLanding}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200/80 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>返回引导页</span>
              </button>
            )}
          </div>
        </div>

        {/* Centered Navigation Switcher under title bar */}
        <div className="flex justify-center border-t border-slate-100/80 pt-2.5">
          <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('POSTER_GALLERY')}
              className={`px-6 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'POSTER_GALLERY'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid size={14} /> 海报栏
            </button>
            <button
              onClick={() => setActiveTab('3D_TUNNEL')}
              className={`px-6 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === '3D_TUNNEL'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles size={14} /> 芙蓉隧道
            </button>
          </div>
        </div>
      </header>

      {/* Main Body Section */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-5">
        
        {/* TAB 1: 线上海报 (POSTER_GALLERY) */}
        {activeTab === 'POSTER_GALLERY' && (
          <div className="space-y-5">
            
            {/* Top Filter Card */}
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 space-y-4">
              
              {/* 所属校区 Filter Row */}
              <div className="flex items-center gap-4 text-xs">
                <span className="text-slate-600 font-bold w-18 flex-shrink-0">所属校区 :</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedCampus(Campus.SIMING);
                      setSelectedBoardId('board-siming-1');
                    }}
                    className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedCampus === Campus.SIMING
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium'
                    }`}
                  >
                    思明校区
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCampus(Campus.XIANGAN);
                      setSelectedBoardId('board-xiangan-1');
                    }}
                    className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedCampus === Campus.XIANGAN
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium'
                    }`}
                  >
                    翔安校区
                  </button>
                </div>
              </div>

              {/* 海报栏 Filter Row */}
              <div className="flex items-start sm:items-center gap-4 text-xs pt-1">
                <span className="text-slate-600 font-bold w-18 flex-shrink-0 mt-2 sm:mt-0">海报栏 :</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {activeBoardList.map(board => (
                    <button
                      key={board.id}
                      onClick={() => setSelectedBoardId(board.id)}
                      className={`px-4 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                        selectedBoardId === board.id
                          ? 'bg-blue-600 text-white font-bold shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium'
                      }`}
                    >
                      {board.name}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Main Poster Board Content Card */}
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 space-y-5">
              
              {/* Card Header Row */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900">
                    {selectedCampus === Campus.SIMING ? '思明校区' : '翔安校区'} &gt; {currentBoardName}
                  </h2>
                </div>

                <button
                  onClick={() => setShowBoardInfo(!showBoardInfo)}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Building2 size={13} />
                  <span>{showBoardInfo ? '收起海报栏信息' : '展开海报栏信息'}</span>
                  <ChevronRight size={13} className={showBoardInfo ? 'rotate-90 transition-transform' : 'transition-transform'} />
                </button>
              </div>

              {/* Collapsible Info Drawer */}
              <AnimatePresence>
                {showBoardInfo && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 text-xs space-y-2 text-slate-700">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <span className="text-slate-400 block font-medium">展栏位置：</span>
                          <span className="font-bold text-slate-800">
                            {selectedCampus === Campus.SIMING ? '思明校区三家村广场东侧' : '翔安校区竞丰餐厅正门广场'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">选座容量：</span>
                          <span className="font-bold text-slate-800">划分 6 个标准张贴列 (单列 80cm×120cm)</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">专责巡检员：</span>
                          <span className="font-bold text-emerald-700">林云飞 (巡检组长) · 在岗日常巡查</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-blue-100/80 text-[11px] text-slate-500 flex items-center gap-1.5">
                        <ShieldCheck size={14} className="text-blue-600" />
                        <span>所有海报均经由校团委四级审核批准，印有专用防伪不干胶二维码印章。</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 4-Column Poster Displays */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {columnPosters.map((col) => (
                  <div 
                    key={col.colIndex}
                    className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-3 flex flex-col space-y-2.5 hover:border-blue-300 transition-all group"
                  >
                    {/* Column Badge Badge at Top */}
                    <div className="flex items-center justify-between">
                      <span className="bg-slate-200/80 text-slate-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-md">
                        第 {col.colIndex} 列
                      </span>
                      <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5">
                        <CheckCircle2 size={11} /> 准予张贴
                      </span>
                    </div>

                    {/* Poster Image Frame */}
                    <div 
                      onClick={() => setViewingPoster({
                        id: `col-${col.colIndex}`,
                        title: col.title,
                        applicantName: '责任申请人',
                        applicantRole: 'STUDENT' as any,
                        orgName: col.orgName,
                        contactPhone: '13800000000',
                        posterImageUrl: col.imgUrl,
                        boardIds: [selectedBoardId],
                        selectedColumns: [{ boardId: selectedBoardId, colIndices: [col.colIndex] }],
                        posterSize: col.size,
                        startDate: col.validPeriod.split(' ~ ')[0],
                        endDate: col.validPeriod.split(' ~ ')[1],
                        daysCount: 3,
                        status: 'APPROVED' as any,
                        currentStep: '已加盖防伪二维码印章',
                        approvalLogs: [],
                        qrCode: col.qrCode,
                        submittedAt: '2026-08-08'
                      })}
                      className="w-full aspect-[3/4] bg-slate-200 rounded-xl overflow-hidden relative shadow-xs cursor-pointer"
                    >
                      <img 
                        src={col.imgUrl} 
                        alt={col.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-md transition-opacity flex items-center gap-1">
                          <Eye size={13} /> 查看详情
                        </span>
                      </div>
                    </div>

                    {/* Brief Caption */}
                    <div className="pt-1 text-xs space-y-1">
                      <h3 className="font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {col.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{col.orgName}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: 芙蓉隧道 (3D_TUNNEL) */}
        {activeTab === '3D_TUNNEL' && (
          <div className="space-y-6">
            {/* 3D Canvas Tunnel Viewport */}
            <Tunnel3DView 
              selectedTheme={selectedTheme} 
              onOpenHistory={() => setIsHistoryOpen(true)} 
            />
          </div>
        )}

      </main>

      {/* 尾部 (Footer) */}
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

      {/* Viewing Poster Detail Modal */}
      <AnimatePresence>
        {viewingPoster && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl p-6 relative text-slate-900"
            >
              <button
                onClick={() => setViewingPoster(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <h3 className="text-base font-bold text-slate-900 pr-8">{viewingPoster.title}</h3>
              <p className="text-xs text-slate-500 mb-4 mt-0.5">主办单位：{viewingPoster.orgName}</p>

              <div className="h-64 bg-slate-100 rounded-2xl overflow-hidden mb-4 relative flex items-center justify-center border border-slate-200/80">
                <img src={viewingPoster.posterImageUrl} alt={viewingPoster.title} className="w-full h-full object-contain" />
                <div className="absolute bottom-3 right-3 bg-emerald-600 text-white px-3 py-1 rounded-xl text-xs font-mono flex items-center gap-1.5 shadow-md">
                  <QrCode size={14} /> 防伪编码: {viewingPoster.qrCode}
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs text-slate-700">
                <p>张贴周期：<strong className="text-slate-900">{viewingPoster.startDate} ~ {viewingPoster.endDate}</strong></p>
                <p>防伪审核：<strong className="text-emerald-600">校团委审定核发防伪二维码印章</strong></p>
                <p>规格展幅：<strong className="text-blue-600">{viewingPoster.posterSize}</strong></p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* System Feature Catalog Modal */}
      <SystemFeatureCatalogModal 
        isOpen={showFeatureCatalog} 
        onClose={() => setShowFeatureCatalog(false)} 
      />

    </div>
  );
}

