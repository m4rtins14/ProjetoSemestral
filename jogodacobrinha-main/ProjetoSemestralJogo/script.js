const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const buttonPause = document.querySelector(".btn-pause");
let isPaused = false;
buttonPause.addEventListener("click", () => {
    if (isPaused) {
        isPaused = false;
        buttonPause.innerText = "Pausar";
        gameLoop();
    } else {
        isPaused = true;
        buttonPause.innerText = "Retomar";
        clearInterval(loopId);
    }
});

const score = document.querySelector(".score--value");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play");

const audio = new Audio("../assets/audio.mp3");

const size = 30;

const initialPosition = { x: 270, y: 240 };

let snake = [initialPosition];

const incrementScore = () => {
    score.innerText = +score.innerText + 10;
};

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
};

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size);
    return Math.round(number / 30) * 30;
};

const foodImages = [
    new Image(),
    new Image(),
    new Image()
];

foodImages[0].src = "img4.png";
foodImages[1].src = "img6.png";
foodImages[2].src = "img3.png";

const snakeHeadImage = new Image();
snakeHeadImage.src = "img8.png";

const snakeBodyImage = new Image();
snakeBodyImage.src = "img3.png";

const snakeBodyImage1 = new Image();
snakeBodyImage1.src = "img7.png";

const food = {
    x: randomPosition(),
    y: randomPosition(),
    imageIndex: Math.floor(Math.random() * foodImages.length)
};

let direction, loopId, isGameOver = false;

const drawFood = () => {
    const { x, y, imageIndex } = food;
    ctx.drawImage(foodImages[imageIndex], x, y, size, size);
};

const drawSnake = () => {
    snake.forEach((position, index) => {
        if (index === snake.length - 1) {
            ctx.drawImage(snakeHeadImage, position.x, position.y, size, size);
        } else {
            ctx.drawImage(snakeBodyImage, position.x, position.y, size, size);
        }
    });
};

const moveSnake = () => {
    if (!direction || isGameOver) return;

    const head = snake[snake.length - 1];

    if (direction === "right") {
        snake.push({ x: head.x + size, y: head.y });
    }

    if (direction === "left") {
        snake.push({ x: head.x - size, y: head.y });
    }

    if (direction === "down") {
        snake.push({ x: head.x, y: head.y + size });
    }

    if (direction === "up") {
        snake.push({ x: head.x, y: head.y - size });
    }

    snake.shift();
};

const drawGrid = () => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#191919";

    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.lineTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
};

const checkEat = () => {
    const head = snake[snake.length - 1];

    if (head.x === food.x && head.y === food.y) {
        incrementScore();
        snake.push(head);
        audio.play();

        let x = randomPosition();
        let y = randomPosition();

        const newImageIndex = Math.floor(Math.random() * foodImages.length);

        while (snake.find((position) => position.x === x && position.y === y)) {
            x = randomPosition();
            y = randomPosition();
        }

        food.x = x;
        food.y = y;
        food.imageIndex = newImageIndex;
    }
};

const checkCollision = () => {
    const head = snake[snake.length - 1];
    const canvasLimit = canvas.width - size;
    const neckIndex = snake.length - 2;

    const wallCollision =
        head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;

    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x === head.x && position.y === head.y;
    });

    if (wallCollision || selfCollision) {
        gameOver();
    }
};

const gameOver = () => {
    direction = undefined;
    isGameOver = true;

    menu.style.display = "flex";
    finalScore.innerText = score.innerText;
    canvas.style.filter = "blur(2px)";
};

const gameLoop = () => {
    clearInterval(loopId);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawFood();
    moveSnake();
    drawSnake();
    checkEat();
    checkCollision();

    // Reduza o intervalo de tempo para aumentar a velocidade
    loopId = setTimeout(() => {
        gameLoop();
    }, 100); // Reduzi para 100 milissegundos, sinta-se à vontade para ajustar conforme necessário
};

gameLoop();

document.addEventListener("keydown", ({ key }) => {
    if (key === "ArrowRight" && direction !== "left") {
        direction = "right";
    }

    if (key === "ArrowLeft" && direction !== "right") {
        direction = "left";
    }

    if (key === "ArrowDown" && direction !== "up") {
        direction = "down";
    }

    if (key === "ArrowUp" && direction !== "down") {
        direction = "up";
    }
});

canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    const touchX = e.changedTouches[0].pageX;
    const touchY = e.changedTouches[0].pageY;
    const head = snake[snake.length - 1];
    const offsetX = touchX - canvas.getBoundingClientRect().left;
    const offsetY = touchY - canvas.getBoundingClientRect().top;

    const deltaX = offsetX - head.x;
    const deltaY = offsetY - head.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        direction = deltaX > 0 ? "right" : "left";
    } else {
        direction = deltaY > 0 ? "down" : "up";
    }
});

buttonPlay.addEventListener("click", () => {
    // Verifique se o jogo está no estado de game over
    if (isGameOver) {
        // Reinicialize as variáveis do jogo
        score.innerText = "00";
        menu.style.display = "none";
        canvas.style.filter = "none";
        snake = [initialPosition];
        direction = undefined;
        isGameOver = false;

        // Inicie o loop do jogo novamente
        gameLoop();
    }
});

function resgatarPontos() {
    // Lógica para resgatar pontos (pode ser ajustada conforme necessário)
    const pontosResgatados = +score.innerText; // Obtém a pontuação atual do jogo

    // Zere o score
    score.innerText = "00";
    
    // Exiba a mensagem na mesma página
    const mensagemResgate = document.getElementById('mensagem-resgate');
    alert(`Você resgatou ${pontosResgatados} pontos na página de pontos!`);
}

// Recupere os pontos do localStorage
const pontosResgatados = localStorage.getItem('pontosResgatados');
