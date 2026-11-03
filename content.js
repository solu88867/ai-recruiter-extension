// 注入浮动面板到网页右侧，方便展示 AI 评分和一键打招呼
function createAIPanel() {
    if (document.getElementById('ai-assistant-float-panel')) return;

    const panel = document.createElement('div');
    panel.id = 'ai-assistant-float-panel';
    panel.innerHTML = `
        <div class="ai-panel-header" id="ai-panel-header">
            <span>🤖 AI 招聘助手 (可拖拽)</span>
            <button id="ai-minimize-btn">−</button>
        </div>
        <div class="ai-panel-body" id="ai-panel-body">
            <button id="ai-analyze-btn">🚀 分析当前候选人</button>
            <div id="ai-result-area">
                <p class="ai-tip">打开简历详情页后，点击上方按钮进行 AI 评估。</p>
            </div>
            <div id="ai-outreach-section" style="display:none; margin-top: 10px;">
                <textarea id="ai-greeting-text" placeholder="AI 生成的打招呼话术..."></textarea>
                <button id="ai-fill-btn">✍️ 一键填入聊天框 (安全半自动)</button>
            </div>
        </div>
    `;
    document.body.appendChild(panel);

    // 绑定按钮事件
    document.getElementById('ai-analyze-btn').addEventListener('click', handleAnalyzeResume);
    document.getElementById('ai-fill-btn').addEventListener('click', handleFillGreeting);
    
    // 绑定最小化折叠功能
    let isMinimized = false;
    document.getElementById('ai-minimize-btn').addEventListener('click', () => {
        isMinimized = !isMinimized;
        const body = document.getElementById('ai-panel-body');
        body.style.display = isMinimized ? 'none' : 'block';
        document.getElementById('ai-minimize-btn').textContent = isMinimized ? '+' : '−';
    });

    // 启用面板拖拽功能
    makeDraggable(panel, document.getElementById('ai-panel-header'));
}

// 实现平滑拖拽逻辑
function makeDraggable(panel, header) {
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        
        const rect = panel.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;

        // 切换为 absolute 定位以方便任意拖动
        panel.style.position = 'fixed';
        panel.style.left = initialLeft + 'px';
        panel.style.top = initialTop + 'px';
        panel.style.right = 'auto'; // 清除默认的 right 约束

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        e.preventDefault();
    });

    function onMouseMove(e) {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        panel.style.left = (initialLeft + dx) + 'px';
        panel.style.top = (initialTop + dy) + 'px';
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
}

// 动态等待并抓取简历文本
function getResumeTextFromPage() {
    const mainContent = document.body.innerText || "";
    return mainContent.slice(0, 8000);
}

// 调用大模型 API
async function handleAnalyzeResume() {
    const resultArea = document.getElementById('ai-result-area');
    resultArea.innerHTML = '<p class="ai-loading">⏳ AI 正在深度分析中...</p>';

    chrome.storage.local.get(['apiUrl', 'apiKey', 'apiModel', 'jobDesc'], async (config) => {
        if (!config.apiKey) {
            resultArea.innerHTML = '<p style="color:red;">请先点开插件图标配置 API Key！</p>';
            return;
        }

        const resumeText = getResumeTextFromPage();
        const prompt = `
你是一个专业的HR招聘专家。请根据以下【职位要求 (JD)】和候选人的【简历内容】，进行专业评估。

【职位要求 (JD)】：
${config.jobDesc || "无特定要求，请通用评估"}

【简历内容】：
${resumeText}

请输出以下格式的结果（Markdown）：
1. **匹配得分**：（0-100分）
2. **核心亮点**：（2条以内）
3. **潜在风险或短板**：（1-2条）
4. **个性化打招呼话术**：（针对该候选人定制一段真诚、专业、能吸引对方回复的招呼语）
`;

        try {
            const response = await fetch(`${config.apiUrl.replace(/\/$/, '')}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.apiKey}`
                },
                body: JSON.stringify({
                    model: config.apiModel || 'deepseek-chat',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.7
                })
            });

            const data = await response.json();
            if (data.choices && data.choices[0]) {
                const aiOutput = data.choices[0].message.content;
                resultArea.innerHTML = `<div class="ai-markdown">${aiOutput.replace(/\n/g, '<br>')}</div>`;
                
                document.getElementById('ai-outreach-section').style.display = 'block';
                document.getElementById('ai-greeting-text').value = aiOutput;
            } else {
                resultArea.innerHTML = `<p style="color:red;">API 返回错误: ${JSON.stringify(data)}</p>`;
            }
        } catch (error) {
            resultArea.innerHTML = `<p style="color:red;">请求失败: ${error.message}</p>`;
        }
    });
}

// 防风控：安全填入聊天框
function handleFillGreeting() {
    const textToFill = document.getElementById('ai-greeting-text').value;
    const inputSelectors = [
        'textarea[placeholder*="沟"]', 
        'textarea[placeholder*="聊"]', 
        'div.chat-input', 
        'textarea',
        '[contenteditable="true"]'
    ];
    
    let targetInput = null;
    for (const selector of inputSelectors) {
        targetInput = document.querySelector(selector);
        if (targetInput) break;
    }

    if (targetInput) {
        if (targetInput.tagName === 'TEXTAREA' || targetInput.tagName === 'INPUT') {
            targetInput.value = textToFill;
            targetInput.dispatchEvent(new Event('input', { bubbles: true }));
            targetInput.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
            targetInput.innerText = textToFill;
            targetInput.dispatchEvent(new InputEvent('input', { bubbles: true }));
        }
        alert('✅ 已安全填入输入框！请人工核对后点击发送按钮。');
    } else {
        alert('⚠️ 未能在当前页面自动定位到聊天输入框，请手动复制粘贴。');
    }
}

const observer = new MutationObserver(() => {
    if (document.body && !document.getElementById('ai-assistant-float-panel')) {
        createAIPanel();
    }
});
observer.observe(document.body, { childList: true, subtree: true });

setTimeout(createAIPanel, 1500);