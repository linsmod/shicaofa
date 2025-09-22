/**
 * UI组件库
 */

/**
 * 按钮组件
 */
class Button extends UIElement {
    constructor(x, y, width, height, text, onClick) {
        super(x, y, width, height);
        this.text = text;
        this.onClick = onClick;
        this.backgroundColor = 'linear-gradient(to bottom, #8B4513, #A0522D)';
        this.textColor = '#fff';
        this.fontSize = '1rem';
        this.fontWeight = 'normal';
        this.borderColor = '#8B4513';
        this.borderWidth = 1;
        this.isHovered = false;
        this.isPressed = false;
    }

    setBackgroundColor(color) {
        this.backgroundColor = color;
    }

    setTextColor(color) {
        this.textColor = color;
    }

    setFontSize(size) {
        this.fontSize = size;
    }

    setFontWeight(weight) {
        this.fontWeight = weight;
    }

    setBorderColor(color) {
        this.borderColor = color;
    }

    setBorderWidth(width) {
        this.borderWidth = width;
    }

    render(ctx) {
        if (!this.visible || !this.enabled) return;

        // 绘制按钮背景
        if (this.backgroundColor.startsWith('linear-gradient')) {
            // 简化的渐变效果
            const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
            if (this.isPressed) {
                gradient.addColorStop(0, '#A0522D');
                gradient.addColorStop(1, '#8B4513');
            } else {
                gradient.addColorStop(0, '#8B4513');
                gradient.addColorStop(1, '#A0522D');
            }
            ctx.fillStyle = gradient;
        } else {
            ctx.fillStyle = this.backgroundColor;
        }

        // 绘制圆角矩形
        this.drawRoundedRect(ctx, this.x, this.y, this.width, this.height, 25);

        // 绘制边框
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = this.borderWidth;
        ctx.stroke();

        // 绘制文字
        ctx.fillStyle = this.textColor;
        ctx.font = `${this.fontWeight} ${this.fontSize} "Microsoft YaHei", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
    }

    drawRoundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
    }

    isPointInside(x, y) {
        return super.isPointInside(x, y) && this.enabled;
    }
}

/**
 * 设置面板组件
 */
class SettingsPanel extends UIElement {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.visible = false;
        this.title = '设置';
        this.showDotsChecked = true;
        this.showLogsChecked = false;
        this.closeButton = new Button(x + width - 30, y, 30, 20, '×', () => this.setVisible(false));
        this.closeButton.setFontSize('1.2rem');
        this.closeButton.setTextColor('#FFD700');
    }

    render(ctx) {
        if (!this.visible) return;

        // 绘制面板背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.drawRoundedRect(ctx, this.x, this.y, this.width, this.height, 10);

        // 绘制边框
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 绘制标题
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 1rem "Microsoft YaHei", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(this.title, this.x + 10, this.y + 25);

        // 绘制设置选项
        ctx.fillStyle = '#fff';
        ctx.font = '0.9rem "Microsoft YaHei", sans-serif';
        
        // 显示圆点选项
        ctx.fillText('显示圆点', this.x + 10, this.y + 50);
        this.drawCheckbox(ctx, this.x + 120, this.y + 40, this.showDotsChecked);

        // 显示日志选项
        ctx.fillText('显示日志', this.x + 10, this.y + 75);
        this.drawCheckbox(ctx, this.x + 120, this.y + 65, this.showLogsChecked);

        // 渲染关闭按钮
        this.closeButton.render(ctx);
    }

    drawRoundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
    }

    drawCheckbox(ctx, x, y, checked) {
        // 绘制复选框
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, 15, 15);

        if (checked) {
            // 绘制勾选标记
            ctx.beginPath();
            ctx.moveTo(x + 3, y + 7);
            ctx.lineTo(x + 6, y + 10);
            ctx.lineTo(x + 12, y + 4);
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    setShowDots(checked) {
        this.showDotsChecked = checked;
    }

    setShowLogs(checked) {
        this.showLogsChecked = checked;
    }

    isPointInside(x, y) {
        return super.isPointInside(x, y) && this.visible;
    }
}

/**
 * 游戏信息面板组件
 */
class GameInfoPanel extends UIElement {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.leftCount = 0;
        this.rightCount = 0;
        this.handCount = 0;
        this.remainingStalks = 49;
        this.currentChange = 0;
        this.currentYao = 0;
    }

    setCounts(left, right, hand) {
        this.leftCount = left;
        this.rightCount = right;
        this.handCount = hand;
    }

    setAlgorithmInfo(remaining, change, yao) {
        this.remainingStalks = remaining;
        this.currentChange = change;
        this.currentYao = yao;
    }

    render(ctx) {
        // 绘制面板背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        this.drawRoundedRect(ctx, this.x, this.y, this.width, this.height, 3);

        // 绘制边框
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // 绘制分组状态
        ctx.fillStyle = '#FFD700';
        ctx.font = '0.8rem "Microsoft YaHei", sans-serif';
        ctx.textAlign = 'center';

        const handStatusY = this.y + 20;
        const leftX = this.x + 80;
        const rightX = this.x + this.width / 2;
        const handX = this.x + this.width - 80;

        // 左组
        ctx.fillText('左组', leftX, handStatusY);
        ctx.fillStyle = '#FF69B4';
        ctx.font = 'bold 0.9rem "Microsoft YaHei", sans-serif';
        ctx.fillText(this.leftCount.toString(), leftX, handStatusY + 15);

        // 右组
        ctx.fillStyle = '#FFD700';
        ctx.font = '0.8rem "Microsoft YaHei", sans-serif';
        ctx.fillText('右组', rightX, handStatusY);
        ctx.fillStyle = '#FF69B4';
        ctx.font = 'bold 0.9rem "Microsoft YaHei", sans-serif';
        ctx.fillText(this.rightCount.toString(), rightX, handStatusY + 15);

        // 一旁
        ctx.fillStyle = '#FFD700';
        ctx.font = '0.8rem "Microsoft YaHei", sans-serif';
        ctx.fillText('一旁', handX, handStatusY);
        ctx.fillStyle = '#FF69B4';
        ctx.font = 'bold 0.9rem "Microsoft YaHei", sans-serif';
        ctx.fillText(this.handCount.toString(), handX, handStatusY + 15);

        // 绘制算法信息
        ctx.fillStyle = '#FFD700';
        ctx.font = '0.7rem "Microsoft YaHei", sans-serif';
        ctx.textAlign = 'left';

        const algorithmY = this.y + 50;
        const infoSpacing = this.width / 3;

        ctx.fillText(`剩余蓍草：${this.remainingStalks}根`, this.x + 10, algorithmY);
        ctx.fillText(`变数：${this.currentChange}/3`, this.x + 10 + infoSpacing, algorithmY);
        ctx.fillText(`爻数：${this.currentYao}/6`, this.x + 10 + infoSpacing * 2, algorithmY);
    }

    drawRoundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
    }
}

/**
 * 卦象显示组件
 */
class GuaDisplay extends UIElement {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.guaName = '';
        this.guaSymbol = '';
        this.yaos = [];
        this.changingYaos = [];
    }

    setGuaData(name, symbol, yaos) {
        this.guaName = name;
        this.guaSymbol = symbol;
        this.yaos = yaos;
        this.changingYaos = yaos.filter(yao => yao === 9 || yao === 6).map((_, index) => index + 1);
    }

    render(ctx) {
        if (!this.visible) return;

        // 绘制卦名
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 2rem "Microsoft YaHei", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${this.guaSymbol} ${this.guaName}卦`, this.x + this.width / 2, this.y + 30);

