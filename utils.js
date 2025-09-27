/**
 * 工具函数库
 */

/**
 * 日志管理器
 */
class LogManager {
    constructor() {
        this.logs = [];
        this.maxLogs = 1000;
    }

    /**
     * 添加日志
     * @param {string} message - 日志消息
     * @param {string} level - 日志级别 (info, warn, error)
     */
    add(message, level = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = {
            timestamp,
            message,
            level,
            id: Date.now() + Math.random()
        };

        this.logs.push(logEntry);

        // 限制日志数量
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }

        // 同时输出到控制台
        this.consoleLog(logEntry);
    }

    /**
     * 控制台日志输出
     * @param {Object} logEntry - 日志条目
     */
    consoleLog(logEntry) {
        const prefix = `[${logEntry.timestamp}]`;
        switch (logEntry.level) {
            case 'error':
                console.error(prefix, logEntry.message);
                break;
            case 'warn':
                console.warn(prefix, logEntry.message);
                break;
            case 'info':
            default:
                console.log(prefix, logEntry.message);
                break;
        }
    }

    /**
     * 获取所有日志
     * @returns {Array}
     */
    getAllLogs() {
        return this.logs;
    }

    /**
     * 获取指定级别的日志
     * @param {string} level - 日志级别
     * @returns {Array}
     */
    getLogsByLevel(level) {
        return this.logs.filter(log => log.level === level);
    }

    /**
     * 清空日志
     */
    clear() {
        this.logs = [];
    }

    /**
     * 导出日志为文本
     * @returns {string}
     */
    export() {
        return this.logs.map(log => `[${log.timestamp}] ${log.message}`).join('\n');
    }
}

/**
 * 数学工具类
 */
class MathUtils {
    /**
     * 改进的随机数生成器
     */
    static randomSeed = Date.now() + Math.random() * 1000000;

    /**
     * 种子随机数生成器
     * @param {number} seed - 随机种子
     * @returns {number} 0-1之间的随机数
     */
    static seededRandom(seed) {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }

    /**
     * 获取更好的随机数
     * @param {number} min - 最小值
     * @param {number} max - 最大值
     * @param {boolean} integer - 是否为整数
     * @returns {number}
     */
    static betterRandom(min, max, integer = false) {
        // 使用多种随机源组合
        const timeRandom = Math.random();
        const seedRandom = this.seededRandom(this.randomSeed++);
        const performanceRandom = performance.now() / 1000000;

        // 组合随机数
        const combined = (timeRandom + seedRandom + performanceRandom) / 3;
        const value = combined * (max - min) + min;

        return integer ? Math.floor(value) : value;
    }

    /**
     * 计算两点之间的距离
     * @param {number} x1 - 第一个点的X坐标
     * @param {number} y1 - 第一个点的Y坐标
     * @param {number} x2 - 第二个点的X坐标
     * @param {number} y2 - 第二个点的Y坐标
     * @returns {number}
     */
    static distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * 计算点到线段的距离
     * @param {number} px - 点的X坐标
     * @param {number} py - 点的Y坐标
     * @param {number} x1 - 线段起点的X坐标
     * @param {number} y1 - 线段起点的Y坐标
     * @param {number} x2 - 线段终点的X坐标
     * @param {number} y2 - 线段终点的Y坐标
     * @returns {number}
     */
    static pointToLineDistance(px, py, x1, y1, x2, y2) {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;

        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;
        if (lenSq !== 0) {
            param = dot / lenSq;
        }

        let xx, yy;

        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }

