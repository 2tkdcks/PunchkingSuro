// config.js
const config = {
    apiKey: ''  // 초기값은 빈 문자열
};

// .env 파일에서 환경변수를 로드하는 함수
async function loadEnvironmentVariables() {
    try {
        const response = await fetch('/.env');
        const text = await response.text();
        const vars = text.split('\n').reduce((acc, line) => {
            const [key, value] = line.split('=');
            if (key && value) {
                acc[key.trim()] = value.trim();
            }
            return acc;
        }, {});
        
        config.apiKey = vars.API || '';
    } catch (error) {
        console.error('환경변수를 로드하는데 실패했습니다:', error);
    }
}

// config 객체를 외부에서 사용할 수 있도록 내보내기
export { config, loadEnvironmentVariables };
