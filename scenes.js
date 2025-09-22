/**
 * 游戏场景类
 */

/**
 * 开始场景
 */
class StartScene extends Scene {
    constructor() {
        super('start');
        this.startButton = null;
        this.title = '蓍草占卜';
        this.subtitle = '体验古老《易经》占卜的现代交互方式';
    }

    init() {
        this.createUI();
        this.setupEventListeners();
    }

    createUI() {
        // 创建开始按钮
        this.startButton = new Button(
            this.engine.getCanvas().width / 2 - 100,
            this.engine.getCanvas().height / 2 + 50,
            200,
            50,
            '开始占卜',
            () => this.onStartButtonClick()
        );
        this.startButton.setBackgroundColor('linear-gradient(to bottom, #FFD700, #FFA500)');
        this.startButton.setTextColor('#8B4513');
        this.startButton.setFontSize('1.2rem');
        this.startButton.setFontWeight('bold');
    }

    setupEventListeners() {
        // 添加点击事件监听
        this.engine.getCanvas().addEventListener('click', (e) => this.handleClick(e));
    }

    handleClick(e) {
        const rect = this.engine.getCanvas().getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (this.startButton && this.startButton.isPointInside(x, y)) {
            this.startButton.onClick();
        }
    }

    onStartButtonClick() {
        if (this.sceneManager) {
            this.sceneManager.switchToScene('game');
        }
    }

    render(ctx, width, height) {
        // 绘制背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, width, height);

        // 绘制标题
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 2rem "Microsoft YaHei", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(this.title, width / 2, height / 2 - 50);

        // 绘制副标题
        ctx.fillStyle = '#fff';
        ctx.font = '1.1rem "Microsoft YaHei", sans-serif';
        ctx.fillText(this.subtitle, width / 2, height / 2);

        // 渲染开始按钮
        if (this.startButton) {
            this.startButton.render(ctx);
        }
    }
}

/**
 * 游戏场景
 */
class GameScene extends Scene {
    constructor() {
        super('game');
        this.stalks = [];
        this.leftGroup = [];
        this.rightGroup = [];
        this.asideStalks = 0;
        this.asideStalksType = '';
        this.divided = false;
        this.currentStep = 0;
        this.totalSteps = 18;
        this.yaos = [];
        this.currentStalks = 49;
        this.currentChange = 0;
        this.currentYao = 0;
        this.changeResults = [];
        this.showDots = true;
        this.showLogs = false;
        this.logs = [];
        this.isDragging = false;
        this.lastX = 0;
        this.lastY = 0;
        this.trail = [];
        this.removalTimeout = null;
        
        // UI元素
        this.settingsPanel = null;
        this.gameInfoPanel = null;
        this.settingsButton = null;
        this.restartButton = null;
        this.autoButton = null;
        this.logsButton = null;
    }

    init() {
        this.initStalks();
        this.createUI();
        this.setupEventListeners();
        this.updateDisplay();
    }

    initStalks() {
        this.stalks = [];
        const stalkCount = 49;
        const width = this.engine.getCanvas().width;
        const height = this.engine.getCanvas().height;
        const padding = 30;

        for (let i = 0; i < stalkCount; i++) {
            const x = padding + Math.random() * (width - 2 * padding);
            const y = padding + Math.random() * (height - 2 * padding);

            this.stalks.push({
                x: x,
                y: y,
                radius: 8,
                color: '#DEB887',
                group: null,
                visible: true
            });
        }
    }

    createUI() {
        const canvas = this.engine.getCanvas();
        const ctx = this.engine.getContext();

        // 创建设置按钮
        this.settingsButton = new Button(
            canvas.width - 60,
            20,
            50,
            30,
            '设置',
            () => this.toggleSettings()
        );
        this.settingsButton.setBackgroundColor('rgba(0, 0, 0, 0.7)');
        this.settingsButton.setTextColor('#FFD700');
        this.settingsButton.setBorderColor('#FFD700');
        this.settingsButton.setBorderWidth(2);

        // 创建重新开始按钮
        this.restartButton = new Button(
            20,
            canvas.height - 60,
            100,
            40,
            '重新开始',
            () => this.restartGame()
        );

        // 创建自动完成按钮
        this.autoButton = new Button(
            130,
            canvas.height - 60,
            100,
            40,
            '自动完成',
            () => this.autoComplete()
        );

        // 创建查看日志按钮
        this.logsButton = new Button(
            240,
            canvas.height - 60,
            100,
            40,
            '查看日志',
            () => this.showLogs()
        );

        // 创建设置面板
        this.settingsPanel = new SettingsPanel(
            canvas.width - 220,
            10,
            200,
            150
        );

        // 创建游戏信息面板
        this.gameInfoPanel = new GameInfoPanel(
            10,
            canvas.height - 100,
            canvas.width - 20,
            80
        );
    }

