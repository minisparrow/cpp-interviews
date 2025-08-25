// C++面试八股文学习助手
class InterviewApp {
    constructor() {
        this.currentCategory = 'all';
        this.currentQuestions = [...questionsData];
        this.favorites = this.loadFavorites();
        this.studiedQuestions = this.loadStudiedQuestions();
        this.currentPlayingIndex = -1;
        this.isPlaying = false;
        this.speechSynthesis = window.speechSynthesis;
        this.currentUtterance = null;
        this.playQueue = [];
        this.autoPlayNext = false;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderQuestions();
        this.updateStats();
        this.initSpeechSettings();
    }

    // 初始化语音设置
    initSpeechSettings() {
        // 语速控制
        const speedRange = document.getElementById('speedRange');
        const speedValue = document.getElementById('speedValue');
        
        speedRange.addEventListener('input', (e) => {
            speedValue.textContent = e.target.value + 'x';
        });

        // 音调控制
        const pitchRange = document.getElementById('pitchRange');
        const pitchValue = document.getElementById('pitchValue');
        
        pitchRange.addEventListener('input', (e) => {
            pitchValue.textContent = e.target.value;
        });

        // 语音选择器
        const voiceSelect = document.getElementById('voiceSelect');
        
        // 加载可用语音
        const loadVoices = () => {
            const voices = this.speechSynthesis.getVoices();
            voiceSelect.innerHTML = '<option value="">自动选择最佳语音</option>';
            
            // 过滤并排序中文语音
            const chineseVoices = voices.filter(voice => 
                voice.lang.includes('zh') || 
                voice.name.includes('Chinese') ||
                voice.name.includes('中文') ||
                voice.lang.includes('cmn')
            ).sort((a, b) => {
                // 优先级排序
                const priority = {
                    'Ting-Ting': 10, 'Sin-ji': 9, 'Mei-Jia': 8,
                    'zh-CN-Standard-A': 7, 'zh-CN-Standard-B': 6,
                    'Microsoft Huihui': 5, 'Microsoft Yaoyao': 4
                };
                
                const aPriority = Object.keys(priority).find(key => a.name.includes(key)) || 0;
                const bPriority = Object.keys(priority).find(key => b.name.includes(key)) || 0;
                
                return (priority[bPriority] || 0) - (priority[aPriority] || 0);
            });
            
            chineseVoices.forEach(voice => {
                const option = document.createElement('option');
                option.value = voice.name;
                option.textContent = `${voice.name} (${voice.lang})`;
                voiceSelect.appendChild(option);
            });
            
            // 如果有高质量语音，自动选择
            if (chineseVoices.length > 0) {
                const bestVoice = chineseVoices[0];
                voiceSelect.value = bestVoice.name;
            }
        };
        
        // 语音加载完成后设置
        if (this.speechSynthesis.getVoices().length > 0) {
            loadVoices();
        } else {
            this.speechSynthesis.addEventListener('voiceschanged', loadVoices);
        }
    }

