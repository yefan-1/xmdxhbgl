import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use JSON middleware for API endpoints
  app.use(express.json({ limit: "10mb" }));

  // Initialize Gemini client with proper User-Agent header
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // Server-side API route for Xiao Jing AI inspection assistant ("小景知道")
  app.post("/api/gemini/xiaojing", async (req, res) => {
    try {
      const { message, chatHistory } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const systemInstruction = `你是“小景知道”，厦门大学海报张贴与芙蓉隧道涂鸦管理系统的智能巡检助手。
你熟悉厦门大学校园公共文化设施管理规范、海报张贴四级审批制度、不干胶防伪二维码印章核销标准、芙蓉隧道涂鸦三级审批与PVC永固铭牌备案细则以及巡检打卡规则。

请以亲切、专业、权威且条理清晰的语气回答巡检员或师生的疑问。
回答要求：
1. 重点突出，语言简练规范，分点陈述（可用1. 2. 3. 或 bullet points）。
2. 不要使用 Markdown 加粗语法（请勿在回复中出现 ** 或 <strong>），保持界面文本字体均匀清晰。
3. 围绕厦大校区（思明校区、翔安校区、海韵园区、樟树林等）和芙蓉隧道真实管理场景。
4. 如涉及违规处理，提醒通过巡检系统“违规上报”功能上传现场照片生成工单。`;

      const prompt = `用户提问: ${message}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction,
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Xiao Jing AI Error:", error);
      res.status(500).json({ 
        error: error.message || "服务器打瞌睡了，请稍后再试",
        text: "抱歉，小景当前网络连接繁忙。常见规范：校内海报张贴有效期一般为 3-7 天，必须加盖校团委或审批单位不干胶防伪二维码印章。如发现未备案海报，请在【+】菜单中点击【违规异常上报】记录工单。"
      });
    }
  });

  // Server-side API route for AI data analysis
  app.post("/api/gemini/analyze", async (req, res) => {
    try {
      const { message, tableData, queryConditions } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Build context from current table data and active query states
      let context = "【当前表格上下文信息】\n";
      if (queryConditions) {
        context += `当前查询条件:\n${JSON.stringify(queryConditions, null, 2)}\n\n`;
      }
      if (tableData && tableData.length > 0) {
        context += `当前表格中的前 30 条记录概要:\n`;
        tableData.slice(0, 30).forEach((item: any, idx: number) => {
          context += `[记录 ${idx + 1}] ID: ${item.id || ""}, 字段一: ${item.identifier || ""}, 字段二: ${item.name || ""}, 字段三: ${item.category || ""}, 字段四: ${item.isModeled ? "已建模" : "未建模"}, 字段五: ${item.description || ""}, 更新时间: ${item.updatedAt || ""}\n`;
        });
      } else {
        context += "当前表格中无可用记录。\n";
      }

      const prompt = `${context}\n用户问题: ${message}\n\n请针对以上表格数据和上下文，给出专业、准确且易于理解的分析回复。`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an intelligent system usage guide helper for a data management platform. Your task is to answer user queries with detailed system operations guidelines, and data insights when requested, focusing on how to use the platform (e.g. how to add records, search, filter, reset, customize columns views, download/export texts). Always reply in friendly, professional, clear Chinese. Crucial: Do not use any bold formatting (do not produce any ** or <strong> tags) in your final response text, as the interface dialogue body must maintain standard font-weight (font-normal) without any bold typography.",
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "内部服务器错误" });
    }
  });

  // Serve static assets out of the dist directory in production, or mount Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
