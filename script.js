
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('splash-screen').style.display = 'none';
    }, 3000);

   
    document.getElementById('current-time').textContent = new Date().toISOString().slice(0, 19).replace('T', ' ');

   
    initGame();
});

function initGame() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    
    function resizeCanvas() {
        const container = canvas.parentElement;
        const containerWidth = container.offsetWidth;
        canvas.width = Math.min(800, containerWidth - 20);
        canvas.height = 200;
    }

  
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Game variables
    let gameStarted = false;
    let score = 0;
    let highScore = localStorage.getItem('highScore') || 0;
    let gameSpeed = 5;
    let gravity = 0.8;
    let touchStartY = 0;
    let touchThreshold = 20;
    
    // Player object
    const player = {
        x: 50,
        y: canvas.height - 40,
        width: 40,
        height: 40,
        velocity: 0,
        jumping: false
    };

    // Obstacles array
    let obstacles = [];
    
    // Load player image
    const playerImg = new Image();
    playerImg.src = 'data:image/png;base64,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';

    function gameLoop() {
        if (!gameStarted) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw ground
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - 10);
        ctx.lineTo(canvas.width, canvas.height - 10);
        ctx.strokeStyle = '#6b46c1';
        ctx.stroke();
        
        // Update player
        if (player.jumping) {
            player.y += player.velocity;
            player.velocity += gravity;
            
            if (player.y > canvas.height - player.height) {
                player.y = canvas.height - player.height;
                player.jumping = false;
                player.velocity = 0;
            }
        }
        
        // Draw player
        ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
        
        // Update and draw obstacles
        updateObstacles();
        
        // Update score
        score++;
        document.getElementById('scoreText').textContent = Math.floor(score/10);
        
        // Check collision
        if (checkCollision()) {
            gameOver();
            return;
        }
        
        requestAnimationFrame(gameLoop);
    }
    
    function updateObstacles() {
        if (Math.random() < 0.02) {
            obstacles.push({
                x: canvas.width,
                y: canvas.height - 30,
                width: 20,
                height: 30
            });
        }
        
        for (let i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].x -= gameSpeed;
            
            if (obstacles[i].x + obstacles[i].width < 0) {
                obstacles.splice(i, 1);
                continue;
            }
            
            
            ctx.fillStyle = '#6b46c1';
            ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
        }
    }
    
    function checkCollision() {
        for (let obstacle of obstacles) {
            if (player.x < obstacle.x + obstacle.width &&
                player.x + player.width > obstacle.x &&
                player.y < obstacle.y + obstacle.height &&
                player.y + player.height > obstacle.y) {
                return true;
            }
        }
        return false;
    }
    
    function jump() {
        if (!player.jumping) {
            player.jumping = true;
            player.velocity = -15;
        }
    }
    
    function startGame() {
        gameStarted = true;
        score = 0;
        obstacles = [];
        player.y = canvas.height - player.height;
        player.velocity = 0;
        player.jumping = false;
        gameLoop();
    }
    
    function gameOver() {
        gameStarted = false;
        const finalScore = Math.floor(score/10);
        if (finalScore > highScore) {
            highScore = finalScore;
            localStorage.setItem('highScore', highScore);
        }
        document.getElementById('highScoreText').textContent = highScore;
        
        ctx.fillStyle = '#6b46c1';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over! Score: ' + finalScore, canvas.width/2 - 100, canvas.height/2);
    }
    
    // Touch controls
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        if (gameStarted) {
            touchStartY = e.touches[0].clientY;
        }
    }, { passive: false });

    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });

    canvas.addEventListener('touchend', function(e) {
        e.preventDefault();
        if (gameStarted) {
            const touchEndY = e.changedTouches[0].clientY;
            const swipeDistance = touchStartY - touchEndY;
            
            if (swipeDistance > touchThreshold) {
                jump();
            }
        }
    }, { passive: false });

    
    let lastTap = 0;
    canvas.addEventListener('touchend', function(e) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        
        if (tapLength < 300 && tapLength > 0) {
            jump();
            e.preventDefault();
        }
        lastTap = currentTime;
    });

    
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && gameStarted) {
            e.preventDefault();
            jump();
        }
    });

    
    const jumpButton = document.createElement('button');
    jumpButton.id = 'jumpButton';
    jumpButton.textContent = 'JUMP';
    jumpButton.className = 'game-button';
    canvas.parentElement.appendChild(jumpButton);

    jumpButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (gameStarted) {
            jump();
        }
    });

 
    document.getElementById('startGame').addEventListener('click', startGame);
    
   
    document.getElementById('highScoreText').textContent = highScore;
}