        const dx = px - xx;
        const dy = py - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * 计算点到线段的带符号距离
     * @param {number} px - 点的X坐标
     * @param {number} py - 点的Y坐标
     * @param {number} x1 - 线段起点的X坐标
     * @param {number} y1 - 线段起点的Y坐标
     * @param {number} x2 - 线段终点的X坐标
     * @param {number} y2 - 线段终点的Y坐标
     * @returns {number}
     */
    static pointToLineSignedDistance(px, py, x1, y1, x2, y2) {
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
     * 生成指定范围内的随机数
     * @param {number} min - 最小值
     * @param {number} max - 最大值
     * @param {boolean} integer - 是否为整数
     * @returns {number}
     */
    static random(min, max, integer = false) {
        const value = Math.random() * (max - min) + min;
        return integer ? Math.floor(value) : value;
    }

    /**
     * 限制数值在指定范围内
     * @param {number} value - 数值
     * @param {number} min - 最小值
     * @param {number} max - 最大值
     * @returns {number}
     */
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    /**
     * 线性插值
     * @param {number} start - 起始值
     * @param {number} end - 结束值
     * @param {number} t - 插值因子 (0-1)
     * @returns {number}
     */
    static lerp(start, end, t) {
        return start + (end - start) * t;
    }

    /**
     * 角度转弧度
     * @param {number} degrees - 角度
     * @returns {number}
     */
    static degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    /**
     * 弧度转角度
     * @param {number} radians - 弧度
     * @returns {number}
     */
    static radiansToDegrees(radians) {
        return radians * (180 / Math.PI);
    }
}

/**
 * 蓍草法算法工具类
 */
class StalksAlgorithm {

    static badinput(){
        return {"error":"bad input"};
    }
    
    // 三变才能生成一个爻
    static doSubModStep(input,left,right,lastout){
        let stepnum = lastout && lastout.nextStep || 1;
        switch(stepnum){
            case 1: return StalksAlgorithm.doYaoStepNext(input,left,right,{rest:49,nextStep:1,results:[]});
            case 2: return StalksAlgorithm.doYaoStepNext(input,left,right,lastout);
            case 3: return StalksAlgorithm.doYaoStepNext(input,left,right,lastout);
            default: return {"error":"bad step"};
        }
    }
    static doYaoStepNext(input,left,right,last){
        if(input!=last.rest){
            return this.badinput();
        }
        if(left+right!=last.rest){
           return this.badinput();
        }
        if(left==0 || right==0)
        {
           return this.badinput();
        }
        let leftsub = left % 4;
        if(leftsub==0)
            leftsub=4;
        let rightsub =  (right-1) % 4;
        if(rightsub==0)
            rightsub=4;
        rightsub = rightsub +1;
        let totalsub = leftsub+rightsub/* 右去1*/;
        let rest = input-totalsub;
        let results = Array.from(last.results);
        results.push(rest);
        return{
            rest,
            leftrest:left-leftsub,
            rightrest:right-rightsub,
            leftsub,
            rightsub,
            totalsub,
            nextStep:last.nextStep+1,
            results:results
        };
    }

    /**
     * 计算爻值
     * @param {Array} changeResults - 变的结果数组
     * @param {Function} addLog - 日志添加函数
     * @returns {number} 爻值
     */
    static calculateYaoValue(lastresult, addLog) {
        const rest = lastresult.rest;

        let yaoValue;
        let yaoType;

        // 根据蓍草法规则，第三变后的剩余数量只能是24、28、32、36
        if (rest === 36) {
            yaoValue = 9; // 老阳 ⚊○
            yaoType = "老阳(⚊○)";
        } else if (rest === 32) {
            yaoValue = 8; // 少阴 ⚋
            yaoType = "少阴(⚋)";
        } else if (rest === 28) {
            yaoValue = 7; // 少阳 ⚊
            yaoType = "少阳(⚊)";
        } else if (rest === 24) {
            yaoValue = 6; // 老阴 ⚋○
            yaoType = "老阴(⚋○)";
        } else {
            // 如果出现异常情况，直接报错
            const yaoNumber = Math.floor(changeResults.length / 3);
            // 转换为传统爻名
            const traditionalYaoNames = ['', '初', '二', '三', '四', '五', '上'];
            const yaoName = traditionalYaoNames[yaoNumber];
            addLog(`错误：${yaoName}爻剩余蓍草数量异常(${rest})，应该是24、28、32或36根`, 'error');
            return null;
        }
        return yaoValue;
    }