    setupEventListeners() {
        const canvas = this.engine.getCanvas();

        // 鼠标事件
        canvas.addEventListener('mousedown', (e) => this.handleStart(e));
        canvas.addEventListener('mousemove', (e) => this.handleMove(e));
        canvas.addEventListener('mouseup', (e) => this.handleEnd(e));
        canvas.addEventListener('click', (e) => this.handleClick(e));

        // 触摸事件
        canvas.addEventListener('touchstart', (e) => this.handleStart(e));
        canvas.addEventListener('touchmove', (e) => this.handleMove(e));
        canvas.addEventListener('touchend', (e) => this.handleEnd(e));
    }

    handleStart(e) {
        if (this.sceneManager && this.sceneManager.getCurrentSceneName() !== 'game') return;

        const rect = this.engine.getCanvas().getBoundingClientRect();
        this.lastX = e.clientX - rect.left || e.touches[0].clientX - rect.left;
        this.lastY = e.clientY - rect.top || e.touches[0].clientY - rect.top;
        this.isDragging = true;
        this.trail = [{ x: this.lastX, y: this.lastY }];
    }

    handleMove(e) {
        if (!this.isDragging) return;

        const rect = this.engine.getCanvas().getBoundingClientRect();
        const currentX = e.clientX - rect.left || e.touches[0].clientX - rect.left;
        const currentY = e.clientY - rect.top || e.touches[0].clientY - rect.top;

        this.trail.push({ x: currentX, y: currentY });

        if (this.trail.length > 20) {
            this.trail.shift();
        }
    }

    handleEnd(e) {
        if (!this.isDragging) return;

        this.isDragging = false;

        if (this.trail.length > 1) {
            this.performDivision();
        }

        this.trail = [];
    }

    handleClick(e) {
        const rect = this.engine.getCanvas().getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // 检查是否点击了设置按钮
        if (this.settingsButton && this.settingsButton.isPointInside(x, y)) {
            this.settingsButton.onClick();
        }
    }

