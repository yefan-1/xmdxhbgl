import React, { useState, useMemo } from 'react';
import { 
  X, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Copy, 
  Check, 
  Search, 
  Filter, 
  Layers, 
  Sparkles, 
  Building2, 
  Smartphone, 
  Monitor,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SYSTEM_FEATURE_CATALOG, FeatureItem } from '../../data/featureCatalogData';

interface SystemFeatureCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SystemFeatureCatalogModal({ isOpen, onClose }: SystemFeatureCatalogModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSystem, setSelectedSystem] = useState<string>('ALL');
  const [selectedBlock, setSelectedBlock] = useState<string>('ALL');
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  // Available unique systems & blocks
  const systems = useMemo(() => {
    return Array.from(new Set(SYSTEM_FEATURE_CATALOG.map(f => f.systemName)));
  }, []);

  const blocks = useMemo(() => {
    let filtered = SYSTEM_FEATURE_CATALOG;
    if (selectedSystem !== 'ALL') {
      filtered = filtered.filter(f => f.systemName === selectedSystem);
    }
    return Array.from(new Set(filtered.map(f => f.blockName)));
  }, [selectedSystem]);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return SYSTEM_FEATURE_CATALOG.filter(item => {
      if (selectedSystem !== 'ALL' && item.systemName !== selectedSystem) {
        return false;
      }
      if (selectedBlock !== 'ALL' && item.blockName !== selectedBlock) {
        return false;
      }
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchTitle = item.featurePoint.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        const matchBlock = item.blockName.toLowerCase().includes(query);
        const matchSys = item.systemName.toLowerCase().includes(query);
        const matchCode = item.code?.toLowerCase().includes(query) ?? false;
        return matchTitle || matchDesc || matchBlock || matchSys || matchCode;
      }
      return true;
    });
  }, [selectedSystem, selectedBlock, searchTerm]);

  // Total statistics
  const stats = useMemo(() => {
    const totalFeatures = SYSTEM_FEATURE_CATALOG.length;
    const totalBlocks = new Set(SYSTEM_FEATURE_CATALOG.map(f => f.blockName)).size;
    const totalSystems = new Set(SYSTEM_FEATURE_CATALOG.map(f => f.systemName)).size;
    return { totalFeatures, totalBlocks, totalSystems };
  }, []);

  // 1. Download as CSV (Excel compatible with UTF-8 BOM)
  const handleDownloadCSV = () => {
    const headers = ['序号', '系统名称', '块名称', '功能点', '功能点描述', '模块编号', '适用对象'];
    const rows = filteredData.map((item, idx) => [
      String(idx + 1),
      `"${item.systemName.replace(/"/g, '""')}"`,
      `"${item.blockName.replace(/"/g, '""')}"`,
      `"${item.featurePoint.replace(/"/g, '""')}"`,
      `"${item.description.replace(/"/g, '""')}"`,
      `"${(item.code || '').replace(/"/g, '""')}"`,
      `"${(item.targetRoles || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const timestamp = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `厦门大学海报涂鸦管理系统_功能清单_${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccessToast('已成功下载 Excel/CSV 功能清单表格！');
    setTimeout(() => setDownloadSuccessToast(null), 3000);
  };

  // 2. Download as Markdown (.md)
  const handleDownloadMarkdown = () => {
    let md = `# 厦门大学海报涂鸦管理系统 · 完整功能清单\n\n`;
    md += `> 导出日期：${new Date().toLocaleDateString('zh-CN')} | 共计 ${filteredData.length} 个功能点\n\n`;
    md += `| 序号 | 系统名称 | 块名称 | 功能点 | 功能点描述 | 模块编号 | 适用对象 |\n`;
    md += `| :---: | :--- | :--- | :--- | :--- | :---: | :--- |\n`;

    filteredData.forEach((item, idx) => {
      const cleanDesc = item.description.replace(/\|/g, '\\|').replace(/\n/g, ' ');
      md += `| ${idx + 1} | ${item.systemName} | ${item.blockName} | **${item.featurePoint}** | ${cleanDesc} | \`${item.code || '-'}\` | ${item.targetRoles || '-'} |\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const timestamp = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `厦门大学海报涂鸦管理系统_功能清单_${timestamp}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccessToast('已成功下载 Markdown 格式功能清单！');
    setTimeout(() => setDownloadSuccessToast(null), 3000);
  };

  // 3. Copy TSV directly to Clipboard for pasting into Excel
  const handleCopyToClipboard = async () => {
    const headers = ['序号', '系统名称', '块名称', '功能点', '功能点描述', '模块编号', '适用对象'];
    const rows = filteredData.map((item, idx) => [
      idx + 1,
      item.systemName,
      item.blockName,
      item.featurePoint,
      item.description.replace(/\t|\r|\n/g, ' '),
      item.code || '',
      item.targetRoles || ''
    ]);

    const tsvContent = [headers.join('\t'), ...rows.map(r => r.join('\t'))].join('\n');

    try {
      await navigator.clipboard.writeText(tsvContent);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2500);
    } catch {
      // fallback
      const textarea = document.createElement('textarea');
      textarea.value = tsvContent;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="bg-white rounded-3xl w-full max-w-7xl h-[94vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200"
      >
        {/* Modal Top Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/30 shrink-0">
              <FileSpreadsheet size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base md:text-lg font-black tracking-tight text-white">
                  厦门大学海报涂鸦管理系统 · 完整功能清单
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[11px] font-bold">
                  共 {stats.totalFeatures} 个功能点
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-2">
                <span>涵盖后台管理、移动巡检、线上3D展示三大子系统</span>
                <span className="text-slate-500">|</span>
                <span>包含系统名称、块名称、功能点、功能点描述全字段</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="关闭窗口"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Toolbar & Filter Bar */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Left: System Tab Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => { setSelectedSystem('ALL'); setSelectedBlock('ALL'); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedSystem === 'ALL'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Layers size={14} />
              <span>全部子系统</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${selectedSystem === 'ALL' ? 'bg-blue-700 text-blue-100' : 'bg-slate-100 text-slate-600'}`}>
                {SYSTEM_FEATURE_CATALOG.length}
              </span>
            </button>

            {systems.map(sys => {
              const count = SYSTEM_FEATURE_CATALOG.filter(f => f.systemName === sys).length;
              const isSelected = selectedSystem === sys;
              return (
                <button
                  key={sys}
                  onClick={() => { setSelectedSystem(sys); setSelectedBlock('ALL'); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {sys.includes('后台') && <Building2 size={13} />}
                  {sys.includes('移动') && <Smartphone size={13} />}
                  {sys.includes('展示') && <Monitor size={13} />}
                  <span>{sys}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isSelected ? 'bg-blue-700 text-blue-100' : 'bg-slate-100 text-slate-600'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Download & Export Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Download CSV / Excel */}
            <button
              onClick={handleDownloadCSV}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              title="下载为包含 UTF-8 BOM 的 CSV 文件，可用 Excel/WPS 直接无乱码打开"
            >
              <Download size={14} />
              <span>下载 Excel/CSV 表格</span>
            </button>

            {/* Download Markdown */}
            <button
              onClick={handleDownloadMarkdown}
              className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              title="下载为 Markdown 格式技术文档"
            >
              <FileText size={14} className="text-blue-600" />
              <span>下载 Markdown</span>
            </button>

            {/* Copy to Clipboard */}
            <button
              onClick={handleCopyToClipboard}
              className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              title="复制制表符格式数据，可直接粘贴进 Excel 或 Word 表格"
            >
              {copiedSuccess ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} className="text-slate-500" />}
              <span>{copiedSuccess ? '已复制到剪贴板！' : '复制数据'}</span>
            </button>
          </div>
        </div>

        {/* Second Filter: Search & Block Filter */}
        <div className="px-6 py-2.5 bg-white border-b border-slate-100 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="搜索功能点名称、系统、块名称、描述关键字..."
                className="w-full pl-9 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Block Filter Dropdown */}
            <div className="flex items-center gap-1.5 shrink-0">
              <Filter size={13} className="text-slate-400" />
              <select
                value={selectedBlock}
                onChange={e => setSelectedBlock(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 outline-none font-bold focus:border-blue-500"
              >
                <option value="ALL">全部功能块 ({blocks.length}个块)</option>
                {blocks.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-xs text-slate-500 font-medium shrink-0">
            当前筛选显示 <span className="font-extrabold text-blue-600">{filteredData.length}</span> 项功能
          </div>
        </div>

        {/* Table Content Area */}
        <div className="flex-1 overflow-auto bg-slate-50/50">
          <div className="min-w-[1000px] p-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/90 text-slate-700 font-black border-b border-slate-200 uppercase tracking-wider sticky top-0 z-10 shadow-2xs">
                    <th className="py-3 px-3 text-center w-14 shrink-0 whitespace-nowrap">序号</th>
                    <th className="py-3 px-4 w-36 whitespace-nowrap">系统名称</th>
                    <th className="py-3 px-4 w-40 whitespace-nowrap">块名称</th>
                    <th className="py-3 px-4 w-52 whitespace-nowrap">功能点</th>
                    <th className="py-3 px-5">功能点描述</th>
                    <th className="py-3 px-3 w-28 text-center whitespace-nowrap">模块编号</th>
                    <th className="py-3 px-4 w-40 whitespace-nowrap">适用角色/对象</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-16 text-center text-slate-400 font-medium">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Search size={24} className="text-slate-300" />
                          <span>未检索到匹配的功能点条目</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item, index) => {
                      // Subsystem badge style
                      const sysStyle = item.systemName.includes('后台')
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : item.systemName.includes('移动')
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-purple-50 text-purple-700 border-purple-200';

                      return (
                        <tr 
                          key={item.id}
                          className="hover:bg-blue-50/30 transition-colors group"
                        >
                          {/* 序号 */}
                          <td className="py-3.5 px-3 text-center font-bold text-slate-400 group-hover:text-blue-600">
                            {index + 1}
                          </td>

                          {/* 系统名称 */}
                          <td className="py-3.5 px-4 font-bold text-slate-800">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-extrabold ${sysStyle}`}>
                              {item.systemName.includes('后台') && <Building2 size={12} />}
                              {item.systemName.includes('移动') && <Smartphone size={12} />}
                              {item.systemName.includes('展示') && <Monitor size={12} />}
                              <span>{item.systemName}</span>
                            </span>
                          </td>

                          {/* 块名称 */}
                          <td className="py-3.5 px-4 font-extrabold text-slate-700">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] border border-slate-200/60 inline-block font-bold">
                              {item.blockName}
                            </span>
                          </td>

                          {/* 功能点 */}
                          <td className="py-3.5 px-4 font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                            {item.featurePoint}
                          </td>

                          {/* 功能点描述 */}
                          <td className="py-3.5 px-5 text-slate-600 text-[11px] leading-relaxed">
                            {item.description}
                          </td>

                          {/* 模块编号 */}
                          <td className="py-3.5 px-3 text-center">
                            {item.code ? (
                              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200/80">
                                {item.code}
                              </span>
                            ) : (
                              <span className="text-slate-300">-</span>
                            )}
                          </td>

                          {/* 适用角色/对象 */}
                          <td className="py-3.5 px-4 text-slate-500 text-[11px] font-medium">
                            {item.targetRoles || '-'}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-4">
            <span>
              已汇总 <strong>{stats.totalSystems}</strong> 个子系统 · <strong>{stats.totalBlocks}</strong> 个功能业务块 · <strong>{stats.totalFeatures}</strong> 个全景功能点
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCSV}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <Download size={14} />
              <span>立即下载功能清单 (Excel/CSV)</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all cursor-pointer"
            >
              关闭
            </button>
          </div>
        </div>
      </motion.div>

      {/* Download Toast Notification */}
      <AnimatePresence>
        {downloadSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold border border-slate-700"
          >
            <Check size={16} className="text-emerald-400" />
            <span>{downloadSuccessToast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
