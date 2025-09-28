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
            // backgroundColor: '#228B22'
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

        this.eventSystem = new UIEventSystem();
        
        // 初始化鼠标事件
        this.initMouseEvents();
        
        // console.log('Game Engine initialized successfully');
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
        
        // console.log('Game Engine started');
    }

    /**
     * 停止游戏引擎
     */
    stop() {
        this.isRunning = false;
        // console.log('Game Engine stopped');
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
                if(this.eventSystem.processMouseDown(currentScene,this.mouseState.x, this.mouseState.y)){
                    this.capturedScene = currentScene;
                }
                else{
                    this.capturedScene = null;
                }
                this.mouseState.isPressed = false;
            }
            if (this.mouseState.isReleased) {
                if(currentScene==this.capturedScene){
                    this.eventSystem.processMouseUp(currentScene, this.mouseState.x, this.mouseState.y)
                }
                this.capturedScene = null; // clear captured state when scene switched
                this.mouseState.isReleased = false;
            }
            if (this.mouseState.moved) {
                if(currentScene==this.capturedScene){
                    this.eventSystem.processMouseMove(currentScene, this.mouseState.x, this.mouseState.y)
                }
                this.mouseState.moved = false;
            }
        }
    }

    /**
     * 初始化鼠标和触摸事件监听
     * @deprecated 建议重命名为 initInputEvents 以更好地反映其功能
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
        this.windowState={
            rect:null,
        }
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

        // 触摸开始事件
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault(); // 防止页面滚动
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            this.mouseState.pressX = touch.clientX - rect.left;
            this.mouseState.pressY = touch.clientY - rect.top;
            this.mouseState.x = touch.clientX - rect.left;
            this.mouseState.y = touch.clientY - rect.top;
            this.mouseState.isPressed = true;
        });

        // 触摸移动事件
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault(); // 防止页面滚动
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            this.mouseState.x = touch.clientX - rect.left;
            this.mouseState.y = touch.clientY - rect.top;
            this.mouseState.moved = true;
        });

        // 触摸结束事件
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault(); // 防止页面滚动
            const rect = this.canvas.getBoundingClientRect();
            this.mouseState.x = this.mouseState.x; // 保持最后的位置
            this.mouseState.y = this.mouseState.y;
            this.mouseState.isReleased = true;
        });

        window.addEventListener('resize',e=>{
            debugger;
             const rect = this.canvas.getBoundingClientRect();
             this.windowState.rect = rect;
             this.windowState.sizeChanged = true;
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
        if (this.sceneManager) {
            const rect = this.canvas.getBoundingClientRect();
            this.sceneManager.getCurrentScene().render(this.ctx,rect.width,rect.height);
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

        var lastSceneResult = null;

        // 退出当前场景
        if (this.currentSceneName && this.scenes.has(this.currentSceneName)) {
            const currentScene = this.scenes.get(this.currentSceneName);
            lastSceneResult = currentScene.sceneResult;
            currentScene.sceneResult = null;
            currentScene.onExit();
        }

        // 切换到新场景
        this.currentSceneName = name;
        const newScene = this.scenes.get(name);
        newScene.onStart(lastSceneResult);
        
        // console.log(`Switched to scene '${name}'`);
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
                let next = currentScene.nextScene;
                currentScene.nextScene = null;
                this.switchToScene(next);
            }
        }
    }
}
class UIEventSystem {
    constructor() {
        this.capturedObject = null;        // 当前捕获的对象（用于 MouseUp）
        this.pressedObject = null;         // 鼠标按下时的对象
        this.draggingObject = null;        // 正在拖拽的对象
        this.hoveredObject = null;         // 悬停的对象
        this.pressX = 0;                   // 记录按下时的坐标，用于拖拽判断
        this.pressY = 0;
        this.dragThreshold = 5;            // 拖拽触发的最小位移（像素）
        this.dialogObject = null;
    }

    /**
     * 处理鼠标按下事件
     */
    processMouseDown(layer, x, y) {
        const hitObject = this.elementAt(layer, x, y);
        console.log('MouseDown hit',hitObject);
        if (hitObject) {
            // 记录按下位置，用于后续拖拽判断
            this.pressX = x;
            this.pressY = y;

            // 设置状态
            this.capturedObject = hitObject;
            this.pressedObject = hitObject;
            this.hoveredObject = hitObject;

            // 标记为按下状态
            hitObject.isPressed = true;
            hitObject.isHovered = true;

            // 如果可拖拽，暂不立即开始拖拽，等待 move 判断是否超过阈值
            if (hitObject.draggable) {
                // 不立即设置 draggingObject，等 mousemove 判断
            }

            // 触发回调
            if (hitObject.onMouseDown) {
                hitObject.onMouseDown(x, y);
            }

            return true; // 事件已处理
        }
        return false;
    }

    /**
     * 处理鼠标移动 - 根据捕获状态分发
     */
    processMouseMove(layer, x, y) {
        // 优先处理拖拽
        if (this.draggingObject) {
            console.log('MouseMove onDrag',this.draggingObject);
            this.draggingObject.onDrag(x, y);
            return;
        }

        // 处理按压状态：判断是否开始拖拽
        if (this.pressedObject && this.pressedObject.onDragStart) {
            const dx = x - this.pressX;
            const dy = y - this.pressY;
            const distanceSquared = dx * dx + dy * dy;

            if (distanceSquared >= this.dragThreshold * this.dragThreshold) {
                // 开始拖拽
                this.draggingObject = this.pressedObject;
                if (this.pressedObject.onDragStart) {
                    this.pressedObject.isDragging = true;
                    this.pressedObject.onDragStart(this.pressX, this.pressY); // 使用按下点
                }
                return;
            }
        }

        // 处理悬停（仅在无拖拽时）
        const newHovered = this.elementAt(layer, x, y); // 注意：你需要传 layer 进来，或保存引用

        if (newHovered !== this.hoveredObject) {
            
            // 退出旧悬停对象
            if (this.hoveredObject) {
                if (this.hoveredObject.onMouseLeave) {
                    this.hoveredObject.onMouseLeave();
                }
                this.hoveredObject.isHovered = false;
            }

            // 进入新悬停对象
            if (newHovered) {
                newHovered.isHovered = true; 
                if (newHovered.onMouseEnter) {
                    newHovered.onMouseEnter(x, y);
                }
            }

            this.hoveredObject = newHovered;
            console.log('MouseMove newHovered',newHovered);
        }

        // 触发当前悬停对象的移动事件
        if (this.hoveredObject) {
            console.log('MouseMove ',this.hoveredObject);
            if(this.hoveredObject.onMouseMove){
            this.hoveredObject.onMouseMove(x, y);
            }
        }
    }

    /**
     * 处理鼠标释放 - 释放所有状态
     */
    processMouseUp(layer, x, y) {
        // 1. 结束拖拽
        if (this.draggingObject) {
            if (this.draggingObject.onDragEnd) {
                console.log('MouseUp endDrag',this.draggingObject);
                this.draggingObject.isDragging = false;
                this.draggingObject.onDragEnd(x, y);
            }
            this.draggingObject = null;
        }

        // 2. 处理点击或释放
        const wasPressed = this.pressedObject;
        if (wasPressed) {
            // 恢复按下状态
            wasPressed.isPressed = false;

            // 触发 MouseUp
            if (wasPressed.onMouseUp) {
                wasPressed.onMouseUp(x, y);
            }

            // 只有在没有拖拽的情况下，并且释放位置仍在对象上，才触发点击
            if (!this.draggingObject) {
                const currentHover = this.elementAt(layer, x, y); // 同样需要 layer
                if (currentHover === wasPressed && wasPressed.onClick) {
                    console.log('MouseUp onClick',wasPressed);
                    wasPressed.onClick(x, y);
                }
            }

            this.pressedObject = null;
        }

        // 3. 清除捕获
        this.capturedObject = null;
    }

    /**
     * 射线检测：查找在给定坐标处最顶层的可交互对象
     */
    elementAt(layer, x, y) {
        if(layer.dialogs){
            for (let i = layer.dialogs.length - 1; i >= 0; i--) {
                const obj = layer.dialogs[i];
                if(this.interactable(obj)){
                    if(obj.children && obj.children.length)
                        return this.elementAt(obj,x,y);
                    else if (this.hitTest(obj, x, y)){
                        return obj;
                    }
                }
            }
        }

        // 从上层向下遍历（渲染顺序逆序）
        for (let i = layer.children.length - 1; i >= 0; i--) {
            const obj = layer.children[i];
            if(this.interactable(obj)){
                if(obj.children && obj.children.length)
                    return this.elementAt(obj,x,y);
                else if (this.hitTest(obj, x, y)){
                        return obj;
                }
            }
        }
        return layer;
    }

    /**
     * 矩形碰撞检测
     */
    hitTest(obj, x, y) {
        return x >= obj.x &&
               x <= obj.x + obj.width &&
               y >= obj.y &&
               y <= obj.y + obj.height;
    }

    /**
     * 判断对象是否可交互
     */
    interactable(obj) {
        return obj.visible !== false && obj.enabled !== false;
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
        this.children = [];
        this.children = [];
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
     * 处理鼠标按下 - 子类可重写
     */
    handleMouseDown(x, y) {
    }

    /**
     * 处理鼠标释放 - 子类可重写
     */
    handleMouseUp(x, y) {
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
    onClick(x, y) {
    }

    
    handleKeyDown(e){
        
    }

    handleKeyUp(e){
        
    }

    update(deltaTime) {
       this.children.forEach(element => {
            if (element.visible && element.update) {
                element.update(deltaTime);
            }
        });
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

/**
 * 场景基类
 */
class Scene extends UIElement {
    constructor(name) {
        super(0,0,);
        this.name = name;
        this.sceneManager = null;
        this.engine = null;
        this.backgroundColorBase = '#228B22'
        this.backgroundColor = '#33333355';
        // this.backgroundColor = "linear-gradient(to bottom, #2E8B57, #333333)"
        this.isInitialized = false;
        this.children = []; // 存储所有UI元素
        this.dialogs = [];
        this.nextScene = null;
    }

    /**
     * 显示模态弹窗
     */
    showModal(element) {
        if(!element)
            throw Error();
        this.dialogs.push(element);
    }

    /**
     * 关闭模态弹窗
     */
    closeModal(element) {
        const index = this.dialogs.indexOf(element);
        if (index > -1) {
            this.dialogs.splice(index, 1);
        }
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
    onStart() {
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
        if (!this.children.includes(element)) {
            this.children.push(element);
        }
    }

    /**
     * 注销UI元素
     * @param {UIElement} element - UI元素
     */
    unregisterUIElement(element) {
        const index = this.children.indexOf(element);
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }
    clearRect(ctx, x, y, w, h, c){
        if (c.startsWith('linear-gradient')) {
            // 解析渐变字符串中的颜色值 - 支持多色渐变
            const colors = [];
            
            // 简单的解析：找到所有十六进制颜色值
            const colorMatches = c.match(/#([0-9a-fA-F]{8}|[0-9a-fA-F]{6})/g);
            if (colorMatches && colorMatches.length >= 2) {
                colors.push(...colorMatches);
            } else {
                console.warn('渐变解析失败: 需要至少2个颜色值', {
                    original: c,
                    colorMatches: colorMatches,
                    fallback: ['#2E8B57', '#228B22']
                });
                // 使用默认渐变
                colors.push('#2E8B57', '#228B22');
            }
            
            // 创建从上到下的渐变
            const gradient = ctx.createLinearGradient(x, y, x, y + h);
            
            // 均匀分布颜色
            for (let i = 0; i < colors.length; i++) {
                gradient.addColorStop(i / (colors.length - 1), colors[i].trim());
            }
            
            ctx.fillStyle = gradient;
        } else {
            // 使用纯色
            ctx.fillStyle = c;
        }
        
        // 填充整个区域
        ctx.fillRect(x, y, w, h);
    }
}

// 导出类到全局作用域
if (typeof window !== 'undefined') {
    window.GameEngine = GameEngine;
    window.SceneManager = SceneManager;
    window.Scene = Scene;
    window.UIElement = UIElement;
}