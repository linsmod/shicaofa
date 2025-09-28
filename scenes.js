/**
 * 游戏场景类
 */

/**
 * 开始场景
 */
const colorSets = [
  ['#FFD700', '#FF6347', '#32CD32', '#1E90FF', '#FF69B4', '#FFA500'],
  ['#FF6B6B', '#4ECDC4', '#FFE66D', '#6A0572', '#1A535C', '#FF9F1C'],
  ['#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA'],
  ['#FF0080', '#00FF87', '#00E0FF', '#FFCE00', '#FF3C00', '#9D00FF'],
  ['#8B4513', '#228B22', '#DAA520', '#8B7355', '#2F4F4F', '#CD853F'],
  ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#8B00FF'],
  ['#00FFFF', '#4B0082', '#00FF7F', '#1E90FF', '#8A2BE2', '#00CED1'],
  ['#FF4500', '#FF8C00', '#FFD700', '#FF6347', '#FFA500', '#FF69B4']
];
function getRandomColorSet() {
  return colorSets[Math.floor(Math.random() * colorSets.length)];
}
class StartScene extends Scene {
    constructor() {
        super('start');
        this.startButton = null;
        this.title = '蓍草占卜';
        this.subtitle = '体验古老《易经》占卜的现代交互方式';
        // 设置渐变背景
        this.backgroundColor = 'linear-gradient(to bottom, #2E8B57, #1E5A3E)';
    }

    init() {
        this.createUI();
        this.registerUIElements();
    }

