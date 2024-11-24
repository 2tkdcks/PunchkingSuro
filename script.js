// script.js
    async function searchCharacter() {
        const characterName = document.getElementById('characterName').value;
        const loading = document.getElementById('loading');
        const error = document.getElementById('error');

        if (!characterName) {
            error.textContent = '캐릭터 이름을 입력해주세요.';
            error.style.display = 'block';
            return;
        }

        loading.style.display = 'block';
        error.style.display = 'none';

        try {
            const apiKey = window.env?.API;
            if (!apiKey) {
                throw new Error('API 키가 설정되지 않았습니다.');
            }
            
            // 날짜 설정 (어제 날짜 사용)
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const dateStr = yesterday.toISOString().split('T')[0];

            // 1. Character OCID 조회
            const ocidResponse = await fetch(`https://open.api.nexon.com/maplestory/v1/id?character_name=${encodeURIComponent(characterName)}`, {
                headers: {
                    'x-nxopen-api-key': apiKey
                }
            });

            if (!ocidResponse.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '캐릭터를 찾을 수 없습니다.');
            }

            const ocidData = await ocidResponse.json();
            
            // 2. 캐릭터 기본 정보 조회
            const characterResponse = await fetch(`https://open.api.nexon.com/maplestory/v1/character/basic?ocid=${ocidData.ocid}&date=${dateStr}`, {
                headers: {
                    'x-nxopen-api-key': apiKey
                }
            });

            // 3. HEXA 매트릭스 정보 조회
            const hexaResponse = await fetch(`https://open.api.nexon.com/maplestory/v1/character/hexamatrix?ocid=${ocidData.ocid}&date=${dateStr}`, {
                headers: {
                    'x-nxopen-api-key': apiKey
                }
            });

            if (!characterResponse.ok || !hexaResponse.ok) {
                throw new Error('캐릭터 정보를 가져올 수 없습니다.');
            }

            const characterData = await characterResponse.json();
            const hexaData = await hexaResponse.json();

            if (characterData.character_class != '라라'){
                throw new Error('라라가 아닙니다.');
            }

            // HEXA 코어 레벨 업데이트
            document.getElementById("MasteryCore1").value = hexaData.character_hexa_core_equipment[1].hexa_core_level || 0;
            document.getElementById("MasteryCore2").value = hexaData.character_hexa_core_equipment[2].hexa_core_level || 0;
            document.getElementById("OriginCore").value = hexaData.character_hexa_core_equipment[0].hexa_core_level || 0;
            document.getElementById("FifthCore1").value = hexaData.character_hexa_core_equipment[4].hexa_core_level || 0;
            document.getElementById("FifthCore2").value = hexaData.character_hexa_core_equipment[6].hexa_core_level || 0;
            document.getElementById("FifthCore3").value = hexaData.character_hexa_core_equipment[3].hexa_core_level || 0;
            document.getElementById("FifthCore4").value = hexaData.character_hexa_core_equipment[5].hexa_core_level || 0;

        } catch (err) {
            console.error('Error:', err);
            error.textContent = err.message;
            error.style.display = 'block';
        } finally {
            loading.style.display = 'none';
        }
    }

    function HexaCalculate() {
        // 스킬 레벨 입력에서 값 가져오기 및 숫자로 변환
        let MasteryCore1 = parseInt(document.getElementById("MasteryCore1").value);
        let MasteryCore2 = parseInt(document.getElementById("MasteryCore2").value);
        let OriginCore = parseInt(document.getElementById("OriginCore").value);
        let FifthCore1 = parseInt(document.getElementById("FifthCore1").value);
        let FifthCore2 = parseInt(document.getElementById("FifthCore2").value);
        let FifthCore3 = parseInt(document.getElementById("FifthCore3").value);
        let FifthCore4 = parseInt(document.getElementById("FifthCore4").value);
    
        let OriginShare = 16.74; // 오리진
    
        let MasteryShare1_1 = 7.34; // 정뿌
        let MasteryShare1_2 = 4.23; // 산꼬마
        let MasteryShare1_3 = 4.15; // 산의 씨앗
    
        let MasteryShare2_1 = 11.17; // 해분출
        let MasteryShare2_2 = 9.29; // 바람분출
        let MasteryShare2_3 = 6.77; // 강분출
    
        let FifthShare1 = 10.85; // 해강산
        let FifthShare2 = 11.45; // 굽이굽이
        let FifthShare3 = 10.28; // 큰기지개
        let FifthShare4 = 5.54; // 용솟음

        let GitaShare = 2.19; // 나머지 점유율
    
        let nowOriginShare; // 오리진
    
        let nowMasteryShare1_1; // 정뿌
        let nowMasteryShare1_2; // 산꼬마
        let nowMasteryShare1_3; // 산의 씨앗
    
        let nowMasteryShare2_1; // 해분출
        let nowMasteryShare2_2; // 바람분출
        let nowMasteryShare2_3; // 강분출
    
        let nowFifthShare1; // 해강산
        let nowFifthShare2; // 굽이굽이
        let nowFifthShare3; // 큰기지개
        let nowFifthShare4; // 용솟음
    
        // 헥사강화로 인한 오리진 감소 계산
        let nowOriginDamage = (1050 + OriginCore * 35) * 7 * 8 + (695 + OriginCore * 23) * 14 * 64; // 1~30레벨 공식
        if(OriginCore > 9) nowOriginDamage *= 1.021; // 10레벨 이상 효과
        if(OriginCore > 19) nowOriginDamage *= 1.008; // 20레벨 이상 효과
        if(OriginCore > 29) nowOriginDamage *= 1.05; // 30레벨 효과
        
        let OriginDamage = (1050 + 30 * 35) * 7 * 8 + (695 + 30 * 23) * 14 * 64; // 만렙 데미지
        OriginDamage *= 1.0806264 // 만렙 효과
    
        nowOriginShare = (nowOriginDamage / OriginDamage) * OriginShare;
        if(OriginCore == 0) nowOriginShare = 0;
        
        // 정뿌 감소 계산
        let nowMastery1_1Damage;
    
        if (MasteryCore1 == 0) { 
            nowMastery1_1Damage = 340 + 50;
        } else {
            nowMastery1_1Damage = 480 + (MasteryCore1 * 12);
        }
    
        let Mastery1_1Damage = 480 + 360;
    
        nowMasteryShare1_1 = (nowMastery1_1Damage / Mastery1_1Damage) * MasteryShare1_1;
    
        // 산꼬마 감소 계산
        let nowMastery1_2Damage;
    
        if(MasteryCore1 == 0) nowMastery1_2Damage = 410 + 16;
        nowMastery1_2Damage = 426 + 60 + (MasteryCore1 * 20);
    
        let Mastery1_2Damage = 426 + 60 + 600;
    
        nowMasteryShare1_2 = (nowMastery1_2Damage / Mastery1_2Damage) * MasteryShare1_2;
        
        // 산의 씨앗 감소 계산
        let nowMastery1_3Damage;
    
        if(MasteryCore1 == 0) nowMastery1_3Damage = 395 + 16;
        nowMastery1_3Damage = 409 + 60 + (MasteryCore1 * 20);
    
        let Mastery1_3Damage = 409 + 60 + 600;
    
        nowMasteryShare1_3 = (nowMastery1_3Damage / Mastery1_3Damage) * MasteryShare1_3;
        
        // 해분출 감소 계산
        let nowMastery2_1Damage;
    
        nowMastery2_1Damage = (760 + MasteryCore2 * 10) * 6 * 6 + (450 + MasteryCore2 * 5) * 60 + ((465 + MasteryCore2 * 7) * 3 + (465 + MasteryCore2 * 7 * 0.9) * 3 * 4) * 28;
    
        let Mastery2_1Damage = (760 + 300) * 6 * 6 + (450 + 150) * 60 + ((465 + 210) * 3 + (465 + 30 * 7 * 0.9) * 3 * 4) * 28;
    
        nowMasteryShare2_1 = (nowMastery2_1Damage / Mastery2_1Damage) * MasteryShare2_1;
    
        // 바람분출 감소 계산
        let nowMastery2_2Damage;
    
        nowMastery2_2Damage = (510 + MasteryCore2 * 6);
    
        let Mastery2_2Damage = (510 + 30 * 6);
    
        nowMasteryShare2_2 = (nowMastery2_2Damage / Mastery2_2Damage) * MasteryShare2_2;
    
        // 강분출 감소 계산
        let nowMastery2_3Damage;
    
        nowMastery2_3Damage = (930 + MasteryCore2 * 13) * 8 * 8 + (780 + MasteryCore2 * 11) * 5 * 20;
    
        let Mastery2_3Damage = (930 + 30 * 13) * 8 * 8 + (780 + 30 * 11) * 5 * 20;
    
        nowMasteryShare2_3 = (nowMastery2_3Damage / Mastery2_3Damage) * MasteryShare2_3;
    
        // 해강산 감소 계산
        let nowFifth1Damage;
        if(FifthCore1 == 0) nowFifth1Damage = 1;
        else if(FifthCore1 < 10) nowFifth1Damage = (110+FifthCore1)/100; // 1~9레벨
        else if(FifthCore1 < 20) nowFifth1Damage = (115+FifthCore1)/100; // 10~19레벨
        else if(FifthCore1 < 30) nowFifth1Damage = (120+FifthCore1)/100; // 20~29레벨
        else nowFifth1Damage = 1.6;
        nowFifthShare1 = (nowFifth1Damage/1.6) * FifthShare1
    
        // 굽이굽이 감소 계산
        let nowFifth2Damage;
        if(FifthCore2 == 0) nowFifth2Damage = 1;
        else if(FifthCore2 < 10) nowFifth2Damage = (110+FifthCore2)/100; // 1~9레벨
        else if(FifthCore2 < 20) nowFifth2Damage = (115+FifthCore2)/100; // 10~19레벨
        else if(FifthCore2 < 30) nowFifth2Damage = (120+FifthCore2)/100; // 20~29레벨
        else nowFifth2Damage = 1.6;
        nowFifthShare2 = (nowFifth2Damage/1.6) * FifthShare2
    
        // 큰기지개 감소 계산
        let nowFifth3Damage;
        if(FifthCore3 == 0) nowFifth3Damage = 1;
        else if(FifthCore3 < 10) nowFifth3Damage = (110+FifthCore3)/100; // 1~9레벨
        else if(FifthCore3 < 20) nowFifth3Damage = (115+FifthCore3)/100; // 10~19레벨
        else if(FifthCore3 < 30) nowFifth3Damage = (120+FifthCore3)/100; // 20~29레벨
        else nowFifth3Damage = 1.6;
        nowFifthShare3 = (nowFifth3Damage/1.6) * FifthShare3
    
        // 용솟음 감소 계산
        let nowFifth4Damage;
        if(FifthCore4 == 0) nowFifth4Damage = 1;
        else if(FifthCore4 < 10) nowFifth4Damage = (110+FifthCore4)/100; // 1~9레벨
        else if(FifthCore4 < 20) nowFifth4Damage = (115+FifthCore4)/100; // 10~19레벨
        else if(FifthCore4 < 30) nowFifth4Damage = (120+FifthCore4)/100; // 20~29레벨
        else nowFifth4Damage = 1.6;
        nowFifthShare4 = (nowFifth4Damage/1.6) * FifthShare4
    
        // 헥사 풀일때 데미지
        let HexaFullDamage = 
        OriginShare +
        MasteryShare1_1 +
        MasteryShare1_2 +
        MasteryShare1_3 +
        MasteryShare2_1 +
        MasteryShare2_2 +
        MasteryShare2_3 +
        FifthShare1 +
        FifthShare2 +
        FifthShare3 +
        FifthShare4 +
        GitaShare;
    
        // 현재 나오는 데미지
        let HexaNowDamage = 
        nowOriginShare +
        nowMasteryShare1_1 +
        nowMasteryShare1_2 +
        nowMasteryShare1_3 +
        nowMasteryShare2_1 +
        nowMasteryShare2_2 +
        nowMasteryShare2_3 +
        nowFifthShare1 +
        nowFifthShare2 +
        nowFifthShare3 +
        nowFifthShare4 +
        GitaShare;
    
        return HexaNowDamage / HexaFullDamage;
    }
  
    function calculate() {
        var HexaLevel = HexaCalculate()
        var hexa = document.getElementById("hexa").value;
        var hexaDamage = 0.0004880131 * HexaLevel;
        var damage = parseInt(hexa) * hexaDamage;
        var score = 0;

        if (damage >= 13671) {
            score = 1250;
            score += (damage - 13671) / 80;
        }   
        // 결과 숫자에 디자인 적용
        var damageElement = document.getElementById("damage");
        var scoreElement = document.getElementById("score");
        damageElement.style.fontSize = "18px";
        damageElement.style.fontWeight = "bold";
        damageElement.style.color = "#000000";
        scoreElement.style.fontSize = "18px";
        scoreElement.style.fontWeight = "bold";
        scoreElement.style.color = "#000000";
  
        damage = damage / 1000;
        if ( score > 5000 ) { score = 5000; }
        damageElement.innerText = "데미지: " + damage.toFixed(1) + "조" + "\n점수: " + score.toFixed(0); 
    }
  
    function calculate2() {
        var HexaLevel = HexaCalculate()
        var hexa2 = document.getElementById("hexa2").value;
        var hexaDamage2 = 0.005278 * HexaLevel;
        var damage2 = parseInt(hexa2) * hexaDamage2;
        var score2 = 0;

        if (damage2 <= 60) {
            score2 = damage2 / 6;
        }
        else if (damage2 <= 210) {
            score2 = 10 + (damage2 - 60) / 7.5;
        }
        else if (damage2 <= 1710) {
            score2 = 30 + (damage2 - 210) / 15;
        }
        else {
            score2 = 130 + (damage2 - 1710) / 30;
        }
        var score3 = score2 / 1.09
  
        // 결과 숫자에 디자인 적용
        var damage2Element = document.getElementById("damage2");
        var score2Element = document.getElementById("score2");
        damage2Element.style.fontSize = "18px";
        damage2Element.style.fontWeight = "bold";
        damage2Element.style.color = "#000000";
        score2Element.style.fontSize = "18px";
        score2Element.style.fontWeight = "bold";
        score2Element.style.color = "#000000";
        if ( score2 > 200000) {
            score2 = 0;
        }
        score2Element.innerText = "일반인 기준: " + score3.toFixed(0) + "\n최고점 기준: " + score2.toFixed(0);
    }

    // 모바일 환경에서 닫기 버튼 동작
    const closeButton = document.querySelector('.close-tooltip');
    const tooltipContent = document.querySelector('.tooltip-content');
    const tooltipTrigger = document.querySelector('.tooltip');
    
    if (closeButton) {
        closeButton.addEventListener('click', function(e) {
            e.stopPropagation(); // 이벤트 버블링 방지
            tooltipContent.style.visibility = 'hidden';
            tooltipContent.style.opacity = '0';
        });
    }

    // 모바일에서 설명서 버튼 클릭 시 툴팁 표시
    if (tooltipTrigger) {
        tooltipTrigger.addEventListener('click', function(e) {
            const isVisible = tooltipContent.style.visibility === 'visible';
            tooltipContent.style.visibility = isVisible ? 'hidden' : 'visible';
            tooltipContent.style.opacity = isVisible ? '0' : '1';
        });
    }

    // 전역 스코프에서 사용할 함수들 등록
    window.HexaCalculate = HexaCalculate;
    window.searchCharacter = searchCharacter;
