/**
 * 蓍草占卜游戏引擎
 * 提供场景管理、渲染管线和游戏循环的核心功能
 */
class GameEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.canvasManager = null;
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

        // 初始化Canvas管理器
        this.canvasManager = new CanvasManager();
        if (!this.canvasManager.init(this.canvas, {
            enableHighQuality: true,
            enablePixelAlignment: true,
            enableImageSmoothing: true,
            imageSmoothingQuality: 'high',
            backgroundColor: '#228B22'
        })) {
            throw new Error('Failed to initialize CanvasManager');
        }

        this.ctx = this.canvasManager.getContext();
        if (!this.ctx) {
            throw new Error('Failed to get 2D context');
        }

        // 设置尺寸变化回调
        this.canvasManager.setResizeCallback((width, height) => {
            if (this.sceneManager) {
                this.sceneManager.onCanvasResize(width, height);
            }
        });

        // 初始化场景管理器
        this.sceneManager = new SceneManager(this);
        
        // 初始化渲染器
        this.renderer = new Renderer(this.canvas, this.ctx);
        
        // 初始化鼠标事件
        this.initMouseEvents();
        
        console.log('Game Engine initialized successfully');
    }

    /**
     * 调整Canvas尺寸
     */
    resizeCanvas() {
        if (!this.canvasManager) return;
        
        // 使用CanvasManager处理尺寸变化
        this.canvasManager.handleResize();
        
        // 获取更新后的尺寸
        const { width, height } = this.canvasManager.getDisplaySize();
        
        // 通知场景管理器Canvas尺寸已改变
        if (this.sceneManager) {
            this.sceneManager.onCanvasResize(width, height);
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
            // 处理输入事件
            this.processInputEvents();
            
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
     * 处理输入事件
     */
    processInputEvents() {
        if (!this.sceneManager) return;
        
        const currentScene = this.sceneManager.getCurrentScene();
        if (!currentScene) return;

        if(this.keyState){
            if(this.keyState.keydown){ // the event obj
                currentScene.handleKeyDown(this.keyState.keydown);
                this.keyState.keydown = null;
            }
            if(this.keyState.keyup){ // the event obj
                currentScene.handleKeyUp(this.keyState.keyup);
                this.keyState.keyup = null;
            }
        }
        // 处理鼠标事件
        if (this.mouseState) {
            if (this.mouseState.isPressed) {
                currentScene.handleMouseDown(this.mouseState.x, this.mouseState.y);
                this.mouseState.isPressed = false;
            }
            if (this.mouseState.isReleased) {
                currentScene.handleMouseUp(this.mouseState.x, this.mouseState.y);
                this.mouseState.isReleased = false;
            }
            if (this.mouseState.moved) {
                currentScene.handleMouseMove(this.mouseState.x, this.mouseState.y);
                this.mouseState.moved = false;
            }
        }
    }

    /**
     * 初始化鼠标事件监听
     */
    initMouseEvents() {
        if (!this.canvas) return;
        
        this.mouseState = {
            x: 0,
            y: 0,
            pressX: 0,  // 记录按下时的X坐标
            pressY: 0,  // 记录按下时的Y坐标
            isPressed: false,
            isReleased: false,
            moved: false,
        };
        this.keyState={
            keydown:null,
            keyup:null,
        }

        window.addEventListener('keydown', (e) => {
            this.keyState.keydown = e;
        });

         window.addEventListener('keyup', (e) => {
            this.keyState.keyup = e;
        });

        // 鼠标移动事件
        window.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseState.x = e.clientX - rect.left;
            this.mouseState.y = e.clientY - rect.top;
            this.mouseState.moved = true;
        });

        // 鼠标按下事件
        this.canvas.addEventListener('mousedown', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseState.pressX = e.clientX - rect.left;
            this.mouseState.pressY = e.clientY - rect.top;
            this.mouseState.x = e.clientX - rect.left;
            this.mouseState.y = e.clientY - rect.top;
            this.mouseState.isPressed = true;
        });

        // 鼠标释放事件
        window.addEventListener('mouseup', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseState.x = e.clientX - rect.left;
            this.mouseState.y = e.clientY - rect.top;
            this.mouseState.isReleased = true;
        });
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

    /**
     * 获取Canvas管理器
     * @returns {CanvasManager}
     */
    getCanvasManager() {
        return this.canvasManager;
    }
}

