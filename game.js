// Configuração inicial do canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Carregar a imagem de fundo
let backgroundImage = new Image();
backgroundImage.src = 'images/background.jpg';

// Carregar a imagem do jogador
let playerImage = new Image();
playerImage.src = 'images/character.png';

// Carregar a imagem das plataformas
let platformImage = new Image();
platformImage.src = 'images/platform.png';

// Variáveis do jogo
let player = {
    x: 100,
    y: 100,
    width: 120,
    height: 140,
    velocityX: 0,
    velocityY: 0,
    speed: 5,
    jumping: false
};

let gravity = 0.5;
let friction = 0.9;

// Plataformas
let platforms = [
    { x: 10, y: 310, width: 100, height: 100},
    { x: 200, y: 310, width: 100, height: 100},
];

// Controles do jogador
document.addEventListener('keydown', function(event) {
    if (event.code === 'ArrowLeft') {
        player.velocityX = -player.speed;
    } else if (event.code === 'ArrowRight') {
        player.velocityX = player.speed;
    } else if (event.code === 'Space' && !player.jumping) {
        player.jumping = true;
        player.velocityY = -10;
    }
});

document.addEventListener('keyup', function(event) {
    if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
        player.velocityX = 0;
    }
});

// Desenhar a imagem de fundo
function drawBackground() {
    if (backgroundImage.complete) { // Verifica se a imagem foi carregada
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    } else {
        // Se a imagem não estiver carregada, desenha um fundo de cor sólida como fallback
        ctx.fillStyle = '#000'; // Cor de fundo preta
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

// Desenhar as plataformas
function drawPlatform() {
    platforms.forEach(platform => {
        if (platformImage.complete) { // Verifica se a imagem foi carregada
            ctx.drawImage(platformImage, platform.x, platform.y, platform.width, platform.height);
        } else {
            // Se a imagem não estiver carregada, desenha um retângulo azul como fallback
            ctx.fillStyle = 'blue';
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        }
    });
}

// Atualizações do jogo
function updateGame() {
    // Limpar o canvas e redesenhar tudo
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar o fundo
    drawBackground();

    // Aplicar gravidade
    player.y += player.velocityY;
    player.velocityY += gravity;

    // Aplicar fricção
    player.x += player.velocityX;
    player.velocityX *= friction;

    // Verificar colisões com o chão
    if (player.y >= canvas.height - player.height) {
        player.y = canvas.height - player.height;
        player.jumping = false;
    }

    // Verificar colisões com plataformas
    platforms.forEach(platform => {
        if (player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y < platform.y + platform.height &&
            player.y + player.height > platform.y) {
            player.jumping = false;
            player.velocityY = 0;
            player.y = platform.y - player.height;
        }
    });

    // Desenhar as plataformas
    drawPlatform();

    // Desenhar o jogador usando a imagem
    if (playerImage.complete) { // Verifica se a imagem foi carregada
        ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
    } else {
        // Se a imagem não estiver carregada, desenha um quadrado vermelho como fallback
        ctx.fillStyle = 'red';
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    requestAnimationFrame(updateGame);
}

// Iniciar o jogo
updateGame();
