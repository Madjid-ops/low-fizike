        const canvas = document.getElementById('Canvas');
        const ctx = canvas.getContext('2d');
        let animationProgress = 0;
        let targetColor = { r: 100, g: 150, b: 255 };
        let currentColor = { r: 100, g: 150, b: 255 };

        function getColorFromTemp(deltaT) {
            if (deltaT < -20) {
                return { r: 0, g: 100, b: 255, name: 'بارد جداً' };
            } else if (deltaT < 0) {
                return { r: 50, g: 150, b: 255, name: 'بارد' };
            } else if (deltaT < 20) {
                return { r: 100, g: 200, b: 100, name: 'معتدل' };
            } else if (deltaT < 50) {
                return { r: 255, g: 150, b: 50, name: 'دافئ' };
            } else {
                return { r: 255, g: 50, b: 50, name: 'ساخن جداً' };
            }
        }

        function drawVisualization() {
            ctx.clearRect(0, 0, canvas.width, canvas.height); //مسح صهىؤخى
            
           
            const gradient = ctx.createRadialGradient(175, 175, 50, 175, 175, 150);
            gradient.addColorStop(0, `rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, 0.8)`);
            gradient.addColorStop(1, `rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, 0.1)`);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

           
            ctx.save();
            ctx.translate(175, 175);
            
            // طيف
            const glowGradient = ctx.createRadialGradient(0, 0, 60, 0, 0, 80);
            glowGradient.addColorStop(0, `rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, 0.6)`);
            glowGradient.addColorStop(1, `rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, 0)`);
            ctx.fillStyle = glowGradient;
            ctx.beginPath();
            ctx.arc(0, 0, 80, 0, Math.PI * 2);
            ctx.fill();

         
            const sphereGradient = ctx.createRadialGradient(-20, -20, 10, 0, 0, 60);
            sphereGradient.addColorStop(0, `rgb(${Math.min(currentColor.r + 100, 255)}, ${Math.min(currentColor.g + 100, 255)}, ${Math.min(currentColor.b + 100, 255)})`);
            sphereGradient.addColorStop(1, `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`);
            
            ctx.fillStyle = sphereGradient;
            ctx.beginPath();
            ctx.arc(0, 0, 60, 0, Math.PI * 2);
            ctx.fill();
            
            // circl border
            ctx.strokeStyle = `rgba(${currentColor.r * 0.7}, ${currentColor.g * 0.7}, ${currentColor.b * 0.7}, 0.8)`;
            ctx.lineWidth = 3;
            ctx.stroke();

            // sun particels
            const deltaT = parseFloat(document.getElementById('deltaT').value) || 0;
            const particleCount = Math.min(Math.abs(deltaT) * 2, 50);
            
            for (let i = 0; i < particleCount; i++) {
                const angle = (Date.now() / 1000 + i) % (Math.PI * 2);
                const radius = 80 + Math.sin(Date.now() / 500 + i) * 15;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                ctx.fillStyle = `rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, 0.6)`;
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();

            // رسم الأسهمد
            if (deltaT !== 0) {
                drawArrows(deltaT);
            }
        }

function drawArrows(deltaT) {
    ctx.save();

    // تحديد ألوء
    let strokeColor;
    let fillColor;
    if (deltaT > 0) {
        strokeColor = '#ff4444';
        fillColor = '#ff4444';
    } else {
        strokeColor = '#4444ff';
        fillColor = '#4444ff';
    }

    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = fillColor;
    ctx.lineWidth = 3;

    const arrowCount = 6;

    for (let i = 0; i < arrowCount; i++) {
        const angle = (i / arrowCount) * Math.PI * 2;

        // 
        let startRadius;
        let endRadius;
        if (deltaT > 0) {
            startRadius = 95;
            endRadius = 130;
        } else {
            startRadius = 130;
            endRadius = 95;
        }

        const x1 = 175 + Math.cos(angle) * startRadius;
        const y1 = 175 + Math.sin(angle) * startRadius;
        const x2 = 175 + Math.cos(angle) * endRadius;
        const y2 = 175 + Math.sin(angle) * endRadius;

       
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

       
        const headAngle = Math.atan2(y2 - y1, x2 - x1);

        const arrowHead1X = x2 - 10 * Math.cos(headAngle - Math.PI / 6);
        const arrowHead1Y = y2 - 10 * Math.sin(headAngle - Math.PI / 6);
        const arrowHead2X = x2 - 10 * Math.cos(headAngle + Math.PI / 6);
        const arrowHead2Y = y2 - 10 * Math.sin(headAngle + Math.PI / 6);

        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(arrowHead1X, arrowHead1Y);
        ctx.lineTo(arrowHead2X, arrowHead2Y);
        ctx.closePath();
        ctx.fill();
    }

    ctx.restore();
}


        function animate() {
          
            currentColor.r += (targetColor.r - currentColor.r) * 0.1;
            currentColor.g += (targetColor.g - currentColor.g) * 0.1;
            currentColor.b += (targetColor.b - currentColor.b) * 0.1;

            drawVisualization();
            requestAnimationFrame(animate);
        }

        function calculate() {
            const mass = parseFloat(document.getElementById('mass').value) || 0;
            const c = parseFloat(document.getElementById('c').value) || 0;
            const deltaT = parseFloat(document.getElementById('deltaT').value) || 0;

            const Q = mass * c * deltaT;
            
            
            const result = document.getElementById('result');
            result.textContent = Q.toLocaleString('ar-DZ', { maximumFractionDigits: 2 }) + ' J';

            
            const colorData = getColorFromTemp(deltaT);
            targetColor = colorData;
            
            
            document.getElementById('sunT').textContent = `درجة الحرارة: ${colorData.name}`;
        }

        
        document.getElementById('mass').addEventListener('input', calculate);
        document.getElementById('c').addEventListener('input', calculate);
        document.getElementById('deltaT').addEventListener('input', calculate);

        animate();
        calculate()