    createUI() {
        // 创建标题文本块
        this.titleText = new TextBlock(0, 0, '蓍草占卜', {
            fontSize: '2rem',
            fontWeight: 'bold',
            fillColor: '#FFD700',
            textAlign: 'center',
            textBaseline: 'middle'
        });

        // 创建副标题文本块
        this.subtitleText = new TextBlock(0, 0, '体验古老《易经》占卜的现代交互方式', {
            fontSize: '1.1rem',
            fontWeight: 'normal',
            fillColor: '#fff',
            textAlign: 'center',
            textBaseline: 'middle'
        });

        // 创建开始按钮 - 使用相对坐标，在render方法中根据实际显示尺寸计算
        this.startButton = new Button(
            0,  // 相对坐标，在render中计算
            0,  // 相对坐标，在render中计算
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

    registerUIElements() {
        // 注册文本元素
        this.registerUIElement(this.titleText);
        this.registerUIElement(this.subtitleText);
        
        // 注册开始按钮
        this.registerUIElement(this.startButton);
    }

    /**
     * 处理键盘事件
     * @param {KeyboardEvent} e - 键盘事件对象
     */
    handleKeyDown(e) {
        // 子类可以重写此方法来处理键盘事件
    }
    
    handleKeyUp(e){

    }


    onStartButtonClick() {
        this.nextScene = "game";
    }

    render(ctx, width, height) {
       super.clearRect(ctx,0,0,width,height,this.backgroundColor);

       // 绘制阳光光束效果
       this.drawSunlightBeams(ctx, width, height);

       // 渲染标题文本
       if (this.titleText) {
           this.titleText.x = width / 2;
           this.titleText.y = height / 2 - 50;
           this.titleText.render(ctx);
       }

       // 渲染副标题文本
       if (this.subtitleText) {
           this.subtitleText.x = width / 2;
           this.subtitleText.y = height / 2;
           this.subtitleText.render(ctx);
       }

       // 渲染开始按钮 - 根据实际显示尺寸设置按钮位置
       if (this.startButton) {
           // 设置按钮位置（使用CSS显示尺寸，而不是canvas像素尺寸）
           this.startButton.x = width / 2 - 100;
           this.startButton.y = height / 2 + 50;
           this.startButton.render(ctx);
       }
    }

    /**
     * 绘制阳光光束效果（丁达尔效应）
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     * @param {number} width - 画布宽度
     * @param {number} height - 画布高度
     */
    drawSunlightBeams(ctx, width, height) {
        const time = Date.now() * 0.0008; // 时间因子，用于动画
        
        // 创建多个从画布边缘外射入的光束
        const beamCount = 8;
        
        for (let i = 0; i < beamCount; i++) {
            // 非对称分布，让光束从不同角度射入
            const baseAngle = (i / beamCount) * Math.PI * 1.5 + Math.PI * 0.25; // 只覆盖135度范围
            const angleVariation = Math.sin(time * 0.3 + i) * 0.4; // 缓慢摆动
            const angle = baseAngle + angleVariation;
            
            // 光束起点在画布外
            const startDistance = Math.max(width, height) * 0.8;
            const startX = width * 0.7 + Math.cos(angle) * startDistance;
            const startY = height * 0.3 + Math.sin(angle) * startDistance;
            
            // 光束终点在画布内不同位置
            const endX = width * (0.1 + Math.sin(time * 0.2 + i) * 0.3);
            const endY = height * (0.4 + Math.cos(time * 0.15 + i) * 0.4);
            
            // 创建渐变
            const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
            
            // 丁达尔效应的渐变效果
            const opacity = 0.06 + Math.sin(time + i * 0.7) * 0.02;
            
            gradient.addColorStop(0, `rgba(255, 255, 255, 0)`); // 完全透明
            gradient.addColorStop(0.1, `rgba(255, 255, 200, ${opacity * 0.3})`); // 淡淡的浅黄
            gradient.addColorStop(0.3, `rgba(255, 255, 150, ${opacity * 0.6})`); // 浅黄色
            gradient.addColorStop(0.6, `rgba(255, 215, 0, ${opacity * 0.8})`); // 金色
            gradient.addColorStop(0.8, `rgba(255, 255, 150, ${opacity * 0.4})`); // 再次变浅
            gradient.addColorStop(1, `rgba(255, 255, 255, 0)`); // 透明边缘
            
            // 绘制光束
            ctx.save();
            ctx.globalCompositeOperation = 'screen'; // 使用混合模式创建发光效果
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 8 + Math.sin(time * 0.5 + i) * 4; // 动态宽度
            ctx.lineCap = 'round';
            
            // 添加轻微的曲线，让光束更自然
            const controlX1 = startX + (endX - startX) * 0.3 + Math.sin(time + i) * 20;
            const controlY1 = startY + (endY - startY) * 0.3 + Math.cos(time + i) * 15;
            const controlX2 = startX + (endX - startX) * 0.7 + Math.sin(time + i + 1) * 15;
            const controlY2 = startY + (endY - startY) * 0.7 + Math.cos(time + i + 1) * 10;
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, endX, endY);
            ctx.stroke();
            ctx.restore();
        }
        
        // 添加一些随机分布的丁达尔光斑
        for (let i = 0; i < 12; i++) {
            const x = width * (0.2 + Math.sin(time * 0.1 + i * 1.7) * 0.6);
            const y = height * (0.2 + Math.cos(time * 0.08 + i * 1.3) * 0.6);
            const size = 3 + Math.sin(time * 1.5 + i) * 2;
            const alpha = 0.15 + Math.sin(time + i * 0.5) * 0.1;
            
            // 创建径向渐变模拟光斑
            const spotGradient = ctx.createRadialGradient(x, y, 0, x, y, size);
            spotGradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
            spotGradient.addColorStop(0.5, `rgba(255, 255, 200, ${alpha * 0.6})`);
            spotGradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
            
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            ctx.fillStyle = spotGradient;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        
        // 添加一些微小的尘埃粒子
        for (let i = 0; i < 25; i++) {
            const x = width * (0.1 + Math.sin(time * 0.05 + i * 2.1) * 0.8);
            const y = height * (0.1 + Math.cos(time * 0.04 + i * 1.8) * 0.8);
            const size = 0.5 + Math.sin(time * 3 + i) * 0.3;
            const alpha = 0.1 + Math.sin(time * 2 + i * 0.7) * 0.05;
            
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = '#FFFACD';
            ctx.shadowBlur = 3;
            ctx.shadowColor = '#FFFACD';
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    onExit(){
        // 隐藏缩略图Canvas
        if (this.thumbnailCanvas && this.thumbnailCanvas.container) {
            this.thumbnailCanvas.container.style.display = 'none';
        }
    }
}

/**
 * 游戏场景
 */
class GameScene extends Scene {
    constructor() {
        super('game');
    }

    init() {
        this.stalks = [];
        this.leftGroup = [];
        this.rightGroup = [];
        this.divided = false;
        this.currentStep = 0;
        this.totalSteps = 18;
        this.yaos = [];
        this.initial = {rest:49,nextStep:1,results:[]};
        this.showDots = true;
        this.showLogs = false;
        this.logs = [];
        this.isDragging = false;
        this.lastX = 0;
        this.lastY = 0;
        this.trail = [];
        this.removalTimeout = null;
        this.backgroundColor = 'linear-gradient(to bottom, #2F4F4F33, #33333333)';
        // 特效系统
        this.effectSystem = {
            isActive: false,
            currentEffect: null,
            cutLine: null,
            animationProgress: 0,
            animationDuration: 800, // 调整到0.8秒，给切分效果更多时间
            startTime: 0,
            particles: [],
            exitDirection: null,

            // 多Canvas裁剪系统 - 在初始化时就创建
            canvi: null,
            leftCanvas: null,
            rightCanvas: null,
            leftCtx: null,
            rightCtx: null,
            separationDistance: 0,
            maxSeparation: 0, // 将在初始化时动态计算为对角线的一半

            // 分割线和分组信息（在特效之前记录）
            divisionLine: null,
            divisionGroups: null,

            // 初始化标志
            isMultiCanvasInitialized: false
        };

        // 进度条Canvas系统
        this.progressCanvas = {
            canvas: null,
            ctx: null,
            container: null,
            width: 0,
            height: 0
        };

        // 缩略图Canvas系统
        this.thumbnailCanvas = {
            canvas: null,
            ctx: null,
            container: null,
            width: 0,
            height: 0,
            lastDivisionData: null // 保存上次的分割结果
        };

        // UI元素
        this.settingsPanel = null;
        this.gameInfoPanel = null;
        this.settingsButton = null;
        this.initStalks(49);
        this.initMultiCanvasSystem();
        this.initProgressCanvas();
        this.initThumbnailCanvas();
        this.createUI();
        this.registerUIElements();
        this.updateDisplay();
    }
    onStart(){
        this.init();
    }

    /**
     * 初始化进度条Canvas系统
     */
    initProgressCanvas() {
        const canvasManager = this.engine.getCanvasManager();
        const { width, height } = canvasManager.getDisplaySize();
        
        // 创建进度条容器
        this.progressCanvas.container = document.createElement('div');
        this.progressCanvas.container.style.position = 'absolute';
        this.progressCanvas.container.style.left = '0';
        this.progressCanvas.container.style.top = '0';
        this.progressCanvas.container.style.width = width + 'px';
        this.progressCanvas.container.style.height = height + 'px';
        this.progressCanvas.container.style.pointerEvents = 'none';
        this.progressCanvas.container.style.zIndex = '25';
        this.progressCanvas.container.style.padding = '3px';
        
        // 使用CanvasManager创建进度条Canvas
        this.progressCanvas.canvas = canvasManager.createOffscreenCanvas(width, 60);
        this.progressCanvas.ctx = this.progressCanvas.canvas.getContext('2d');
        
        // 添加到DOM
        const canvas = this.engine.getCanvas();
        canvas.parentElement.appendChild(this.progressCanvas.container);
        this.progressCanvas.container.appendChild(this.progressCanvas.canvas);
        
        // 初始化进度条内容
        this.renderProgressCanvas();
        
        // console.log('进度条Canvas系统初始化完成');
    }

    /**
     * 初始化缩略图Canvas系统
     */
    initThumbnailCanvas() {
        const canvasManager = this.engine.getCanvasManager();
        const { width, height } = canvasManager.getDisplaySize();
        
        // 创建缩略图容器
        this.thumbnailCanvas.container = document.createElement('div');
        this.thumbnailCanvas.container.style.position = 'absolute';
        this.thumbnailCanvas.container.style.left = '10px';
        this.thumbnailCanvas.container.style.bottom = '100px';
        // this.thumbnailCanvas.container.style.width = '200px';
        // this.thumbnailCanvas.container.style.height = '150px';
        this.thumbnailCanvas.container.style.pointerEvents = 'none';
        this.thumbnailCanvas.container.style.zIndex = '30';
        this.thumbnailCanvas.container.style.border = '3px solid rgba(255, 215, 0, 0.8)';
        this.thumbnailCanvas.container.style.borderRadius = '10px';
        this.thumbnailCanvas.container.style.backgroundColor = 'rgba(63, 63, 63, 0.8)';
        this.thumbnailCanvas.container.style.padding="3px"
        this.thumbnailCanvas.scale = 0.2;
        // 使用CanvasManager创建缩略图Canvas
        this.thumbnailCanvas.canvas = canvasManager.createOffscreenCanvas(width*0.2, height*0.2);
        this.thumbnailCanvas.ctx = this.thumbnailCanvas.canvas.getContext('2d');
        
        // 添加到DOM
        const canvas = this.engine.getCanvas();
        canvas.parentElement.appendChild(this.thumbnailCanvas.container);
        this.thumbnailCanvas.container.appendChild(this.thumbnailCanvas.canvas);
        
        // 初始化缩略图内容
        this.renderThumbnail();
        
        // console.log('缩略图Canvas系统初始化完成');
    }

    /**
     * 渲染进度条Canvas内容
     */
    renderProgressCanvas() {
        if (!this.progressCanvas.ctx || !this.progressCanvas.canvas) {
            return;
        }
        
        const canvasManager = this.engine.getCanvasManager();
        const size = canvasManager.getDisplaySize();
        const displayWidth = size.width;
        const displayHeight = size.height;
        
        const actualWidth = this.progressCanvas.canvas.width;
        const actualHeight = this.progressCanvas.canvas.height;
        
        // 清除Canvas
        this.progressCanvas.ctx.clearRect(0, 0, actualWidth, actualHeight);
        
        // 保存当前状态
        this.progressCanvas.ctx.save();
        
        // 重置变换
        this.progressCanvas.ctx.resetTransform();
        
        // 使用CSS像素尺寸
        const scaledWidth = displayWidth;
        const scaledHeight = 60; // CSS高度固定为60px
        
       
        
        // 计算内容区域宽度
        const titleWidth = this.progressCanvas.ctx.measureText('取').width;
        const yaoAreaStartX = 10 + titleWidth + 10; // 标题右边距10px
        
        // 计算六个爻区域的总宽度
        const yaoBlockSize = 10;
        const yaoSpacing = 3;
        const yaoAreaWidth = 6 * 50; // 6个爻，每个占50px
        
        // 计算背景总宽度（标题 + 爻区域 + 右边距）
        const backgroundWidth = yaoAreaStartX + yaoAreaWidth + 20;
        
        // 绘制进度背景（适应内容宽度）
        this.progressCanvas.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.progressCanvas.ctx.fillRect(0, 0, backgroundWidth, scaledHeight);

         // 绘制进度标题
        this.progressCanvas.ctx.fillStyle = '#FFD700';
        this.progressCanvas.ctx.font = 'bold 16px "Microsoft YaHei", sans-serif';
        this.progressCanvas.ctx.textAlign = 'left';
        this.progressCanvas.ctx.fillText('取', 10, 20);
        
        // 添加内边距
        const padding = 0;
        const contentHeight = scaledHeight - padding * 2;
        
        // 绘制六个爻的进度方块
        const yaoAreaY = padding + 35;
        const endofX = 0;
        for (let yao = 0; yao < 6; yao++) {
            const yaoX = yaoAreaStartX + yao * 50;
            
            // 绘制爻标签
            this.progressCanvas.ctx.fillStyle = '#FFD700';
            this.progressCanvas.ctx.font = '12px "Microsoft YaHei", sans-serif';
            this.progressCanvas.ctx.textAlign = 'center';
            
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
            this.progressCanvas.ctx.fillText(yaoName, firstBlockX, yaoAreaY - 8);
            
            // 绘制3个小方块
            for (let change = 0; change < 3; change++) {
                const blockX = yaoX + change * (yaoBlockSize + yaoSpacing);
                const blockY = yaoAreaY;
                
                const stepIndex = yao * 3 + change;
                if (stepIndex < this.currentStep) {
                    this.progressCanvas.ctx.fillStyle = '#FFD700';
                } else {
                   //模拟一个立体阴影
                    this.progressCanvas.ctx.fillStyle = '#ffffffff';
                    this.progressCanvas.ctx.fillRect(blockX+1, blockY+1, yaoBlockSize, yaoBlockSize);
                    this.progressCanvas.ctx.fillStyle = '#464646ff';
                }
                
                this.progressCanvas.ctx.fillRect(blockX, blockY, yaoBlockSize, yaoBlockSize);
            }
        }
        
        // 恢复状态
        this.progressCanvas.ctx.restore();
    }

    onClick(){
    }

    /**
     * 启动切分特效
     * @param {Object} cutLine - 切分线对象
     */
    startCutEffect(cutLine) {
        this.effectSystem.isActive = true;
        this.effectSystem.currentEffect = 'cut';
        this.effectSystem.cutLine = cutLine;
        this.effectSystem.animationProgress = 0;
        this.effectSystem.startTime = performance.now();
        this.effectSystem.particles = [];

        // 计算法线方向
        const lineVecX = cutLine.end.x - cutLine.start.x;
        const lineVecY = cutLine.end.y - cutLine.start.y;
        const lineLength = Math.sqrt(lineVecX * lineVecX + lineVecY * lineVecY);

        // 法线方向（垂直于切分线）
        this.effectSystem.exitDirection = {
            x: -lineVecY / lineLength,
            y: lineVecX / lineLength
        };

        // 验证法线方向
        const validation = this.validateNormalDirection(cutLine);
        if (!validation.isValid) {
            console.warn('法线方向计算异常，可能影响特效效果');
        }

        // 创建粒子效果
        this.createCutParticles(cutLine);

        // console.log('切分特效启动，法线方向:', this.effectSystem.exitDirection);
    }

    /**
     * 初始化多Canvas裁剪系统
     */
    initMultiCanvasSystem() {
        const canvasManager = this.engine.getCanvasManager();
        const size = canvasManager.getDisplaySize();
        const displayWidth = size.width;
        const displayHeight = size.height;
        
        // 计算对角线的一半作为最大分离距离，确保左右canvas能移动到画布外面
        const diagonal = Math.sqrt(displayWidth * displayWidth + displayHeight * displayHeight);
        this.effectSystem.maxSeparation = diagonal;
        
        // console.log(`计算的最大分离距离: ${this.effectSystem.maxSeparation}px (对角线: ${diagonal}px)`);
        
        // 创建容器div
        this.effectSystem.canvi = document.createElement('div');
        this.effectSystem.canvi.style.position = 'absolute';
        this.effectSystem.canvi.style.left = '0';
        this.effectSystem.canvi.style.top = '0';
        this.effectSystem.canvi.style.width = displayWidth + 'px';
        this.effectSystem.canvi.style.height = displayHeight + 'px';
        this.effectSystem.canvi.style.pointerEvents = 'none';
        this.effectSystem.canvi.style.zIndex = '15'; // 提高z-index确保在主画布之上
        
        // 创建左侧Canvas（用于显示）- 天组
        this.effectSystem.leftCanvas = canvasManager.createOffscreenCanvas(displayWidth, displayHeight);
        this.effectSystem.leftCanvas.style.position = 'absolute';
        this.effectSystem.leftCanvas.style.left = '0';
        this.effectSystem.leftCanvas.style.top = '0';
        this.effectSystem.leftCanvas.style.border = '3px solid #FFD700'; // 金色边框
        this.effectSystem.leftCanvas.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.5)'; // 金色发光效果
        this.effectSystem.leftCanvas.style.zIndex = '16'; // 确保在容器之上
        
        // 创建右侧Canvas（用于显示）- 地组
        this.effectSystem.rightCanvas = canvasManager.createOffscreenCanvas(displayWidth, displayHeight);
        this.effectSystem.rightCanvas.style.position = 'absolute';
        this.effectSystem.rightCanvas.style.left = '0';
        this.effectSystem.rightCanvas.style.top = '0';
        this.effectSystem.rightCanvas.style.border = '3px solid #FF6347'; // 红色边框
        this.effectSystem.rightCanvas.style.boxShadow = '0 0 20px rgba(255, 99, 71, 0.5)'; // 红色发光效果
        this.effectSystem.rightCanvas.style.zIndex = '16'; // 确保在容器之上
        
        // 创建OffscreenCanvas（用于离屏渲染）
        this.effectSystem.offscreenLeftCanvas = canvasManager.createOffscreenCanvas(displayWidth, displayHeight);
        this.effectSystem.offscreenRightCanvas = canvasManager.createOffscreenCanvas(displayWidth, displayHeight);
        
        // 获取上下文
        this.effectSystem.leftCtx = this.effectSystem.leftCanvas.getContext('2d');
        this.effectSystem.rightCtx = this.effectSystem.rightCanvas.getContext('2d');
        
        // 添加到DOM - 注意添加顺序
        const mainCanvas = this.engine.getCanvas();
        mainCanvas.parentElement.appendChild(this.effectSystem.canvi);
        this.effectSystem.canvi.appendChild(this.effectSystem.leftCanvas);
        this.effectSystem.canvi.appendChild(this.effectSystem.rightCanvas);
        
        
        // 标记为已初始化
        this.effectSystem.isMultiCanvasInitialized = true;
        
        // console.log('多Canvas裁剪系统初始化完成，包含OffscreenCanvas');
    }

    /**
     * 根据斜率创建透明渐变效果
     * @param {Object} cutLine - 切分线对象
     * @param {number} normalX - 法线X分量
     * @param {number} normalY - 法线Y分量
     */
    createSlopeBasedTransparency(cutLine, normalX, normalY) {
        if (!this.effectSystem.leftCtx || !this.effectSystem.rightCtx) {
            return;
        }

        // 获取Canvas尺寸
        const actualWidth = this.effectSystem.leftCanvas.width;
        const actualHeight = this.effectSystem.leftCanvas.height;

        // 计算切分线的角度
        const lineVecX = cutLine.end.x - cutLine.start.x;
        const lineVecY = cutLine.end.y - cutLine.start.y;
        const angle = Math.atan2(lineVecY, lineVecX);

        // 为左侧Canvas创建透明渐变（切分线右侧透明）
        this.effectSystem.leftCtx.save();
        this.effectSystem.leftCtx.globalCompositeOperation = 'destination-out';

        const leftGradient = this.effectSystem.leftCtx.createLinearGradient(
            cutLine.start.x, cutLine.start.y,
            cutLine.end.x, cutLine.end.y
        );

        // 根据角度调整渐变
        const gradientOffset = Math.abs(Math.sin(angle)) * 0.3;
        leftGradient.addColorStop(0, `rgba(0, 0, 0, 0)`);
        leftGradient.addColorStop(0.5 + gradientOffset, `rgba(0, 0, 0, 0.3)`);
        leftGradient.addColorStop(1, `rgba(0, 0, 0, 0.8)`);

        this.effectSystem.leftCtx.fillStyle = leftGradient;
        this.effectSystem.leftCtx.fillRect(0, 0, actualWidth, actualHeight);
        this.effectSystem.leftCtx.restore();

        // 为右侧Canvas创建透明渐变（切分线左侧透明）
        this.effectSystem.rightCtx.save();
        this.effectSystem.rightCtx.globalCompositeOperation = 'destination-out';

        const rightGradient = this.effectSystem.rightCtx.createLinearGradient(
            cutLine.start.x, cutLine.start.y,
            cutLine.end.x, cutLine.end.y
        );

        // 根据角度调整渐变
        rightGradient.addColorStop(0, `rgba(0, 0, 0, 0.8)`);
        rightGradient.addColorStop(0.5 - gradientOffset, `rgba(0, 0, 0, 0.3)`);
        rightGradient.addColorStop(1, `rgba(0, 0, 0, 0)`);

        this.effectSystem.rightCtx.fillStyle = rightGradient;
        this.effectSystem.rightCtx.fillRect(0, 0, actualWidth, actualHeight);
        this.effectSystem.rightCtx.restore();
    }

    /**
     * 使用已记录的分组信息更新Canvas裁剪区域
     * 简化版本：根据斜率填充不需要的那半为透明
     * @param {number} separationProgress - 分离进度 (0-1)
     */
    updateAnimationStep(separationProgress) {
        if (!this.effectSystem.cutLine || !this.effectSystem.leftCtx || !this.effectSystem.rightCtx) {
            return;
        }

        const cutLine = this.effectSystem.cutLine;
        const separationDistance = separationProgress * this.effectSystem.maxSeparation;

        // 计算法线方向
        const lineVecX = cutLine.end.x - cutLine.start.x;
        const lineVecY = cutLine.end.y - cutLine.start.y;
        const lineLength = Math.sqrt(lineVecX * lineVecX + lineVecY * lineVecY);
        const normalX = -lineVecY / lineLength;
        const normalY = lineVecX / lineLength;

        // 清除两个Canvas - 使用实际像素尺寸
        const actualWidth = this.effectSystem.leftCanvas.width;
        const actualHeight = this.effectSystem.leftCanvas.height;
        this.effectSystem.leftCtx.clearRect(0, 0, actualWidth, actualHeight);
        this.effectSystem.rightCtx.clearRect(0, 0, actualWidth, actualHeight);

        // 简化版本：根据斜率创建透明遮罩
        this.createSimpleTransparencyMask(this.effectSystem.leftCtx, cutLine, normalX, normalY, separationDistance, true);
        this.createSimpleTransparencyMask(this.effectSystem.rightCtx, cutLine, normalX, normalY, separationDistance, false);

        // 保存分离距离用于后续渲染
        this.effectSystem.separationDistance = separationDistance;
    }

    /**
     * 创建简单的透明遮罩
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     * @param {Object} cutLine - 切分线
     * @param {number} normalX - 法线X分量
     * @param {number} normalY - 法线Y分量
     * @param {number} separationDistance - 分离距离
     * @param {boolean} isLeft - 是否为左侧Canvas
     */
    createSimpleTransparencyMask(ctx, cutLine, normalX, normalY, separationDistance, isLeft) {
        ctx.save();

        // 创建透明遮罩
        ctx.globalCompositeOperation = 'destination-out';

        // 根据斜率创建半透明遮罩
        const gradient = ctx.createLinearGradient(
            cutLine.start.x, cutLine.start.y,
            cutLine.end.x, cutLine.end.y
        );

        // 根据分离进度调整透明度
        const alpha = Math.min(separationDistance / this.effectSystem.maxSeparation, 1);

        if (isLeft) {
            // 左侧Canvas：切分线右侧透明
            gradient.addColorStop(0, `rgba(0, 0, 0, 0)`);
            gradient.addColorStop(0.5, `rgba(0, 0, 0, ${alpha * 0.5})`);
            gradient.addColorStop(1, `rgba(0, 0, 0, ${alpha})`);
        } else {
            // 右侧Canvas：切分线左侧透明
            gradient.addColorStop(0, `rgba(0, 0, 0, ${alpha})`);
            gradient.addColorStop(0.5, `rgba(0, 0, 0, ${alpha * 0.5})`);
            gradient.addColorStop(1, `rgba(0, 0, 0, 0)`);
        }

        ctx.fillStyle = gradient;

        // 绘制遮罩区域
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(ctx.canvas.width, 0);
        ctx.lineTo(ctx.canvas.width, ctx.canvas.height);
        ctx.lineTo(0, ctx.canvas.height);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    /**
     * 更新Canvas裁剪区域
     * @param {number} separationProgress - 分离进度 (0-1)
     */
    updateCanvasClipping(separationProgress) {
        if (!this.effectSystem.cutLine || !this.effectSystem.leftCtx || !this.effectSystem.rightCtx) {
            return;
        }

        const cutLine = this.effectSystem.cutLine;
        const separationDistance = separationProgress * this.effectSystem.maxSeparation;

        // 计算法线方向
        const lineVecX = cutLine.end.x - cutLine.start.x;
        const lineVecY = cutLine.end.y - cutLine.start.y;
        const lineLength = Math.sqrt(lineVecX * lineVecX + lineVecY * lineVecY);
        const normalX = -lineVecY / lineLength;
        const normalY = lineVecX / lineLength;

        // 清除两个Canvas - 使用实际像素尺寸
        const actualWidth = this.effectSystem.leftCanvas.width;
        const actualHeight = this.effectSystem.leftCanvas.height;
        this.effectSystem.leftCtx.clearRect(0, 0, actualWidth, actualHeight);
        this.effectSystem.rightCtx.clearRect(0, 0, actualWidth, actualHeight);

        // 设置左侧Canvas裁剪区域（天组）
        this.effectSystem.leftCtx.save();
        this.effectSystem.leftCtx.beginPath();
        this.effectSystem.leftCtx.moveTo(0, 0);
        this.effectSystem.leftCtx.lineTo(this.effectSystem.leftCanvas.width, 0);
        this.effectSystem.leftCtx.lineTo(this.effectSystem.leftCanvas.width, this.effectSystem.leftCanvas.height);
        this.effectSystem.leftCtx.lineTo(0, this.effectSystem.leftCanvas.height);

        // 创建切分路径
        this.effectSystem.leftCtx.moveTo(cutLine.start.x + normalX * separationDistance, cutLine.start.y + normalY * separationDistance);
        for (let t = 0; t <= 1; t += 0.1) {
            const x = cutLine.start.x + (cutLine.end.x - cutLine.start.x) * t;
            const y = cutLine.start.y + (cutLine.end.y - cutLine.start.y) * t;
            this.effectSystem.leftCtx.lineTo(x + normalX * separationDistance, y + normalY * separationDistance);
        }
        this.effectSystem.leftCtx.closePath();
        this.effectSystem.leftCtx.clip();

        // 设置右侧Canvas裁剪区域（地组）
        this.effectSystem.rightCtx.save();
        this.effectSystem.rightCtx.beginPath();
        this.effectSystem.rightCtx.moveTo(0, 0);
        this.effectSystem.rightCtx.lineTo(this.effectSystem.rightCanvas.width, 0);
        this.effectSystem.rightCtx.lineTo(this.effectSystem.rightCanvas.width, this.effectSystem.rightCanvas.height);
        this.effectSystem.rightCtx.lineTo(0, this.effectSystem.rightCanvas.height);

        // 创建切分路径
        this.effectSystem.rightCtx.moveTo(cutLine.start.x - normalX * separationDistance, cutLine.start.y - normalY * separationDistance);
        for (let t = 0; t <= 1; t += 0.1) {
            const x = cutLine.start.x + (cutLine.end.x - cutLine.start.x) * t;
            const y = cutLine.start.y + (cutLine.end.y - cutLine.start.y) * t;
            this.effectSystem.rightCtx.lineTo(x - normalX * separationDistance, y - normalY * separationDistance);
        }
        this.effectSystem.rightCtx.closePath();
        this.effectSystem.rightCtx.clip();

        // 保存分离距离用于后续渲染
        this.effectSystem.separationDistance = separationDistance;
    }

    /**
     * 创建切分粒子效果
     * @param {Object} cutLine - 切分线对象
     */
    createCutParticles(cutLine) {
        const particleCount = 30;
        const lineLength = Math.sqrt(
            Math.pow(cutLine.end.x - cutLine.start.x, 2) +
            Math.pow(cutLine.end.y - cutLine.start.y, 2)
        );

        for (let i = 0; i < particleCount; i++) {
            const t = i / (particleCount - 1);
            const x = cutLine.start.x + (cutLine.end.x - cutLine.start.x) * t;
            const y = cutLine.start.y + (cutLine.end.y - cutLine.start.y) * t;

            // 在切分线两侧创建粒子
            for (let side = -1; side <= 1; side += 2) {
                this.effectSystem.particles.push({
                    x: x,
                    y: y,
                    vx: (Math.random() - 0.5) * 4,
                    vy: (Math.random() - 0.5) * 4,
                    life: 1.0,
                    decay: 0.02,
                    size: Math.random() * 3 + 1,
                    color: side > 0 ? '#FFD700' : '#FF6347', // 天组金色，地组红色
                    side: side
                });
            }
        }
    }

    /**
     * 更新特效动画
     * @param {number} deltaTime - 距离上一帧的时间（毫秒）
     */
    updateEffects(deltaTime) {
        if (!this.effectSystem.isActive) return;

        const currentTime = performance.now();
        const elapsed = currentTime - this.effectSystem.startTime;
        this.effectSystem.animationProgress = Math.min(elapsed / this.effectSystem.animationDuration, 1);

        // 更新Canvas裁剪和分离效果
        if (this.effectSystem.cutLine) {
            // 使用已记录的分组信息更新裁剪
            this.updateAnimationStep(this.effectSystem.animationProgress);

            // 计算分离距离
            const separationProgress = this.effectSystem.animationProgress;
            const separationDistance = separationProgress * this.effectSystem.maxSeparation;

            // 更新两个Canvas的位置
            if (this.effectSystem.leftCanvas && this.effectSystem.rightCanvas) {
                const lineVecX = this.effectSystem.cutLine.end.x - this.effectSystem.cutLine.start.x;
                const lineVecY = this.effectSystem.cutLine.end.y - this.effectSystem.cutLine.start.y;
                const lineLength = Math.sqrt(lineVecX * lineVecX + lineVecY * lineVecY);
                const normalX = -lineVecY / lineLength;
                const normalY = lineVecX / lineLength;

                // 左侧Canvas向法线方向移动
                const leftOffsetX = normalX * separationDistance;
                const leftOffsetY = normalY * separationDistance;
                this.effectSystem.leftCanvas.style.transform = `translate(${leftOffsetX}px, ${leftOffsetY}px)`;

                // 右侧Canvas向反法线方向移动
                const rightOffsetX = -normalX * separationDistance;
                const rightOffsetY = -normalY * separationDistance;
                this.effectSystem.rightCanvas.style.transform = `translate(${rightOffsetX}px, ${rightOffsetY}px)`;
            }
        }

        // 更新粒子
        this.effectSystem.particles = this.effectSystem.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
            particle.vy += 0.1; // 重力效果
            return particle.life > 0;
        });

        // 检查动画是否完成
        if (this.effectSystem.animationProgress >= 1) {
            this.completeEffect();
        }
    }

    /**
     * 完成特效动画
     */
    completeEffect() {
        this.effectSystem.isActive = false;
        this.effectSystem.currentEffect = null;
        this.effectSystem.particles = [];
    }

    doStalksAlgorithm() {
        if(this.lastresult== null){
            this.lastresult = JSON.parse(JSON.stringify( this.initial));
        }
        // 转换为传统爻名
        const yaoNames = ['初', '二', '三', '四', '五', '上'];
        const yaoName = yaoNames[this.yaos.length];
        // 执行蓍草法计算以获取余数信息
        let result = StalksAlgorithm.doSubModStep(
            this.lastresult.rest,
            this.leftGroup.length,
            this.rightGroup.length,
            this.lastresult,
        );
        if(result.error){
            console.log(result.error);
            return;
        }
        // 构造新的日志格式
        let startStalks = this.lastresult.rest;
        let logMessage = `${yaoName}爻第${result.nextStep - 1}变：起有${startStalks}，`;

        if (result && !result.error) {
            // 左边信息：左23挂1后揲四余2
            const leftrest = result.leftrest || 0;
            logMessage += `左${this.leftGroup.length}揲四余${leftrest}，`;

            // 右边信息：右26揲四余2
            const rightrest = result.rightrest || 0;
            logMessage += `右${this.rightGroup.length}去一，揲四余${rightrest}，`;

            const totalHang = result.totalsub;
            logMessage += `左右合去${totalHang}，`;


            logMessage += `本爻合去${49-result.rest}，`;

            // Next值：如果是第三变，显示得爻之数，否则显示剩余的蓍草数量
            logMessage += `得${result.rest} `;
            if (result.nextStep === 4) {
                // 第三变，计算爻值
                let yaoValue;
                let yaoType;
                if (result.rest === 36) {
                    yaoValue = 9; // 老阳 ⚊○
                    yaoType = "老阳(⚊○)";
                } else if (result.rest === 32) {
                    yaoValue = 8; // 少阴 ⚋
                    yaoType = "少阴(⚋)";
                } else if (result.rest === 28) {
                    yaoValue = 7; // 少阳 ⚊
                    yaoType = "少阳(⚊)";
                } else if (result.rest === 24) {
                    yaoValue = 6; // 老阴 ⚋○
                    yaoType = "老阴(⚋○)";
                } else {
                    yaoValue = result.rest; // 异常情况
                    yaoType = "异常";
                }
                logMessage += `为${yaoType}${yaoValue}`;
            }
        } else {
            // 如果计算失败，使用简化格式
            logMessage += `左${this.leftGroup.length}右${this.rightGroup.length}，切分完成`;
        }

        this.addLog(logMessage);

        // 更新界面显示
        this.updateDisplay();

        this.currentStep++;

        // 用第三变结果生成一个爻
        if(result.nextStep>=4){
            this.yaos.push(StalksAlgorithm.calculateYaoValue(result));

            // reset to generate next yao
            result = null;
            this.initStalks(49);

            // 六个爻获得一个卦
            if(this.yaos.length==6){
                this.nextScene = 'result'
                this.sceneResult = Array.from(this.yaos);
                this.yaos = []
                this.currentStep = 0;
            }
        }
        else{
            this.initStalks(result.rest);
        }
        this.lastresult = result;
    }

    /**
     * 渲染特效
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     */
    renderEffects(ctx) {
        if (!this.effectSystem.isActive) return;

        const progress = this.effectSystem.animationProgress;
        // 渲染粒子效果（始终在主Canvas上渲染）
        this.renderParticles(ctx);
    }

    /**
     * 渲染粒子效果
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     */
    renderParticles(ctx) {
        this.effectSystem.particles.forEach(particle => {
            ctx.save();
            ctx.globalAlpha = particle.life;
            ctx.fillStyle = particle.color;

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        });
    }


    initStalks(stalkCount) {
        this.stalks = [];

        // 获取画布的实际显示尺寸（CSS像素）
        const canvasManager = this.engine.getCanvasManager();
        const size = canvasManager.getDisplaySize();
        const displayWidth = size.width;
        const displayHeight = size.height;
        const actualSize = canvasManager.getActualSize();
        const actualWidth = actualSize.width;
        const actualHeight = actualSize.height;

        const padding = 30;

        for (let i = 0; i < stalkCount; i++) {
            // 使用CSS像素坐标来定位蓍草，确保显示正确
            const x = padding + Math.random() * (displayWidth - 2 * padding);
            const y = padding + Math.random() * (displayHeight - 2 * padding);

            // 为不同组的圆圈设置不同的颜色
            const colors = getRandomColorSet();
            const color = colors[i % colors.length];

            this.stalks.push({
                x: x,
                y: y,
                radius: 8,
                color: color,
                group: null,
                visible: true
            });
        }
        this.dirty = true;
    }

    createUI() {
        const canvasManager = this.engine.getCanvasManager();
        const size = canvasManager.getDisplaySize();
        const canvasWidth = size.width;
        const canvasHeight = size.height;
        
        const ctx = this.engine.getContext();

        // 创建设置按钮
        this.settingsButton = new ImageButton(
            canvasWidth - 60,
            20,
            50,
            30,
            'setting.png',
            () => this.toggleSettings()
        );
        this.settingsButton.setMaintainAspectRatio(true);

        // 创建设置面板
        this.settingsPanel = new SettingsPanel(
            canvasWidth - 220,
            10,
            200,
            150
        );

        // 创建游戏信息面板
        this.gameInfoPanel = new GameInfoPanel(
            10,
            canvasHeight - 100,
            canvasWidth - 20,
            80
        );
    }

    registerUIElements() {
        // 注册所有按钮
        this.registerUIElement(this.settingsButton);
        
        // 始终注册设置面板，这样关闭按钮才能正常工作
        if (this.settingsPanel) {
            this.registerUIElement(this.settingsPanel);
        }
        if (this.gameInfoPanel) {
            this.registerUIElement(this.gameInfoPanel);
        }
    }

    /**
     * 处理键盘事件
     * @param {KeyboardEvent} e - 键盘事件对象
     */
    handleKeyDown(e) {
        // 子类可以重写此方法来处理键盘事件
    }

    onDragStart(x,y){
        this.lastX = x;
        this.lastY = y;
        this.isDragging = true;
        this.trail = [{ x: this.lastX, y: this.lastY }];
    }

    onDrag(x,y){
        if (this.trail.length > 20) {
            this.trail.shift();
        }
        this.trail.push({ x, y });
    }
    onDragEnd(x,y){
         if (this.trail.length > 1) {
            this.performDivision();
        }

        this.trail = [];
        this.dirty = true;
    }

    /**
     * 处理蓍草拖拽开始
     * @param {number} x - 鼠标X坐标
     * @param {number} y - 鼠标Y坐标
     */
    handleStart(x, y) {
        if (this.sceneManager && this.sceneManager.getCurrentSceneName() !== 'game') return;

        this.lastX = x;
        this.lastY = y;
        this.isDragging = true;
        this.trail = [{ x: this.lastX, y: this.lastY }];
    }

    update(deltaTime) {
        // 更新父类
        super.update(deltaTime);
        
        // 更新游戏特定的逻辑
        if (this.effectSystem.isActive) {
            this.updateEffects(deltaTime);
        }

        if(this.settingsPanel.visible){
            this.closeModal(this.settingsPanel);
        }
        else{
            this.showModal(this.settingsPanel);
        }
    }

    createCutLine() {
        // 计算划拉线的起点和终点
        const startPoint = this.trail[0];
        const endPoint = this.trail[this.trail.length - 1];

        // 计算划拉线的斜率
        const lineVecX = endPoint.x - startPoint.x;
        const lineVecY = endPoint.y - startPoint.y;
        let slope;

        if (Math.abs(lineVecX) < 0.001) {
            slope = Infinity;
        } else {
            slope = lineVecY / lineVecX;
        }

        // 获取画布的实际显示尺寸（CSS像素）
        const canvasManager = this.engine.getCanvasManager();
        const size = canvasManager.getDisplaySize();
        const displayWidth = size.width;
        const displayHeight = size.height;
        const actualSize = canvasManager.getActualSize();
        const actualWidth = actualSize.width;
        const actualHeight = actualSize.height;

        // 计算中心点（使用CSS像素坐标，确保特效线正确经过中心）
        const centerX = displayWidth / 2;
        const centerY = displayHeight / 2;

        // const centerX = startPoint.x + lineVecX/2;
        // const centerY = startPoint.y + lineVecY/2;

        // 根据斜率创建通过画布中心的切分线
        let cutLine;
        if (slope === Infinity) {
            // 垂直线
            cutLine = {
                start: { x: centerX, y: 0 },
                end: { x: centerX, y: displayHeight }
            };
        } else if (slope === 0) {
            // 水平线
            cutLine = {
                start: { x: 0, y: centerY },
                end: { x: displayWidth, y: centerY }
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
                endX = displayWidth;
                endY = slope * endX + intercept;
            } else {
                // 斜率较大，与上下边界相交
                startY = 0;
                startX = (startY - intercept) / slope;
                endY = displayHeight;
                endX = (endY - intercept) / slope;
            }

            cutLine = {
                start: { x: startX, y: startY },
                end: { x: endX, y: endY }
            };
        }
        this.effectSystem.divisionLine = cutLine;
        this.effectSystem.slope = slope;
        return cutLine;
    }

    performDivision() {
        let cutLine = this.createCutLine();
        this.groupByLine(cutLine);
        this.startCutEffect(cutLine);
        this.doStalksAlgorithm();
    }

    /**
     * 在特效之前执行分组逻辑
     * @param {Object} cutLine - 切分线对象
     */
    groupByLine(cutLine) {

        // console.log("groupByLine",cutLine);
        // 根据切分线划分蓍草
        this.stalks.forEach(stalk => {
            const distance = this.pointToLineSignedDistance(
                stalk.x, stalk.y,
                cutLine.start.x, cutLine.start.y,
                cutLine.end.x, cutLine.end.y
            );
            if (distance > 0) {
                stalk.group = '地';
                // 为地组圆圈设置红色系
                stalk.color = '#FF6347';
            } else {
                stalk.group = '天';
                // 为天组圆圈设置金色系
                stalk.color = '#FFD700';
            }
        });

        // 更新分组数组
        this.leftGroup = this.stalks.filter(stalk => stalk.group === '天');
        this.rightGroup = this.stalks.filter(stalk => stalk.group === '地');

        // 标记为已分割
        this.divided = true;

        // 保存分割结果到缩略图
        this.setThumbnailData(cutLine);

    }

    /**
     * 保存分割结果到缩略图
     * @param {Object} cutLine - 切分线对象
     */
    setThumbnailData(cutLine) {
        // 保存当前的分割数据
        this.thumbnailCanvas.lastDivisionData = {
            cutLine: cutLine,
            stalks: this.stalks.map(stalk => ({
                x: stalk.x,
                y: stalk.y,
                group: stalk.group,
                color: stalk.color
            })),
            timestamp: Date.now()
        };

        // 重新渲染缩略图
        this.renderThumbnail();
    }

    /**
     * 渲染缩略图
     */
    renderThumbnail() {
        if (!this.thumbnailCanvas.ctx || !this.thumbnailCanvas.canvas) {
            return;
        }

        const ctx = this.thumbnailCanvas.ctx;
        const canvas = this.thumbnailCanvas.canvas;
        
        // 清除Canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 绘制背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if(!this.thumbnailCanvas.lastDivisionData){
            this.thumbnailCanvas.lastDivisionData = {
                stalks:this.stalks
            }
        }
        // 如果有分割数据，渲染缩略图
        if (this.thumbnailCanvas.lastDivisionData) {
            const data = this.thumbnailCanvas.lastDivisionData;
            const scale = 0.2; // 缩放比例
            
            // 绘制背景
            ctx.fillStyle = '#333333';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // 绘制分割线
            if (data.cutLine) {
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(
                    data.cutLine.start.x * scale,
                    data.cutLine.start.y * scale
                );
                ctx.lineTo(
                    data.cutLine.end.x * scale,
                    data.cutLine.end.y * scale
                );
                ctx.stroke();
            }

            // 绘制蓍草圆圈
            data.stalks.forEach(stalk => {
                ctx.fillStyle = stalk.color;
                ctx.beginPath();
                ctx.arc(
                    stalk.x * scale,
                    stalk.y * scale,
                    2,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            });

            // 添加标签 - 使用稍大的字体提高可读性
            ctx.fillStyle = '#FFD700';
            ctx.font = 'bold 10px "Microsoft YaHei", sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.fillText('上次分割', 3, 3);
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

    /**
     * 验证法线方向计算
     * @param {Object} cutLine - 切分线对象
     * @returns {Object} 法线方向信息
     */
    validateNormalDirection(cutLine) {
        const lineVecX = cutLine.end.x - cutLine.start.x;
        const lineVecY = cutLine.end.y - cutLine.start.y;
        const lineLength = Math.sqrt(lineVecX * lineVecX + lineVecY * lineVecY);

        // 法线方向（垂直于切分线）
        const normalX = -lineVecY / lineLength;
        const normalY = lineVecX / lineLength;

        // 验证法线方向是否正确（应该与切分线垂直）
        const dotProduct = lineVecX * normalX + lineVecY * normalY;
        const normalLength = Math.sqrt(normalX * normalX + normalY * normalY);

        // console.log('法线方向验证:', {
        //     lineVector: { x: lineVecX, y: lineVecY },
        //     normalVector: { x: normalX, y: normalY },
        //     dotProduct: dotProduct, // 应该接近0
        //     normalLength: normalLength, // 应该接近1
        //     isValid: Math.abs(dotProduct) < 0.001 && Math.abs(normalLength - 1) < 0.001
        // });

        return {
            normalX: normalX,
            normalY: normalY,
            isValid: Math.abs(dotProduct) < 0.001 && Math.abs(normalLength - 1) < 0.001
        };
    }

    calculateYaoValue() {
        // 使用 utils.js 中统一的实现
        return StalksAlgorithm.calculateYaoValue(this.lastresult, (message) => this.addLog(message));
    }

    render(ctx, width, height) {
        super.clearRect(ctx,0,0,width,height,this.backgroundColor);

        // 绘制蓍草（圆点）
        this.drawStalks(ctx);
        // 渲染特效
        this.renderEffects(ctx);

        // 更新进度条Canvas（不再在主画布上绘制进度条）
        this.renderProgressCanvas();

        // 渲染UI元素
        if (this.settingsButton) this.settingsButton.render(ctx);
        if (this.restartButton) this.restartButton.render(ctx);
        if (this.logsButton) this.logsButton.render(ctx);
        if (this.settingsPanel) this.settingsPanel.render(ctx);
        if (this.gameInfoPanel) this.gameInfoPanel.render(ctx);
    }

    drawStalks(ctx) {
        // 绘制所有蓍草
        if (this.showDots && this.stalks) {
            this.stalks.forEach(stalk => {
                if (stalk.visible) {
                    this.drawStalk(ctx, stalk);
                }
            });
        }
        
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
            
            // 使用圆圈自身的颜色
            ctx.fillStyle = stalk.color;
            ctx.fill();

            // 根据圆圈颜色设置边框颜色
            ctx.strokeStyle = stalk.group === '天' ? '#FFA500' : '#8B0000';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
        else {
            // hide all
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
        // ctx.fillText('进度', progressPadding - 10, progressY + 20);

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
            // 当设置面板可见性改变时，重新注册UI元素
            this.registerUIElements();
        }
    }


    showLogs() {
        if (this.sceneManager) {
            this.sceneManager.switchToScene('logs');
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

    /**
     * 场景退出时调用
     */
    onExit() {
        // 隐藏进度条Canvas和缩略图Canvas
        if (this.progressCanvas && this.progressCanvas.container) {
            this.progressCanvas.container.style.display = 'none';
        }
        if (this.thumbnailCanvas && this.thumbnailCanvas.container) {
            this.thumbnailCanvas.container.style.display = 'none';
        }
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
        this.backgroundColor = 'linear-gradient(to bottom, #2E5A3E, #1E4A2E, #153A1E)'
        this.yaos = [];
        this.guaData = null; // 缓存卦象数据
        this.isGuaDataCalculated = false; // 标记是否已计算
    }

    init(yaos = []) {
        // 只有当传入的yaos不为空时才更新，避免覆盖已经传递的数据
        if (yaos && yaos.length > 0) {
            this.yaos = yaos;
        }
        this.createUI();
        this.registerUIElements();
        // 不在这里调用generateResult，让外部控制调用时机
    }

    /**
     * 场景进入时调用
     * @param {Array} lastSceneResult - 上一个场景返回的结果
     */
    onStart(lastSceneResult) {
        // 首先调用父类的onEnter方法，确保场景被正确初始化
        super.onStart();
        
        // 处理从GameScene传递过来的yaos参数
        if (lastSceneResult && Array.isArray(lastSceneResult) && lastSceneResult.length > 0) {
            this.yaos = lastSceneResult;
            console.log('ResultScene接收到yaos参数:', this.yaos);
        }
        
        // 确保进度条Canvas保持隐藏状态
        if (this.engine && this.engine.getCurrentScene && this.engine.getCurrentScene().progressCanvas &&
            this.engine.getCurrentScene().progressCanvas.container) {
            this.engine.getCurrentScene().progressCanvas.container.style.display = 'none';
        }
        
        // 生成占卜结果
        this.generateResult();
        
        // 调试信息：检查GuaDisplay状态
        if (this.guaDisplay) {
            console.log('GuaDisplay状态:', {
                visible: this.guaDisplay.visible,
                originalGuaName: this.guaDisplay.originalGuaName,
                originalGuaSymbol: this.guaDisplay.originalGuaSymbol,
                x: this.guaDisplay.x,
                y: this.guaDisplay.y,
                width: this.guaDisplay.width,
                height: this.guaDisplay.height
            });
        } else {
            console.log('GuaDisplay未初始化');
        }
        
        console.log(`Scene '${this.name}' entered`);
    }


    startNewGame() {
        this.nextScene = 'start';
    }
    

    restartGame() {
        this.state = 'dividing';
        this.divided = false;
        this.yaos = [];

        this.logs = [];
        this.nextScene = 'game';
    }
    createUI() {
        const canvasManager = this.engine.getCanvasManager();
        const size = canvasManager.getDisplaySize();
        const canvasWidth = size.width;
        const canvasHeight = size.height;

        // 创建标题文本块
        this.titleText = new TextBlock(canvasWidth / 2, 50, '占卜结果', {
            fontSize: '2rem',
            fontWeight: 'bold',
            fillColor: '#FFD700',
            textAlign: 'center',
            textBaseline: 'middle'
        });

        // 创建卦象显示组件（增加高度以适应本卦和变卦同时显示）
        this.guaDisplay = new GuaDisplay(
            canvasWidth / 2 - 150,
            80,
            300,
            280
        );

        // 创建重新开始按钮
        this.restartButton = new Button(
            canvasWidth / 2 - 110,
            canvasHeight - 80,
            100,
            40,
            '重新占卜',
            () => this.restartGame()
        );
        this.restartButton.setBackgroundColor('linear-gradient(to bottom, #FFD700, #FFA500)');
        this.restartButton.setTextColor('#8B4513');
        this.restartButton.setFontSize('1.1rem');
        this.restartButton.setFontWeight('bold');

        // 创建新的占卜按钮
        this.newGameButton = new Button(
            canvasWidth / 2 + 10,
            canvasHeight - 80,
            100,
            40,
            '新的占卜',
            () => this.startNewGame()
        );
        this.newGameButton.setBackgroundColor('linear-gradient(to bottom, #FFD700, #FFA500)');
        this.newGameButton.setTextColor('#8B4513');
        this.newGameButton.setFontSize('1.1rem');
        this.newGameButton.setFontWeight('bold');
    }

    registerUIElements() {
        // 注册标题文本
        if (this.titleText) {
            this.registerUIElement(this.titleText);
        }
        
        // 注册卦象显示组件
        if (this.guaDisplay) {
            this.registerUIElement(this.guaDisplay);
        }
        
        // 注册按钮
        this.registerUIElement(this.restartButton);
        this.registerUIElement(this.newGameButton);
    }

    generateResult() {
        // 确保使用传递过来的yaos数组，而不是构造函数中的空数组
        const yaos = this.yaos || [];
        console.log('ResultScene中的yaos数组:', yaos);

        if (yaos.length === 0) {
            console.warn('警告：yaos数组为空，无法计算卦象');
            return;
        }

        // 如果还没有计算过或者yaos数据有变化，才重新计算
        this.guaData = this.calculateGuaFromYaos(yaos);
        // 计算变卦
        const changingYaos = StalksAlgorithm.calculateChangingGua(yaos);
        const changingGuaData = this.calculateGuaFromYaos(changingYaos);
        // 设置卦象数据到GuaDisplay组件（同时传递本卦和变卦数据）
        if (this.guaDisplay) {
            this.guaDisplay.setGuaData(
                this.guaData.name,
                this.guaData.symbol,
                yaos,
                {
                    name: changingGuaData.name,
                    symbol: changingGuaData.symbol,
                    yaos: changingYaos
                }
            );
            this.guaDisplay.setVisible(true);
        }
        // 输出结果到控制台
        // console.log(`本卦：${this.guaData.interpretation}`);
        // console.log(`卦象：${this.guaData.symbolism}`);
        // console.log(`建议：${this.guaData.advice}`);
        // 获取变爻信息
        // const changingYaoIndices = yaos
        //     .map((yao, index) => yao === 9 || yao === 6 ? index + 1 : null)
        //     .filter(yao => yao !== null);
        // if (changingYaoIndices.length > 0 && window.StalksAlgorithm) {
        //     const advice = window.StalksAlgorithm.getChangingYaoAdvice(changingYaoIndices);
        //     console.log(`变爻提示：${advice}`);
        //     console.log(`变卦：${changingGuaData.name} (${changingGuaData.symbol})`);
        // }
    }

    calculateGuaFromYaos(yaos) {
        // 使用 utils.js 中最完整的实现
        return StalksAlgorithm.calculateGuaFromYaos(yaos);
    }

    render(ctx, width, height) {
        super.clearRect(ctx,0,0,width,height,this.backgroundColor);

        // 绘制装饰性蓍草背景
        this.drawDecorativeStalks(ctx, width, height);

        // 渲染标题文本
        if (this.titleText) {
            this.titleText.x = width / 2;
            this.titleText.y = 50;
            this.titleText.render(ctx);
        }

        // 渲染卦象显示组件
        if (this.guaDisplay) {
            this.guaDisplay.render(ctx);
        }

        // 渲染UI元素
        if (this.restartButton) this.restartButton.render(ctx);
        if (this.newGameButton) this.newGameButton.render(ctx);
    }

    /**
     * 绘制装饰性蓍草背景
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     * @param {number} width - 画布宽度
     * @param {number} height - 画布高度
     */
    drawDecorativeStalks(ctx, width, height) {
        // 只在左边三分之一区域绘制装饰
        const leftThirdWidth = width / 2;
        
        const positions = [
            {x: 60, y: 100, angle: 0.2, opacity: 0.4},
            {x: 120, y: 180, angle: 0.4, opacity: 0.35},
            {x: 40, y: 260, angle: 0.1, opacity: 0.45},
            {x: 100, y: 340, angle: 0.3, opacity: 0.4},
            {x: 80, y: 420, angle: 0.5, opacity: 0.38},
            {x: 140, y: 500, angle: 0.2, opacity: 0.42},
            {x: 50, y: 580, angle: 0.4, opacity: 0.4},
            {x: 110, y: 140, angle: -0.2, opacity: 0.37},
            {x: 30, y: 220, angle: -0.3, opacity: 0.43},
            {x: 90, y: 300, angle: -0.1, opacity: 0.39},
            {x: 70, y: 380, angle: -0.4, opacity: 0.41},
            {x: 130, y: 460, angle: -0.2, opacity: 0.36}
        ];
        
        positions.forEach(pos => {
            // 确保位置在左边三分之一区域内
            if (pos.x <= leftThirdWidth) {
                ctx.save();
                ctx.globalAlpha = pos.opacity;
                ctx.translate(pos.x, pos.y);
                ctx.rotate(pos.angle);
                
                // 绘制更大的蓍草
                ctx.strokeStyle = '#8b4513';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(0, -40);
                ctx.lineTo(0, 40);
                ctx.stroke();
                
                // 绘制更大的叶子
                ctx.fillStyle = '#228b22';
                ctx.beginPath();
                ctx.ellipse(-5, -20, 6, 12, -0.3, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.ellipse(5, 20, 4, 10, 0.3, 0, Math.PI * 2);
                ctx.fill();
                
                // 添加额外的叶子装饰
                ctx.beginPath();
                ctx.ellipse(-3, 0, 3, 6, 0.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.ellipse(3, 0, 3, 6, -0.5, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.restore();
            }
        });
        
        // 在左边三分之一区域绘制较大的圆形装饰
        for (let i = 0; i < 8; i++) {
            const x = 50 + (i % 3) * 80;
            const y = 150 + Math.floor(i / 3) * 120;
            const radius = 25 + Math.sin(i) * 10;
            
            if (x <= leftThirdWidth) {
                ctx.save();
                ctx.globalAlpha = 0.12;
                ctx.strokeStyle = '#8b4513';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
            }
        }

        // 在左边三分之一区域绘制较大的八卦符号装饰
        const symbols = ['☯'];
        symbols.forEach((symbol, index) => {
            const x = 60 + (index % 2) * 200;
            const y = 120 + Math.floor(index / 2) * 200;
            
            if (x <= leftThirdWidth) {
                ctx.save();
                ctx.globalAlpha = 0.2;
                ctx.fillStyle = '#d9d9d937';
                ctx.font = '600px serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(symbol, x, y);
                ctx.restore();
            }
        });
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
        this.registerUIElements();
    }

    createUI() {
        const canvasManager = this.engine.getCanvasManager();
        const size = canvasManager.getDisplaySize();
        const canvasWidth = size.width;
        const canvasHeight = size.height;

        // 创建标题文本块
        this.titleText = new TextBlock(canvasWidth / 2, 50, '占卜日志', {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            fillColor: '#FFD700',
            textAlign: 'center',
            textBaseline: 'middle'
        });

        // 创建清空日志按钮
        this.clearButton = new Button(
            canvasWidth / 2 - 110,
            canvasHeight - 100,
            100,
            40,
            '清空日志',
            () => this.clearLogs()
        );

        // 创建返回按钮
        this.backButton = new Button(
            canvasWidth / 2 + 10,
            canvasHeight - 100,
            100,
            40,
            '返回游戏',
            () => this.backToGame()
        );
    }

    registerUIElements() {
        // 注册标题文本
        if (this.titleText) {
            this.registerUIElement(this.titleText);
        }
        
        // 注册按钮
        this.registerUIElement(this.clearButton);
        this.registerUIElement(this.backButton);
    }

    render(ctx, width, height) {
        // 绘制背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, width, height);

        // 渲染标题文本
        if (this.titleText) {
            this.titleText.x = width / 2;
            this.titleText.y = 50;
            this.titleText.render(ctx);
        }

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