/**
 * 场景管理器
 */
class SceneManager {
    constructor(engine) {
        this.engine = engine;
        this.dialog = null;
        this.scenes = new Map();
        this.currentSceneName = null;
        this.canvasWidth = 0;
        this.canvasHeight = 0;
    }

    setDialog(dialog){
        this.dialog = dialog;
    }
    closeDialog(dialog){
        if(this.dialog == dialog){
            this.dialog = null;
        }
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

        var lastSceneResult = null;

        // 退出当前场景
        if (this.currentSceneName && this.scenes.has(this.currentSceneName)) {
            const currentScene = this.scenes.get(this.currentSceneName);
            lastSceneResult = currentScene.onExit();
        }

        // 切换到新场景
        this.currentSceneName = name;
        const newScene = this.scenes.get(name);
        newScene.onEnter(lastSceneResult);
        
        console.log(`Switched to scene '${name}'`);
    }

    /**
     * 获取当前场景
     * @returns {Scene}
     */
    getCurrentScene() {
        if(this.dialog)
            return this.dialog;
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

            if(currentScene.nextScene!=null){
                this.switchToScene(currentScene.nextScene);
            }
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

        // 获取CSS显示尺寸（用于场景渲染）
        const rect = this.canvas.getBoundingClientRect();
        const displayWidth = rect.width;
        const displayHeight = rect.height;

        // 渲染场景内容（使用CSS显示尺寸，而不是像素尺寸）
        scene.render(this.ctx, displayWidth, displayHeight);

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
 * 事件处理基类
 */
class EventHandler {
    constructor() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.isMouseDown = false;
        this.isMouseUp = true;
        this.hoveredElements = new Set();
        this.pressedElements = new Set();
        this.uiElements = [];
    }

    /**
     * 处理鼠标按下
     */
    handleMouseDown(x, y) {
        this.isMouseDown = true;
        this.isMouseUp = false;
        this.mouseX = x;
        this.mouseY = y;
        
        // 从后往前遍历，找到最上层的元素
        for (let i = this.uiElements.length - 1; i >= 0; i--) {
            const element = this.uiElements[i];
            if (element.visible && element.enabled && element.isPointInside(x, y)) {
                if (element.handleMouseDown) {
                    element.handleMouseDown(x, y);
                }
                this.pressedElements.add(element);
                break;
            }
        }
    }

    /**
     * 处理鼠标释放
     */
    handleMouseUp(x, y) {
        this.isMouseDown = false;
        this.isMouseUp = true;
        this.mouseX = x;
        this.mouseY = y;
        
        // 处理所有被按下的元素
        this.pressedElements.forEach(element => {
            if (element.visible && element.enabled && element.isPointInside(x, y)) {
                if (element.handleMouseUp) {
                    element.handleMouseUp(x, y);
                }
            }
        });
        this.pressedElements.clear();
    }

    /**
     * 处理鼠标移动
     */
    handleMouseMove(x, y) {
        const prevX = this.mouseX;
        const prevY = this.mouseY;
        this.mouseX = x;
        this.mouseY = y;
        
        // 检查悬停状态变化
        const newHoveredElements = new Set();
        
        for (let i = this.uiElements.length - 1; i >= 0; i--) {
            const element = this.uiElements[i];
            if (element.visible && element.enabled) {
                const isInside = element.isPointInside(x, y);
                
                if (isInside) {
                    newHoveredElements.add(element);
                    
                    // 如果是新悬停的元素
                    if (!this.hoveredElements.has(element)) {
                        if (element.handleMouseEnter) {
                            element.handleMouseEnter(x, y);
                        }
                    }
                    
                    // 处理鼠标移动
                    if (element.handleMouseMove) {
                        element.handleMouseMove(x, y);
                    }
                } else {
                    // 如果是离开的元素
                    if (this.hoveredElements.has(element)) {
                        if (element.handleMouseLeave) {
                            element.handleMouseLeave();
                        }
                    }
                }
            }
        }
        
        this.hoveredElements = newHoveredElements;
    }

    /**
     * 处理点击
     */
    handleClick(x, y) {
        for (let i = this.uiElements.length - 1; i >= 0; i--) {
            const element = this.uiElements[i];
            if (element.visible && element.enabled && element.isPointInside(x, y)) {
                if (element.handleClick) {
                    element.handleClick(x, y);
                }
                break;
            }
        }
    }
    handleKeyDown(e){
        
    }

    handleKeyUp(e){
        
    }

    /**
     * 检查是否构成点击事件（按下和释放在同一位置）
     * @param {number} pressX - 按下时的X坐标
     * @param {number} pressY - 按下时的Y坐标
     * @param {number} releaseX - 释放时的X坐标
     * @param {number} releaseY - 释放时的Y坐标
     * @param {number} threshold - 点击阈值距离
     * @returns {boolean}
     */
    isClick(pressX, pressY, releaseX, releaseY, threshold = 5) {
        const distance = Math.sqrt((pressX - releaseX) ** 2 + (pressY - releaseY) ** 2);
        return distance <= threshold;
    }

    /**
     * 更新事件处理器
     */
    update(deltaTime) {
        // 可以在这里添加事件处理器的更新逻辑
    }
}

/**
 * 场景基类
 */
class Scene extends EventHandler {
    constructor(name) {
        super();
        this.name = name;
        this.sceneManager = null;
        this.engine = null;
        this.backgroundColor = '#228B22';
        this.isInitialized = false;
        this.uiElements = []; // 存储所有UI元素
        this.nextScene = null;
    }