    /**
     * 根据爻值计算卦象
     * @param {Array} yaos - 爻值数组
     * @returns {Object} 卦象数据
     */
    static calculateGuaFromYaos(yaos) {
        // 添加调试信息
        console.log('输入的爻值数组:', yaos);

        const binary = yaos.map(yao => yao === 9 || yao === 7 ? 1 : 0).join('');
        console.log('转换后的二进制:', binary);


        const guas = [
            { binary: '111111', symbol: '䷀', seq: 1, sname: "乾", name: "乾为天" },
            { binary: '000000', symbol: '䷁', seq: 2, sname: "坤", name: "坤为地" },
            { binary: '010001', symbol: '䷂', seq: 3, sname: "屯", name: "水雷屯" },
            { binary: '100010', symbol: '䷃', seq: 4, sname: "蒙", name: "山水蒙" },
            { binary: '010111', symbol: '䷄', seq: 5, sname: "需", name: "水天需" },
            { binary: '111010', symbol: '䷅', seq: 6, sname: "讼", name: "天水讼" },
            { binary: '000010', symbol: '䷆', seq: 7, sname: "师", name: "地水师" },
            { binary: '010000', symbol: '䷇', seq: 8, sname: "比", name: "水地比" },
            { binary: '110111', symbol: '䷈', seq: 9, sname: "小畜", name: "风天小畜" },
            { binary: '111011', symbol: '䷉', seq: 10, sname: "履", name: "天泽履" },
            { binary: '000111', symbol: '䷊', seq: 11, sname: "泰", name: "天地泰" },
            { binary: '111000', symbol: '䷋', seq: 12, sname: "否", name: "地天否" },
            { binary: '111101', symbol: '䷌', seq: 13, sname: "同人", name: "天火同人" },
            { binary: '101111', symbol: '䷍', seq: 14, sname: "大有", name: "火天大有" },
            { binary: '000100', symbol: '䷎', seq: 15, sname: "谦", name: "地山谦" },
            { binary: '001000', symbol: '䷏', seq: 16, sname: "豫", name: "雷地豫" },
            { binary: '011001', symbol: '䷐', seq: 17, sname: "随", name: "泽雷随" },
            { binary: '100110', symbol: '䷑', seq: 18, sname: "蛊", name: "山风蛊" },
            { binary: '000011', symbol: '䷒', seq: 19, sname: "临", name: "地泽临" },
            { binary: '110000', symbol: '䷓', seq: 20, sname: "观", name: "风地观" },
            { binary: '101001', symbol: '䷔', seq: 21, sname: "噬嗑", name: "火雷噬嗑" },
            { binary: '100101', symbol: '䷕', seq: 22, sname: "贲", name: "山火贲" },
            { binary: '100000', symbol: '䷖', seq: 23, sname: "剥", name: "山地剥" },
            { binary: '000001', symbol: '䷗', seq: 24, sname: "复", name: "地雷复" },
            { binary: '111001', symbol: '䷘', seq: 25, sname: "无妄", name: "天雷无妄" },
            { binary: '100111', symbol: '䷙', seq: 26, sname: "大畜", name: "山天大畜" },
            { binary: '100001', symbol: '䷚', seq: 27, sname: "颐", name: "山雷颐" },
            { binary: '011110', symbol: '䷛', seq: 28, sname: "大过", name: "泽风大过" },
            { binary: '010010', symbol: '䷜', seq: 29, sname: "坎", name: "坎为水" },
            { binary: '101101', symbol: '䷝', seq: 30, sname: "离", name: "离为火" },
            { binary: '011100', symbol: '䷞', seq: 31, sname: "咸", name: "泽山咸" },
            { binary: '001110', symbol: '䷟', seq: 32, sname: "恒", name: "雷风恒" },
            { binary: '111100', symbol: '䷠', seq: 33, sname: "遯", name: "天山遯" },
            { binary: '001111', symbol: '䷡', seq: 34, sname: "大壮", name: "雷天大壮" },
            { binary: '101000', symbol: '䷢', seq: 35, sname: "晋", name: "火地晋" },
            { binary: '000101', symbol: '䷣', seq: 36, sname: "明夷", name: "地火明夷" },
            { binary: '110101', symbol: '䷤', seq: 37, sname: "家人", name: "风火家人" },
            { binary: '101011', symbol: '䷥', seq: 38, sname: "睽", name: "火泽睽" },
            { binary: '010100', symbol: '䷦', seq: 39, sname: "蹇", name: "水山蹇" },
            { binary: '001010', symbol: '䷧', seq: 40, sname: "解", name: "雷水解" },
            { binary: '100011', symbol: '䷨', seq: 41, sname: "损", name: "山泽损" },
            { binary: '110001', symbol: '䷩', seq: 42, sname: "益", name: "风雷益" },
            { binary: '011111', symbol: '䷪', seq: 43, sname: "夬", name: "泽天夬" },
            { binary: '111110', symbol: '䷫', seq: 44, sname: "姤", name: "天风姤" },
            { binary: '011000', symbol: '䷬', seq: 45, sname: "萃", name: "泽地萃" },
            { binary: '000110', symbol: '䷭', seq: 46, sname: "升", name: "地风升" },
            { binary: '011010', symbol: '䷮', seq: 47, sname: "困", name: "泽水困" },
            { binary: '010110', symbol: '䷯', seq: 48, sname: "井", name: "水风井" },
            { binary: '011101', symbol: '䷰', seq: 49, sname: "革", name: "泽火革" },
            { binary: '101110', symbol: '䷱', seq: 50, sname: "鼎", name: "火风鼎" },
            { binary: '001001', symbol: '䷲', seq: 51, sname: "震", name: "震为雷" },
            { binary: '100100', symbol: '䷳', seq: 52, sname: "艮", name: "艮为山" },
            { binary: '110100', symbol: '䷴', seq: 53, sname: "渐", name: "风山渐" },
            { binary: '001011', symbol: '䷵', seq: 54, sname: "归妹", name: "雷泽归妹" },
            { binary: '001101', symbol: '䷶', seq: 55, sname: "丰", name: "雷火丰" },
            { binary: '101100', symbol: '䷷', seq: 56, sname: "旅", name: "火山旅" },
            { binary: '110110', symbol: '䷸', seq: 57, sname: "风", name: "巽为风" },
            { binary: '011011', symbol: '䷹', seq: 58, sname: "泽", name: "兑为泽" },
            { binary: '110010', symbol: '䷺', seq: 59, sname: "涣", name: "风水涣" },
            { binary: '010011', symbol: '䷻', seq: 60, sname: "节", name: "水泽节" },
            { binary: '110011', symbol: '䷼', seq: 61, sname: "中孚", name: "风泽中孚" },
            { binary: '001100', symbol: '䷽', seq: 62, sname: "小过", name: "雷山小过" },
            { binary: '010101', symbol: '䷾', seq: 63, sname: "既济", name: "水火既济" },
            { binary: '101010', symbol: '䷿', seq: 64, sname: "未济", name: "火水未济" }]

        const matchedGua = guas.find(gua => gua.binary === binary);

        console.log('匹配到的卦:', matchedGua);

        if (matchedGua) {
            return matchedGua;
        } else {
            console.log('未找到匹配的卦，返回默认的未济卦');
            return {
                name: '????',
                symbol: binary,
                interpretation: 'binary=' + binary,
                symbolism: '火水未济，君子以慎辨物居方',
                advice: '事情尚未完成，需要继续努力'
            };
        }
    }

