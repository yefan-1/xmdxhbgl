import React, { useState } from 'react';
import { MOCK_SPECS, MOCK_MODELS, MOCK_INSTANCES, MOCK_SUPPLIERS, CATEGORIES_HIERARCHY } from '../data/mockData';
import { 
  Plus, 
  Search, 
  UploadCloud,
  ChevronRight,
  ChevronDown,
  Box,
  Layers,
  FolderTree,
  Cpu,
  Monitor,
  Smartphone,
  Zap,
  Lock,
  Shield,
  Wind,
  Eye,
  Edit3,
  Trash2,
  X,
  Calendar,
  Download,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Pagination from './ui/Pagination';

export default function AssetManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 30;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSelectedSpecId, setModalSelectedSpecId] = useState<string | null>(null);
  const [isSpecDetailModalOpen, setIsSpecDetailModalOpen] = useState(false);
  const [isUserPickerOpen, setIsUserPickerOpen] = useState(false);
  const [isDeptPickerOpen, setIsDeptPickerOpen] = useState(false);
  const [isSupplierPickerOpen, setIsSupplierPickerOpen] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [supplierSearch, setSupplierSearch] = useState({ name: '', type: '' });
  const [supplierPage, setSupplierPage] = useState(1);
  const [selectedDept, setSelectedDept] = useState("华大资产管理部");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<string[]>(['信息类', '环境信息', '系统信息', '实体类', '基础家具', '网络通信', '基础电气']);

  const MOCK_USERS = [
    { id: '1001', name: '王振华', dept: '资产管理部' },
    { id: '1002', name: '李思思', dept: '信息学院' },
    { id: '1003', name: '张大勇', dept: '后勤处' },
    { id: '1004', name: '赵六', dept: '实验室管理办公室' },
  ];

  const DEPARTMENT_TREE: Record<string, string[]> = {
    '校党政职能部门': [
      '党委办公室/校长办公室',
      '党委组织部/统战部',
      '党委宣传部/教师工作部',
      '党委学生工作部',
      '纪检监察办公室',
      '教务处/实验室与设备管理',
      '研究生院',
      '资产管理处',
      '财务处',
      '信息化建设与管理处',
      '后勤保障部'
    ],
    '教学科研单位': [
      '经济与管理学院',
      '法学院',
      '理学院',
      '信息科学与工程学院',
      '机电及自动化学院',
      '建筑学院',
      '土木工程学院',
      '新闻与传播学院',
      '外国语学院',
      '计算机科学与技术学院'
    ]
  };

  const [expandedDepts, setExpandedDepts] = useState<string[]>(['校党政职能部门', '教学科研单位']);

  const CATEGORY_ICONS: Record<string, any> = {
    '桌子': Monitor,
    '椅子': Smartphone,
    '网络设备': Cpu,
    '灯': Zap,
    '门': Lock,
    '监控': Shield,
    '电器': Wind,
    '环境信息': Wind,
    '系统信息': Cpu,
    '天气': Wind,
    '温度': Zap,
    '光照': Zap,
    '湿度': Wind,
    'PM2.5': Wind,
    'PM10': Wind,
    '风速': Wind,
    '会议室预约系统': Cpu,
    '教务排课系统': Cpu,
    '会议室巡检系统': Cpu,
    '教室巡检系统': Cpu
  };

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => 
      prev.includes(nodeId) ? prev.filter(n => n !== nodeId) : [...prev, nodeId]
    );
  };

  const renderTree = (data: any, parentId: string = '', level: number = 0) => {
    return Object.entries(data).map(([key, value]) => {
      const nodeId = parentId ? `${parentId}-${key}` : key;
      const isExpanded = expandedNodes.includes(nodeId);
      const IconComponent = CATEGORY_ICONS[key] || (level === 0 ? Layers : Box);

      if (typeof value === 'object' && !Array.isArray(value)) {
        return (
          <div key={key} className={level === 0 ? "mb-2" : ""}>
            <button 
              onClick={() => toggleNode(nodeId)}
              className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors text-xs font-bold ${
                level === 0 ? 'text-gray-900 hover:bg-gray-100' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {level === 0 ? <Layers size={14} className="text-blue-600" /> : <IconComponent size={14} className="text-gray-400" />}
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <span>{key}</span>
            </button>
            <AnimatePresence>
              {isExpanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="ml-4 border-l border-gray-100 pl-2 mt-1 space-y-1 overflow-hidden"
                >
                  {renderTree(value, nodeId, level + 1)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      }

      // Handle the 3rd level (array elements) as Leaf nodes
      return (value as string[]).map(catName => {
        const LeafIcon = CATEGORY_ICONS[catName] || Box;
        const isSelected = selectedCategory === catName;
        
        return (
          <button
            key={catName}
            onClick={() => {
              setSelectedCategory(catName);
              setCurrentPage(1);
            }}
            className={`w-full text-left p-2 rounded-lg transition-all text-xs font-bold flex items-center justify-between group ${
              isSelected 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <LeafIcon size={14} className={isSelected ? 'text-white' : 'text-gray-400'} />
              <span className="truncate">{catName} ({getCategoryInstanceCount(catName)})</span>
            </div>
          </button>
        );
      });
    });
  };

  const getCategoryInstanceCount = (catName: string) => {
    return MOCK_INSTANCES.filter(i => {
      const spec = MOCK_SPECS.find(s => s.id === i.specId);
      const model = MOCK_MODELS.find(m => m.id === spec?.modelId);
      return model?.category === catName;
    }).length;
  };

  const filteredAssets = MOCK_INSTANCES.filter(i => {
    if (!selectedCategory) return true;
    const spec = MOCK_SPECS.find(s => s.id === i.specId);
    const model = MOCK_MODELS.find(m => m.id === spec?.modelId);
    return model?.category === selectedCategory;
  });

  const paginatedAssets = filteredAssets.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex h-full overflow-hidden bg-white">
      {/* Left Sidebar - Model Tree */}
      <aside className="w-80 border-r border-gray-100 flex flex-col bg-gray-50/30 overflow-hidden shrink-0">
        <div className="p-6 border-b border-gray-100 bg-white shadow-sm z-10">
          <div className="flex items-center gap-2">
            <FolderTree size={18} className="text-blue-600" />
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">物模型</h2>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
          {renderTree(CATEGORIES_HIERARCHY)}
        </div>
      </aside>

      {/* New Asset Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-gray-900"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white z-10">
                <div>
                  <h2 className="text-xl font-black text-gray-900 tracking-tight">新增资产</h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-10 space-y-8 overflow-y-auto flex-1 no-scrollbar">
                <div className="space-y-6 max-w-xl mx-auto">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">所属物模型</label>
                    <div className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-gray-400 font-bold text-sm cursor-not-allowed">
                      {selectedCategory || '未选择'}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">产品规格型号</label>
                    <div className="flex gap-3">
                      <select 
                        value={modalSelectedSpecId || ''}
                        onChange={(e) => setModalSelectedSpecId(e.target.value)}
                        className="flex-1 px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-bold text-sm outline-none"
                      >
                        <option value="">请选择规格型号...</option>
                        {MOCK_SPECS.filter(s => {
                          const model = MOCK_MODELS.find(m => m.id === s.modelId);
                          return !selectedCategory || model?.category === selectedCategory;
                        }).map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                      <button 
                        disabled={!modalSelectedSpecId}
                        onClick={() => setIsSpecDetailModalOpen(true)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                          modalSelectedSpecId 
                            ? 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 active:scale-95' 
                            : 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                        }`}
                      >
                        查看规格
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">资产编号</label>
                    <input type="text" placeholder="输入资产唯一编号..." className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-blue-500 font-mono text-sm font-bold outline-none" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">供应商</label>
                    <button 
                      onClick={() => setIsSupplierPickerOpen(true)}
                      className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl flex items-center justify-between text-gray-700 font-bold text-sm hover:bg-gray-100 transition-all text-left"
                    >
                      <span className={selectedSupplier ? 'text-gray-900' : 'text-gray-400'}>
                        {selectedSupplier ? selectedSupplier.name : '点击选择供应商...'}
                      </span>
                      <Search size={16} className="text-gray-400" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">采购合同编号</label>
                    <input type="text" placeholder="输入采购合同编号..." className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-sm outline-none" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">采购日期</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input type="date" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-sm outline-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">保修截止日</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input type="date" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-sm outline-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">产权部门</label>
                    <button 
                      onClick={() => setIsDeptPickerOpen(true)}
                      className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl flex items-center justify-between text-gray-700 font-bold text-sm hover:bg-gray-100 transition-all text-left"
                    >
                      <span>{selectedDept}</span>
                      <ChevronDown size={16} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">责任人/保管人</label>
                    <button 
                      onClick={() => setIsUserPickerOpen(true)}
                      className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl flex items-center justify-between text-gray-700 font-bold text-sm hover:bg-gray-100 transition-all text-left"
                    >
                      <div className="flex items-center gap-2">
                        {selectedUser ? <Users size={14} className="text-blue-500" /> : <Plus size={14} className="text-gray-400" />}
                        <span>{selectedUser ? `${selectedUser.name} (${selectedUser.id})` : '选择责任人...'}</span>
                      </div>
                      <Search size={16} className="text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-4 shrink-0 bg-white z-10">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-2.5 rounded-xl font-bold text-gray-400 hover:text-gray-600 transition-colors"
                >
                  取消
                </button>
                <button className="px-12 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black uppercase tracking-widest shadow-xl shadow-blue-200 transition-all active:scale-95 text-xs">
                  保存
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Specification Detail Modal */}
      <AnimatePresence>
        {isSpecDetailModalOpen && modalSelectedSpecId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsSpecDetailModalOpen(false)} />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <Box size={20} />
                  </div>
                  <h3 className="font-bold text-gray-900">产品规格型号明细</h3>
                </div>
                <button onClick={() => setIsSpecDetailModalOpen(false)}><X size={18} className="text-gray-400" /></button>
              </div>
              <div className="p-8 overflow-y-auto space-y-6 no-scrollbar">
                {(() => {
                  const spec = MOCK_SPECS.find(s => s.id === modalSelectedSpecId);
                  if (!spec) return null;
                  return (
                    <>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">规格名称</label>
                          <p className="text-sm font-bold text-gray-900">{spec.name}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">规格标识符</label>
                          <p className="text-sm font-mono font-bold text-blue-600">SPEC_{spec.id.substring(0,8)}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">生产厂家</label>
                          <p className="text-sm font-bold text-gray-900">{spec.manufacturer}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">维保周期</label>
                          <p className="text-sm font-bold text-gray-900">365 天</p>
                        </div>
                      </div>
                      
                      <div className="pt-6 border-t border-gray-50 space-y-4">
                        <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">物联网能力</h4>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">连接方式</label>
                            <p className="text-xs font-bold text-gray-700">WIFI / Zigbee</p>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">供电方式</label>
                            <p className="text-xs font-bold text-gray-700">POE / 交流 220V</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-50 space-y-4">
                        <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">物理参数</h4>
                        <div className="grid grid-cols-2 gap-6 text-xs bg-gray-50 p-4 rounded-xl">
                          <span className="text-gray-400">尺寸规格:</span>
                          <span className="text-gray-900 font-bold text-right">440x280x44 mm</span>
                          <span className="text-gray-400">设备重量:</span>
                          <span className="text-gray-900 font-bold text-right">3.8 kg</span>
                          <span className="text-gray-400">额定功率:</span>
                          <span className="text-gray-900 font-bold text-right">150W</span>
                        </div>
                      </div>
                    </>
                  )
                })()}
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={() => setIsSpecDetailModalOpen(false)}
                  className="px-8 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm hover:bg-gray-50 transition-all"
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Personnel Selector Modal */}
      <AnimatePresence>
        {isUserPickerOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsUserPickerOpen(false)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px]"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-900">选择责任人/保管人</h3>
                <button onClick={() => setIsUserPickerOpen(false)}><X size={18} className="text-gray-400" /></button>
              </div>
              <div className="p-4 bg-gray-50/50 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="按姓名或工号搜索..." 
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#FBFCFD] sticky top-0 border-b border-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">工号</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">姓名</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">所属部门</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-24 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {MOCK_USERS.filter(u => u.name.includes(userSearch) || u.id.includes(userSearch)).map(user => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-xs font-mono font-bold text-blue-600">{user.id}</td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">{user.name}</td>
                        <td className="px-6 py-4 text-xs text-gray-500">{user.dept}</td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => { setSelectedUser(user); setIsUserPickerOpen(false); }}
                            className="text-blue-600 font-bold text-xs hover:underline"
                          >
                            选择
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Department Selector Modal (Two-level tree) */}
      <AnimatePresence>
        {isDeptPickerOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsDeptPickerOpen(false)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh]"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <FolderTree size={16} />
                  </div>
                  <h3 className="font-bold text-gray-900">选择产权部门</h3>
                </div>
                <button onClick={() => setIsDeptPickerOpen(false)}><X size={18} className="text-gray-400" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
                {Object.entries(DEPARTMENT_TREE).map(([parent, children]) => (
                  <div key={parent} className="space-y-1">
                    <button 
                      onClick={() => setExpandedDepts(prev => prev.includes(parent) ? prev.filter(p => p !== parent) : [...prev, parent])}
                      className="w-full flex items-center gap-2 p-3 rounded-xl text-sm font-black text-gray-900 hover:bg-gray-50 transition-all uppercase tracking-widest"
                    >
                      {expandedDepts.includes(parent) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      <span>{parent}</span>
                    </button>
                    <AnimatePresence>
                      {expandedDepts.includes(parent) && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="ml-6 space-y-1 overflow-hidden"
                        >
                          {children.map(child => (
                            <button
                              key={child}
                              onClick={() => { setSelectedDept(child); setIsDeptPickerOpen(false); }}
                              className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all border border-transparent ${
                                selectedDept === child 
                                  ? 'bg-blue-600 text-white shadow-md border-blue-500' 
                                  : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'
                              }`}
                            >
                              {child}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Supplier Selector Modal */}
      <AnimatePresence>
        {isSupplierPickerOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsSupplierPickerOpen(false)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white w-full max-w-5xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col h-[700px]"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <Users size={20} />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">选择供应商</h3>
                </div>
                <button onClick={() => setIsSupplierPickerOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 bg-gray-50/50 border-b border-gray-100 space-y-6 shrink-0">
                <div className="flex items-end gap-6">
                  <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">
                    <Plus size={16} />
                    <span>新建供应商</span>
                  </button>
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">供应商名称</label>
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <input 
                          type="text" 
                          placeholder="搜索供应商..." 
                          value={supplierSearch.name}
                          onChange={(e) => setSupplierSearch({ ...supplierSearch, name: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">供应商类型</label>
                      <select 
                        value={supplierSearch.type}
                        onChange={(e) => setSupplierSearch({ ...supplierSearch, type: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer"
                      >
                        <option value="">全部类型</option>
                        <option value="企业">企业</option>
                        <option value="个人">个人</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-end gap-4">
                    <button 
                      onClick={() => setSupplierSearch({ name: '', type: '' })}
                      className="bg-white border border-gray-200 text-gray-400 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-gray-50 transition-all"
                    >
                      重置
                    </button>
                    <button className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">查询</button>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-8 no-scrollbar">
                <div className="border border-gray-100 rounded-3xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-[#FBFCFD] sticky top-0 border-b border-gray-50 z-10">
                      <tr className="whitespace-nowrap">
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">供应商名称</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">供应商标识</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">证件类型</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">证件号码</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">地址</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">联系人</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">联系电话</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {MOCK_SUPPLIERS
                        .filter(s => s.name.includes(supplierSearch.name) && (supplierSearch.type === '' || s.type === supplierSearch.type))
                        .slice((supplierPage - 1) * 5, supplierPage * 5)
                        .map(sup => (
                        <tr key={sup.id} className="hover:bg-gray-50 group transition-colors">
                          <td className="px-6 py-4 text-xs font-bold text-gray-900">{sup.name}</td>
                          <td className="px-6 py-4 text-xs font-mono font-bold text-blue-600">{sup.identifier}</td>
                          <td className="px-6 py-4 text-xs font-semibold text-gray-500">{sup.certificateType}</td>
                          <td className="px-6 py-4 text-xs font-mono text-gray-400">{sup.certificateNumber}</td>
                          <td className="px-6 py-4 text-xs text-gray-500 truncate max-w-[150px]">{sup.address}</td>
                          <td className="px-6 py-4 text-xs font-bold text-gray-700">{sup.contact}</td>
                          <td className="px-6 py-4 text-xs font-mono text-gray-500">{sup.phone}</td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => { setSelectedSupplier(sup); setIsSupplierPickerOpen(false); }}
                              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                            >
                              选择
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between shrink-0 bg-white">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  第 {supplierPage} 页 / 共 {Math.ceil(MOCK_SUPPLIERS.filter(s => s.name.includes(supplierSearch.name) && (supplierSearch.type === '' || s.type === supplierSearch.type)).length / 5)} 页
                </p>
                <div className="flex gap-2">
                  <button 
                    disabled={supplierPage === 1}
                    onClick={() => setSupplierPage(p => p - 1)}
                    className="px-6 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-blue-600 disabled:opacity-30 transition-all shadow-sm"
                  >
                    上一页
                  </button>
                  <button 
                    disabled={supplierPage >= Math.ceil(MOCK_SUPPLIERS.filter(s => s.name.includes(supplierSearch.name) && (supplierSearch.type === '' || s.type === supplierSearch.type)).length / 5)}
                    onClick={() => setSupplierPage(p => p + 1)}
                    className="px-6 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-blue-600 disabled:opacity-30 transition-all shadow-sm"
                  >
                    下一页
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-hidden flex flex-col bg-[#FDFEFE]">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 bg-white shrink-0">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 border-l-4 border-blue-600 pl-4 uppercase">
              {selectedCategory || '资产管理'}
            </h1>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-600 px-5 py-2.5 rounded-xl font-bold transition-all border border-gray-100 text-xs shadow-sm">
                 <Download size={16} className="text-blue-500" />
                 <span>模板文件下载</span>
              </button>
              <button className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-600 px-5 py-2.5 rounded-xl font-bold transition-all border border-gray-100 text-xs shadow-sm">
                 <UploadCloud size={16} className="text-gray-400" />
                 <span>批量导入</span>
              </button>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-100 active:scale-95 text-xs"
              >
                <Plus size={18} />
                <span>新增资产</span>
              </button>
            </div>
          </div>

          {/* Search Fields */}
          <div className="grid grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input type="text" placeholder="资产编号" className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" />
            </div>
            <div className="relative">
              <select className="w-full px-4 py-2 bg-gray-50 border-none rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-500/20 transition-all outline-none appearance-none">
                <option>所有规格型号</option>
                {MOCK_SPECS.filter(s => {
                  const model = MOCK_MODELS.find(m => m.id === s.modelId);
                  return !selectedCategory || model?.category === selectedCategory;
                }).map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
            </div>
            <div className="relative">
              <button 
                onClick={() => setIsDeptPickerOpen(true)}
                className="w-full px-4 py-2 bg-gray-50 border-none rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-left flex items-center justify-between text-gray-700"
              >
                <span className="truncate">{selectedDept || '产权部门'}</span>
                <ChevronDown size={12} className="shrink-0 ml-1" />
              </button>
            </div>
            <button className="bg-blue-600/10 text-blue-600 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">查询</button>
          </div>
        </div>

        {/* Table Area */}
        <div className="flex-1 overflow-auto p-8 no-scrollbar bg-[#FDFEFE]">
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-2xl shadow-black/5 flex flex-col">
            <div className="overflow-x-auto relative flex-1">
              <table className="w-full text-left table-fixed min-w-[1600px]">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="whitespace-nowrap">
                    <th className="sticky left-0 bg-gray-50 px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest w-48 z-10">资产编号</th>
                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest w-40">所属物模型</th>
                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest w-40">规格标识</th>
                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest w-48">规格名称</th>
                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest w-32">采购日期</th>
                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest w-40">供应商</th>
                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest w-40">采购合同编号</th>
                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest w-32">保修截止日</th>
                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest w-40">产权部门</th>
                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest w-40">责任人/保管人</th>
                    <th className="sticky right-0 bg-gray-50 px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest w-56 text-right z-10">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs font-medium">
                  {paginatedAssets.map(asset => {
                    const spec = MOCK_SPECS.find(s => s.id === asset.specId);
                    const model = MOCK_MODELS.find(m => m.id === spec?.modelId);
                    return (
                      <tr key={asset.id} className="hover:bg-blue-50/10 transition-colors group">
                        <td className="sticky left-0 bg-white group-hover:bg-gray-50/50 px-6 py-5 font-bold text-gray-900 z-10 truncate">{asset.assetCode}</td>
                        <td className="px-6 py-5 text-gray-500">{model?.name}</td>
                        <td className="px-6 py-5 font-mono text-blue-600 font-bold">SPEC_{asset.specId.substring(0,6)}</td>
                        <td className="px-6 py-5 text-gray-900 font-bold">{spec?.name}</td>
                        <td className="px-6 py-5 text-gray-400 font-mono">2024-01-15</td>
                        <td className="px-6 py-5 text-gray-600 font-semibold">{spec?.manufacturer}</td>
                        <td className="px-6 py-5 text-gray-400 font-mono">CONT-2024-001</td>
                        <td className="px-6 py-5 text-gray-400 font-mono">2025-01-15</td>
                        <td className="px-6 py-5 text-gray-600">华大资产管理部</td>
                        <td className="px-6 py-5 text-gray-600 font-bold">{asset.owner}</td>
                        <td className="sticky right-0 bg-white group-hover:bg-gray-50/50 px-6 py-5 z-10 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                             <button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-all font-bold">查看</button>
                             <button className="px-3 py-1.5 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-all font-bold">编辑</button>
                             <button className="px-3 py-1.5 bg-red-50 text-red-500 rounded-md hover:bg-red-100 transition-all font-bold">作废</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {paginatedAssets.length === 0 && (
                     <tr>
                       <td colSpan={11} className="px-8 py-20 text-center">
                         <div className="flex flex-col items-center gap-4 text-gray-300">
                            <Box size={48} className="opacity-20" />
                            <p className="text-sm font-black uppercase tracking-widest">该模型下暂无资产数据</p>
                         </div>
                       </td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-8 py-4 bg-gray-50/50 border-t border-gray-100 shrink-0">
               <Pagination 
                currentPage={currentPage}
                totalItems={filteredAssets.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
