import React from 'react';
import { motion } from 'motion/react';
import { UtilityPole, Cpu, Sparkles, ArrowLeft } from 'lucide-react';

interface UnderConstructionProps {
  title?: string;
}

export default function UnderConstruction({ title = '功能升级' }: UnderConstructionProps) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] bg-[#F8F9FA] p-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-black/5 border border-gray-100 p-8 text-center space-y-6"
      >
        <div className="relative mx-auto w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          >
            <Cpu size={40} className="stroke-[1.5]" />
          </motion.div>
          
          <div className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full p-1 shadow-md">
            <Sparkles size={12} />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black tracking-tight text-gray-900">{title}</h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-100">
            🔧 正在建设中
          </span>
        </div>

        <p className="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto font-sans">
          该功能正在积极规划与系统升级中。敬请期待。
        </p>

        <div className="pt-2">
          <div className="h-[1px] bg-gray-100 w-full mb-6" />
          <p className="text-xs text-gray-400 font-mono">
            STATUS: PIPELINE_ACTIVE_CONSTRUCTION
          </p>
        </div>
      </motion.div>
    </div>
  );
}
