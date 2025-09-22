/**
 * 蓍草法算法测试脚本 - Node.js版本
 */

// 模拟浏览器环境
global.window = global;
global.document = { readyState: 'complete' };

// 加载必要的文件
const fs = require('fs');
const path = require('path');

// 读取并执行utils.js
const utilsPath = path.join(__dirname, 'utils.js');
const utilsCode = fs.readFileSync(utilsPath, 'utf8');
eval(utilsCode);

// 模拟日志函数
function addLog(message, level = 'info') {
    console.log(`[${new Date().toLocaleTimeString()}] ${message}`);
}

// 测试函数
function testStalksAlgorithm() {
    const StalksAlgorithm = window.StalksAlgorithm;
    const MathUtils = window.MathUtils;
    
    if (!StalksAlgorithm || !MathUtils) {
        console.error('无法加载算法类');
        return;
    }
    
    console.log('=== 蓍草法算法测试开始 ===');
    
    // 测试多次占卜，看是否产生不同的结果
    const testCount = 10;
    const results = [];
    
    for (let i = 0; i < testCount; i++) {
        console.log(`\n--- 第 ${i + 1} 次测试 ---`);
        
        const yaos = [];
        const changeResults = [];
        let currentStalks = 49;
        let currentYao = 0;
        
        // 模拟6爻的生成过程
        for (let yao = 0; yao < 6; yao++) {
            currentStalks = 49; // 每爻重新开始
            const yaoResults = [];
            
            // 每爻进行3变
            for (let change = 0; change < 3; change++) {
                const result = StalksAlgorithm.performChangeManual(
                    currentStalks,
                    change,
                    yao,
                    yaoResults,
                    null, // leftGroup
                    null, // rightGroup
                    addLog
                );
                
                if (!result || !result.success) {
                    console.error(`第 ${yao + 1} 爻第 ${change + 1} 变失败`);
                    break;
                }
                
                currentStalks = result.remainingStalks;
            }
            
            // 计算爻值
            if (yaoResults.length === 3) {
                const yaoValue = StalksAlgorithm.calculateYaoValue(yaoResults, addLog);
                if (yaoValue !== null) {
                    yaos.push(yaoValue);
                    console.log(`第 ${yao + 1} 爻值: ${yaoValue}`);
                } else {
                    console.error(`第 ${yao + 1} 爻值计算失败`);
                    break;
                }
            } else {
                console.error(`第 ${yao + 1} 爻变数不足`);
                break;
            }
        }
        
        if (yaos.length === 6) {
            // 计算卦象
            const gua = StalksAlgorithm.calculateGuaFromYaos(yaos);
            results.push({
                yaos: yaos,
                gua: gua
            });
            console.log(`本卦: ${gua.name} (${gua.symbol})`);
            console.log(`爻值: ${yaos.join(', ')}`);
        } else {
            console.error('占卜失败，爻数不足');
        }
    }
    
    // 分析结果
    console.log('\n=== 测试结果分析 ===');
    const guaCount = {};
    const yaoPatterns = {};
    
    results.forEach((result, index) => {
        const guaName = result.gua.name;
        const yaoPattern = result.yaos.join(',');
        
        // 统计卦象出现次数
        guaCount[guaName] = (guaCount[guaName] || 0) + 1;
        
        // 统计爻值模式
        yaoPatterns[yaoPattern] = (yaoPatterns[yaoPattern] || 0) + 1;
        
        console.log(`测试 ${index + 1}: ${guaName} (${result.gua.symbol}) - 爻值: ${result.yaos.join(', ')}`);
    });
    
    console.log('\n--- 卦象统计 ---');
    Object.entries(guaCount).forEach(([gua, count]) => {
        console.log(`${gua}: ${count} 次 (${(count / results.length * 100).toFixed(1)}%)`);
    });
    
    console.log('\n--- 爻值模式统计 ---');
    Object.entries(yaoPatterns).forEach(([pattern, count]) => {
        console.log(`${pattern}: ${count} 次`);
    });
    
    // 检查是否有重复
    const uniqueGuas = new Set(results.map(r => r.gua.name));
    const uniquePatterns = new Set(results.map(r => r.yaos.join(',')));
    
    console.log(`\n--- 总结 ---`);
    console.log(`总测试次数: ${results.length}`);
    console.log(`不同卦象数: ${uniqueGuas.size}`);
    console.log(`不同爻值模式数: ${uniquePatterns.size}`);
    
    if (uniqueGuas.size > 1) {
        console.log('✅ 测试通过：算法产生了不同的卦象');
    } else {
        console.log('❌ 测试失败：算法总是产生相同的卦象');
    }
    
    if (uniquePatterns.size > 1) {
        console.log('✅ 测试通过：算法产生了不同的爻值模式');
    } else {
        console.log('❌ 测试失败：算法总是产生相同的爻值模式');
    }
}

// 运行测试
testStalksAlgorithm();