    /**
     * 计算变卦
     * @param {Array} yaos - 原始爻值数组
     * @returns {Array} 变卦爻值数组
     */
    static calculateChangingGua(yaos) {
        return yaos.map(yao => {
            // 老阴(6)变阳爻，老阳(9)变阴爻，少阴少阳不变
            if (yao === 6) return 7; // 老阴变少阳
            if (yao === 9) return 8; // 老阳变少阴
            return yao; // 少阴少阳不变
        });
    }

    /**
     * 获取变爻建议
     * @param {Array} changingYaos - 变爻数组
     * @returns {string} 建议文本
     */
    static getChangingYaoAdvice(changingYaos) {
        const adviceMap = {
            1: '初爻变动，根基不稳，宜谨慎行事',
            2: '二爻变动，居中守正，可稳步前进',
            3: '三爻变动，多有波折，需审时度势',
            4: '四爻变动，近君之位，当恭敬谨慎',
            5: '五爻变动，尊位之之变，可大有作为',
            6: '上爻变动，物极必反，宜知进退'
        };

        return changingYaos.map(yao => adviceMap[yao] || '').filter(Boolean).join('；');
    }
}

/**
 * 设备检测工具类
 */
class DeviceUtils {
    /**
     * 检测是否为移动设备
     * @returns {boolean}
     */
    static isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    /**
     * 检测是否为iOS设备
     * @returns {boolean}
     */
    static isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent);
    }

    /**
     * 检测是否为Android设备
     * @returns {boolean}
     */
    static isAndroid() {
        return /Android/.test(navigator.userAgent);
    }

    /**
     * 获取设备像素比
     * @returns {number}
     */
    static getDevicePixelRatio() {
        return window.devicePixelRatio || 1;
    }

    /**
     * 获取设备方向
     * @returns {string}
     */
    static getOrientation() {
        if (window.matchMedia("(orientation: portrait)").matches) {
            return 'portrait';
        } else if (window.matchMedia("(orientation: landscape)").matches) {
            return 'landscape';
        }
        return 'unknown';
    }

    /**
     * 获取屏幕尺寸
     * @returns {Object}
     */
    static getScreenSize() {
        return {
            width: window.screen.width,
            height: window.screen.height,
            availWidth: window.screen.availWidth,
            availHeight: window.screen.availHeight,
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight,
            outerWidth: window.outerWidth,
            outerHeight: window.outerHeight
        };
    }
}