        // 绘制六爻
        const yaoWidth = 120;
        const yaoHeight = 15;
        const yaoSpacing = 5;
        const startY = this.y + 70;

        for (let i = 5; i >= 0; i--) {
            const yaoValue = this.yaos[i];
            const yaoY = startY + (5 - i) * (yaoHeight + yaoSpacing);

            this.drawYao(ctx, this.x + (this.width - yaoWidth) / 2, yaoY, yaoWidth, yaoHeight, yaoValue);
        }

        // 绘制变爻信息
        if (this.changingYaos.length > 0) {
            ctx.fillStyle = '#FFD700';
            ctx.font = '1rem "Microsoft YaHei", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`变爻：第${this.changingYaos.join('、')}爻`, this.x + this.width / 2, this.y + 200);
        }
    }

    drawYao(ctx, x, y, width, height, yaoValue) {
        ctx.fillStyle = '#FFD700';
        
        if (yaoValue === 9) {
            // 老阳 ⚊○ - 实线中间加圆圈
            ctx.fillRect(x, y, width, height);
            ctx.fillStyle = '#228B22'; // 使用背景色来创建"透明"效果
            ctx.beginPath();
            ctx.arc(x + width - 15, y + height/2, 6, 0, Math.PI * 2);
            ctx.fill();
        } else if (yaoValue === 8) {
            // 少阴 ⚋ - 断线
            ctx.fillRect(x, y, width / 2 - 8, height);
            ctx.fillRect(x + width / 2 + 8, y, width / 2 - 8, height);
        } else if (yaoValue === 7) {
            // 少阳 ⚊ - 实线（修复完整显示）
            ctx.fillRect(x, y, width, height);
        } else if (yaoValue === 6) {
            // 老阴 ⚋○ - 断线中间加圆圈
            ctx.fillRect(x, y, width / 2 - 8, height);
            ctx.fillRect(x + width / 2 + 8, y, width / 2 - 8, height);
            ctx.fillStyle = '#228B22'; // 使用背景色来创建"透明"效果
            ctx.beginPath();
            ctx.arc(x + width / 2, y + height/2, 6, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

/**
 * 进度条组件
 */
class ProgressBar extends UIElement {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.progress = 0; // 0-1
        this.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        this.foregroundColor = '#FFD700';
        this.title = '进度';
    }

    setProgress(progress) {
        this.progress = Math.max(0, Math.min(1, progress));
    }

    setTitle(title) {
        this.title = title;
    }

    setBackgroundColor(color) {
        this.backgroundColor = color;
    }

    setForegroundColor(color) {
        this.foregroundColor = color;
    }

    render(ctx) {
        if (!this.visible) return;

        // 绘制背景
        ctx.fillStyle = this.backgroundColor;
        this.drawRoundedRect(ctx, this.x, this.y, this.width, this.height, 5);

        // 绘制进度
        ctx.fillStyle = this.foregroundColor;
        const progressWidth = this.width * this.progress;
        this.drawRoundedRect(ctx, this.x, this.y, progressWidth, this.height, 5);

        // 绘制标题
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 14px "Microsoft YaHei", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(this.title, this.x + 10, this.y + 20);

        // 绘制进度文本
        ctx.fillStyle = '#fff';
        ctx.font = '12px "Microsoft YaHei", sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`${Math.round(this.progress * 100)}%`, this.x + this.width - 10, this.y + 20);
    }

    drawRoundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
    }
}

// 导出UI组件到全局作用域
if (typeof window !== 'undefined') {
    window.Button = Button;
    window.SettingsPanel = SettingsPanel;
    window.GameInfoPanel = GameInfoPanel;
    window.GuaDisplay = GuaDisplay;
    window.ProgressBar = ProgressBar;
}