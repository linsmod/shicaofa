/**
 * Canvas统一管理器
 * 处理设备像素比、尺寸分离、坐标对齐和图像质量优化
 */
class CanvasManager {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.devicePixelRatio = window.devicePixelRatio || 1;
        this.displayWidth = 0;  // CSS显示宽度
        this.displayHeight = 0; // CSS显示高度
        this.actualWidth = 0;   // 实际像素宽度
        this.actualHeight = 0;  // 实际像素高度
        this.isInitialized = false;
        
        // 注意：resize事件由Engine统一管理，这里不直接监听
        // 监听设备像素比变化
        window.addEventListener('devicePixelRatioChange', () => this.handlePixelRatioChange());
    }

    /**
     * 初始化Canvas管理器
     * @param {HTMLCanvasElement} canvas - Canvas元素
     * @param {Object} options - 配置选项
     * @returns {boolean} 是否初始化成功
     */
    init(canvas, options = {}) {
        if (!canvas) {
            console.error('Canvas元素不能为空');
            return false;
        }

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        if (!this.ctx) {
            console.error('无法获取2D上下文');
            return false;
        }

        // 合并默认选项
        const defaultOptions = {
            enableHighQuality: true,
            enablePixelAlignment: true,
            enableImageSmoothing: true,
            imageSmoothingQuality: 'high',
            backgroundColor: '#228B22'
        };
        
        this.options = { ...defaultOptions, ...options };

        // 初始化尺寸
        this.updateDimensions();

        // 设置高质量图像处理
        if (this.options.enableImageSmoothing) {
            this.ctx.imageSmoothingEnabled = true;
            this.ctx.imageSmoothingQuality = this.options.imageSmoothingQuality;
        }

        // 设置背景颜色
        if (this.options.backgroundColor) {
            this.ctx.fillStyle = this.options.backgroundColor;
            this.ctx.fillRect(0, 0, this.actualWidth, this.actualHeight);
        }

        this.isInitialized = true;
        console.log('CanvasManager初始化完成', {
            displayWidth: this.displayWidth,
            displayHeight: this.displayHeight,
            actualWidth: this.actualWidth,
            actualHeight: this.actualHeight,
            devicePixelRatio: this.devicePixelRatio
        });

        return true;
    }

    /**
     * 更新Canvas尺寸
     */
    updateDimensions() {
        if (!this.canvas) return;

        const rect = this.canvas.getBoundingClientRect();
        console.log("canvas rect",rect);
        this.displayWidth = rect.width;
        this.displayHeight = rect.height;

        // 设置CSS尺寸
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';

        // 设置实际像素尺寸（考虑设备像素比）
        this.actualWidth = Math.floor(this.displayWidth * this.devicePixelRatio);
        this.actualHeight = Math.floor(this.displayHeight * this.devicePixelRatio);

        // 设置Canvas的width/height属性
        this.canvas.width = this.actualWidth;
        this.canvas.height = this.actualHeight;

        console.log("canvas pixels size",this.canvas.width,this.canvas.height);

        // 缩放上下文以匹配设备像素比
        this.ctx.scale(this.devicePixelRatio, this.devicePixelRatio);

        // 应用坐标对齐
        if (this.options.enablePixelAlignment) {
            this.ctx.translate(0.5, 0.5);
        }

        // 重置变换矩阵
        this.resetTransform();
    }

    /**
     * 重置变换矩阵
     */
    resetTransform() {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        
        // 重新应用缩放和对齐
        this.ctx.scale(this.devicePixelRatio, this.devicePixelRatio);
        if (this.options.enablePixelAlignment) {
            this.ctx.translate(0.5, 0.5);
        }
    }

    /**
     * 处理窗口大小变化
     */
    handleResize() {
        if (!this.isInitialized) return;
        
        const oldWidth = this.displayWidth;
        const oldHeight = this.displayHeight;
        
        this.updateDimensions();
        
        // 如果尺寸发生变化，通知回调
        if (oldWidth !== this.displayWidth || oldHeight !== this.displayHeight) {
            this.onResize?.(this.displayWidth, this.displayHeight);
        }
    }

    /**
     * 处理设备像素比变化
     */
    handlePixelRatioChange() {
        this.devicePixelRatio = window.devicePixelRatio || 1;
        this.updateDimensions();
    }

    /**
     * 清除画布
     * @param {string} color - 背景颜色，如果不指定则使用初始化时的颜色
     */
    clear(color = null) {
        if (!this.ctx) return;

        this.resetTransform();
        
        if (color) {
            this.ctx.fillStyle = color;
        } else {
            this.ctx.fillStyle = this.options.backgroundColor;
        }
        
        this.ctx.fillRect(0, 0, this.displayWidth, this.displayHeight);
    }

    /**
     * 获取Canvas元素
     * @returns {HTMLCanvasElement}
     */
    getCanvas() {
        return this.canvas;
    }

    /**
     * 获取2D上下文
     * @returns {CanvasRenderingContext2D}
     */
    getContext() {
        return this.ctx;
    }

    /**
     * 获取显示尺寸
     * @returns {Object} { width, height }
     */
    getDisplaySize() {
        return {
            width: this.displayWidth,
            height: this.displayHeight
        };
    }

    /**
     * 获取实际像素尺寸
     * @returns {Object} { width, height }
     */
    getActualSize() {
        return {
            width: this.actualWidth,
            height: this.actualHeight
        };
    }

    /**
     * 获取设备像素比
     * @returns {number}
     */
    getDevicePixelRatio() {
        return this.devicePixelRatio;
    }

    /**
     * 设置高质量图像处理
     * @param {boolean} enabled - 是否启用
     * @param {string} quality - 图像质量 ('low', 'medium', 'high')
     */
    setHighQualityImageProcessing(enabled = true, quality = 'high') {
        this.options.enableImageSmoothing = enabled;
        this.options.imageSmoothingQuality = quality;
        
        if (this.ctx) {
            this.ctx.imageSmoothingEnabled = enabled;
            this.ctx.imageSmoothingQuality = quality;
        }
    }

    /**
     * 设置坐标对齐
     * @param {boolean} enabled - 是否启用像素对齐
     */
    setPixelAlignment(enabled = true) {
        this.options.enablePixelAlignment = enabled;
        this.resetTransform();
    }

    /**
     * 设置背景颜色
     * @param {string} color - 颜色值
     */
    setBackgroundColor(color) {
        this.options.backgroundColor = color;
        this.clear();
    }

    /**
     * 设置尺寸变化回调
     * @param {Function} callback - 回调函数
     */
    setResizeCallback(callback) {
        this.onResize = callback;
    }

    /**
     * 创建离屏Canvas（用于特效等）
     * @param {number} width - 宽度
     * @param {number} height - 高度
     * @returns {HTMLCanvasElement}
     */
    createOffscreenCanvas(width, height) {
        const offscreenCanvas = document.createElement('canvas');
        const offscreenCtx = offscreenCanvas.getContext('2d');
        
        if (!offscreenCtx) {
            console.error('无法创建离屏Canvas上下文');
            return null;
        }

        // 设置离屏Canvas的实际尺寸
        offscreenCanvas.width = Math.floor(width * this.devicePixelRatio);
        offscreenCanvas.height = Math.floor(height * this.devicePixelRatio);
        
        // 设置CSS尺寸
        offscreenCanvas.style.width = width + 'px';
        offscreenCanvas.style.height = height + 'px';

        // 设置离屏上下文
        offscreenCtx.scale(this.devicePixelRatio, this.devicePixelRatio);
        if (this.options.enablePixelAlignment) {
            offscreenCtx.translate(0.5, 0.5);
        }

        return offscreenCanvas;
    }

    /**
     * 将离屏Canvas内容绘制到主Canvas
     * @param {HTMLCanvasElement} offscreenCanvas - 离屏Canvas
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     * @param {number} width - 宽度
     * @param {number} height - 高度
     */
    drawOffscreenCanvas(offscreenCanvas, x, y, width, height) {
        if (!this.ctx || !offscreenCanvas) return;

        this.ctx.save();
        this.ctx.resetTransform();
        
        this.ctx.drawImage(
            offscreenCanvas,
            0, 0,
            offscreenCanvas.width,
            offscreenCanvas.height,
            x * this.devicePixelRatio,
            y * this.devicePixelRatio,
            width * this.devicePixelRatio,
            height * this.devicePixelRatio
        );
        
        this.ctx.restore();
    }

    /**
     * 销毁Canvas管理器
     */
    destroy() {
        this.canvas = null;
        this.ctx = null;
        this.isInitialized = false;
        
        // 移除事件监听器
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('devicePixelRatioChange', this.handlePixelRatioChange);
    }
}

// 导出CanvasManager到全局作用域
if (typeof window !== 'undefined') {
    window.CanvasManager = CanvasManager;
}