    performDivision() {
        // 计算划拉线的起点和终点
        const startPoint = this.trail[0];
        const endPoint = this.trail[this.trail.length - 1];

        // 重置所有蓍草的分组
        this.stalks.forEach(stalk => {
            stalk.group = null;
        });

        // 计算划拉线的斜率
        const lineVecX = endPoint.x - startPoint.x;
        const lineVecY = endPoint.y - startPoint.y;
        let slope;

        if (Math.abs(lineVecX) < 0.001) {
            slope = Infinity;
        } else {
            slope = lineVecY / lineVecX;
        }

        // 获取画布中心点
        const centerX = this.engine.getCanvas().width / 2;
        const centerY = this.engine.getCanvas().height / 2;

        // 根据斜率创建通过画布中心的切分线
        let cutLine;
        if (slope === Infinity) {
            // 垂直线
            cutLine = {
                start: { x: centerX, y: 0 },
                end: { x: centerX, y: this.engine.getCanvas().height }
            };
        } else if (slope === 0) {
            // 水平线
            cutLine = {
                start: { x: 0, y: centerY },
                end: { x: this.engine.getCanvas().width, y: centerY }
            };
        } else {
            // 根据斜率计算通过中心点的直线
            // 使用斜截式 y = slope * x + b，代入中心点求截距
            const intercept = centerY - slope * centerX;
            
            // 计算直线与画布边界的交点
            let startX, startY, endX, endY;
            
            if (Math.abs(slope) < 1) {
                // 斜率较小，与左右边界相交
                startX = 0;
                startY = slope * startX + intercept;
                endX = this.engine.getCanvas().width;
                endY = slope * endX + intercept;
            } else {
                // 斜率较大，与上下边界相交
                startY = 0;
                startX = (startY - intercept) / slope;
                endY = this.engine.getCanvas().height;
                endX = (endY - intercept) / slope;
            }
            
            cutLine = {
                start: { x: startX, y: startY },
                end: { x: endX, y: endY }
            };
        }

        // 格式化斜率显示
        const slopeDisplay = slope === Infinity ? '垂直' : slope.toFixed(3);

        // 根据切分线划分蓍草
        this.stalks.forEach(stalk => {
            const distance = this.pointToLineSignedDistance(
                stalk.x, stalk.y,
                cutLine.start.x, cutLine.start.y,
                cutLine.end.x, cutLine.end.y
            );

            if (distance > 0) {
                stalk.group = '地';
            } else {
                stalk.group = '天';
            }
        });

        // 更新分组数组
        this.leftGroup = this.stalks.filter(stalk => stalk.group === '天');
        this.rightGroup = this.stalks.filter(stalk => stalk.group === '地');

        // 标记为已分割
        this.divided = true;

        // 显示所有蓍草
        this.stalks.forEach(stalk => {
            stalk.visible = true;
        });

        // 记录日志（包含斜率信息和爻信息）
        const currentYaoNumber = this.yaos.length + 1; // 当前是第几爻
        
        // 转换为传统爻名
        const traditionalYaoNames = ['', '初', '二', '三', '四', '五', '上'];
        const yaoName = traditionalYaoNames[currentYaoNumber];
        
        // 执行蓍草法计算以获取余数信息
        const result = StalksAlgorithm.performChangeManual(
            this.currentStalks,
            this.currentChange,
            this.yaos.length,
            this.changeResults,
            this.leftGroup,
            this.rightGroup,
            (message) => {} // 暂时不记录日志，避免重复
        );
        
        // 构造新的日志格式
        let startStalks = this.currentStalks;
        // 如果是第一变且currentStalks不是49，则使用49（根据蓍草法规则）
        if (this.currentChange === 0 && startStalks !== 49) {
            startStalks = 49;
        }
        let logMessage = `${yaoName}爻${this.currentChange + 1}变：起有${startStalks}，`;
        
        if (result && result.success) {
            // 左边信息：左23挂1后揲四余2
            const leftRemainder = result.leftRemainder || 0;
            logMessage += `左${this.leftGroup.length}挂1后揲四余${leftRemainder}，`;
            
            // 右边信息：右26揲四余2
            const rightRemainder = result.rightRemainder || 0;
            logMessage += `右${this.rightGroup.length}揲四余${rightRemainder}，`;
            
            // 左右合挂：挂一1根 + 左右余数之和
            const totalHang = 1 + result.totalRemainder;
            logMessage += `左右合挂${totalHang}，`;
            
            // 本爻合挂总数（累加当前变和之前所有变的挂数）
            const currentHang = 1 + result.totalRemainder; // 当前变的挂数
            const previousHangs = this.changeResults.reduce((sum, r) => sum + (1 + r.totalRemainder), 0); // 之前所有变的挂数
            const totalAsideStalks = currentHang + previousHangs; // 总挂数
            logMessage += `本爻合挂${totalAsideStalks}，`;
            
            // Next值：如果是第三变，显示得爻之数，否则显示剩余的蓍草数量
            if (this.currentChange === 2) {
                // 第三变，计算爻值
                let yaoValue;
                let yaoType;
                if (result.remainingStalks === 36) {
                    yaoValue = 9; // 老阳 ⚊○
                    yaoType = "老阳(⚊○)";
                } else if (result.remainingStalks === 32) {
                    yaoValue = 8; // 少阴 ⚋
                    yaoType = "少阴(⚋)";
                } else if (result.remainingStalks === 28) {
                    yaoValue = 7; // 少阳 ⚊
                    yaoType = "少阳(⚊)";
                } else if (result.remainingStalks === 24) {
                    yaoValue = 6; // 老阴 ⚋○
                    yaoType = "老阴(⚋○)";
                } else {
                    yaoValue = result.remainingStalks; // 异常情况
                    yaoType = "异常";
                }
                logMessage += `得${yaoType}`;
            } else {
                // 其他变，显示剩余的蓍草数量
                logMessage += `Next=${result.remainingStalks}`;
            }
        } else {
            // 如果计算失败，使用简化格式
            logMessage += `左${this.leftGroup.length}右${this.rightGroup.length}，斜率${slopeDisplay}，计算失败`;
        }
        
        this.addLog(logMessage);

        // 执行挂一步骤
        this.asideStalks = 1;
        this.asideStalksType = 'hanging';

        // 更新界面显示
        this.updateDisplay();

        // 立即执行蓍草法算法并进入下一步
        if (this.performChange()) {
            this.currentStep++;
            this.currentChange++;

            if (this.currentChange >= 3) {
                const yaoValue = this.calculateYaoValue();
                this.yaos.push(yaoValue);

                this.currentChange = 0;
                this.changeResults = [];
                this.asideStalks = 0;
                this.asideStalksType = '';

                if (this.yaos.length >= 6) {
                    this.showResult();
                    this.addLog("手动占卜完成");
                } else {
                    this.divided = false;
                    this.initStalks();
                    this.updateDisplay();
                }
            } else {
                this.divided = false;
                this.initStalks();
                this.updateDisplay();
            }
        } else {
            this.addLog("占卜中断：蓍草数量不足");
            this.divided = false;
            this.initStalks();
            this.updateDisplay();
        }
    }


