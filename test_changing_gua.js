/**
 * 测试变卦计算功能
 */

// 引入必要的工具函数
const { StalksAlgorithm } = window;

// 测试用例
const testCases = [
    {
        name: '测试案例1：风水涣（有老阳变爻）',
        yaos: [8, 7, 8, 8, 9, 7], // 原始卦：风水涣，第5爻是老阳
        expectedChangingGua: [8, 7, 8, 8, 8, 7], // 变卦应该是：水风井
        expectedChangingGuaName: '水风井'
    },
    {
        name: '测试案例2：乾为天（有多个老阳变爻）',
        yaos: [9, 9, 9, 9, 9, 9], // 原始卦：乾为天，所有爻都是老阳
        expectedChangingGua: [8, 8, 8, 8, 8, 8], // 变卦应该是：坤为地
        expectedChangingGuaName: '坤为地'
    },
    {
        name: '测试案例3：坤为地（有多个老阴变爻）',
        yaos: [6, 6, 6, 6, 6, 6], // 原始卦：坤为地，所有爻都是老阴
        expectedChangingGua: [7, 7, 7, 7, 7, 7], // 变卦应该是：乾为天
        expectedChangingGuaName: '乾为天'
    },
    {
        name: '测试案例4：无变爻的情况',
        yaos: [7, 8, 7, 8, 7, 8], // 原始卦：无变爻
        expectedChangingGua: [7, 8, 7, 8, 7, 8], // 变卦应该与原卦相同
        expectedChangingGuaName: null // 应该与原卦相同
    }
];

// 运行测试
function runTests() {
    console.log('开始测试变卦计算功能...\n');
    
    let passed = 0;
    let failed = 0;
    
    testCases.forEach((testCase, index) => {
        console.log(`测试案例 ${index + 1}: ${testCase.name}`);
        console.log(`原始卦: ${testCase.yaos.join(', ')}`);
        
        // 计算变卦
        const changingGua = StalksAlgorithm.calculateChangingGua(testCase.yaos);
        console.log(`计算得到的变卦: ${changingGua.join(', ')}`);
        console.log(`期望的变卦: ${testCase.expectedChangingGua.join(', ')}`);
        
        // 验证变卦计算是否正确
        const guaMatch = changingGua.every((val, idx) => val === testCase.expectedChangingGua[idx]);
        
        if (guaMatch) {
            console.log('✅ 变卦计算正确');
            passed++;
        } else {
            console.log('❌ 变卦计算错误');
            failed++;
        }
        
        // 计算变卦对应的卦象
        const changingGuaData = StalksAlgorithm.calculateGuaFromYaos(changingGua);
        console.log(`变卦名称: ${changingGuaData.name}`);
        console.log(`变卦符号: ${changingGuaData.symbol}`);
        
        if (testCase.expectedChangingGuaName) {
            if (changingGuaData.name === testCase.expectedChangingGuaName) {
                console.log('✅ 变卦名称正确');
                passed++;
            } else {
                console.log(`❌ 变卦名称错误，期望: ${testCase.expectedChangingGuaName}, 实际: ${changingGuaData.name}`);
                failed++;
            }
        }
        
        console.log('---\n');
    });
    
    console.log(`测试完成: 通过 ${passed} 个，失败 ${failed} 个`);
}

// 如果在浏览器环境中，添加测试按钮
if (typeof window !== 'undefined') {
    window.runTests = runTests;
    
    // 创建测试按钮
    const testButton = document.createElement('button');
    testButton.textContent = '运行变卦测试';
    testButton.style.position = 'fixed';
    testButton.style.top = '10px';
    testButton.style.right = '10px';
    testButton.style.padding = '10px';
    testButton.style.backgroundColor = '#4CAF50';
    testButton.style.color = 'white';
    testButton.style.border = 'none';
    testButton.style.borderRadius = '5px';
    testButton.style.cursor = 'pointer';
    testButton.style.zIndex = '1000';
    
    testButton.addEventListener('click', () => {
        runTests();
    });
    
    document.body.appendChild(testButton);
    
    console.log('变卦测试功能已加载，点击右上角的按钮运行测试');
}

// 在Node.js环境中直接运行
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runTests, testCases };
}