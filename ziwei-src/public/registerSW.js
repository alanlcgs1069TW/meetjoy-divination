if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then((reg) => {
        // 主動檢查更新，確保舊版被劫持的 Navigation 快取被立即替換
        reg.update();
      })
      .catch((err) => {
        console.debug('Service Worker register failed:', err);
      });
  });
}