    pointToLineSignedDistance(px, py, x1, y1, x2, y2) {
        const lineVecX = x2 - x1;
        const lineVecY = y2 - y1;
        const lineLength = Math.sqrt(lineVecX * lineVecX + lineVecY * lineVecY);

        if (lineLength === 0) {
            return Math.sqrt((px - x1) * (px - x1) + (py - y1) * (py - y1));
        }

        const crossProduct = (px - x1) * lineVecY - (py - y1) * lineVecX;
        return crossProduct / lineLength;
    }

    performChange() {
        // 使用统一的算法实现
        const result = StalksAlgorithm.performChangeManual(
            this.currentStalks,
            this.currentChange,
            this.yaos.length,
            this.changeResults,
            this.leftGroup,
            this.rightGroup,
            (message) => this.addLog(message)
        );

        if (result && result.success) {
            this.currentStalks = result.remainingStalks;
            return true;
        }

        return false;
    }

    calculateYaoValue() {
        // 使用 utils.js 中统一的实现
        return StalksAlgorithm.calculateYaoValue(this.changeResults, (message) => this.addLog(message));
    }

    render(ctx, width, height) {
        // 绘制背景
        ctx.fillStyle = '#228B22';
        ctx.fillRect(0, 0, width, height);

        // 绘制蓍草
        this.drawStalks(ctx);

        // 绘制进度提示
        this.drawProgress(ctx, width, height);

        // 渲染UI元素
        if (this.settingsButton) this.settingsButton.render(ctx);
        if (this.restartButton) this.restartButton.render(ctx);
        if (this.autoButton) this.autoButton.render(ctx);
        if (this.logsButton) this.logsButton.render(ctx);
        if (this.settingsPanel) this.settingsPanel.render(ctx);
        if (this.gameInfoPanel) this.gameInfoPanel.render(ctx);
    }

    drawStalks(ctx) {
        let drawnCount = 0;

        this.stalks.forEach(stalk => {
            if (stalk.visible || this.divided || this.showDots) {
                drawnCount++;

                ctx.fillStyle = stalk.group === '天' ? '#FFD700' :
                    stalk.group === '地' ? '#FF6347' : stalk.color;

                this.drawStalk(ctx, stalk);
            }
        });

        // 绘制划拉轨迹
        if (this.isDragging && this.trail.length > 1) {
            this.drawTrail(ctx);
        }
    }

