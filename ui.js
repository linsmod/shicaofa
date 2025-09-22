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
        this.isDragging = false;
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

        // 计算绘制位置（按下时添加位移）
        const offsetX = this.isPressed ? 2 : 0;
        const offsetY = this.isPressed ? 2 : 0;
        const drawX = this.x + offsetX;
        const drawY = this.y + offsetY;

        // 绘制按钮背景
        if (this.backgroundColor.startsWith('linear-gradient')) {
            // 解析渐变字符串中的颜色值
            const gradientMatch = this.backgroundColor.match(/linear-gradient\([^,]+,\s*([^,]+),\s*([^)]+)\)/);
            if (gradientMatch) {
                const color1 = gradientMatch[1].trim();
                const color2 = gradientMatch[2].trim();
                
                const gradient = ctx.createLinearGradient(drawX, drawY, drawX, drawY + this.height);
                if (this.isPressed) {
                    gradient.addColorStop(0, color2);
                    gradient.addColorStop(1, color1);
                } else {
                    gradient.addColorStop(0, color1);
                    gradient.addColorStop(1, color2);
                }
                ctx.fillStyle = gradient;
            } else {
                // 如果解析失败，使用默认颜色
                const gradient = ctx.createLinearGradient(drawX, drawY, drawX, drawY + this.height);
                if (this.isPressed) {
                    gradient.addColorStop(0, '#A0522D');
                    gradient.addColorStop(1, '#8B4513');
                } else {
                    gradient.addColorStop(0, '#8B4513');
                    gradient.addColorStop(1, '#A0522D');
                }
                ctx.fillStyle = gradient;
            }
        } else {
            ctx.fillStyle = this.backgroundColor;
        }

        // 绘制圆角矩形
        this.drawRoundedRect(ctx, drawX, drawY, this.width, this.height, 25);

        // 绘制边框
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = this.borderWidth;
        ctx.stroke();

        // 绘制文字
        ctx.fillStyle = this.textColor;
        ctx.font = `${this.fontWeight} ${this.fontSize} "Microsoft YaHei", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.text, drawX + this.width / 2, drawY + this.height / 2);
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

    // 鼠标按下事件
    handleMouseDown(x, y) {
        if (this.isPointInside(x, y)) {
            this.isPressed = true;
            this.isDragging = true;
            return true;
        }
        return false;
    }

    // 鼠标释放事件
    handleMouseUp(x, y) {
        if (this.isPressed && this.isPointInside(x, y)) {
            this.isPressed = false;
            if (this.onClick) {
                this.onClick();
            }
            return true;
        }
        this.isPressed = false;
        this.isDragging = false;
        return false;
    }

    // 鼠标移动事件
    handleMouseMove(x, y) {
        if (this.isDragging) {
            const wasInside = this.isPressed;
            const isInside = this.isPointInside(x, y);
            
            if (wasInside && !isInside) {
                // 鼠标移出按钮区域
                this.isPressed = false;
            } else if (!wasInside && isInside) {
                // 鼠标移入按钮区域
                this.isPressed = true;
            }
            return true;
        }
        
        // 更新悬停状态
        const wasHovered = this.isHovered;
        this.isHovered = this.isPointInside(x, y);
        
        return wasHovered !== this.isHovered;
    }

    // 鼠标离开事件
    handleMouseLeave() {
        this.isPressed = false;
        this.isDragging = false;
        this.isHovered = false;
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
        this.originalGuaName = ''; // 本卦名称
        this.originalGuaSymbol = ''; // 本卦符号
        this.originalYaos = []; // 本卦爻值
        this.changingGuaName = ''; // 变卦名称
        this.changingGuaSymbol = ''; // 变卦符号
        this.changingYaos = []; // 变卦爻值
        this.changingYaoIndices = []; // 变爻位置
    }

    setGuaData(originalName, originalSymbol, originalYaos, changingGuaData = null) {
        this.originalGuaName = originalName;
        this.originalGuaSymbol = originalSymbol;
        this.originalYaos = originalYaos;
        
        // 计算变爻位置
        this.changingYaoIndices = originalYaos
            .map((yao, index) => yao === 9 || yao === 6 ? index + 1 : null)
            .filter(yao => yao !== null);
        
        // 如果提供了变卦数据，使用它；否则计算变卦
        if (changingGuaData) {
            this.changingGuaName = changingGuaData.name;
            this.changingGuaSymbol = changingGuaData.symbol;
            this.changingYaos = changingGuaData.yaos;
        } else {
            // 计算变卦爻值
            this.changingYaos = originalYaos.map(yao => {
                if (yao === 6) return 7; // 老阴变少阳
                if (yao === 9) return 8; // 老阳变少阴
                return yao; // 少阴少阳不变
            });
            
            // 计算变卦
            const changingGua = StalksAlgorithm.calculateGuaFromYaos(this.changingYaos);
            this.changingGuaName = changingGua.name;
            this.changingGuaSymbol = changingGua.symbol;
        }
    }

    render(ctx) {
        if (!this.visible) return;

        // 绘制本卦信息
        this.renderGua(ctx, this.originalGuaName, this.originalGuaSymbol, this.originalYaos, this.y + 30, '本卦');
        
        // 绘制变卦信息
        if (this.changingYaoIndices.length > 0) {
            this.renderGua(ctx, this.changingGuaName, this.changingGuaSymbol, this.changingYaos, this.y + 180, '变卦');
            
            // 绘制变爻信息
            ctx.fillStyle = '#FFD700';
            ctx.font = '1rem "Microsoft YaHei", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`变爻：第${this.changingYaoIndices.join('、')}爻`, this.x + this.width / 2, this.y + 320);
        }
    }

    /**
     * 渲染单个卦象
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     * @param {string} name - 卦名
     * @param {string} symbol - 卦符号
     * @param {Array} yaos - 爻值数组
     * @param {number} startY - 起始Y坐标
     * @param {string} title - 标题（本卦/变卦）
     */
    renderGua(ctx, name, symbol, yaos, startY, title) {
        // 绘制标题
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 1.2rem "Microsoft YaHei", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${title}：${symbol} ${name}`, this.x + this.width / 2, startY);
        
        // 绘制六爻
        const yaoWidth = 100;
        const yaoHeight = 12;
        const yaoSpacing = 4;
        const yaoStartY = startY + 30;

        for (let i = 5; i >= 0; i--) {
            const yaoValue = yaos[i];
            const yaoY = yaoStartY + (5 - i) * (yaoHeight + yaoSpacing);
            const yaoX = this.x + (this.width - yaoWidth) / 2;

            // 绘制爻
            this.drawYao(ctx, yaoX, yaoY, yaoWidth, yaoHeight, yaoValue);
            
            // 如果是变爻（老阳或老阴），在爻的旁边添加文字说明
            if (yaoValue === 9 || yaoValue === 6) {
                ctx.fillStyle = '#90EE90';
                ctx.font = '0.7rem "Microsoft YaHei", sans-serif';
                ctx.textAlign = 'left';
                const yaoName = yaoValue === 9 ? '老阳' : '老阴';
                ctx.fillText(yaoName, yaoX + yaoWidth + 5, yaoY + yaoHeight / 2 + 2);
            }
        }
    }

    drawYao(ctx, x, y, width, height, yaoValue) {
        ctx.fillStyle = '#FFD700';
        
        if (yaoValue === 9) {
            // 老阳 ⚊ - 实线
            ctx.fillRect(x, y, width, height);
        } else if (yaoValue === 8) {
            // 少阴 ⚋ - 断线
            ctx.fillRect(x, y, width / 2 - 6, height);
            ctx.fillRect(x + width / 2 + 6, y, width / 2 - 6, height);
        } else if (yaoValue === 7) {
            // 少阳 ⚊ - 实线
            ctx.fillRect(x, y, width, height);
        } else if (yaoValue === 6) {
            // 老阴 ⚋ - 断线
            ctx.fillRect(x, y, width / 2 - 6, height);
            ctx.fillRect(x + width / 2 + 6, y, width / 2 - 6, height);
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