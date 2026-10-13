import React, { useState } from 'react';
import { MOCK_MODELS } from '../data/mockData';
import { EntityStatus } from '../types';
import { 
  Plus, 
  X, 
  CheckCircle2, 
  Search, 
  Bell,
  Box, 
  UploadCloud,
  FileText,
  Info,
  SlidersHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  GripVertical,
  Sparkles,
  Send,
  Trash2,
  Bookmark,
  Download,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Check
} from 'lucide-react';
import Badge from './ui/Badge';
import { motion, AnimatePresence } from 'motion/react';
import Pagination from './ui/Pagination';

export default function ModelManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Table column configuration (widths & visibility)
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
    col1: 176, // 字段一
    col2: 224, // 字段二
    col3: 128, // 字段三
    col4: 128, // 字段四
    col5: 320, // 字段五
    col6: 160, // 字段六
    col7: 160, // 字段七
    col8: 160, // 字段八
    col9: 160, // 字段九
    col10: 160, // 字段十
  });

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    col1: true,
    col2: true,
    col3: true,
    col4: true,
    col5: true,
    col6: true,
    col7: true,
    col8: true,
    col9: true,
    col10: true,
  });

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [isColToggleOpen, setIsColToggleOpen] = useState(false);

  const columnsList = [
    { key: 'col1', label: '字段一' },
    { key: 'col2', label: '字段二' },
    { key: 'col3', label: '字段三' },
    { key: 'col4', label: '字段四' },
    { key: 'col5', label: '字段五' },
    { key: 'col6', label: '字段六' },
    { key: 'col7', label: '字段七' },
    { key: 'col8', label: '字段八' },
    { key: 'col9', label: '字段九' },
    { key: 'col10', label: '字段十' },
  ];

  const handleSort = (columnKey: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };

  const getSortValue = (model: any, columnKey: string) => {
    const modelNumId = parseInt(model.id.replace(/\D/g, '')) || 0;
    switch (columnKey) {
      case 'col1': return model.identifier || '';
      case 'col2': return model.name || '';
      case 'col3': return model.category || '';
      case 'col4': return model.isModeled ? 1 : 0;
      case 'col5': return model.description || '';
      case 'col6': return model.updatedAt || '';
      case 'col7': return `配置#${100 + modelNumId}`;
      case 'col8': return (modelNumId % 3) + 1;
      case 'col9': return `doc_v${(modelNumId % 4) + 1}.pdf`;
      case 'col10': return (modelNumId * 37 + 104) % 1000;
      default: return '';
    }
  };

  const handleResizeStart = (e: React.MouseEvent, columnKey: string) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startWidth = columnWidths[columnKey];

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const diffX = moveEvent.clientX - startX;
      const newWidth = Math.max(64, startWidth + diffX);
      setColumnWidths(prev => ({
        ...prev,
        [columnKey]: newWidth
      }));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(prev => prev === msg ? null : prev);
    }, 3000);
  };

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingModel, setEditingModel] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewModel, setViewModel] = useState<any>(null);
  const [modelStatuses, setModelStatuses] = useState<Record<string, 'active' | 'inactive'>>({});

  // States for the 9 new record fields (一行一个字段)
  const [field1, setField1] = useState("");
  const [field2, setField2] = useState("");
  const [field3Start, setField3Start] = useState("");
  const [field3End, setField3End] = useState("");
  const [field4, setField4] = useState("");
  const [field5, setField5] = useState("");
  const [field6, setField6] = useState("");
  const [field7, setField7] = useState("");
  const [field8, setField8] = useState("");
  const [field9File, setField9File] = useState<File | null>(null);
  const [field9Dragging, setField9Dragging] = useState(false);

  // Query condition states
  const [query1, setQuery1] = useState("");
  const [query2, setQuery2] = useState("");
  const [query3Start, setQuery3Start] = useState("");
  const [query3End, setQuery3End] = useState("");
  const [query4, setQuery4] = useState("");
  const [query5, setQuery5] = useState("");
  const [query6, setQuery6] = useState("");

  const handleCancelNewRecord = () => {
    setIsModalOpen(false);
    setField1("");
    setField2("");
    setField3Start("");
    setField3End("");
    setField4("");
    setField5("");
    setField6("");
    setField7("");
    setField8("");
    setField9File(null);
  };

  const handleSaveNewRecord = () => {
    showNotification('🎉 成功新建记录！字段已保存。');
    setIsModalOpen(false);
    setField1("");
    setField2("");
    setField3Start("");
    setField3End("");
    setField4("");
    setField5("");
    setField6("");
    setField7("");
    setField8("");
    setField9File(null);
  };

  const handleResetQuery = () => {
    setQuery1("");
    setQuery2("");
    setQuery3Start("");
    setQuery3End("");
    setQuery4("");
    setQuery5("");
    setQuery6("");
    showNotification('🔄 查询条件已重置');
  };

  const handleSearch = () => {
    showNotification('🔍 正在按条件查询数据...');
  };

  // Filter models based on the queries
  const filteredModels = MOCK_MODELS.filter(model => {
    if (query1 && !model.identifier.toLowerCase().includes(query1.toLowerCase())) return false;
    if (query2) {
      if (query2 === 'val1' && model.category !== '桌子') return false;
      if (query2 === 'val2' && model.category !== '椅子') return false;
      if (query2 === 'val3' && model.category !== '网络设备') return false;
    }
    if (query4 && !model.name.toLowerCase().includes(query4.toLowerCase())) return false;
    if (query5 && !model.description.toLowerCase().includes(query5.toLowerCase())) return false;
    if (query6 && !model.updatedAt.toLowerCase().includes(query6.toLowerCase())) return false;
    return true;
  });

  const sortedModels = React.useMemo(() => {
    if (!sortConfig) return filteredModels;
    return [...filteredModels].sort((a, b) => {
      const valA = getSortValue(a, sortConfig.key);
      const valB = getSortValue(b, sortConfig.key);
      if (valA === valB) return 0;
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      return sortConfig.direction === 'asc' ? 1 : -1;
    });
  }, [filteredModels, sortConfig]);

  const paginatedModels = sortedModels.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filteredModels.length / pageSize);

  const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; role: 'user' | 'ai'; text: string; timestamp: Date }>>([
    { 
      id: 'welcome', 
      role: 'ai', 
      text: '您好！欢迎使用本系统管理平台。我是您的系统使用指南助手，为您提供详尽的功能说明与操作指引：\n\n1. 📂 记录管理：支持快速查询，支持实时添加、编辑（点击每行的编辑按钮）和删除数据集模型。\n2. 🔍 条件查询：通过顶部的条件一至六等多个筛选字段，可以对列表中的数据进行精准的过滤与组合搜索。\n3. ⚙️ 列配置与视图：列表右上方支持自定义列的显示与隐藏，便于您调节最适合自己的阅读和查看视图。\n4. 📊 导出与备份：支持将所需的指南文本、分析结果或聊天记录进行快速导出、收藏，或一键复制内容。\n\n请随时提问我有关本系统的任何操作或功能问题，我将为您竭竭解答！',
      timestamp: new Date() 
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAILoading, setIsAILoading] = useState(false);
  const [bookmarkedMessageIds, setBookmarkedMessageIds] = useState<Record<string, boolean>>({});
  const [likedMessageIds, setLikedMessageIds] = useState<Record<string, 'up' | 'down' | null>>({});

  const toggleBookmark = (id: string) => {
    setBookmarkedMessageIds(prev => {
      const isBookmarked = !prev[id];
      showNotification(isBookmarked ? '⭐ 已保存到系统收藏夹' : '⭐ 已取消收藏');
      return { ...prev, [id]: isBookmarked };
    });
  };

  const handleExportText = (id: string, text: string) => {
    try {
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `AI分析报告_${id.substring(0, 6)}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showNotification('📥 分析文本已成功导出为 TXT 文件！');
    } catch (error) {
      showNotification('❌ 导出失败，请重试');
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    showNotification('📋 已复制分析结果到剪贴板！');
  };

  const handleLikeMessage = (id: string, type: 'up' | 'down') => {
    setLikedMessageIds(prev => {
      const current = prev[id];
      let nextValue: 'up' | 'down' | null = type;
      if (current === type) {
        nextValue = null;
        showNotification('已撤销反馈');
      } else {
        showNotification(type === 'up' ? '👍 感谢您的反馈！' : '👎 已记录您的反馈，我们会持续改进！');
      }
      return { ...prev, [id]: nextValue };
    });
  };

  const handleClearChat = () => {
    setChatMessages([
      { 
        id: 'welcome', 
        role: 'ai', 
        text: '对话已成功清空。我是您的系统使用指南助手，随时为您解答有关平台功能、添加记录、过滤搜索或展示视图等任何功能的操作指引。', 
        timestamp: new Date() 
      }
    ]);
  };

  const handleSendChatMessage = async (presetText?: string) => {
    const textToSend = presetText || chatInput;
    if (!textToSend.trim() || isAILoading) return;

    // Add user message to state
    const userMsg = {
      id: Math.random().toString(36).substring(7),
      role: 'user' as const,
      text: textToSend,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, userMsg]);
    if (!presetText) setChatInput('');
    setIsAILoading(true);

    try {
      const response = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          tableData: filteredModels,
          queryConditions: {
            query1,
            query2,
            query3Start,
            query3End,
            query4,
            query5,
            query6
          }
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setChatMessages(prev => [...prev, {
          id: Math.random().toString(36).substring(7),
          role: 'ai',
          text: data.text || "未能获取到合理的数据分析结果。",
          timestamp: new Date()
        }]);
      } else {
        setChatMessages(prev => [...prev, {
          id: Math.random().toString(36).substring(7),
          role: 'ai',
          text: `数据分析发生异常: ${data.error || "接口响应错误"}`,
          timestamp: new Date()
        }]);
      }
    } catch (err: any) {
      setChatMessages(prev => [...prev, {
        id: Math.random().toString(36).substring(7),
        role: 'ai',
        text: `分析请求发送失败: ${err.message || "请检查网络或配置"}`,
        timestamp: new Date()
      }]);
    } finally {
      setIsAILoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6 relative min-h-screen">
        {/* Dynamic Slide-in Alert */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%", scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
            exit={{ opacity: 0, y: -20, x: "-50%", scale: 0.9 }}
            className="fixed top-6 left-1/2 z-[100] bg-gray-900/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-gray-800"
          >
            <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0">
              <Bell size={10} className="animate-pulse" />
            </div>
            <p className="text-xs font-bold tracking-wider">{notification}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 border-l-4 border-blue-600 pl-4">菜单一</h1>
          <p className="text-gray-500 text-sm mt-1 pl-4 opacity-80">菜单一的功能描述</p>
        </div>
        <button 
          onClick={() => {
            setIsEditMode(false);
            setEditingModel(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95"
        >
          <Plus size={18} />
          <span>新建记录</span>
        </button>
      </div>

      {/* 查询条件 */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 条件一 */}
          <div>
            <label className="text-xs font-semibold text-gray-400 tracking-wide flex items-center font-sans mb-2">条件一</label>
            <input 
              type="text" 
              value={query1}
              onChange={(e) => setQuery1(e.target.value)}
              placeholder="请输入条件一" 
              className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all placeholder:text-gray-400"
            />
          </div>
          {/* 条件二 */}
          <div>
            <label className="text-xs font-semibold text-gray-400 tracking-wide flex items-center font-sans mb-2">条件二</label>
            <select 
              value={query2}
              onChange={(e) => setQuery2(e.target.value)}
              className="w-full bg-gray-50 border border-transparent rounded-xl text-sm px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-gray-750"
            >
              <option value="">请选择</option>
              <option value="val1">分类一</option>
              <option value="val2">分类二</option>
              <option value="val3">分类三</option>
            </select>
          </div>
          {/* 条件三 */}
          <div>
            <label className="text-xs font-semibold text-gray-400 tracking-wide flex items-center font-sans mb-2">条件三</label>
            <div className="flex items-center gap-2">
              <input 
                type="date" 
                value={query3Start}
                onChange={(e) => setQuery3Start(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-transparent rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              />
              <span className="text-gray-400 text-xs shrink-0">至</span>
              <input 
                type="date" 
                value={query3End}
                onChange={(e) => setQuery3End(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-transparent rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              />
            </div>
          </div>
          {/* 条件四 */}
          <div>
            <label className="text-xs font-semibold text-gray-400 tracking-wide flex items-center font-sans mb-2">条件四</label>
            <input 
              type="text" 
              value={query4}
              onChange={(e) => setQuery4(e.target.value)}
              placeholder="请输入条件四" 
              className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all placeholder:text-gray-400"
            />
          </div>
          {/* 条件五 */}
          <div>
            <label className="text-xs font-semibold text-gray-400 tracking-wide flex items-center font-sans mb-2">条件五</label>
            <input 
              type="text" 
              value={query5}
              onChange={(e) => setQuery5(e.target.value)}
              placeholder="请输入条件五" 
              className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all placeholder:text-gray-400"
            />
          </div>
          {/* 条件六 */}
          <div>
            <label className="text-xs font-semibold text-gray-400 tracking-wide flex items-center font-sans mb-2">条件六</label>
            <input 
              type="text" 
              value={query6}
              onChange={(e) => setQuery6(e.target.value)}
              placeholder="请输入条件六" 
              className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all placeholder:text-gray-400"
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-50">
          <button 
            onClick={handleSearch}
            className="h-[40px] px-8 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100 active:scale-95"
          >
            查询
          </button>
          <button 
            onClick={handleResetQuery}
            className="h-[40px] px-6 bg-gray-50 text-gray-500 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all active:scale-95"
          >
            重置
          </button>
        </div>
      </div>

      {/* 记录列表 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-visible">
        {/* Table Header Controls */}
        <div className="px-8 py-5 border-b border-gray-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-t-2xl relative z-30">
          <div className="text-sm font-semibold text-gray-500 font-sans flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
            <span>
              显示 <strong className="text-gray-900 font-bold font-mono">{filteredModels.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> 到 <strong className="text-gray-900 font-bold font-mono">{Math.min(currentPage * pageSize, filteredModels.length)}</strong>，共 <strong className="text-blue-600 font-black font-mono">{filteredModels.length}</strong> 条记录
            </span>
          </div>
          
          <div className="flex items-center gap-3 self-end sm:self-auto relative">
            <button
              onClick={() => setIsAISidebarOpen(!isAISidebarOpen)}
              title="AI数据分析"
              className={`flex items-center justify-center w-10 h-10 border rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer shrink-0 ${
                isAISidebarOpen
                  ? 'border-indigo-300 bg-indigo-50 text-indigo-600'
                  : 'border-indigo-100 bg-indigo-50/55 hover:bg-indigo-50 text-indigo-600 hover:text-indigo-700'
              }`}
            >
              <Sparkles size={15} className={`text-indigo-500 ${isAISidebarOpen ? '' : 'animate-pulse'}`} />
            </button>

            <button
              onClick={() => setIsColToggleOpen(!isColToggleOpen)}
              title="显示/隐藏列"
              className="flex items-center justify-center w-10 h-10 border border-gray-200 bg-white rounded-xl text-gray-500 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm active:scale-95 cursor-pointer group shrink-0"
            >
              <SlidersHorizontal size={15} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
            </button>

            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              title="上一页"
              className="flex items-center justify-center w-10 h-10 border border-gray-200 bg-white rounded-xl text-gray-500 hover:text-blue-600 hover:border-blue-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-gray-500 disabled:hover:border-gray-200 transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
            >
              <ChevronLeft size={15} />
            </button>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage >= totalPages || totalPages <= 1}
              title="下一页"
              className="flex items-center justify-center w-10 h-10 border border-gray-200 bg-white rounded-xl text-gray-500 hover:text-blue-600 hover:border-blue-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-gray-500 disabled:hover:border-gray-200 transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
            >
              <ChevronRight size={15} />
            </button>

            {/* Dropdown menu for column toggles */}
            <AnimatePresence>
              {isColToggleOpen && (
                <>
                  <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsColToggleOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-11 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl p-3 space-y-1.5 z-50 text-left"
                  >
                    <div className="px-2.5 py-1 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-55 pb-1.5 flex items-center justify-between">
                      <span>🔧 配置列表显示列</span>
                    </div>
                    <div className="max-h-60 overflow-y-auto space-y-1 pr-1 no-scrollbar">
                      {columnsList.map((col) => {
                        const isChecked = visibleColumns[col.key];
                        return (
                          <label
                            key={col.key}
                            className="flex items-center gap-2.5 px-2.5 py-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors group"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                setVisibleColumns(prev => ({
                                  ...prev,
                                  [col.key]: !prev[col.key]
                                }));
                              }}
                              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500/20 border-gray-200 cursor-pointer"
                            />
                            <span className="text-xs font-bold text-gray-600 group-hover:text-gray-900 transition-colors">
                              {col.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                    <div className="border-t border-gray-100 pt-2 flex items-center justify-between px-1 shrink-0 bg-white">
                      <button
                        onClick={() => {
                          const allTrue = { ...visibleColumns };
                          Object.keys(allTrue).forEach(k => allTrue[k] = true);
                          setVisibleColumns(allTrue);
                        }}
                        className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
                      >
                        显示全部
                      </button>
                      <button
                        onClick={() => {
                          const reset = { ...visibleColumns };
                          Object.keys(reset).forEach(k => reset[k] = k === 'col1');
                          setVisibleColumns(reset);
                        }}
                        className="text-[10px] font-bold text-gray-400 hover:text-red-500 cursor-pointer"
                      >
                        全不选
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="overflow-x-auto relative z-20">
          <table 
            className="w-full text-left table-fixed" 
            style={{ minWidth: `${columnsList.filter(col => visibleColumns[col.key]).reduce((sum, col) => sum + (columnWidths[col.key] || 0), 0) + 256}px` }}
          >
            <thead className="bg-white border-b border-gray-100">
              <tr>
                {visibleColumns.col1 && (
                  <th 
                    className="sticky left-0 bg-white border-r border-gray-100/80 shadow-[4px_0_10px_-3px_rgba(0,0,0,0.06)] px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest z-40 whitespace-nowrap select-none"
                    style={{ width: `${columnWidths.col1}px` }}
                  >
                    <div className="flex items-center justify-center w-full cursor-pointer hover:text-gray-700 transition-colors relative pr-6" onClick={() => handleSort('col1')}>
                      <span className="truncate">字段一</span>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
                        {sortConfig?.key === 'col1' ? (
                          sortConfig.direction === 'asc' ? <ArrowUp size={12} className="text-blue-600" /> : <ArrowDown size={12} className="text-blue-600" />
                        ) : (
                          <ArrowUpDown size={12} className="text-gray-300 opacity-60 hover:opacity-100" />
                        )}
                      </div>
                    </div>
                    {/* Drag handle */}
                    <div 
                      onMouseDown={(e) => handleResizeStart(e, 'col1')}
                      className="absolute right-0 top-0 bottom-0 w-3 cursor-col-resize hover:bg-blue-50/50 active:bg-blue-100/50 z-30 group flex items-center justify-center"
                    >
                      <div className="w-[1px] h-full bg-gray-100 group-hover:bg-blue-200 transition-colors absolute right-px" />
                      <GripVertical size={10} className="text-gray-400 opacity-30 group-hover:opacity-100 group-hover:text-blue-500 group-active:text-blue-600 transition-all duration-150 shrink-0" />
                    </div>
                  </th>
                )}
                {visibleColumns.col2 && (
                  <th 
                    className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap relative select-none"
                    style={{ width: `${columnWidths.col2}px` }}
                  >
                    <div className="flex items-center justify-center w-full cursor-pointer hover:text-gray-700 transition-colors relative pr-6" onClick={() => handleSort('col2')}>
                      <span className="truncate">字段二</span>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
                        {sortConfig?.key === 'col2' ? (
                          sortConfig.direction === 'asc' ? <ArrowUp size={12} className="text-blue-600" /> : <ArrowDown size={12} className="text-blue-600" />
                        ) : (
                          <ArrowUpDown size={12} className="text-gray-300 opacity-60 hover:opacity-100" />
                        )}
                      </div>
                    </div>
                    <div 
                      onMouseDown={(e) => handleResizeStart(e, 'col2')}
                      className="absolute right-0 top-0 bottom-0 w-3 cursor-col-resize hover:bg-blue-50/50 active:bg-blue-100/50 z-30 group flex items-center justify-center"
                    >
                      <div className="w-[1px] h-full bg-gray-100 group-hover:bg-blue-200 transition-colors absolute right-px" />
                      <GripVertical size={10} className="text-gray-400 opacity-30 group-hover:opacity-100 group-hover:text-blue-500 group-active:text-blue-600 transition-all duration-150 shrink-0" />
                    </div>
                  </th>
                )}
                {visibleColumns.col3 && (
                  <th 
                    className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap relative select-none"
                    style={{ width: `${columnWidths.col3}px` }}
                  >
                    <div className="flex items-center justify-center w-full cursor-pointer hover:text-gray-700 transition-colors relative pr-6" onClick={() => handleSort('col3')}>
                      <span className="truncate">字段三</span>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
                        {sortConfig?.key === 'col3' ? (
                          sortConfig.direction === 'asc' ? <ArrowUp size={12} className="text-blue-600" /> : <ArrowDown size={12} className="text-blue-600" />
                        ) : (
                          <ArrowUpDown size={12} className="text-gray-300 opacity-60 hover:opacity-100" />
                        )}
                      </div>
                    </div>
                    <div 
                      onMouseDown={(e) => handleResizeStart(e, 'col3')}
                      className="absolute right-0 top-0 bottom-0 w-3 cursor-col-resize hover:bg-blue-50/50 active:bg-blue-100/50 z-30 group flex items-center justify-center"
                    >
                      <div className="w-[1px] h-full bg-gray-100 group-hover:bg-blue-200 transition-colors absolute right-px" />
                      <GripVertical size={10} className="text-gray-400 opacity-30 group-hover:opacity-100 group-hover:text-blue-500 group-active:text-blue-600 transition-all duration-150 shrink-0" />
                    </div>
                  </th>
                )}
                {visibleColumns.col4 && (
                  <th 
                    className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap relative select-none"
                    style={{ width: `${columnWidths.col4}px` }}
                  >
                    <div className="flex items-center justify-center w-full cursor-pointer hover:text-gray-700 transition-colors relative pr-6" onClick={() => handleSort('col4')}>
                      <span className="truncate">字段四</span>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
                        {sortConfig?.key === 'col4' ? (
                          sortConfig.direction === 'asc' ? <ArrowUp size={12} className="text-blue-600" /> : <ArrowDown size={12} className="text-blue-600" />
                        ) : (
                          <ArrowUpDown size={12} className="text-gray-300 opacity-60 hover:opacity-100" />
                        )}
                      </div>
                    </div>
                    <div 
                      onMouseDown={(e) => handleResizeStart(e, 'col4')}
                      className="absolute right-0 top-0 bottom-0 w-3 cursor-col-resize hover:bg-blue-50/50 active:bg-blue-100/50 z-30 group flex items-center justify-center"
                    >
                      <div className="w-[1px] h-full bg-gray-100 group-hover:bg-blue-200 transition-colors absolute right-px" />
                      <GripVertical size={10} className="text-gray-400 opacity-30 group-hover:opacity-100 group-hover:text-blue-500 group-active:text-blue-600 transition-all duration-150 shrink-0" />
                    </div>
                  </th>
                )}
                {visibleColumns.col5 && (
                  <th 
                    className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap relative select-none"
                    style={{ width: `${columnWidths.col5}px` }}
                  >
                    <div className="flex items-center justify-center w-full cursor-pointer hover:text-gray-700 transition-colors relative pr-6" onClick={() => handleSort('col5')}>
                      <span className="truncate">字段五</span>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
                        {sortConfig?.key === 'col5' ? (
                          sortConfig.direction === 'asc' ? <ArrowUp size={12} className="text-blue-600" /> : <ArrowDown size={12} className="text-blue-600" />
                        ) : (
                          <ArrowUpDown size={12} className="text-gray-300 opacity-60 hover:opacity-100" />
                        )}
                      </div>
                    </div>
                    <div 
                      onMouseDown={(e) => handleResizeStart(e, 'col5')}
                      className="absolute right-0 top-0 bottom-0 w-3 cursor-col-resize hover:bg-blue-50/50 active:bg-blue-100/50 z-30 group flex items-center justify-center"
                    >
                      <div className="w-[1px] h-full bg-gray-100 group-hover:bg-blue-200 transition-colors absolute right-px" />
                      <GripVertical size={10} className="text-gray-400 opacity-30 group-hover:opacity-100 group-hover:text-blue-500 group-active:text-blue-600 transition-all duration-150 shrink-0" />
                    </div>
                  </th>
                )}
                {visibleColumns.col6 && (
                  <th 
                    className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap relative select-none"
                    style={{ width: `${columnWidths.col6}px` }}
                  >
                    <div className="flex items-center justify-center w-full cursor-pointer hover:text-gray-700 transition-colors relative pr-6" onClick={() => handleSort('col6')}>
                      <span className="truncate">字段六</span>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
                        {sortConfig?.key === 'col6' ? (
                          sortConfig.direction === 'asc' ? <ArrowUp size={12} className="text-blue-600" /> : <ArrowDown size={12} className="text-blue-600" />
                        ) : (
                          <ArrowUpDown size={12} className="text-gray-300 opacity-60 hover:opacity-100" />
                        )}
                      </div>
                    </div>
                    <div 
                      onMouseDown={(e) => handleResizeStart(e, 'col6')}
                      className="absolute right-0 top-0 bottom-0 w-3 cursor-col-resize hover:bg-blue-50/50 active:bg-blue-100/50 z-30 group flex items-center justify-center"
                    >
                      <div className="w-[1px] h-full bg-gray-100 group-hover:bg-blue-200 transition-colors absolute right-px" />
                      <GripVertical size={10} className="text-gray-400 opacity-30 group-hover:opacity-100 group-hover:text-blue-500 group-active:text-blue-600 transition-all duration-150 shrink-0" />
                    </div>
                  </th>
                )}
                {visibleColumns.col7 && (
                  <th 
                    className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap relative select-none"
                    style={{ width: `${columnWidths.col7}px` }}
                  >
                    <div className="flex items-center justify-center w-full cursor-pointer hover:text-gray-700 transition-colors relative pr-6" onClick={() => handleSort('col7')}>
                      <span className="truncate">字段七</span>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
                        {sortConfig?.key === 'col7' ? (
                          sortConfig.direction === 'asc' ? <ArrowUp size={12} className="text-blue-600" /> : <ArrowDown size={12} className="text-blue-600" />
                        ) : (
                          <ArrowUpDown size={12} className="text-gray-300 opacity-60 hover:opacity-100" />
                        )}
                      </div>
                    </div>
                    <div 
                      onMouseDown={(e) => handleResizeStart(e, 'col7')}
                      className="absolute right-0 top-0 bottom-0 w-3 cursor-col-resize hover:bg-blue-50/50 active:bg-blue-100/50 z-30 group flex items-center justify-center"
                    >
                      <div className="w-[1px] h-full bg-gray-100 group-hover:bg-blue-200 transition-colors absolute right-px" />
                      <GripVertical size={10} className="text-gray-400 opacity-30 group-hover:opacity-100 group-hover:text-blue-500 group-active:text-blue-600 transition-all duration-150 shrink-0" />
                    </div>
                  </th>
                )}
                {visibleColumns.col8 && (
                  <th 
                    className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap relative select-none"
                    style={{ width: `${columnWidths.col8}px` }}
                  >
                    <div className="flex items-center justify-center w-full cursor-pointer hover:text-gray-700 transition-colors relative pr-6" onClick={() => handleSort('col8')}>
                      <span className="truncate">字段八</span>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
                        {sortConfig?.key === 'col8' ? (
                          sortConfig.direction === 'asc' ? <ArrowUp size={12} className="text-blue-600" /> : <ArrowDown size={12} className="text-blue-600" />
                        ) : (
                          <ArrowUpDown size={12} className="text-gray-300 opacity-60 hover:opacity-100" />
                        )}
                      </div>
                    </div>
                    <div 
                      onMouseDown={(e) => handleResizeStart(e, 'col8')}
                      className="absolute right-0 top-0 bottom-0 w-3 cursor-col-resize hover:bg-blue-50/50 active:bg-blue-100/50 z-30 group flex items-center justify-center"
                    >
                      <div className="w-[1px] h-full bg-gray-100 group-hover:bg-blue-200 transition-colors absolute right-px" />
                      <GripVertical size={10} className="text-gray-400 opacity-30 group-hover:opacity-100 group-hover:text-blue-500 group-active:text-blue-600 transition-all duration-150 shrink-0" />
                    </div>
                  </th>
                )}
                {visibleColumns.col9 && (
                  <th 
                    className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap relative select-none"
                    style={{ width: `${columnWidths.col9}px` }}
                  >
                    <div className="flex items-center justify-center w-full cursor-pointer hover:text-gray-700 transition-colors relative pr-6" onClick={() => handleSort('col9')}>
                      <span className="truncate">字段九</span>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
                        {sortConfig?.key === 'col9' ? (
                          sortConfig.direction === 'asc' ? <ArrowUp size={12} className="text-blue-600" /> : <ArrowDown size={12} className="text-blue-600" />
                        ) : (
                          <ArrowUpDown size={12} className="text-gray-300 opacity-60 hover:opacity-100" />
                        )}
                      </div>
                    </div>
                    <div 
                      onMouseDown={(e) => handleResizeStart(e, 'col9')}
                      className="absolute right-0 top-0 bottom-0 w-3 cursor-col-resize hover:bg-blue-50/50 active:bg-blue-100/50 z-30 group flex items-center justify-center"
                    >
                      <div className="w-[1px] h-full bg-gray-100 group-hover:bg-blue-200 transition-colors absolute right-px" />
                      <GripVertical size={10} className="text-gray-400 opacity-30 group-hover:opacity-100 group-hover:text-blue-500 group-active:text-blue-600 transition-all duration-150 shrink-0" />
                    </div>
                  </th>
                )}
                {visibleColumns.col10 && (
                  <th 
                    className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap relative select-none"
                    style={{ width: `${columnWidths.col10}px` }}
                  >
                    <div className="flex items-center justify-center w-full cursor-pointer hover:text-gray-700 transition-colors relative pr-6" onClick={() => handleSort('col10')}>
                      <span className="truncate">字段十</span>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
                        {sortConfig?.key === 'col10' ? (
                          sortConfig.direction === 'asc' ? <ArrowUp size={12} className="text-blue-600" /> : <ArrowDown size={12} className="text-blue-600" />
                        ) : (
                          <ArrowUpDown size={12} className="text-gray-300 opacity-60 hover:opacity-100" />
                        )}
                      </div>
                    </div>
                    <div 
                      onMouseDown={(e) => handleResizeStart(e, 'col10')}
                      className="absolute right-0 top-0 bottom-0 w-3 cursor-col-resize hover:bg-blue-50/50 active:bg-blue-100/50 z-30 group flex items-center justify-center"
                    >
                      <div className="w-[1px] h-full bg-gray-100 group-hover:bg-blue-200 transition-colors absolute right-px" />
                      <GripVertical size={10} className="text-gray-400 opacity-30 group-hover:opacity-100 group-hover:text-blue-500 group-active:text-blue-600 transition-all duration-150 shrink-0" />
                    </div>
                  </th>
                )}
                <th 
                  className="sticky right-0 bg-white border-l border-gray-100/80 shadow-[-4px_0_10px_-3px_rgba(0,0,0,0.06)] px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest w-64 text-right z-40 whitespace-nowrap"
                >
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedModels.map(model => {
                const modelNumId = parseInt(model.id.replace(/\D/g, '')) || 0;
                return (
                  <tr key={model.id} className="hover:bg-blue-50/10 transition-colors group">
                    {visibleColumns.col1 && (
                      <td 
                        className="sticky left-0 bg-white border-r border-gray-100/80 shadow-[4px_0_10px_-3px_rgba(0,0,0,0.06)] group-hover:bg-slate-50 px-8 py-5 text-sm font-mono font-bold text-blue-600 z-10 truncate transition-colors duration-150" 
                        style={{ width: `${columnWidths.col1}px` }}
                      >
                        {model.identifier}
                      </td>
                    )}
                    {visibleColumns.col2 && (
                      <td className="px-8 py-5" style={{ width: `${columnWidths.col2}px` }}>
                        <div className="flex items-center gap-3 font-bold text-gray-900 text-sm truncate">
                          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
                            <Box size={16} />
                          </div>
                          <span className="truncate">{model.name}</span>
                        </div>
                      </td>
                    )}
                    {visibleColumns.col3 && (
                      <td className="px-8 py-5" style={{ width: `${columnWidths.col3}px` }}>
                        <Badge variant="info">{model.category}</Badge>
                      </td>
                    )}
                    {visibleColumns.col4 && (
                      <td className="px-8 py-5" style={{ width: `${columnWidths.col4}px` }}>
                        {model.isModeled ? (
                          <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs whitespace-nowrap">
                            <CheckCircle2 size={14} />
                            已建模
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-gray-400 font-bold text-xs whitespace-nowrap">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                            未建模
                          </span>
                        )}
                      </td>
                    )}
                    {visibleColumns.col5 && (
                      <td className="px-8 py-5 text-sm text-gray-400 truncate" style={{ width: `${columnWidths.col5}px` }}>
                        <div className="truncate" title={model.description}>{model.description}</div>
                      </td>
                    )}
                    {visibleColumns.col6 && (
                      <td className="px-8 py-5 text-sm font-mono text-gray-400" style={{ width: `${columnWidths.col6}px` }}>{model.updatedAt}</td>
                    )}
                    {visibleColumns.col7 && (
                      <td className="px-8 py-5 text-sm font-sans text-gray-500 whitespace-nowrap" style={{ width: `${columnWidths.col7}px` }}>
                        <span className="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-slate-50 text-slate-600 text-xs font-medium border border-slate-100">
                          配置#{100 + modelNumId}
                        </span>
                      </td>
                    )}
                    {visibleColumns.col8 && (
                      <td className="px-8 py-5 text-sm font-sans text-gray-500 whitespace-nowrap" style={{ width: `${columnWidths.col8}px` }}>
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          等级 {(modelNumId % 3) + 1}
                        </span>
                      </td>
                    )}
                    {visibleColumns.col9 && (
                      <td className="px-8 py-5 text-sm font-sans text-gray-500 whitespace-nowrap" style={{ width: `${columnWidths.col9}px` }}>
                        <div className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline cursor-pointer truncate">
                          <FileText size={14} className="shrink-0" />
                          <span className="truncate">doc_v{(modelNumId % 4) + 1}.pdf</span>
                        </div>
                      </td>
                    )}
                    {visibleColumns.col10 && (
                      <td className="px-8 py-5 text-sm font-sans text-gray-400 whitespace-nowrap truncate" style={{ width: `${columnWidths.col10}px` }} title={`备注：该数据节点已执行自动化核验，关联ID: ${model.id}`}>
                        核对码: {(modelNumId * 37 + 104) % 1000}
                      </td>
                    )}
                    <td className="sticky right-0 bg-white border-l border-gray-100/80 shadow-[-4px_0_10px_-3px_rgba(0,0,0,0.06)] group-hover:bg-slate-50 px-8 py-5 z-10 text-right transition-colors duration-150">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          type="button"
                          onClick={() => {
                            setViewModel(model);
                            setIsViewModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-all text-xs font-normal whitespace-nowrap cursor-pointer"
                        >
                          查看
                        </button>
                        <button 
                          type="button"
                          onClick={() => {
                            setIsEditMode(true);
                            setEditingModel(model);
                            setField1(model.identifier);
                            setField2(model.category === "桌子" ? "选项一" : model.category === "椅子" ? "选项二" : "选项三");
                            setField4("编辑中的字段四");
                            setField5(model.name);
                            setField6("编辑中的字段六");
                            setField7(model.description);
                            setField8("单选选项一");
                            setIsModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-all text-xs font-normal whitespace-nowrap cursor-pointer"
                        >
                          编辑
                        </button>
                        {(() => {
                          const isCurrentlyActive = modelStatuses[model.id] !== 'inactive';
                          return (
                            <button 
                              type="button"
                              onClick={() => {
                                const nextState = isCurrentlyActive ? 'inactive' : 'active';
                                setModelStatuses(prev => ({ ...prev, [model.id]: nextState }));
                                if (nextState === 'active') {
                                  showNotification(`▶️ 已成功启用记录 [${model.name}]`);
                                } else {
                                  showNotification(`⏸️ 已成功停用记录 [${model.name}]`);
                                }
                              }}
                              className={`px-3 py-1.5 rounded-md transition-all text-xs font-normal whitespace-nowrap cursor-pointer ${
                                isCurrentlyActive 
                                  ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' 
                                  : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                              }`}
                            >
                              {isCurrentlyActive ? '停用' : '启用'}
                            </button>
                          );
                        })()}
                        <button 
                          type="button"
                          onClick={() => showNotification(`🗑️ 已成功删除记录 [${model.name}]`)}
                          className="px-3 py-1.5 bg-red-50 text-red-500 rounded-md hover:bg-red-100 transition-all text-xs font-normal whitespace-nowrap cursor-pointer"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginatedModels.length === 0 && (
                <tr>
                  <td colSpan={Object.values(visibleColumns).filter(v => v).length + 1} className="px-8 py-12 text-center text-gray-400 font-semibold text-sm">
                    暂无符合条件的记录数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination 
          currentPage={currentPage}
          totalItems={filteredModels.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* AI Panel Floating Drawer Overlay */}
      <AnimatePresence>
        {isAISidebarOpen && (
          <>
            {/* Soft click-blocking background mask - matching New Record modal backdrop style for a consistent 3D depth */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAISidebarOpen(false)}
              className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 cursor-pointer"
            />
            {/* Narrower floating panel container with heavy 3D shadow */}
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="fixed right-6 top-6 bottom-6 z-50 w-[510px] flex flex-col"
            >
              <div className="bg-white rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.3),0_4px_10px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.4)] border border-slate-100/80 overflow-hidden flex flex-col h-full font-sans">
                {/* Header with Title '系统使用指南' and no secondary subtitle */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 tracking-tight flex items-center gap-2.5 font-sans">
                      <div className="w-1.5 h-5 bg-indigo-600 rounded-full" />
                      系统使用指南
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={handleClearChat}
                      title="清空对话"
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:text-red-550 hover:bg-red-50 transition-all cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                    <button 
                      onClick={() => setIsAISidebarOpen(false)} 
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>

                {/* Chat Message List Area */}
                <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 bg-slate-50/50 flex flex-col">
                  {chatMessages.map((msg) => (
                    msg.role === 'user' ? (
                      <div 
                        key={msg.id} 
                        className="flex items-start gap-2.5 flex-row-reverse"
                      >
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 bg-indigo-600 text-white shadow-xs">
                          我
                        </div>
                        
                        <div className="max-w-[85%] flex flex-col gap-0.5">
                          <div className="px-3.5 py-2.5 rounded-2xl text-sm font-normal line-clamp-none whitespace-pre-wrap leading-relaxed shadow-[0_2px_8px_-1px_rgba(0,0,0,0.04)] bg-indigo-600 text-white rounded-tr-none">
                            {msg.text}
                          </div>
                          <span className="text-[10px] text-gray-400 px-1 font-mono font-medium text-right block mt-0.5">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div 
                        key={msg.id} 
                        className="flex flex-col gap-2 pb-3.5 border-b border-gray-100/50"
                      >
                        <div className="text-sm text-gray-800 line-clamp-none whitespace-pre-wrap leading-relaxed font-sans font-normal">
                          {msg.text}
                        </div>
                        {/* Custom Actions: 收藏, 导出, 复制, 点赞, 点踩 */}
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] text-gray-400 font-mono font-medium">
                            AI助手 • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => toggleBookmark(msg.id)}
                              className={`p-1.5 rounded-lg transition-all hover:scale-105 cursor-pointer ${
                                bookmarkedMessageIds[msg.id] 
                                  ? 'text-amber-500 bg-amber-50 shadow-xs' 
                                  : 'text-gray-400 hover:text-amber-500 hover:bg-gray-100/80'
                              }`}
                              title="收藏"
                            >
                              <Bookmark size={14} className={bookmarkedMessageIds[msg.id] ? "fill-amber-500" : ""} />
                            </button>
                            <button
                              onClick={() => handleExportText(msg.id, msg.text)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 hover:scale-105 transition-all cursor-pointer"
                              title="导出文本"
                            >
                              <Download size={14} />
                            </button>
                            <button
                              onClick={() => handleCopyText(msg.text)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 hover:scale-105 transition-all cursor-pointer"
                              title="复制"
                            >
                              <Copy size={14} />
                            </button>
                            <button
                              onClick={() => handleLikeMessage(msg.id, 'up')}
                              className={`p-1.5 rounded-lg transition-all hover:scale-105 cursor-pointer ${
                                likedMessageIds[msg.id] === 'up' 
                                  ? 'text-blue-500 bg-blue-50 shadow-xs' 
                                  : 'text-gray-400 hover:text-blue-500 hover:bg-gray-100/80'
                              }`}
                              title="点赞"
                            >
                              <ThumbsUp size={14} className={likedMessageIds[msg.id] === 'up' ? "fill-blue-500" : ""} />
                            </button>
                            <button
                              onClick={() => handleLikeMessage(msg.id, 'down')}
                              className={`p-1.5 rounded-lg transition-all hover:scale-105 cursor-pointer ${
                                likedMessageIds[msg.id] === 'down' 
                                  ? 'text-red-500 bg-red-50 shadow-xs' 
                                  : 'text-gray-400 hover:text-red-550 hover:bg-red-50/80'
                              }`}
                              title="点踩"
                            >
                              <ThumbsDown size={14} className={likedMessageIds[msg.id] === 'down' ? "fill-red-500" : ""} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  ))}
                  
                  {isAILoading && (
                    <div className="flex flex-col gap-1 pb-2">
                      <div className="text-sm text-indigo-500 font-medium flex items-center gap-1.5 py-1">
                        <div className="flex space-x-1">
                          <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                          <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                          <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce"></span>
                        </div>
                        <span>智能解答整理中...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Suggestions Panel */}
                <div className="px-5 py-2.5 border-t border-gray-100 bg-white space-y-1.5 shrink-0">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">系统使用常见问题</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "如何新建或编辑数据记录",
                      "如何控制表格列显示隐藏",
                      "如何精准多条件过滤查询数据",
                      "如何将当前视图数据进行重置"
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => handleSendChatMessage(suggestion)}
                        disabled={isAILoading}
                        className="px-2.5 py-1.5 border border-slate-100 bg-slate-50 text-gray-600 hover:bg-indigo-50 hover:border-indigo-150 hover:text-indigo-600 rounded-lg text-[10px] transition-all cursor-pointer font-normal disabled:opacity-40 disabled:pointer-events-none active:scale-95"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Send Message Input Area */}
                <div className="px-5 py-3 border-t border-gray-100 bg-white flex items-start gap-2 shrink-0">
                  <textarea
                    rows={3}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendChatMessage();
                      }
                    }}
                    placeholder={isAILoading ? "AI 智能挖掘分析中..." : "输入您关于系统使用操作的疑问..."}
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all placeholder:text-gray-400 font-sans resize-none h-[72px]"
                  />
                  <button
                    onClick={() => handleSendChatMessage()}
                    className="w-12 h-[72px] flex flex-col items-center justify-center gap-1 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200 transition-all shadow-md shadow-indigo-100 active:scale-95 cursor-pointer shrink-0 ml-1.5"
                  >
                    <Send size={13} className="shrink-0" />
                    <span className="text-[10px] font-bold tracking-wider shrink-0 select-none">发送</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 新建/编辑模型弹窗 */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancelNewRecord}
              className="absolute inset-0 bg-transparent"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-3xl h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10"
            >
              {/* 头部标题 */}
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white z-10">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-3 font-sans">
                    <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                    {isEditMode ? '编辑记录' : '新建记录'}
                  </h2>
                </div>
                <button onClick={handleCancelNewRecord} className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
                  <X size={20} />
                </button>
              </div>

              {/* 表单区域：一行一个字段 (不含背景卡片) */}
              <div className="flex-1 overflow-y-auto px-10 py-8 bg-white space-y-6">
                {/* 字段一 */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 tracking-wide flex items-center font-sans">
                    字段一
                    <span className="text-red-500 ml-1 font-bold">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={field1}
                    onChange={(e) => setField1(e.target.value)}
                    placeholder="请输入字段一的内容" 
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm placeholder:text-gray-400 font-sans"
                  />
                </div>

                {/* 字段二 */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 tracking-wide flex items-center font-sans">
                    字段二
                    <span className="text-red-500 ml-1 font-bold">*</span>
                  </label>
                  <select 
                    value={field2}
                    onChange={(e) => setField2(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm text-gray-700 font-medium font-sans animate-none"
                  >
                    <option value="">请选择选项</option>
                    <option value="选项一">经典选项一</option>
                    <option value="选项二">高级选项二</option>
                    <option value="选项三">至尊选项三</option>
                  </select>
                </div>

                {/* 字段三 */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 tracking-wide flex items-center font-sans">
                    字段三
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                      <input 
                        type="date" 
                        value={field3Start}
                        onChange={(e) => setField3Start(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm text-gray-700 font-sans"
                      />
                    </div>
                    <span className="text-gray-400 font-bold text-xs shrink-0">至</span>
                    <div className="flex-1 relative">
                      <input 
                        type="date" 
                        value={field3End}
                        onChange={(e) => setField3End(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm text-gray-700 font-sans"
                      />
                    </div>
                  </div>
                  {/* 提示内容使用蓝色字体，字体大小12px，前面有提示图标 */}
                  <div className="flex items-center gap-1.5 text-xs text-blue-500 mt-1 font-sans">
                    <Info size={14} className="text-blue-500 shrink-0" />
                    <span>提示：配置起止日期将作为生效周期的校验凭证，到期后系统将提示归档</span>
                  </div>
                </div>

                {/* 字段四 */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 tracking-wide flex items-center font-sans">
                    字段四
                  </label>
                  <input 
                    type="text" 
                    value={field4}
                    onChange={(e) => setField4(e.target.value)}
                    placeholder="请输入字段四的内容" 
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm placeholder:text-gray-400 font-sans"
                  />
                </div>

                {/* 字段五 */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 tracking-wide flex items-center font-sans">
                    字段五
                  </label>
                  <input 
                    type="text" 
                    value={field5}
                    onChange={(e) => setField5(e.target.value)}
                    placeholder="请输入字段五的内容" 
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm placeholder:text-gray-400 font-sans"
                  />
                </div>

                {/* 字段六 */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 tracking-wide flex items-center font-sans">
                    字段六
                  </label>
                  <input 
                    type="text" 
                    value={field6}
                    onChange={(e) => setField6(e.target.value)}
                    placeholder="请输入字段六的内容" 
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm placeholder:text-gray-400 font-sans"
                  />
                </div>

                {/* 字段七 */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 tracking-wide flex items-center font-sans">
                    字段七
                  </label>
                  <textarea 
                    rows={4}
                    value={field7}
                    onChange={(e) => setField7(e.target.value)}
                    placeholder="请输入详细的字段七文本域内容..." 
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm placeholder:text-gray-400 resize-y font-sans"
                  />
                </div>

                {/* 字段八 */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 tracking-wide flex items-center font-sans">
                    字段八
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                    {['单选选项一', '单选选项二', '单选选项三'].map((opt) => (
                      <label 
                        key={opt}
                        className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border transition-all cursor-pointer font-sans ${
                          field8 === opt 
                            ? 'bg-blue-50/50 border-blue-500 text-blue-600 font-bold' 
                            : 'bg-gray-50/50 border-gray-100 text-gray-500 hover:border-gray-200'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="field8"
                          value={opt}
                          checked={field8 === opt}
                          onChange={() => setField8(opt)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 accent-blue-600"
                        />
                        <span className="text-xs">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 字段九 */}
                <div className="flex flex-col gap-1.5 mb-6">
                  <label className="text-xs font-semibold text-gray-400 tracking-wide flex items-center font-sans">
                    字段九 (文件上传)
                  </label>
                  <div 
                    onDragOver={(e) => {
                      e.preventDefault();
                      setField9Dragging(true);
                    }}
                    onDragLeave={() => setField9Dragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setField9Dragging(false);
                      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        setField9File(e.dataTransfer.files[0]);
                      }
                    }}
                    onClick={() => {
                      const fileInput = document.getElementById('field9-file-input');
                      fileInput?.click();
                    }}
                    className={`w-full py-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all font-sans ${
                      field9Dragging 
                        ? 'border-blue-500 bg-blue-50/25' 
                        : field9File 
                        ? 'border-green-400 bg-green-50/10' 
                        : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50/50'
                    }`}
                  >
                    <input 
                      type="file" 
                      id="field9-file-input"
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          setField9File(e.target.files[0]);
                        }
                      }}
                    />
                    {field9File ? (
                      <>
                        <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shadow-sm">
                          <FileText size={24} />
                        </div>
                        <div className="text-center space-y-1">
                          <p className="text-sm font-bold text-gray-800">{field9File.name}</p>
                          <p className="text-xs text-gray-400 font-sans">已成功加载 ({(field9File.size / 1024).toFixed(1)} KB)</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                          <UploadCloud size={24} />
                        </div>
                        <div className="text-center space-y-1">
                          <p className="text-sm font-bold text-gray-700 font-sans">拖拽文件到此处，或点击上传</p>
                          <p className="text-xs text-gray-400 font-sans">支持任意文件类型，最大可支持 50MB</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

              </div>

              {/* 底部按钮 */}
              <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/30 flex items-center justify-end gap-4 shrink-0 bg-white">
                <button 
                  onClick={handleCancelNewRecord}
                  className="px-8 py-2.5 rounded-xl font-bold text-gray-400 hover:text-gray-600 transition-colors text-sm font-sans"
                >
                  取消
                </button>
                <button 
                  onClick={handleSaveNewRecord}
                  className="px-12 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xl shadow-blue-200 transition-all active:scale-95 text-xs tracking-wider font-sans"
                >
                  保存
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 查看详情弹窗 */}
      <AnimatePresence>
        {isViewModalOpen && viewModel && (() => {
          const modelNumId = parseInt(viewModel.id.replace(/\D/g, '')) || 0;
          const detailsList = [
            { label: '字段一', value: viewModel.identifier },
            { label: '字段二', value: viewModel.name },
            { label: '字段三', value: viewModel.category },
            { label: '字段四', value: viewModel.isModeled ? '已建模' : '未建模' },
            { label: '字段五', value: viewModel.description },
            { label: '字段六', value: viewModel.updatedAt },
            { label: '字段七', value: `配置#${100 + modelNumId}` },
            { label: '字段八', value: `等级 ${(modelNumId % 3) + 1}` },
            { label: '字段九', value: `doc_v${(modelNumId % 4) + 1}.pdf` },
            { label: '字段十', value: `核对码: ${(modelNumId * 37 + 104) % 1000}` },
          ];

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsViewModalOpen(false)}
                className="absolute inset-0 bg-transparent"
              />
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative bg-white w-full max-w-2xl h-[560px] rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 border border-slate-100/80"
              >
                {/* 头部标题 */}
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-3 font-sans">
                      <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                      数据详情查看
                    </h2>
                  </div>
                  <button 
                    onClick={() => setIsViewModalOpen(false)} 
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* 表格内容区域 */}
                <div className="flex-1 overflow-y-auto px-8 py-6 bg-white">
                  <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse text-sm">
                      <tbody className="divide-y divide-slate-100 text-gray-700">
                        {detailsList.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 w-1/3 text-right font-normal text-gray-900 bg-blue-50/30 border-r border-blue-100/60 select-none">
                              {item.label}：
                            </td>
                            <td className="px-6 py-4 font-normal text-gray-900 whitespace-pre-wrap break-all">
                              {item.label === '字段四' ? (
                                item.value === '已建模' ? (
                                  <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded-lg">
                                    <CheckCircle2 size={13} />
                                    已建模
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 text-gray-400 font-bold text-xs bg-gray-50 px-2.5 py-1 rounded-lg">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                    未建模
                                  </span>
                                )
                              ) : item.label === '字段九' ? (
                                <div className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-medium">
                                  <FileText size={14} className="text-blue-500" />
                                  <span>{item.value}</span>
                                </div>
                              ) : item.label === '字段一' ? (
                                <span className="font-mono font-bold text-blue-600 text-xs">
                                  {item.value}
                                </span>
                              ) : (
                                item.value?.toString() || <span className="text-gray-300">空</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>


    </div>
  );
}