    /**
     * 绘制单个蓍草
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     * @param {Object} stalk - 蓍草对象
     */
    drawStalk(ctx, stalk) {
        if (this.showDots) {
            // 绘制圆形蓍草
            ctx.beginPath();
            ctx.arc(stalk.x, stalk.y, stalk.radius, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = '#8B4513';
            ctx.lineWidth = 1;
            ctx.stroke();
        } else {
            // 绘制方形蓍草
            ctx.fillRect(stalk.x - 4, stalk.y - 4, 8, 8);
        }
    }

    /**
     * 绘制划拉轨迹
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     */
    drawTrail(ctx) {
        for (let i = 1; i < this.trail.length; i++) {
            const alpha = i / this.trail.length;
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
            ctx.lineWidth = 3 + alpha * 2;

            ctx.beginPath();
            ctx.moveTo(this.trail[i - 1].x, this.trail[i - 1].y);
            ctx.lineTo(this.trail[i].x, this.trail[i].y);
            ctx.stroke();
        }
    }

    drawProgress(ctx, width, height) {
        const progressPadding = 15;
        const progressHeight = 50;
        const progressY = progressPadding;

        // 绘制进度背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(progressPadding, progressY, width - progressPadding * 2, progressHeight);

        // 绘制进度标题
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 14px "Microsoft YaHei", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('进度', progressPadding + 10, progressY + 20);

        // 绘制六个爻的进度方块
        const yaoAreaStartX = progressPadding + 60;
        const yaoAreaY = progressY + 35;
        const yaoBlockSize = 6;
        const yaoSpacing = 3;

        for (let yao = 0; yao < 6; yao++) {
            const yaoX = yaoAreaStartX + yao * 50;

            // 绘制爻标签
            ctx.fillStyle = '#FFD700';
            ctx.font = '10px "Microsoft YaHei", sans-serif';
            ctx.textAlign = 'center';

            let yaoName;
            switch (yao) {
                case 0: yaoName = '初'; break;
                case 1: yaoName = '二'; break;
                case 2: yaoName = '三'; break;
                case 3: yaoName = '四'; break;
                case 4: yaoName = '五'; break;
                case 5: yaoName = '上'; break;
                default: yaoName = `${yao + 1}`;
            }

            const firstBlockX = yaoX + (yaoBlockSize / 2);
            ctx.fillText(yaoName, firstBlockX, yaoAreaY - 8);

            // 绘制3个小方块
            for (let change = 0; change < 3; change++) {
                const blockX = yaoX + change * (yaoBlockSize + yaoSpacing);
                const blockY = yaoAreaY;

                const stepIndex = yao * 3 + change;

                if (stepIndex < this.currentStep) {
                    ctx.fillStyle = '#FFD700';
                } else {
                    ctx.fillStyle = '#666';
                }

                ctx.fillRect(blockX, blockY, yaoBlockSize, yaoBlockSize);
            }
        }
    }

    toggleSettings() {
        if (this.settingsPanel) {
            this.settingsPanel.setVisible(!this.settingsPanel.visible);
        }
    }

    restartGame() {
        this.state = 'dividing';
        this.currentStep = 0;
        this.divided = false;

        this.currentStalks = 49;
        this.currentChange = 0;
        this.currentYao = 0;
        this.changeResults = [];
        this.yaos = [];

        this.asideStalks = 0;
        this.asideStalksType = '';

        if (this.removalTimeout) {
            clearTimeout(this.removalTimeout);
            this.removalTimeout = null;
        }

        this.logs = [];
        this.updateDisplay();

        this.addLog("游戏重新开始");

        if (this.sceneManager) {
            this.sceneManager.switchToScene('game');
        }
    }

    autoComplete() {
        // 调用全局的autoComplete函数，避免代码重复
        if (window.autoComplete) {
            window.autoComplete();
        } else {
            this.addLog("全局autoComplete函数不可用，请检查main.js");
        }
    }

    showLogs() {
        if (this.sceneManager) {
            this.sceneManager.switchToScene('logs');
        }
    }

    showResult() {
        if (this.sceneManager) {
            this.sceneManager.switchToScene('result');
        }
    }

    addLog(message) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = `[${timestamp}] ${message}`;
        this.logs.push(logEntry);
        this.updateLogsDisplay();
    }

    updateLogsDisplay() {
        // 更新日志显示的逻辑
    }

    updateDisplay() {
        // 更新界面显示的逻辑
    }
}

/**
 * 结果场景
 */
class ResultScene extends Scene {
    constructor() {
        super('result');
        this.guaContainer = null;
        this.interpretationDiv = null;
        this.restartButton = null;
        this.newGameButton = null;
        this.guaDisplay = null;
        this.yaos = [];
    }

    init(yaos = []) {
        this.yaos = yaos;
        this.createUI();
        this.generateResult();
    }

    createUI() {
        const canvas = this.engine.getCanvas();

        // 创建卦象显示组件
        this.guaDisplay = new GuaDisplay(
            canvas.width / 2 - 150,
            100,
            300,
            200
        );

        // 创建重新开始按钮
        this.restartButton = new Button(
            canvas.width / 2 - 110,
            canvas.height - 100,
            100,
            40,
            '重新占卜',
            () => this.restartGame()
        );

        // 创建新的占卜按钮
        this.newGameButton = new Button(
            canvas.width / 2 + 10,
            canvas.height - 100,
            100,
            40,
            '新的占卜',
            () => this.startNewGame()
        );
    }

