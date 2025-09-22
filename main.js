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
            if (this.gameInfoPanel) {
                this.gameInfoPanel.setCounts(this.leftGroup.length, this.rightGroup.length, this.asideStalks);
                this.gameInfoPanel.setAlgorithmInfo(this.currentStalks, this.currentChange, this.yaos.length);
            }
        };
        
        resultScene.generateResult = function() {
            const guaData = StalksAlgorithm.calculateGuaFromYaos(this.yaos);
            
            // 创建卦象显示
            if (!this.guaDisplay) {
                this.guaDisplay = new GuaDisplay(
                    this.engine.getCanvas().width / 2 - 150,
                    100,
                    300,
                    200
                );
            }
            
            this.guaDisplay.setGuaData(guaData.name, guaData.symbol, this.yaos);
            this.guaDisplay.setVisible(true);
            
            // 显示解释
            console.log(`本卦：${guaData.interpretation}`);
            console.log(`卦象：${guaData.symbolism}`);
            console.log(`建议：${guaData.advice}`);
            
            // 获取变爻信息
            const changingYaos = this.yaos
                .map((yao, index) => yao === 9 || yao === 6 ? index + 1 : null)
                .filter(yao => yao !== null);
            
            if (changingYaos.length > 0) {
                const advice = StalksAlgorithm.getChangingYaoAdvice(changingYaos);
                console.log(`变爻提示：${advice}`);
            }
        };
        
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
            // 重置游戏状态
            currentGameScene.state = 'dividing';
            currentGameScene.currentStep = 0;
            currentGameScene.divided = false;
            
            currentGameScene.currentStalks = 49;
            currentGameScene.currentChange = 0;
            currentGameScene.currentYao = 0;
            currentGameScene.changeResults = [];
            currentGameScene.yaos = [];
            
            currentGameScene.asideStalks = 0;
            currentGameScene.asideStalksType = '';
            
            if (currentGameScene.removalTimeout) {
                clearTimeout(currentGameScene.removalTimeout);
                currentGameScene.removalTimeout = null;
            }
            
            currentGameScene.logs = [];
            gameLogs = [];
            
            currentGameScene.updateDisplay();
            
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
            
            // 切换到结果场景
            gameEngine.sceneManager.switchToScene('result');
            
            // 生成结果
            setTimeout(() => {
                currentResultScene.generateResult();
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
     * 自动完成占卜
     */
    function autoComplete() {
        if (currentGameScene) {
            // 重置游戏状态，复用startGame的逻辑
            startGame();
            logManager.add('开始自动占卜');
            
            // 模拟用户操作，触发手动占卜流程
            const simulateUserAction = () => {
                if (currentGameScene.yaos.length < 6) {
                    // 随机生成蓍草位置和分组
                    const width = gameEngine.getCanvas().width;
                    const height = gameEngine.getCanvas().height;
                    const padding = 30;
                    
                    currentGameScene.stalks.forEach(stalk => {
                        stalk.x = padding + Math.random() * (width - 2 * padding);
                        stalk.y = padding + Math.random() * (height - 2 * padding);
                        stalk.group = null;
                        stalk.visible = true;
                    });
                    
                    // 随机选择切分方向 - 使用更好的随机数生成器
                    const directions = ['horizontal', 'vertical', 'diagonal1', 'diagonal2'];
                    const cutDirection = directions[Math.floor(MathUtils.betterRandom(0, directions.length, true))];
                    
                    // 创建切分线并划分蓍草
                    const centerX = width / 2;
                    const centerY = height / 2;
                    const cutLine = currentGameScene.createCutLine(centerX, centerY, cutDirection);
                    
                    currentGameScene.stalks.forEach(stalk => {
                        const distance = MathUtils.pointToLineSignedDistance(
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
                    
                    currentGameScene.leftGroup = currentGameScene.stalks.filter(stalk => stalk.group === '天');
                    currentGameScene.rightGroup = currentGameScene.stalks.filter(stalk => stalk.group === '地');
                    currentGameScene.divided = true;
                    
                    // 调用手动占卜的performChange方法
                    if (currentGameScene.performChange()) {
                        currentGameScene.currentStep++;
                        currentGameScene.currentChange++;
                        
                        if (currentGameScene.currentChange >= 3) {
                            const yaoValue = currentGameScene.calculateYaoValue();
                            if (yaoValue !== null) {
                                currentGameScene.yaos.push(yaoValue);
                                
                                currentGameScene.currentChange = 0;
                                currentGameScene.changeResults = [];
                                currentGameScene.asideStalks = 0;
                                currentGameScene.asideStalksType = '';
                            } else {
                                logManager.add('自动占卜中断：爻值计算错误');
                                return;
                            }
                        }
                        
                        if (currentGameScene.yaos.length >= 6) {
                            showResult();
                            logManager.add('自动占卜完成');
                        } else {
                            setTimeout(simulateUserAction, 500);
                        }
                    } else {
                        logManager.add('自动占卜中断：蓍草数量不足');
                    }
                }
            };
            
            // 开始模拟
            setTimeout(simulateUserAction, 100);
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
    window.autoComplete = autoComplete;
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
        // 按 'A' 键或 'a' 键自动完成
        if (e.key === 'A' || e.key === 'a') {
            autoComplete();
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