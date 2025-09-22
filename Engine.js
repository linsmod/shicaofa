/**
 * 蓍草占卜游戏引擎
 * 提供场景管理、渲染管线和游戏循环的核心功能
 */
class GameEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.sceneManager = null;
        this.renderer = null;
        this.isRunning = false;
        this.lastTime = 0;
        this.fps = 60;
        this.frameInterval = 1000 / this.fps;
    }

    /**
     * 初始化游戏引擎
     * @param {string} canvasId - Canvas元素ID
     */
    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            throw new Error(`Canvas element with id '${canvasId}' not found`);
        }

        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            throw new Error('Failed to get 2D context');
        }

        // 初始化场景管理器
        this.sceneManager = new SceneManager(this);
        
        // 初始化渲染器
        this.renderer = new Renderer(this.canvas, this.ctx);
        
        // 设置Canvas尺寸
        this.resizeCanvas();
        
        // 监听窗口大小变化
        window.addEventListener('resize', () => this.resizeCanvas());
        
        console.log('Game Engine initialized successfully');
    }

    /**
     * 调整Canvas尺寸
     */
    resizeCanvas() {
        if (!this.canvas) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        const displayWidth = rect.width;
        const displayHeight = rect.height;

        // 设置Canvas CSS尺寸
        this.canvas.style.width = displayWidth + 'px';
        this.canvas.style.height = displayHeight + 'px';

        // 设置Canvas实际尺寸（考虑设备像素比）
        this.canvas.width = displayWidth * dpr;
        this.canvas.height = displayHeight * dpr;

        // 重置变换矩阵
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);

        // 清除画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 缩放上下文以匹配像素比
        this.ctx.scale(dpr, dpr);

        // 确保绘制坐标位于像素中心，避免模糊
        this.ctx.translate(0.5, 0.5);

        // 设置图像平滑质量
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';

        // 通知场景管理器Canvas尺寸已改变
        if (this.sceneManager) {
            this.sceneManager.onCanvasResize(displayWidth, displayHeight);
        }
    }

    /**
     * 启动游戏引擎
     */
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.lastTime = performance.now();
        this.gameLoop();
        
        console.log('Game Engine started');
    }

    /**
     * 停止游戏引擎
     */
    stop() {
        this.isRunning = false;
        console.log('Game Engine stopped');
    }

    /**
     * 游戏主循环
     */
    gameLoop() {
        if (!this.isRunning) return;

        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;

        if (deltaTime >= this.frameInterval) {
            // 更新游戏状态
            this.update(deltaTime);
            
            // 渲染游戏
            this.render();
            
            this.lastTime = currentTime;
        }

        requestAnimationFrame(() => this.gameLoop());
    }

    /**
     * 更新游戏状态
     * @param {number} deltaTime - 距离上一帧的时间（毫秒）
     */
    update(deltaTime) {
        if (this.sceneManager) {
            this.sceneManager.update(deltaTime);
        }
    }

    /**
     * 渲染游戏
     */
    render() {
        if (this.renderer && this.sceneManager) {
            this.renderer.render(this.sceneManager.getCurrentScene());
        }
    }

    /**
     * 获取Canvas上下文
     * @returns {CanvasRenderingContext2D}
     */
    getContext() {
        return this.ctx;
    }

    /**
     * 获取Canvas元素
     * @returns {HTMLCanvasElement}
     */
    getCanvas() {
        return this.canvas;
    }
}

/**
 * 场景管理器
 */
class SceneManager {
    constructor(engine) {
        this.engine = engine;
        this.scenes = new Map();
        this.currentSceneName = null;
        this.canvasWidth = 0;
        this.canvasHeight = 0;
    }

    /**
     * 注册场景
     * @param {string} name - 场景名称
     * @param {Scene} scene - 场景实例
     */
    registerScene(name, scene) {
        this.scenes.set(name, scene);
        scene.setSceneManager(this);
        scene.setEngine(this.engine);
        console.log(`Scene '${name}' registered`);
    }

