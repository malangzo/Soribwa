const CACHE_NAME = "cache-v1";
const FILES_TO_CACHE = ["/offline.html", "/public/icons/favicon.ico"];

// 설치 이벤트: 파일을 캐시
self.addEventListener("install", (event) => {
    console.log('Service Worker installing.');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
    );
});

// 활성화 이벤트: 이전 버전의 캐시 삭제
self.addEventListener("activate", (event) => {
    console.log('Service Worker activating.');
    event.waitUntil(
        caches.keys().then((keyList) =>
            Promise.all(
                keyList.map((key) => {
                    if (CACHE_NAME !== key) return caches.delete(key);
                })
            )
        )
    );
});

// 요청 처리: 네비게이션 요청의 경우 캐시에서 오프라인 페이지 제공
self.addEventListener("fetch", (event) => {
    if (event.request.mode === "navigate") {
        event.respondWith(
            fetch(event.request).catch(() =>
                caches.open(CACHE_NAME).then((cache) => cache.match("/offline.html"))
            )
        );
    }
});

// self.addEventListener('push', (event) => {
//     console.log('Push event received:', event);
//     const data = event.data.json();
//     const options = {
//         body: data.message.body,
//         icon: 'logo192.png',
//     };

//     event.waitUntil(
//         self.registration.showNotification(data.message.title, options)
//     );
// });