    // 绑定事件监听器
    bindEvents() {
        // 分类导航
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchCategory(e.target.dataset.category);
            });
        });

        // 控制按钮
        document.getElementById('playAll').addEventListener('click', () => this.playAllQuestions());
        document.getElementById('pauseBtn').addEventListener('click', () => this.pauseSpeech());
        document.getElementById('stopBtn').addEventListener('click', () => this.stopSpeech());

        // 搜索功能
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchQuestions(e.target.value);
        });
        document.getElementById('searchBtn').addEventListener('click', () => {
            const searchTerm = document.getElementById('searchInput').value;
            this.searchQuestions(searchTerm);
        });

        // 关闭播放提示
        document.getElementById('closePlaying').addEventListener('click', () => {
            this.hidePlayingIndicator();
        });

        // 监听语音合成事件
        if (this.speechSynthesis) {
            // 处理语音结束事件
            document.addEventListener('speechend', () => {
                if (this.autoPlayNext) {
                    this.playNextInQueue();
                }
            });
        }
    }

    // 切换分类
    switchCategory(category) {
        this.currentCategory = category;
        
        // 更新导航按钮状态
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');

        // 过滤并渲染题目
        this.filterQuestions();
        this.renderQuestions();
    }

    // 过滤题目
    filterQuestions() {
        if (this.currentCategory === 'all') {
            this.currentQuestions = [...questionsData];
        } else {
            this.currentQuestions = questionsData.filter(q => q.category === this.currentCategory);
        }
    }

    // 搜索题目
    searchQuestions(searchTerm) {
        if (!searchTerm.trim()) {
            this.filterQuestions();
        } else {
            const term = searchTerm.toLowerCase();
            this.currentQuestions = questionsData.filter(q => 
                q.title.toLowerCase().includes(term) ||
                q.question.toLowerCase().includes(term) ||
                q.answer.toLowerCase().includes(term)
            );
        }
        this.renderQuestions();
    }

    // 渲染题目列表
    renderQuestions() {
        const container = document.getElementById('questionsContainer');
        
        if (this.currentQuestions.length === 0) {
            container.innerHTML = '<div class="loading">没有找到相关题目</div>';
            return;
        }

        container.innerHTML = this.currentQuestions.map(question => 
            this.createQuestionCard(question)
        ).join('');

        // 添加动画效果
        container.querySelectorAll('.question-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fade-in');
        });

        // 绑定事件
        this.bindQuestionEvents();
    }

    // 创建题目卡片HTML
    createQuestionCard(question) {
        const isFavorited = this.favorites.includes(question.id);
        const isStudied = this.studiedQuestions.includes(question.id);
        
        return `
            <div class="question-card" data-id="${question.id}">
                <div class="question-header">
                    <span class="question-category">${categoryMap[question.category]}</span>
                    <h3 class="question-title">${question.title}</h3>
                    <div class="question-actions">
                        <button class="action-btn play-btn" data-id="${question.id}" title="播放">
                            ▶️
                        </button>
                        <button class="action-btn favorite-btn ${isFavorited ? 'favorited' : ''}" 
                                data-id="${question.id}" title="收藏">
                            ${isFavorited ? '⭐' : '☆'}
                        </button>
                    </div>
                </div>
                <div class="question-content">
                    <div class="question-text">${question.question}</div>
                    <div class="answer">
                        <span class="answer-label">答案：</span>
                        <div class="answer-text">${this.formatAnswerText(question.answer)}</div>
                    </div>
                </div>
            </div>
        `;
    }

    // 格式化答案文本
    formatAnswerText(text) {
        // 将代码块格式化
        text = text.replace(/```cpp\n([\s\S]*?)\n```/g, '<pre><code>$1</code></pre>');
        text = text.replace(/```\n([\s\S]*?)\n```/g, '<pre><code>$1</code></pre>');
        
        // 处理内联代码
        text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // 处理列表
        text = text.replace(/^\s*\d+\.\s+\*\*(.*?)\*\*：?\s*$/gm, '<strong>$1</strong>：');
        text = text.replace(/^\s*-\s+(.*?)$/gm, '<li>$1</li>');
        text = text.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
        
        // 处理粗体
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // 处理换行
        text = text.replace(/\n\n/g, '</p><p>');
        text = '<p>' + text + '</p>';
        
        return text;
    }

    // 绑定题目相关事件
    bindQuestionEvents() {
        // 播放按钮
        document.querySelectorAll('.play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const questionId = parseInt(e.target.dataset.id);
                this.playQuestion(questionId);
            });
        });

        // 收藏按钮
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const questionId = parseInt(e.target.dataset.id);
                this.toggleFavorite(questionId);
            });
        });

        // 点击卡片标记为已学习
        document.querySelectorAll('.question-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('action-btn')) {
                    const questionId = parseInt(card.dataset.id);
                    this.markAsStudied(questionId);
                }
            });
        });
    }

    // 播放单个题目
    playQuestion(questionId) {
        const question = questionsData.find(q => q.id === questionId);
        if (!question) return;

        this.stopSpeech(); // 停止当前播放

        // 优化朗读文本结构，更自然的表达
        const cleanAnswer = this.cleanTextForSpeech(question.answer);
        const textToSpeak = `${question.title}。${question.question}。答案是：${cleanAnswer}`;
        
        this.speakText(textToSpeak, question.title);
        this.markAsStudied(questionId);
    }

    // 播放全部题目
    playAllQuestions() {
        if (this.currentQuestions.length === 0) return;
        
        this.autoPlayNext = true;
        this.playQueue = [...this.currentQuestions];
        this.currentPlayingIndex = 0;
        
        this.playQuestion(this.playQueue[0].id);
    }

    // 播放队列中的下一个
    playNextInQueue() {
        if (!this.autoPlayNext || this.currentPlayingIndex >= this.playQueue.length - 1) {
            this.autoPlayNext = false;
            this.hidePlayingIndicator();
            return;
        }
        
        this.currentPlayingIndex++;
        this.playQuestion(this.playQueue[this.currentPlayingIndex].id);
    }

    // 语音合成
    speakText(text, title) {
        if (!this.speechSynthesis) {
            alert('您的浏览器不支持语音合成功能');
            return;
        }

        this.currentUtterance = new SpeechSynthesisUtterance(text);
        
        // 设置语音参数 - 使用用户选择的设置
        const speedRange = document.getElementById('speedRange');
        const pitchRange = document.getElementById('pitchRange');
        const voiceSelect = document.getElementById('voiceSelect');
        
        this.currentUtterance.rate = parseFloat(speedRange.value);
        this.currentUtterance.pitch = parseFloat(pitchRange.value);
        this.currentUtterance.volume = 0.9;
        
        // 语音选择 - 优先使用用户选择的语音
        const voices = this.speechSynthesis.getVoices();
        let selectedVoice = null;
        
        if (voiceSelect.value) {
            // 使用用户选择的语音
            selectedVoice = voices.find(voice => voice.name === voiceSelect.value);
        } else {
            // 自动选择最佳语音
            const preferredVoices = [
                'Ting-Ting', 'Sin-ji', 'Mei-Jia',
                'zh-CN-Standard-A', 'zh-CN-Standard-B', 'zh-CN-Standard-C', 'zh-CN-Standard-D',
                'Microsoft Huihui Desktop', 'Microsoft Yaoyao Desktop'
            ];
            
            for (const voiceName of preferredVoices) {
                selectedVoice = voices.find(voice => 
                    voice.name.includes(voiceName) || voice.voiceURI.includes(voiceName)
                );
                if (selectedVoice) break;
            }
            
            // 如果没找到，则找任何中文语音
            if (!selectedVoice) {
                selectedVoice = voices.find(voice => 
                    voice.lang.includes('zh') || 
                    voice.name.includes('Chinese') ||
                    voice.name.includes('中文') ||
                    voice.lang.includes('cmn')
                );
            }
        }
        
        if (selectedVoice) {
            this.currentUtterance.voice = selectedVoice;
            console.log(`使用语音: ${selectedVoice.name} (${selectedVoice.lang})`);
        }

        // 事件监听
        this.currentUtterance.onstart = () => {
            this.isPlaying = true;
            this.showPlayingIndicator(title);
        };

        this.currentUtterance.onend = () => {
            this.isPlaying = false;
            if (this.autoPlayNext) {
                setTimeout(() => this.playNextInQueue(), 1000);
            } else {
                this.hidePlayingIndicator();
            }
        };

        this.currentUtterance.onerror = () => {
            this.isPlaying = false;
            this.hidePlayingIndicator();
        };

        this.speechSynthesis.speak(this.currentUtterance);
    }

    // 清理文本用于语音播放 - 优化为更自然的朗读
    cleanTextForSpeech(text) {
        // 移除代码块和标记，并添加适当的停顿
        text = text.replace(/```[\s\S]*?```/g, '，这里有一段代码示例，');
        text = text.replace(/`([^`]+)`/g, '，$1，');
        text = text.replace(/\*\*(.*?)\*\*/g, '$1');
        
        // 处理列表项，添加自然的停顿
        text = text.replace(/^\s*\d+\.\s*/gm, '第$1点：');
        text = text.replace(/^\s*-\s*/gm, '，另外，');
        
        // 优化标点符号，增加自然停顿
        text = text.replace(/[:：]/g, '，也就是说，');
        text = text.replace(/[;；]/g, '，');
        text = text.replace(/[.。]/g, '。');
        text = text.replace(/[!！]/g, '！');
        text = text.replace(/[?？]/g, '？');
        
        // 处理换行，添加适当停顿
        text = text.replace(/\n\n+/g, '。接下来，');
        text = text.replace(/\n+/g, '，');
        
        // 处理技术术语，添加解释性停顿
        text = text.replace(/C\+\+/g, 'C加加');
        text = text.replace(/STL/g, '标准模板库');
        text = text.replace(/const/g, '常量');
        text = text.replace(/static/g, '静态');
        text = text.replace(/virtual/g, '虚');
        text = text.replace(/template/g, '模板');
        text = text.replace(/namespace/g, '命名空间');
        text = text.replace(/nullptr/g, '空指针');
        
        // 移除多余的标点符号
        text = text.replace(/[,，]{2,}/g, '，');
        text = text.replace(/[.。]{2,}/g, '。');
        
        // 确保句子以适当的标点结尾
        text = text.trim();
        if (!text.match(/[。！？]$/)) {
            text += '。';
        }
        
        return text;
    }

    // 暂停语音
    pauseSpeech() {
        if (this.speechSynthesis && this.speechSynthesis.speaking) {
            this.speechSynthesis.pause();
        }
    }

    // 停止语音
    stopSpeech() {
        if (this.speechSynthesis && (this.speechSynthesis.speaking || this.speechSynthesis.pending)) {
            this.speechSynthesis.cancel();
        }
        this.isPlaying = false;
        this.autoPlayNext = false;
        this.hidePlayingIndicator();
    }

    // 显示播放指示器
    showPlayingIndicator(title) {
        const indicator = document.getElementById('currentPlaying');
        const titleElement = document.getElementById('playingTitle');
        
        titleElement.textContent = title;
        indicator.style.display = 'flex';
        
        // 模拟进度条动画（实际语音API没有进度信息）
        this.animateProgress();
    }

    // 隐藏播放指示器
    hidePlayingIndicator() {
        const indicator = document.getElementById('currentPlaying');
        indicator.style.display = 'none';
    }

    // 进度条动画
    animateProgress() {
        const progressFill = document.getElementById('progressFill');
        let progress = 0;
        
        const interval = setInterval(() => {
            if (!this.isPlaying) {
                clearInterval(interval);
                progressFill.style.width = '0%';
                return;
            }
            
            progress += 1;
            progressFill.style.width = Math.min(progress, 100) + '%';
            
            if (progress >= 100) {
                progress = 0; // 重置进度
            }
        }, 100);
    }

    // 切换收藏状态
    toggleFavorite(questionId) {
        const index = this.favorites.indexOf(questionId);
        
        if (index === -1) {
            this.favorites.push(questionId);
        } else {
            this.favorites.splice(index, 1);
        }
        
        this.saveFavorites();
        this.updateStats();
        this.renderQuestions(); // 重新渲染以更新收藏状态
    }

    // 标记为已学习
    markAsStudied(questionId) {
        if (!this.studiedQuestions.includes(questionId)) {
            this.studiedQuestions.push(questionId);
            this.saveStudiedQuestions();
            this.updateStats();
        }
    }

    // 更新统计数据
    updateStats() {
        document.getElementById('totalQuestions').textContent = questionsData.length;
        document.getElementById('studiedQuestions').textContent = this.studiedQuestions.length;
        document.getElementById('favoriteQuestions').textContent = this.favorites.length;
    }

    // 本地存储相关方法
    loadFavorites() {
        const stored = localStorage.getItem('cpp-interview-favorites');
        return stored ? JSON.parse(stored) : [];
    }

    saveFavorites() {
        localStorage.setItem('cpp-interview-favorites', JSON.stringify(this.favorites));
    }

    loadStudiedQuestions() {
        const stored = localStorage.getItem('cpp-interview-studied');
        return stored ? JSON.parse(stored) : [];
    }

    saveStudiedQuestions() {
        localStorage.setItem('cpp-interview-studied', JSON.stringify(this.studiedQuestions));
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    // 等待语音API加载
    if ('speechSynthesis' in window) {
        // 某些浏览器需要先获取一次voices来触发加载
        speechSynthesis.getVoices();
        
        // 等待voices加载完成
        speechSynthesis.onvoiceschanged = () => {
            new InterviewApp();
        };
        
        // 如果voices已经加载完成
        if (speechSynthesis.getVoices().length > 0) {
            new InterviewApp();
        }
    } else {
        // 即使不支持语音合成也初始化应用
        new InterviewApp();
    }
});
