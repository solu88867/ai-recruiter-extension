# AI 招聘助手 (防风控版) / AI Recruiter Assistant (Anti-Risk Control Edition)

一个基于 Chrome Manifest V3 的浏览器扩展，用于在招聘网站（58同城、BOSS直聘）上辅助 HR 快速分析候选人简历，并生成个性化的打招呼话术。支持 OpenAI、DeepSeek、通义千问等兼容 OpenAI 格式的大模型 API。

A Chrome Manifest V3 browser extension that helps HR quickly analyze candidate resumes on recruitment websites (58.com, BOSS Zhipin) and generate personalized greeting messages. Supports OpenAI, DeepSeek, Qwen, and other LLM APIs compatible with the OpenAI format.

> ⚠️ 本扩展仅作为辅助工具，所有发送操作均需人工确认，避免触发平台风控。  
> ⚠️ This extension is only an auxiliary tool. All sending actions require manual confirmation to avoid platform risk control.

---

## 中文说明

### ✨ 功能特性

- **浮动控制面板**：在招聘网站页面右侧注入可拖拽、可折叠的 AI 助手面板。
- **动态 DOM 监听**：自动适配现代招聘网站的异步加载，实时抓取当前页面的简历文本。
- **AI 智能匹配**：一键调用大模型，根据职位描述（JD）和简历内容给出：
  - 匹配得分（0-100）
  - 核心亮点
  - 潜在风险或短板
  - 个性化打招呼话术
- **半自动安全填入**：将 AI 生成的招呼语一键填入聊天输入框，但**不会自动发送**，需人工核对后手动点击发送，有效防止账号被风控。
- **多模型支持**：兼容 OpenAI、DeepSeek、通义千问等任何提供 OpenAI 格式接口的大模型服务。
- **本地配置存储**：API Key、API 地址、模型名称、职位描述均保存在浏览器本地 `chrome.storage.local`，不会上传到任何第三方服务器。

### 📦 安装方法

#### 1. 下载代码

```bash
git clone https://github.com/solu88867/ai-recruiter-extension.git

#### 2.拓展下载

https://chromewebstore.google.com/detail/ai-%E6%8B%9B%E8%81%98%E5%8A%A9%E6%89%8B-%E9%98%B2%E9%A3%8E%E6%8E%A7%E7%89%88/gphkdmecndgldclbmkbophdkpjigjgeg?authuser=0&hl=zh-CN&pli=1
