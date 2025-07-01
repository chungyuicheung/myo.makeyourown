// assets/js/main.js

document.addEventListener("DOMContentLoaded", function() {
    // 建立一個函數來載入元件
    const loadComponent = (selector, url) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${url}: ${response.statusText}`);
                }
                return response.text();
            })
            .then(data => {
                // 將抓取到的 HTML 內容放入指定的選擇器中
                const element = document.querySelector(selector);
                if (element) {
                    element.innerHTML = data;
                }
            })
            .catch(error => console.error(error));
    };

    // 載入 header 和 footer
    // 注意：這裡的路徑是相對於執行 JS 的 HTML 檔案
    loadComponent('header', '/includes/header.html');
    loadComponent('footer', '/includes/footer.html');
});