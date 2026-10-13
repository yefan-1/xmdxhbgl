import React, { useState } from 'react';
import { MOCK_SPECS, MOCK_MODELS, CATEGORIES_HIERARCHY } from '../data/mockData';
import { EntityStatus } from '../types';
import { 
  Plus, 
  Settings, 
  Eye,
  Edit3,
  Trash2,
  ChevronRight,
  ChevronDown,
  Search,
  Box,
  Layers,
  FolderTree,
  ExternalLink,
  Cpu,
  Zap,
  Lock,
  Shield,
  Monitor,
  Smartphone,
  Wind,
  X,
  Upload,
  Image as ImageIcon,
  FileText
} from 'lucide-react';
import Badge from './ui/Badge';
import { motion, AnimatePresence } from 'motion/react';
import Pagination from './ui/Pagination';

export default function SpecManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<string[]>(['信息类', '环境信息', '基础家具', '网络通信', '基础电气']);

  // New IoT Fields State
  const [iotProvisionMode, setIotProvisionMode] = useState<'不提供' | '自带' | '外接' | '混合'>('不提供');
  const [iotPowerSupplyMode, setIotPowerSupplyMode] = useState('无需额外供电');
  const [topicId, setTopicId] = useState('');
  const [deviceId, setDeviceId] = useState('');

  // Product Images & Manuals States
  const [productImages, setProductImages] = useState<{ id: string; name: string; url: string }[]>([
    { id: 'img-1', name: 'device_front_perspective.png', url: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=150&auto=format&fit=crop&q=60' },
    { id: 'img-2', name: 'device_top_panel_detail.png', url: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=150&auto=format&fit=crop&q=60' },
  ]);
  const [productManuals, setProductManuals] = useState<{ id: string; name: string; size: string }[]>([
    { id: 'man-1', name: 'Smart_Industrial_Hub_Installation_Guide_v1.4.pdf', size: '3.8 MB' },
    { id: 'man-2', name: 'Smart_Industrial_Hub_Datasheet_v2.1.pdf', size: '1.2 MB' },
  ]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages = [...productImages];
    for (let i = 0; i < files.length; i++) {
      if (newImages.length >= 9) break;
      const file = files[i];
      const url = URL.createObjectURL(file);
      newImages.push({
        id: `img-${Date.now()}-${i}`,
        name: file.name,
        url: url
      });
    }
    setProductImages(newImages);
  };

  const handleManualUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newManuals = [...productManuals];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const sizeKB = Math.round(file.size / 1024);
      const sizeStr = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;
      newManuals.push({
        id: `man-${Date.now()}-${i}`,
        name: file.name,
        size: sizeStr
      });
    }
    setProductManuals(newManuals);
  };

  const deleteImage = (id: string) => {
    setProductImages(productImages.filter(img => img.id !== id));
  };

  const deleteManual = (id: string) => {
    setProductManuals(productManuals.filter(man => man.id !== id));
  };

  const MOCK_DRIVERS = [
    { id: '1', name: 'SmartLightingDriver', version: 'v1.0.2', developer: 'IOT_Team_A' },
    { id: '2', name: 'EnvSensorEngine', version: 'v2.1.0', developer: 'Core_Dev' },
    { id: '3', name: 'UniversalGateDriver', version: 'v1.5.0', developer: 'System_Arch' },
    { id: '4', name: 'SecurityMonitorDriver', version: 'v3.0.1', developer: 'Global_Security' }
  ];

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

  const filteredSpecs = selectedCategory 
    ? MOCK_SPECS.filter(s => {
        const model = MOCK_MODELS.find(m => m.id === s.modelId);
        return model?.category === selectedCategory;
      })
    : MOCK_SPECS;

  const paginatedSpecs = filteredSpecs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getModelSpecCount = (modelId: string) => {
    return MOCK_SPECS.filter(s => s.modelId === modelId).length;
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
                  className="ml-4 border-l border-gray-200 pl-2 mt-1 space-y-1 overflow-hidden"
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
              <span className="truncate">{catName} ({getCategorySpecCount(catName)})</span>
            </div>
          </button>
        );
      });
    });
  };

  const getCategorySpecCount = (catName: string) => {
    return MOCK_SPECS.filter(s => {
      const model = MOCK_MODELS.find(m => m.id === s.modelId);
      return model?.category === catName;
    }).length;
  };


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

      {/* Right Content - Spec List */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 border-l-4 border-blue-600 pl-4 uppercase">
              {selectedCategory || '产品规格管理'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-600 px-5 py-2.5 rounded-xl font-bold transition-all border border-gray-100 text-xs">
               <Eye size={16} />
               <span>查看物模型信息</span>
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-100 active:scale-95 text-xs"
            >
              <Plus size={18} />
              <span>新建物品规格型号</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-8 no-scrollbar bg-[#FDFEFE]">
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-2xl shadow-black/5 flex flex-col">
            <div className="overflow-x-auto relative flex-1">
              <table className="w-full text-left table-fixed min-w-[1200px]">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="whitespace-nowrap">
                    <th className="sticky left-0 bg-gray-50 px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest w-48 z-10">产品名称</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest w-40">规格标识</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest w-64">规格描述</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest w-40">所属物模型</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest w-32">制造商</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest w-56">驱动类</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest w-24">版本</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest w-32">开发者</th>
                    <th className="sticky right-0 bg-gray-50 px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest w-64 text-right z-10">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginatedSpecs.map(spec => {
                    const model = MOCK_MODELS.find(m => m.id === spec.modelId);
                    const l1 = Object.entries(CATEGORIES_HIERARCHY).find(([_, value]) => {
                      if (!model) return false;
                      // Recursively find model.category in HIERARCHY
                      const findInValue = (val: any): boolean => {
                          if (Array.isArray(val)) return val.includes(model.category);
                          if (typeof val === 'object') return Object.values(val).some(v => findInValue(v));
                          return false;
                      };
                      return findInValue(value);
                    })?.[0] || '未知';
                    return (
                      <tr key={spec.id} className="hover:bg-blue-50/10 transition-colors group">
                        <td className="sticky left-0 bg-white group-hover:bg-gray-50/50 px-8 py-5 text-sm font-bold text-gray-900 z-10 truncate">{spec.name}</td>
                        <td className="px-8 py-5 text-xs font-mono font-bold text-blue-600">ID_{spec.id.substring(0,6)}</td>
                        <td className="px-8 py-5 text-sm text-gray-400 truncate">{spec.description || '这是该规格实现的具体技术参数描述...'}</td>
                        <td className="px-8 py-5 text-xs font-bold text-gray-700">
                          <span className="opacity-40">{l1} / </span>{model?.category}
                        </td>
                        <td className="px-8 py-5 text-xs font-semibold text-gray-600">{spec.manufacturer}</td>
                        <td className="px-8 py-5 text-[11px] font-mono text-gray-400 truncate">com.iot.driver.{model?.identifier}.V1</td>
                        <td className="px-8 py-5 text-xs font-mono text-gray-500">{spec.version}</td>
                        <td className="px-8 py-5 text-xs text-gray-500">System_Core</td>
                        <td className="sticky right-0 bg-white group-hover:bg-gray-50/50 px-8 py-5 z-10 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2 text-xs font-normal">
                             <button className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-all font-sans whitespace-nowrap">查看</button>
                             <button className="px-4 py-1.5 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-all font-sans whitespace-nowrap">编辑</button>
                             <button className="px-4 py-1.5 bg-red-50 text-red-500 rounded-md hover:bg-red-100 transition-all font-sans whitespace-nowrap">删除</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {paginatedSpecs.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-4 text-gray-300">
                           <Layers size={48} className="opacity-20" />
                           <p className="text-sm font-black uppercase tracking-widest">该模型下暂无规格实现</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-8 py-4 bg-gray-50/50 border-t border-gray-50 shrink-0">
               <Pagination 
                currentPage={currentPage}
                totalItems={filteredSpecs.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>

      {/* New Spec Modal */}
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
                  <h2 className="text-xl font-black text-gray-900 tracking-tight">新建物品规格型号</h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-10 space-y-6 overflow-y-auto flex-1 no-scrollbar">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">所属物模型分类</label>
                  <div className="px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-gray-400 font-bold text-sm cursor-not-allowed">
                    {selectedCategory || '未选择'}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">驱动实现类</label>
                  <button 
                    onClick={() => setIsDriverModalOpen(true)}
                    className="w-full px-4 py-3 bg-gray-50 border border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50/30 transition-all text-left flex items-center justify-between group"
                  >
                    <span className={`text-sm font-mono ${selectedDriver ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>
                      {selectedDriver ? selectedDriver.name : '点击选择驱动实现类...'}
                    </span>
                    <ExternalLink size={16} className="text-gray-300 group-hover:text-blue-400" />
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">制造商</label>
                  <input type="text" placeholder="例如：博世" className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-sm font-bold" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">规格标识</label>
                  <input type="text" placeholder="MODEL-X-01" className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-mono text-sm font-bold" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">规格名称</label>
                  <input type="text" placeholder="输入正式上线的产品规格名称..." className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-bold text-sm" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">规格说明</label>
                  <textarea rows={3} placeholder="输入该产品规格的具体详细说明..." className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-sm font-normal" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">维保周期（天）</label>
                  <input type="number" placeholder="例如：365" className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-sm font-bold" />
                </div>

                {/* New Upload Fields */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">产品图片 ({productImages.length}/9)</label>
                    <span className="text-[10px] font-bold text-gray-400">最多可上传 9 张图片</span>
                  </div>
                  
                  {/* Image Grid */}
                  <div className="grid grid-cols-5 gap-3">
                    {productImages.map((img) => (
                      <div key={img.id} className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
                        <img referrerPolicy="no-referrer" src={img.url} alt={img.name} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            type="button"
                            onClick={() => deleteImage(img.id)}
                            className="p-1.5 bg-red-600 rounded-lg text-white hover:bg-red-700 hover:scale-110 transition-all shadow-md"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {productImages.length < 9 && (
                      <label htmlFor="product-images-input" className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50/20 cursor-pointer flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-blue-500 transition-all">
                        <Upload size={20} className="stroke-[2.5]" />
                        <span className="text-[10px] font-black uppercase tracking-widest">上传图片</span>
                        <input 
                          type="file" 
                          multiple 
                          accept="image/*" 
                          className="hidden" 
                          id="product-images-input" 
                          onChange={handleImageUpload} 
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">产品说明书</label>
                  
                  {/* File Upload Trigger */}
                  <label htmlFor="product-manuals-input" className="flex items-center justify-center gap-2 w-full py-4 bg-gray-50 hover:bg-blue-50/20 border-2 border-dashed border-gray-200 hover:border-blue-400 cursor-pointer rounded-2xl text-gray-450 hover:text-blue-600 transition-all">
                    <Upload size={18} className="stroke-[2.5] text-gray-400 group-hover:text-blue-500" />
                    <span className="text-xs font-bold">拖拽文件到此处，或点击浏览文件...</span>
                    <input 
                      type="file" 
                      multiple 
                      className="hidden" 
                      id="product-manuals-input" 
                      onChange={handleManualUpload} 
                    />
                  </label>

                  {/* Manuals List */}
                  {productManuals.length > 0 && (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {productManuals.map((man) => (
                        <div key={man.id} className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100 rounded-xl">
                          <div className="flex items-center gap-2.5 min-w-0 pr-4">
                            <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
                              <FileText size={16} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-gray-800 truncate" title={man.name}>{man.name}</p>
                              <span className="text-[9px] font-mono text-gray-400">{man.size}</span>
                            </div>
                          </div>
                          <button 
                            type="button"
                            onClick={() => deleteManual(man.id)}
                            className="p-1 px-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-all font-bold"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* New IoT Configuration Section */}
                <div className="pt-6 border-t border-gray-100 space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest">物联网配置</h3>
                    {iotProvisionMode === '不提供' && (
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">未启用物联网功能</span>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">物联网功能提供方式</label>
                    <div className="flex flex-wrap gap-2">
                      {['不提供', '自带', '外接', '混合'].map((mode) => (
                        <button 
                          key={mode} 
                          type="button"
                          onClick={() => setIotProvisionMode(mode as any)}
                          className={`px-6 py-2.5 rounded-2xl text-xs font-bold transition-all border ${
                            iotProvisionMode === mode 
                              ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' 
                              : 'bg-white text-gray-400 border-gray-200 hover:border-blue-400 hover:text-blue-500 shadow-sm'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  {iotProvisionMode !== '不提供' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-8"
                    >
                      {(iotProvisionMode === '外接' || iotProvisionMode === '混合') && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">物联网功能构建描述</label>
                          <textarea 
                            rows={3} 
                            placeholder="请输入物联网功能构建描述信息..." 
                            className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-sm font-normal" 
                          />
                        </div>
                      )}

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">物联网连接方式</label>
                          <select className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-sm font-bold outline-none appearance-none cursor-pointer">
                            {['BLE', 'WIFI', '4G/5G物联网卡', 'Zigbee', 'RS-485/Modbus', 'Thread', 'LoRaWAN', 'NB-IoT', 'LTE-M', 'Wi-SUN FAN'].map(item => (
                              <option key={item} value={item}>{item}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">物联网供电方式</label>
                          <select 
                            value={iotPowerSupplyMode}
                            onChange={(e) => setIotPowerSupplyMode(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-sm font-bold outline-none appearance-none cursor-pointer"
                          >
                            {['无需额外供电', '电池供电', '交流 100~240V', '直流 5/12/24V', 'POE'].map(item => (
                              <option key={item} value={item}>{item}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {iotPowerSupplyMode === '电池供电' && (
                        <div className="space-y-6 pt-2">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">电池类型</label>
                            <select className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-sm font-bold outline-none appearance-none cursor-pointer">
                              {['锂离子', '一号电池', '七号电池'].map(item => (
                                <option key={item} value={item}>{item}</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">电池持久度（天）</label>
                            <input type="text" placeholder="例如：730" className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-sm font-bold" />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
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

      {/* Driver Selection Modal */}
      <AnimatePresence>
        {isDriverModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsDriverModalOpen(false)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                 <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">选择驱动实现类</h3>
                 <button onClick={() => setIsDriverModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>
              <div className="p-6">
                <div className="border border-gray-100 rounded-2xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-[#FBFCFD] border-b border-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">驱动类</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">版本号</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">开发者</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {MOCK_DRIVERS.map(driver => (
                        <tr key={driver.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-xs font-mono font-bold text-gray-900">{driver.name}</td>
                          <td className="px-6 py-4 text-xs font-mono text-gray-500">{driver.version}</td>
                          <td className="px-6 py-4 text-xs text-gray-500">{driver.developer}</td>
                          <td className="px-6 py-4 text-right">
                             <button 
                               onClick={() => { setSelectedDriver(driver); setIsDriverModalOpen(false); }}
                               className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-all"
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