    generateResult() {
        // 确保使用传递过来的yaos数组，而不是构造函数中的空数组
        const yaos = this.yaos || [];
        console.log('ResultScene中的yaos数组:', yaos);
        
        const guaData = this.calculateGuaFromYaos(yaos);
        
        // 设置卦象数据到GuaDisplay组件
        if (this.guaDisplay) {
            this.guaDisplay.setGuaData(guaData.name, guaData.symbol, yaos);
            this.guaDisplay.setVisible(true);
        }
        
        // 输出结果到控制台
        console.log(`本卦：${guaData.interpretation}`);
        console.log(`卦象：${guaData.symbolism}`);
        console.log(`建议：${guaData.advice}`);
        
        // 获取变爻信息
        const changingYaos = yaos
            .map((yao, index) => yao === 9 || yao === 6 ? index + 1 : null)
            .filter(yao => yao !== null);
        
        if (changingYaos.length > 0 && window.StalksAlgorithm) {
            const advice = window.StalksAlgorithm.getChangingYaoAdvice(changingYaos);
            console.log(`变爻提示：${advice}`);
        }
    }

    calculateGuaFromYaos(yaos) {
        // 使用 utils.js 中最完整的实现
        return StalksAlgorithm.calculateGuaFromYaos(yaos);
    }

    render(ctx, width, height) {
        // 绘制背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(0, 0, width, height);

        // 绘制标题
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 2rem "Microsoft YaHei", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('占卜结果', width / 2, 50);

        // 渲染卦象显示组件
        if (this.guaDisplay) {
            this.guaDisplay.render(ctx);
        }

        // 渲染UI元素
        if (this.restartButton) this.restartButton.render(ctx);
        if (this.newGameButton) this.newGameButton.render(ctx);
        
        // 绘制卦象解释和建议
        if (this.yaos.length > 0) {
            const guaData = this.calculateGuaFromYaos(this.yaos);
            
            // 绘制解释
            ctx.fillStyle = '#fff';
            ctx.font = '1rem "Microsoft YaHei", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(guaData.interpretation, width / 2, height - 180);
            
            // 绘制建议
            ctx.fillStyle = '#FFD700';
            ctx.font = '0.9rem "Microsoft YaHei", sans-serif';
            ctx.fillText(guaData.advice, width / 2, height - 150);
        }
    }

    // restartGame 方法已在前面定义，这里删除重复定义

    startNewGame() {
        if (this.sceneManager) {
            this.sceneManager.switchToScene('start');
        }
    }
}

/**
 * 日志场景
 */
class LogsScene extends Scene {
    constructor() {
        super('logs');
        this.logsContent = [];
        this.clearButton = null;
        this.backButton = null;
    }

    init(logs = []) {
        this.logsContent = logs;
        this.createUI();
    }

    createUI() {
        const canvas = this.engine.getCanvas();

        // 创建清空日志按钮
        this.clearButton = new Button(
            canvas.width / 2 - 110,
            canvas.height - 100,
            100,
            40,
            '清空日志',
            () => this.clearLogs()
        );

        // 创建返回按钮
        this.backButton = new Button(
            canvas.width / 2 + 10,
            canvas.height - 100,
            100,
            40,
            '返回游戏',
            () => this.backToGame()
        );
    }

    render(ctx, width, height) {
        // 绘制背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, width, height);

        // 绘制标题
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 1.5rem "Microsoft YaHei", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('占卜日志', width / 2, 50);

        // 绘制日志内容
        ctx.fillStyle = '#fff';
        ctx.font = '0.9rem monospace';
        ctx.textAlign = 'left';

        let y = 100;
        this.logsContent.forEach(log => {
            ctx.fillText(log, 50, y);
            y += 20;
            if (y > height - 120) {
                y = 100; // 滚动到顶部
            }
        });

        // 渲染UI元素
        if (this.clearButton) this.clearButton.render(ctx);
        if (this.backButton) this.backButton.render(ctx);
    }

    clearLogs() {
        this.logsContent = [];
    }

    backToGame() {
        if (this.sceneManager) {
            this.sceneManager.switchToScene('game');
        }
    }
}

// 导出场景类到全局作用域
if (typeof window !== 'undefined') {
    window.StartScene = StartScene;
    window.GameScene = GameScene;
    window.ResultScene = ResultScene;
    window.LogsScene = LogsScene;
}