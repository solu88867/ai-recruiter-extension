document.addEventListener('DOMContentLoaded', () => {
    // 页面加载时读取已保存的配置
    chrome.storage.local.get(['apiUrl', 'apiKey', 'apiModel', 'jobDesc'], (data) => {
        if (data.apiUrl) document.getElementById('apiUrl').value = data.apiUrl;
        if (data.apiKey) document.getElementById('apiKey').value = data.apiKey;
        if (data.apiModel) document.getElementById('apiModel').value = data.apiModel;
        if (data.jobDesc) document.getElementById('jobDesc').value = data.jobDesc;
    });

    // 点击保存
    document.getElementById('saveBtn').addEventListener('click', () => {
        const apiUrl = document.getElementById('apiUrl').value.trim();
        const apiKey = document.getElementById('apiKey').value.trim();
        const apiModel = document.getElementById('apiModel').value.trim();
        const jobDesc = document.getElementById('jobDesc').value.trim();

        chrome.storage.local.set({ apiUrl, apiKey, apiModel, jobDesc }, () => {
            const status = document.getElementById('status');
            status.textContent = '配置保存成功！';
            setTimeout(() => { status.textContent = ''; }, 2000);
        });
    });
});