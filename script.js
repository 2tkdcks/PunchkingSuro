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
                const apiKey = process.env.MAPLE_API_KEY;
                
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
                    throw new Error('캐릭터를 찾을 수 없습니다.');
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