    /**
     * 切换到指定场景
     * @param {string} name - 场景名称
     */
    switchToScene(name) {
        if (!this.scenes.has(name)) {
            throw new Error(`Scene '${name}' not found`);
        }

        // 退出当前场景
        if (this.currentSceneName && this.scenes.has(this.currentSceneName)) {
            const currentScene = this.scenes.get(this.currentSceneName);
            currentScene.onExit();
        }

        // 切换到新场景
        this.currentSceneName = name;
        const newScene = this.scenes.get(name);
        newScene.onEnter();
        
        console.log(`Switched to scene '${name}'`);
    }

    /**
     * 获取当前场景
     * @returns {Scene}
     */
    getCurrentScene() {
        return this.currentSceneName ? this.scenes.get(this.currentSceneName) : null;
    }

    /**
     * 获取场景名称
     * @returns {string}
     */
    getCurrentSceneName() {
        return this.currentSceneName;
    }

    /**
     * Canvas尺寸改变时的处理
     * @param {number} width - Canvas宽度
     * @param {number} height - Canvas高度
     */
    onCanvasResize(width, height) {
        this.canvasWidth = width;
        this.canvasHeight = height;
        
        // 通知当前场景Canvas尺寸已改变
        if (this.currentSceneName && this.scenes.has(this.currentSceneName)) {
            const currentScene = this.scenes.get(this.currentSceneName);
            currentScene.onCanvasResize(width, height);
        }
    }

    /**
     * 更新所有场景
     * @param {number} deltaTime - 距离上一帧的时间（毫秒）
     */
    update(deltaTime) {
        if (this.currentSceneName && this.scenes.has(this.currentSceneName)) {
            const currentScene = this.scenes.get(this.currentSceneName);
            currentScene.update(deltaTime);
        }
    }
}

/**
 * 渲染器
 */
class Renderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.uiElements = [];
    }

    /**
     * 渲染场景
     * @param {Scene} scene - 要渲染的场景
     */
    render(scene) {
        if (!scene) return;

        // 清除画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 渲染场景背景
        this.renderBackground(scene);

        // 渲染场景内容
        scene.render(this.ctx, this.canvas.width, this.canvas.height);

        // 渲染UI元素
        this.renderUI();
    }

    /**
     * 渲染背景
     * @param {Scene} scene - 场景
     */
    renderBackground(scene) {
        const backgroundColor = scene.getBackgroundColor();
        if (backgroundColor) {
            this.ctx.fillStyle = backgroundColor;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    /**
     * 渲染UI元素
     */
    renderUI() {
        this.uiElements.forEach(uiElement => {
            if (uiElement.visible) {
                uiElement.render(this.ctx);
            }
        });
    }

    /**
     * 添加UI元素
     * @param {UIElement} element - UI元素
     */
    addUIElement(element) {
        this.uiElements.push(element);
    }

    /**
     * 移除UI元素
     * @param {UIElement} element - UI元素
     */
    removeUIElement(element) {
        const index = this.uiElements.indexOf(element);
        if (index > -1) {
            this.uiElements.splice(index, 1);
        }
    }

    /**
     * 清除所有UI元素
     */
    clearUIElements() {
        this.uiElements = [];
    }
}

/**
 * 场景基类
 */
class Scene {
    constructor(name) {
        this.name = name;
        this.sceneManager = null;
        this.engine = null;
        this.backgroundColor = '#228B22';
        this.isInitialized = false;
        this.uiElements = []; // 存储所有UI元素
    }

    /**
     * 设置场景管理器
     * @param {SceneManager} manager - 场景管理器
     */
    setSceneManager(manager) {
        this.sceneManager = manager;
    }

    /**
     * 设置游戏引擎
     * @param {GameEngine} engine - 游戏引擎
     */
    setEngine(engine) {
        this.engine = engine;
    }

    /**
     * 场景进入时调用
     */
    onEnter() {
        if (!this.isInitialized) {
            this.init();
            this.isInitialized = true;
        }
        console.log(`Scene '${this.name}' entered`);
    }

    /**
     * 场景退出时调用
     */
    onExit() {
        console.log(`Scene '${this.name}' exited`);
    }

    /**
     * Canvas尺寸改变时调用
     * @param {number} width - Canvas宽度
     * @param {number} height - Canvas高度
     */
    onCanvasResize(width, height) {
        console.log(`Scene '${this.name}' canvas resized to ${width}x${height}`);
    }

    /**
     * 更新场景
     * @param {number} deltaTime - 距离上一帧的时间（毫秒）
     */
    update(deltaTime) {
        // 子类实现具体的更新逻辑
    }

    /**
     * 渲染场景
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     * @param {number} width - Canvas宽度
     * @param {number} height - Canvas高度
     */
    render(ctx, width, height) {
        // 子类实现具体的渲染逻辑
    }

    /**
     * 获取背景颜色
     * @returns {string}
     */
    getBackgroundColor() {
        return this.backgroundColor;
    }

    /**
     * 初始化场景
     */
    init() {
        // 子类实现具体的初始化逻辑
    }

    /**
     * 注册UI元素
     * @param {UIElement} element - UI元素
     */
    registerUIElement(element) {
        if (!this.uiElements.includes(element)) {
            this.uiElements.push(element);
        }
    }

    /**
     * 注销UI元素
     * @param {UIElement} element - UI元素
     */
    unregisterUIElement(element) {
        const index = this.uiElements.indexOf(element);
        if (index > -1) {
            this.uiElements.splice(index, 1);
        }
    }

    /**
     * 获取所有UI元素
     * @returns {Array} UI元素数组
     */
    getUIElements() {
        return this.uiElements;
    }

    /**
     * 统一的事件处理方法
     * @param {string} eventType - 事件类型
     * @param {Event} e - 事件对象
     */
    handleEvent(eventType, e) {
        const rect = this.engine.getCanvas().getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // 从后往前遍历，确保上层元素优先处理
        for (let i = this.uiElements.length - 1; i >= 0; i--) {
            const element = this.uiElements[i];
            if (element.visible && element.enabled && element.isPointInside(x, y)) {
                switch (eventType) {
                    case 'mousedown':
                        if (element.handleMouseDown) {
                            element.handleMouseDown(x, y);
                        }
                        break;
                    case 'mouseup':
                        if (element.handleMouseUp) {
                            element.handleMouseUp(x, y);
                        }
                        break;
                    case 'mousemove':
                        if (element.handleMouseMove) {
                            element.handleMouseMove(x, y);
                        }
                        break;
                    case 'click':
                        if (element.onClick) {
                            element.onClick();
                        }
                        break;
                }
                return true; // 事件已被处理
            }
        }
        return false; // 事件未被处理
    }
}

/**
 * UI元素基类
 */
class UIElement {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.visible = true;
        this.enabled = true;
    }

    /**
     * 渲染UI元素
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     */
    render(ctx) {
        // 子类实现具体的渲染逻辑
    }

    /**
     * 检查点击是否在UI元素范围内
     * @param {number} x - 点击X坐标
     * @param {number} y - 点击Y坐标
     * @returns {boolean}
     */
    isPointInside(x, y) {
        return x >= this.x && x <= this.x + this.width &&
               y >= this.y && y <= this.y + this.height;
    }

    /**
     * 设置UI元素可见性
     * @param {boolean} visible - 是否可见
     */
    setVisible(visible) {
        this.visible = visible;
    }

    /**
     * 设置UI元素可用性
     * @param {boolean} enabled - 是否可用
     */
    setEnabled(enabled) {
        this.enabled = enabled;
    }
}

// 导出类到全局作用域
if (typeof window !== 'undefined') {
    window.GameEngine = GameEngine;
    window.SceneManager = SceneManager;
    window.Renderer = Renderer;
    window.Scene = Scene;
    window.UIElement = UIElement;
}