/**
 * 性能监控工具类
 */
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            fps: 0,
            frameTime: 0,
            memory: 0,
            lastTime: performance.now(),
            frames: 0,
            startTime: performance.now()
        };
    }

    /**
     * 更新性能指标
     */
    update() {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.metrics.lastTime;

        this.metrics.frames++;
        this.metrics.frameTime = deltaTime;
        this.metrics.fps = Math.round(1000 / deltaTime);
        this.metrics.lastTime = currentTime;

        // 更新内存使用情况（如果支持）
        if (performance.memory) {
            this.metrics.memory = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
        }
    }

    /**
     * 获取性能指标
     * @returns {Object}
     */
    getMetrics() {
        return {
            fps: this.metrics.fps,
            frameTime: this.metrics.frameTime,
            memory: this.metrics.memory,
            uptime: Math.round((performance.now() - this.metrics.startTime) / 1000)
        };
    }

    /**
     * 重置性能监控
     */
    reset() {
        this.metrics = {
            fps: 0,
            frameTime: 0,
            memory: 0,
            lastTime: performance.now(),
            frames: 0,
            startTime: performance.now()
        };
    }
}

// 导出工具类到全局作用域
if (typeof window !== 'undefined') {
    window.LogManager = LogManager;
    window.MathUtils = MathUtils;
    window.StalksAlgorithm = StalksAlgorithm;
    window.DeviceUtils = DeviceUtils;
    window.PerformanceMonitor = PerformanceMonitor;
}