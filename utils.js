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
    /**
     * 执行蓍草法的一变
     * @param {number} currentStalks - 当前蓍草数量
     * @param {number} currentChange - 当前变的次数 (0,1,2)
     * @param {number} currentYao - 当前爻的次数 (0-5)
     * @param {Array} changeResults - 存储每变的结果
     * @param {Function} addLog - 日志添加函数
     * @returns {Object} 结果对象
     */
    /**
     * 执行蓍草法的一变（模拟手动切分方式）
     * @param {number} currentStalks - 当前蓍草数量
     * @param {number} currentChange - 当前变的次数 (0,1,2)
     * @param {number} currentYao - 当前爻的次数 (0-5)
     * @param {Array} changeResults - 存储每变的结果
     * @param {Array} leftGroup - 左组蓍草数组
     * @param {Array} rightGroup - 右组蓍草数组
     * @param {Function} addLog - 日志添加函数
     * @returns {Object} 结果对象
     */
    static performChangeManual(currentStalks, currentChange, currentYao, changeResults, leftGroup, rightGroup, addLog) {
        if (currentStalks < 4) {
            addLog(`错误：蓍草数量不足，剩余${currentStalks}根，无法继续`, 'error');
            return null;
        }

        let leftCount, rightCount;

        // 根据蓍草法规则，第一变必须从49根开始
        if (currentChange === 0 && currentStalks !== 49) {
            currentStalks = 49;
            // 注释掉重复的日志记录，因为已在scenes.js中记录
            // 转换为传统爻名
            // const traditionalYaoNames = ['', '初', '二', '三', '四', '五', '上'];
            // const yaoName = traditionalYaoNames[currentYao + 1];
            // addLog(`重新开始${yaoName}爻，使用49根蓍草`);
        }

        // 使用实际的切分结果而不是随机数
        if (leftGroup && rightGroup && leftGroup.length + rightGroup.length === currentStalks) {
            leftCount = leftGroup.length;
            rightCount = rightGroup.length;
        } else {
            // 如果没有切分数据，使用模拟切分
            const cutRatio = MathUtils.betterRandom(0.3, 0.7); // 切分比例在30%-70%之间
            leftCount = Math.round(currentStalks * cutRatio);
            rightCount = currentStalks - leftCount;
        }

        // 挂一：从左堆取出一根
        const hangYi = 1;
        leftCount -= hangYi;
// 揲四：计算余数（以4根一组）
        const leftRemainder = leftCount % 4;
        const rightRemainder = rightCount % 4;
        
        // 根据蓍草法规则，余数可能是1、2、3、4（整除时视为余4）
        const adjustedLeftRemainder = leftRemainder === 0 ? 4 : leftRemainder;
        const adjustedRightRemainder = rightRemainder === 0 ? 4 : rightRemainder;
        
        // 归奇：余数之和应该是4或8
        const totalRemainder = adjustedLeftRemainder + adjustedRightRemainder;
        
        // 验证余数之和是否符合蓍草法规则
        // 注意：由于第一变后剩余44或40根，第二变和第三变的余数之和规则可能不同
        if (currentChange === 0 && totalRemainder !== 4 && totalRemainder !== 8) {
            // 转换为传统爻名
            const traditionalYaoNames = ['', '初', '二', '三', '四', '五', '上'];
            const yaoName = traditionalYaoNames[currentYao + 1];
            addLog(`错误：${yaoName}爻第${currentChange + 1}变的余数之和异常(${totalRemainder})，应该是4或8`, 'error');
            return null;
        }
        
        // 移除挂一和余数的根数
        const removeStalks = hangYi + totalRemainder;
        const remainingStalks = currentStalks - removeStalks;

        const changeType = currentChange + 1;
        const yaoType = currentYao + 1;
        // 注释掉重复的日志记录，因为已在scenes.js中记录
        // addLog(`第${yaoType}爻第${changeType}变：分二左${leftCount + hangYi}右${rightCount}，挂一1根，揲四左余${adjustedLeftRemainder}右余${adjustedRightRemainder}，归奇${totalRemainder}，移除${removeStalks}根，剩余${remainingStalks}根，本爻已挂${totalAsideStalks}根`);

        changeResults.push({
            leftCount: leftCount + hangYi,
            rightCount: rightCount,
            leftRemainder: adjustedLeftRemainder,
            rightRemainder: adjustedRightRemainder,
            totalRemainder: totalRemainder,
            removedStalks: removeStalks,
            remainingStalks: remainingStalks
        });

        return {
            remainingStalks,
            asideStalks: totalRemainder,
            leftRemainder: adjustedLeftRemainder,
            rightRemainder: adjustedRightRemainder,
            totalRemainder: totalRemainder,
            success: true
        };
    }

    /**
     * 计算爻值
     * @param {Array} changeResults - 变的结果数组
     * @param {Function} addLog - 日志添加函数
     * @returns {number} 爻值
     */
    static calculateYaoValue(changeResults, addLog) {
        const lastChange = changeResults[changeResults.length - 1];
        const remainingStalks = lastChange.remainingStalks;

        let yaoValue;
        let yaoType;

        // 根据蓍草法规则，第三变后的剩余数量只能是24、28、32、36
        if (remainingStalks === 36) {
            yaoValue = 9; // 老阳 ⚊○
            yaoType = "老阳(⚊○)";
        } else if (remainingStalks === 32) {
            yaoValue = 8; // 少阴 ⚋
            yaoType = "少阴(⚋)";
        } else if (remainingStalks === 28) {
            yaoValue = 7; // 少阳 ⚊
            yaoType = "少阳(⚊)";
        } else if (remainingStalks === 24) {
            yaoValue = 6; // 老阴 ⚋○
            yaoType = "老阴(⚋○)";
        } else {
            // 如果出现异常情况，直接报错
            const yaoNumber = Math.floor(changeResults.length / 3);
            // 转换为传统爻名
            const traditionalYaoNames = ['', '初', '二', '三', '四', '五', '上'];
            const yaoName = traditionalYaoNames[yaoNumber];
            addLog(`错误：${yaoName}爻剩余蓍草数量异常(${remainingStalks})，应该是24、28、32或36根`, 'error');
            return null;
        }

        const yaoNumber = Math.floor(changeResults.length / 3);
        const totalAsideStalks = changeResults.reduce((sum, result) => sum + result.totalRemainder, 0) + 3; // 每变挂一1根，共3变
        // 注释掉重复的日志记录，因为已在scenes.js中记录
        // addLog(`第${yaoNumber}爻：第三变后剩余${remainingStalks}根，得${yaoType}，本爻总挂${totalAsideStalks}根`);

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
        // 八纯卦
        { binary: '111111', name: '乾为天', symbol: '䷀', interpretation: '元亨利贞，自强不息', symbolism: '天行健，君子以自强不息', advice: '当前宜保持坚定信念，勇往直前' },
        { binary: '000000', name: '坤为地', symbol: '䷁', interpretation: '厚德载物，柔顺利贞', symbolism: '地势坤，君子以厚德载物', advice: '应当包容宽厚，顺应自然' },
        { binary: '100010', name: '坎为水', symbol: '䷜', interpretation: '习坎，有孚，维心亨', symbolism: '水洊至，习坎君子以常德行，习教事', advice: '面临险阻，心存诚信，坚守正道' },
        { binary: '010101', name: '离为火', symbol: '䷝', interpretation: '离，利贞，亨', symbolism: '明两作，大人以继明照于四方', advice: '光明正大，宜附和贤者' },
        { binary: '100110', name: '艮为山', symbol: '䷳', interpretation: '艮，止也', symbolism: '兼山艮，君子以思不出其位', advice: '当止则止，宜安守本分' },
        { binary: '011001', name: '兑为泽', symbol: '䷹', interpretation: '兑，说也', symbolism: '丽泽兑，君子以朋友讲习', advice: '和悦相处，宜与朋友交流' },
        { binary: '110011', name: '震为雷', symbol: '䷲', interpretation: '震为雷，君子以恐惧修省', symbolism: '洊雷震，君子以恐惧修省', advice: '震动之时，宜谨慎行事，修身养性' },
        { binary: '011010', name: '巽为风', symbol: '䷸', interpretation: '巽为风，君子以广惠足志', symbolism: '随风巽，君子以申命行事', advice: '宜顺势而为，广施恩惠' },
        
        // 其他卦象（按周易顺序）
        { binary: '100001', name: '水雷屯', symbol: '䷂', interpretation: '刚柔始交而难生，动乎险中，大亨贞', symbolism: '云雷屯，君子以经纶', advice: '艰难中孕育希望，需谨慎前行' },
        { binary: '010000', name: '山水蒙', symbol: '䷃', interpretation: '山下有险，险而止，蒙以养正', symbolism: '山下出泉，蒙君子以果行育德', advice: '需要启蒙教育，循序渐进' },
        { binary: '111010', name: '水天需', symbol: '䷄', interpretation: '云上于天，需君子以饮食宴乐', symbolism: '云上于天，需君子以饮食宴乐', advice: '需要耐心等待，不可急躁' },
        { binary: '010111', name: '天水讼', symbol: '䷅', interpretation: '天与水违行，讼君子以作事谋始', symbolism: '天与水违行，讼君子以作事谋始', advice: '避免争讼，以和为贵' },
        { binary: '010001', name: '地水师', symbol: '䷆', interpretation: '地中有水，师君子以容民畜众', symbolism: '地中有水，师君子以容民畜众', advice: '团结众人，共同奋斗' },
        { binary: '100010', name: '水地比', symbol: '䷇', interpretation: '地上有水，比先王以建万国亲诸侯', symbolism: '地上有水，比先王以建万国亲诸侯', advice: '和睦相处，亲贤远佞' },
        { binary: '111011', name: '风天小畜', symbol: '䷈', interpretation: '风行天上，小畜君子以懿文德', symbolism: '风行天上，小畜君子以懿文德', advice: '积蓄力量，待时而动' },
        { binary: '110111', name: '天泽履', symbol: '䷉', interpretation: '上天下泽，履君子以辨上下定民志', symbolism: '上天下泽，履君子以辨上下定民志', advice: '谨慎行事，循规蹈矩' },
        { binary: '111000', name: '地天泰', symbol: '䷊', interpretation: '天地交，泰后以财成天地之道', symbolism: '天地交泰，后以财成天地之道', advice: '把握时机，积极进取' },
        { binary: '000111', name: '天地否', symbol: '䷋', interpretation: '天地不交，否君子以俭德辟难', symbolism: '天地不交，否君子以俭德辟难', advice: '暂时隐忍，等待转机' },
        { binary: '101111', name: '天火同人', symbol: '䷌', interpretation: '同人于野，亨', symbolism: '天与火，同人君子以类族辨物', advice: '与人和同，宜团结协作' },
        { binary: '111101', name: '火天大有', symbol: '䷍', interpretation: '大有，元亨', symbolism: '火在天上，大有君子以遏恶扬善', advice: '收获丰盛，宜抑恶扬善' },
        { binary: '001000', name: '地山谦', symbol: '䷎', interpretation: '谦亨，君子有终', symbolism: '地中有山，谦君子以裒多益寡', advice: '谦虚谨慎，宜损己益人' },
        { binary: '000100', name: '雷地豫', symbol: '䷏', interpretation: '豫，建侯行师', symbolism: '雷出地奋，豫君子以作乐崇德', advice: '安乐之时，宜兴作乐事，崇尚道德' },
        { binary: '100011', name: '泽雷随', symbol: '䷐', interpretation: '随，元亨利贞', symbolism: '泽中有雷，随君子以向晦入宴息', advice: '随顺时势，宜适时休息' },
        { binary: '110000', name: '山风蛊', symbol: '䷑', interpretation: '蛊，元亨，利涉大川', symbolism: '山下有风，蛊君子以振民育德', advice: '治乱之时，宜振兴民众，培育道德' },
        { binary: '110001', name: '地泽临', symbol: '䷒', interpretation: '临，元亨利贞', symbolism: '泽上有地，临君子以教思无穷', advice: '临事之时，宜教化民众，深思不息' },
        { binary: '000110', name: '风地观', symbol: '䷓', interpretation: '观，盥而不荐，有孚颙若', symbolism: '风行地上，观君子以省方观民', advice: '观察之时，宜省视四方，体察民情' },
        { binary: '100101', name: '火雷噬嗑', symbol: '䷔', interpretation: '噬嗑，亨，利用狱', symbolism: '雷电噬嗑，先王以明罚敕法', advice: '决断之时，宜明正刑罚，整饬法令' },
        { binary: '101100', name: '山火贲', symbol: '䷕', interpretation: '贲，亨，小利有攸往', symbolism: '山下有火，贲君子以明庶政', advice: '修饰之时，宜明察政务，文质彬彬' },
        { binary: '000001', name: '山地剥', symbol: '䷖', interpretation: '剥，不利有攸往', symbolism: '山附于地，剥上以厚下安宅', advice: '剥落之时，宜固本培元，安居守成' },
        { binary: '100000', name: '地雷复', symbol: '䷗', interpretation: '复，亨', symbolism: '地雷复，君子以休养息', advice: '回复之时，宜休养生息，恢复元气' },
        { binary: '111001', name: '天雷无妄', symbol: '䷘', interpretation: '无妄，元亨利贞', symbolism: '天雷无妄，君子以茂对时育万物', advice: '无妄之时，宜顺应时势，养育万物' },
        { binary: '100111', name: '山天大畜', symbol: '䷙', interpretation: '大畜，利贞', symbolism: '天在山中，大畜君子以多识前言往行', advice: '大畜之时，宜博学多识，积累智慧' },
        { binary: '100001', name: '山雷颐', symbol: '䷚', interpretation: '颐，贞吉', symbolism: '山雷颐，君子以慎言语节饮食', advice: '颐养之时，宜谨言慎行，节制饮食' },
        { binary: '011110', name: '泽风大过', symbol: '䷛', interpretation: '大过，栋桡，利有攸往', symbolism: '泽风大过，君子以独立不惧，遁世无闷', advice: '大过之时，宜坚守正道，独立不惧' },
        { binary: '001110', name: '坎为水', symbol: '䷜', interpretation: '习坎，有孚，维心亨', symbolism: '水洊至，习坎君子以常德行，习教事', advice: '面临险阻，心存诚信，坚守正道' },
        { binary: '101101', name: '离为火', symbol: '䷝', interpretation: '离，利贞，亨', symbolism: '明两作，大人以继明照于四方', advice: '光明正大，宜附和贤者' },
        { binary: '001111', name: '泽山咸', symbol: '䷞', interpretation: '咸，亨，利贞', symbolism: '山上有泽，咸君子以虚受人', advice: '感应之时，宜虚心接受他人' },
        { binary: '110100', name: '雷风恒', symbol: '䷟', interpretation: '恒，亨，无咎', symbolism: '雷风恒，君子以立不易方', advice: '恒久之时，宜坚守正道，不变初心' },
        { binary: '001100', name: '天山遁', symbol: '䷠', interpretation: '遁，亨，小利贞', symbolism: '天下有山，遁君子以远小人，不恶而严', advice: '隐遁之时，宜远离小人，保持威严' },
        { binary: '100100', name: '雷天大壮', symbol: '䷡', interpretation: '大壮，利贞', symbolism: '雷在天上，大壮君子以非礼弗履', advice: '强盛之时，宜守礼遵法，不越雷池' },
        { binary: '000101', name: '火地晋', symbol: '䷢', interpretation: '晋，康侯用锡马蕃庶', symbolism: '明出地上，晋君子以自昭明德', advice: '晋升之时，宜彰显美德，提升自我' },
        { binary: '101000', name: '地火明夷', symbol: '䷣', interpretation: '明夷，利艰贞', symbolism: '明入地中，明夷君子以莅众，用晦而明', advice: '艰难之时，宜韬光养晦，以柔克刚' },
        { binary: '101011', name: '风火家人', symbol: '䷤', interpretation: '家人，利女贞', symbolism: '风火家人，君子以言有物而行有恒', advice: '家庭之时，宜言行一致，持之以恒' },
        { binary: '110101', name: '火泽睽', symbol: '䷥', interpretation: '睽，小事吉', symbolism: '上火下泽，睽君子以同而异', advice: '乖离之时，宜求同存异，和而不同' },
        { binary: '001010', name: '水山蹇', symbol: '䷦', interpretation: '蹇，利西南，不利东北', symbolism: '水山蹇，君子以反身修德', advice: '艰难之时，宜反省自身，修养品德' },
        { binary: '010100', name: '雷水解', symbol: '䷧', interpretation: '解，利西南', symbolism: '雷水解，君子以赦过宥罪', advice: '解除之时，宜宽恕过错，赦免罪责' },
        { binary: '110001', name: '山泽损', symbol: '䷨', interpretation: '损，有孚，元吉', symbolism: '山泽损，君子以惩忿窒欲', advice: '减损之时，宜克制愤怒，抑制欲望' },
        { binary: '100011', name: '风雷益', symbol: '䷩', interpretation: '益，利有攸往', symbolism: '风雷益，君子以见善则迁，有过则改', advice: '增益之时，宜见善即行，有过即改' },
        { binary: '111110', name: '泽天夬', symbol: '䷪', interpretation: '夬，扬于王庭', symbolism: '泽天夬，君子以施禄及下，居德则忌', advice: '决断之时，宜施惠于下，忌居功自傲' },
        { binary: '011111', name: '天风姤', symbol: '䷫', interpretation: '姤，女壮，勿用取女', symbolism: '天下有风，姤君子以施命诰四方', advice: '相遇之时，宜发布政令，告谕四方' },
        { binary: '000110', name: '泽地萃', symbol: '䷬', interpretation: '萃，亨，王假有庙', symbolism: '泽地萃，君子以除戎器，戒不虞', advice: '聚集之时，宜整治兵器，防备不测' },
        { binary: '011000', name: '地风升', symbol: '䷭', interpretation: '升，元亨', symbolism: '地中生木，升君子以顺德，积小以高大', advice: '上升之时，宜顺应德行，积少成多' },
        { binary: '010110', name: '泽水困', symbol: '䷮', interpretation: '困，亨', symbolism: '泽无水，困君子以致命遂志', advice: '困穷之时，宜坚守志向，舍生取义' },
        { binary: '011010', name: '水风井', symbol: '䷯', interpretation: '井，改邑不改井', symbolism: '风井井，君子以劳民劝相', advice: '井养之时，宜劳民劝相，惠及他人' },
        { binary: '101110', name: '泽火革', symbol: '䷰', interpretation: '革，己日乃孚', symbolism: '泽火革，君子以治历明时', advice: '变革之时，宜革新制度，明确时令' },
        { binary: '011100', name: '火风鼎', symbol: '䷱', interpretation: '鼎，元吉，亨', symbolism: '火风鼎，君子以正位凝命', advice: '鼎新之时，宜端正位置，凝练使命' },
        { binary: '100100', name: '震为雷', symbol: '䷲', interpretation: '震，亨', symbolism: '洊雷震，君子以恐惧修省', advice: '震动之时，宜谨慎行事，修身养性' },
        { binary: '001001', name: '艮为山', symbol: '䷳', interpretation: '艮，止也', symbolism: '兼山艮，君子以思不出其位', advice: '当止则止，宜安守本分' },
        { binary: '001011', name: '风山渐', symbol: '䷴', interpretation: '渐，女归吉', symbolism: '山上有木，渐君子以居贤德善俗', advice: '渐进之时，宜居贤德，善风俗' },
        { binary: '110100', name: '雷泽归妹', symbol: '䷵', interpretation: '归妹，征凶，无攸利', symbolism: '泽上有雷，归妹君子以永终知敝', advice: '婚嫁之时，宜知终始，防微杜渐' },
        { binary: '101100', name: '雷火丰', symbol: '䷶', interpretation: '丰，亨，王假之', symbolism: '雷火丰，君子以折狱致刑', advice: '丰盛之时，宜明断案件，公正施刑' },
        { binary: '001101', name: '火山旅', symbol: '䷷', interpretation: '旅，小亨', symbolism: '山上有火，旅君子以明慎用刑而不留狱', advice: '旅行之时，宜谨慎用刑，不滞留狱案' },
        { binary: '011011', name: '巽为风', symbol: '䷸', interpretation: '巽，小亨', symbolism: '随风巽，君子以申命行事', advice: '顺从之时，宜发布政令，推行政策' },
        { binary: '110110', name: '兑为泽', symbol: '䷹', interpretation: '兑，说也', symbolism: '丽泽兑，君子以朋友讲习', advice: '和悦之时，宜与朋友交流学习' },
        { binary: '010011', name: '风水涣', symbol: '䷺', interpretation: '涣，亨', symbolism: '风行水上，涣先王以享于帝立庙', advice: '涣散之时，宜祭祀立庙，凝聚人心' },
        { binary: '110010', name: '水泽节', symbol: '䷻', interpretation: '节，亨', symbolism: '水上有泽，节君子以制数度，议德行', advice: '节制之时，宜制定法度，评议德行' },
        { binary: '110011', name: '风泽中孚', symbol: '䷼', interpretation: '中孚，豚鱼吉', symbolism: '泽上有风，中孚君子以议狱缓死', advice: '诚信之时，宜审议狱案，宽缓死刑' },
        { binary: '001100', name: '雷山小过', symbol: '䷽', interpretation: '小过，亨，利贞', symbolism: '山上有雷，小过君子以行过乎恭，丧过乎哀', advice: '小过之时，宜行为恭敬，哀丧适度' },
        { binary: '101010', name: '水火既济', symbol: '䷾', interpretation: '既济，亨小', symbolism: '水在火上，既济君子以思患而豫防之', advice: '成功之时，宜思患预防，居安思危' },
        { binary: '010101', name: '火水未济', symbol: '䷿', interpretation: '未济，亨', symbolism: '火在水上，未济君子以慎辨物居方', advice: '未成之时，宜谨慎辨别，各安其位' }
    ];

        const matchedGua = guas.find(gua => gua.binary === binary);
        
        console.log('匹配到的卦:', matchedGua);

        if (matchedGua) {
            return matchedGua;
        } else {
            console.log('未找到匹配的卦，返回默认的未济卦');
            return {
                name: '未济',
                symbol: '䷿',
                interpretation: '事未成，需继续努力',
                symbolism: '火水未济，君子以慎辨物居方',
                advice: '事情尚未完成，需要继续努力'
            };
        }
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
            5: '五爻变动，尊位之变，可大有作为',
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