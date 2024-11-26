// config.js - API 키 관리
(function() {
    // ROT13 디코딩 함수
    function rot13(str) {
        return str.replace(/[a-zA-Z]/g, function(c) {
            return String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
        });
    }

    // API 키 설정
    const encodedKey = 'YOUR_ENCODED_API_KEY_HERE'; // GitHub Actions에서 이 부분이 교체됨
    
    // API 키를 전역 객체에 추가
    Object.defineProperty(window, '_apiKey', {
        get: function() {
            try {
                // Base64 디코딩 후 ROT13 디코딩
                return rot13(atob(encodedKey));
            } catch(e) {
                console.error('API 키 복호화 실패');
                return null;
            }
        },
        configurable: false,
        enumerable: false
    });
})();
