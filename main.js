/**
 * 蓍草占卜游戏主入口文件
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化游戏引擎
    const gameEngine = new GameEngine();
    
    // 初始化日志管理器
    const logManager = new LogManager();
    
    // 初始化性能监控器
    const performanceMonitor = new PerformanceMonitor();
    
    // 全局变量
    let currentGameScene = null;
    let currentResultScene = null;
    let gameLogs = [];
    
    // 获取UI组件
    const { Button, SettingsPanel, GameInfoPanel, GuaDisplay } = window;
    
    /**
     * 初始化游戏
     */
    function initGame() {
        try {
            // 初始化游戏引擎
            gameEngine.init('game-canvas');
            
            // 注册场景
            registerScenes();
            
            // 启动游戏引擎
            gameEngine.start();
            
            // 切换到开始场景
            gameEngine.sceneManager.switchToScene('start');
            
            logManager.add('游戏初始化完成');
            
        } catch (error) {
            logManager.add(`游戏初始化失败: ${error.message}`, 'error');
            console.error('游戏初始化失败:', error);
        }
    }
    
    /**
     * 注册游戏场景
     */
    function registerScenes() {
        // 创建场景实例
        const startScene = new StartScene();
        const gameScene = new GameScene();
        const resultScene = new ResultScene();
        const logsScene = new LogsScene();
        
        // 设置场景的日志管理器
        gameScene.addLog = function(message) {
            logManager.add(message);
            gameLogs.push(message);
        };
        
        gameScene.updateLogsDisplay = function() {
            // 更新日志显示的逻辑
        };
        
        gameScene.updateDisplay = function() {
            if (this.gameInfoPanel && this.lastresult) {
                this.gameInfoPanel.setCounts(this.leftGroup.length, this.rightGroup.length, this.asideStalks);
                this.gameInfoPanel.setAlgorithmInfo(this.currentStalks, this.lastresult.nextStep, this.yaos.length);
            }
        };
        
        // 移除重复定义的generateResult函数，使用ResultScene类中定义的方法
        
        logsScene.init = function(logs = []) {
            this.logsContent = logs;
            this.createUI();
        };
        
        // 注册场景到场景管理器
        gameEngine.sceneManager.registerScene('start', startScene);
        gameEngine.sceneManager.registerScene('game', gameScene);
        gameEngine.sceneManager.registerScene('result', resultScene);
        gameEngine.sceneManager.registerScene('logs', logsScene);
        
        // 保存场景引用
        currentGameScene = gameScene;
        currentResultScene = resultScene;
    }
    
    /**
     * 开始游戏
     */
    function startGame() {
        if (currentGameScene) {
            logManager.add('游戏重新开始');
            
            // 确保切换到游戏场景，避免频繁切换
            const currentSceneName = gameEngine.sceneManager.getCurrentSceneName();
            if (currentSceneName !== 'game') {
                gameEngine.sceneManager.switchToScene('game');
            }
        }
    }
    
    /**
     * 显示结果
     */
    function showResult() {
        if (currentResultScene && currentGameScene) {
            // 传递爻值到结果场景
            currentResultScene.yaos = [...currentGameScene.yaos];
            console.log('从GameScene传递到ResultScene的yaos:', currentGameScene.yaos);
            console.log('currentGameScene.yaos长度:', currentGameScene.yaos.length);
            
            // 切换到结果场景
            gameEngine.sceneManager.switchToScene('result');
            
            // 等待场景切换完成后再生成结果
            setTimeout(() => {
                if (currentResultScene && currentResultScene.generateResult) {
                    currentResultScene.generateResult();
                }
            }, 100);
        }
    }
    
    /**
     * 重新开始游戏
     */
    function restartGame() {
        startGame();
    }
    
    /**
     * 开始新的占卜
     */
    function startNewGame() {
        gameEngine.sceneManager.switchToScene('start');
    }
    
    /**
     * 返回游戏
     */
    function backToGame() {
        gameEngine.sceneManager.switchToScene('game');
    }
    
    /**
     * 清空日志
     */
    function clearLogs() {
        gameLogs = [];
        logManager.clear();
        
        if (gameEngine.sceneManager.getCurrentSceneName() === 'logs') {
            const logsScene = gameEngine.sceneManager.getCurrentScene();
            if (logsScene) {
                logsScene.logsContent = [];
            }
        }
    }
    
    
    /**
     * 切换设置面板
     */
    function toggleSettings() {
        if (currentGameScene && currentGameScene.settingsPanel) {
            currentGameScene.settingsPanel.setVisible(!currentGameScene.settingsPanel.visible);
        }
    }
    
    /**
     * 切换圆点显示
     */
    function toggleDots() {
        if (currentGameScene) {
            currentGameScene.showDots = !currentGameScene.showDots;
            if (currentGameScene.settingsPanel) {
                currentGameScene.settingsPanel.setShowDots(currentGameScene.showDots);
            }
        }
    }
    
    /**
     * 显示日志
     */
    function showLogs() {
        if (gameEngine.sceneManager) {
            const logsScene = gameEngine.sceneManager.getCurrentScene();
            if (logsScene && logsScene.name === 'logs') {
                logsScene.init(gameLogs);
            }
            gameEngine.sceneManager.switchToScene('logs');
        }
    }
    
    // 绑定全局函数
    window.startGame = startGame;
    window.showResult = showResult;
    window.restartGame = restartGame;
    window.startNewGame = startNewGame;
    window.backToGame = backToGame;
    window.clearLogs = clearLogs;
    window.toggleSettings = toggleSettings;
    window.toggleDots = toggleDots;
    window.showLogs = showLogs;
    
    // 添加键盘快捷键
    document.addEventListener('keydown', function(e) {
        // 按 'S' 键或 's' 键切换设置面板
        if (e.key === 'S' || e.key === 's') {
            toggleSettings();
        }
        // 按 'L' 键或 'l' 键显示日志
        if (e.key === 'L' || e.key === 'l') {
            showLogs();
        }
        // 按 'R' 键或 'r' 键重新开始
        if (e.key === 'R' || e.key === 'r') {
            restartGame();
        }
    });
    
    // 启动游戏
    initGame();
    
    // 导出游戏实例供调试使用
    window.gameEngine = gameEngine;
    window.logManager = logManager;
    window.performanceMonitor = performanceMonitor;
    
    // 定期更新性能监控
    setInterval(() => {
        performanceMonitor.update();
        const metrics = performanceMonitor.getMetrics();
        
        // 注释掉性能指标的显示逻辑
        // if (gameEngine.sceneManager.getCurrentSceneName() === 'game') {
        //     console.log('性能指标:', metrics);
        // }
    }, 1000);
});