     setNext(next) {
        this.nextScene = next;
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
        // 更新事件处理器
        super.update(deltaTime);
        
        // 更新UI元素
        this.updateUIElements(deltaTime);
        
        // 子类实现具体的更新逻辑
    }

    /**
     * 更新UI元素
     */
    updateUIElements(deltaTime) {
        // 可以在这里添加UI元素的通用更新逻辑
        this.uiElements.forEach(element => {
            if (element.visible && element.update) {
                element.update(deltaTime);
            }
        });
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
        this.isHovered = false;
        this.isPressed = false;
        this.backgroundColor = '';
    }
    getBackgroundColor(){
        return this.backgroundColor;
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
     * 处理鼠标按下 - 子类可重写
     */
    handleMouseDown(x, y) {
        this.isPressed = true;
    }

    /**
     * 处理鼠标释放 - 子类可重写
     */
    handleMouseUp(x, y) {
        this.isPressed = false;
    }

    /**
     * 处理鼠标移动 - 子类可重写
     */
    handleMouseMove(x, y) {
        // 子类实现具体的鼠标移动逻辑
    }

    /**
     * 处理鼠标进入 - 子类可重写
     */
    handleMouseEnter(x, y) {
        this.isHovered = true;
    }

    /**
     * 处理鼠标离开 - 子类可重写
     */
    handleMouseLeave() {
        this.isHovered = false;
        this.isPressed = false;
    }

    /**
     * 处理点击 - 子类可重写
     */
    handleClick(x, y) {
        // 子类实现具体的点击逻辑
    }

    
    handleKeyDown(e){
        
    }

    handleKeyUp(e){
        
    }

    /**
     * 更新 - 子类可重写
     */
    update(deltaTime) {
        // 子类实现具体的更新逻辑
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