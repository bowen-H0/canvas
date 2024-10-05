document.getElementById('COLOR').style.display = "none";
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const circle = document.getElementById('circle');
ctx.fillStyle = '#fff';
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let previousX = null;
let previousY = null;
var model = "PEN";
var PEN_color = "#000"
var PEN_size = 5;
// 开始绘画
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});
// 结束绘画
canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    ctx.beginPath(); // 开始新的路径
    previousX = null;
    previousY = null;
});
// 绘制
canvas.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    // 更新圆形位置
    circle.style.left = `${x - circle.offsetWidth / 2}px`; // 使圆形中心跟随鼠标
    circle.style.top = `${y - circle.offsetHeight / 2}px`; // 使圆形中心跟随鼠标
    if (!isDrawing) return; // 如果没有按下鼠标，则不绘制
    if (model === "RUBBER") {
        const diameter = PEN_size;
        if (previousX !== null && previousY !== null) {
            // 在之前的点和当前点之间擦除
            const distance = Math.hypot(e.offsetX - previousX, e.offsetY - previousY);
            const steps = Math.ceil(distance / 5); // 每 5 像素擦除一次
            for (let i = 0; i <= steps; i++) {
                const x = previousX + ((e.offsetX - previousX) / steps) * i;
                const y = previousY + ((e.offsetY - previousY) / steps) * i;
                ctx.clearRect(x-diameter/2, y-diameter/2, diameter, diameter);
            }
        }
        previousX = e.offsetX;
        previousY = e.offsetY;
        return;
    }
    if (PEN_size > 7) {
        const diameter = PEN_size;
        if (previousX !== null && previousY !== null) {
            const distance = Math.hypot(e.offsetX - previousX, e.offsetY - previousY);
            const steps = Math.ceil(distance / 5);
            for (let i = 0; i <= steps; i++) {
                const x = previousX + ((e.offsetX - previousX) / steps) * i;
                const y = previousY + ((e.offsetY - previousY) / steps) * i;
                ctx.fillStyle = PEN_color;
                // 开始绘制圆形
                ctx.beginPath();
                ctx.arc(x, y , diameter/2, 0, Math.PI * 2, true);
                ctx.fill(); // 填充圆形
                ctx.closePath();
            }
        }
        previousX = e.offsetX;
        previousY = e.offsetY;
        return;
    }
    ctx.strokeStyle = PEN_color; // 设置画笔颜色
    ctx.lineWidth = PEN_size; // 设置画笔宽度
    ctx.lineJoin = 'round'; // 设置线条连接样式
    ctx.beginPath(); // 开始新的路径
    const distance = Math.hypot(e.offsetX - lastX, e.offsetY - lastY);
    const steps = Math.ceil(distance / 5); // 控制插值点的数量

    for (let i = 0; i <= steps; i++) {
        const x = lastX + ((e.offsetX - lastX) / steps) * i;
        const y = lastY + ((e.offsetY - lastY) / steps) * i;
        if (i === 0) {
            ctx.moveTo(x, y); // 移动到起点
        } else {
            ctx.lineTo(x, y); // 绘制线到下一个插值点
        }
    }
    ctx.stroke(); // 绘制路径
    [lastX, lastY] = [e.offsetX, e.offsetY]; // 更新最后的坐标
});
function Choose_Border() {
    if (model == "PEN") {
        document.getElementById('pen').style.border = "3px solid red";
        document.getElementById('rubber').style.border = "1px solid black";
    } else {
        document.getElementById('pen').style.border = "1px solid black";
        document.getElementById('rubber').style.border = "3px solid red";
    }
}
// 清除画布
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function Use_rubber() {
    model = "RUBBER";
    Choose_Border();
    circle.style.borderRadius="0%";
    circle.style.backgroundColor="rgba(128, 128, 128, 0.2)"
} function Use_pen() {
    model = "PEN";
    Choose_Border();
    circle.style.borderRadius="50%";circle.style.backgroundColor="rgba(0, 0, 0, 0.2)"
} function Choose_Color() {
    const colorContainer = document.getElementById('COLOR');
    colorContainer.style.display = "block"; // 显示颜色按钮容器
    

    const ColorID = [
        "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF",
        "#FFFF00", "#00FFFF", "#FF00FF", "#808080", "#FFA500",
        "#800080", "#FFC0CB", "#A52A2A"
    ];
    // 清空容器
    colorContainer.innerHTML = '';

    // 创建颜色按钮
    ColorID.forEach(color => {
        const button = document.createElement('div');
        button.className = 'colorButton';
        button.style.backgroundColor = color; // 设置背景颜色
        // 添加点击事件
        button.onclick = () => {
            PEN_color = color; // 设置所选颜色
            console.log("选择的颜色: ", color); // 在控制台输出选择的颜色
            document.getElementById('COLOR').style.display = "none";
            model = "PEN";
            Choose_Border();
            document.getElementById('ChooseColor').style.backgroundColor = color;
            circle.style.borderRadius="50%";circle.style.backgroundColor="rgba(0, 0, 0, 0.2)"
        };
        colorContainer.appendChild(button); // 将按钮添加到容器中
    });
}
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});
// 更新当前值显示
document.getElementById('sizeSlider').addEventListener('input', () => {
    document.getElementById('sizeSliderP').textContent = `Size:${document.getElementById('sizeSlider').value}`;
    PEN_size = document.getElementById('sizeSlider').value;
    circle.style.width=document.getElementById('sizeSlider').value+"px";
    circle.style.height=document.getElementById('sizeSlider').value+"px";
});
canvas.addEventListener('mouseleave', () => {
    circle.style.display="none";
});

canvas.addEventListener('mouseenter', () => {
    circle.style.display="block";
});
Choose_Border();