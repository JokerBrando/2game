// Ініціалізація Phaser
var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 500,
    scene: {

        parent:game,
        physics: {  //задаємо стиль фізики гри
            default: 'arcade',
            arcade: {
                debug: true
            }
        },

        preload: preload,
        create: create, 
        update: update

    }
};

var game = new Phaser.Game(config);
var spaceKey;
var isAccelerating = false;

// Попереднє завантаження ресурсів
function preload() {
    this.load.image('space', 'assets/space.jpg');
    this.load.image('spaceship', 'assets/spaceship1.png');
    this.load.image('trash', 'assets/trash1.png');
}

// Основна функція гри
function create() {
    // Додавання фону
    this.add.image(0, 0, 'space').setOrigin(0);

    // Додавання космічного корабля
    this.spaceship = this.physics.add.sprite(287, 151, 'spaceship').setScale(0.2);
    this.spaceship.setCollideWorldBounds(true);

    // Додавання космічного сміття
    this.trash = this.physics.add.group({
        key: 'trash',
        repeat: 11,
        setXY: { x: 200, y: 200, stepX: 200 }
    });

    // Збір сміття
    this.physics.add.collider(this.spaceship, this.trash, collectTrash, null, this);

    // Рахунок зібраного сміття
    this.score = 0;
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });

    // Таймер або час гри
    this.timeText = this.add.text(800, 16, 'Time: 60', { fontSize: '32px', fill: '#fff' });
    this.endTime = this.time.addEvent({ delay: 60000, callback: gameOver, callbackScope: this });
    this.timer = this.time.addEvent({ delay: 1000, callback: updateTimer, callbackScope: this, repeat: 59 });



    spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    spaceKey.on('down', function(event) {
        isAccelerating = true;
    });
    spaceKey.on('up', function(event) {
        isAccelerating = false;
    });
}

// Функція оновлення
function update() {
    // Рух космічного корабля
    if (this.input.activePointer.isDown) {

        var angle = Phaser.Math.Angle.Between(this.spaceship.x, this.spaceship.y, this.input.x, this.input.y);
        // Задаємо кут повороту корабля
        this.spaceship.setRotation(angle);
        // Рух до позиції курсора


        if (isAccelerating) {
            this.physics.moveTo(this.spaceship, this.input.x, this.input.y, 400); // Збільшення швидкості до 400
        } else {
            this.physics.moveTo(this.spaceship, this.input.x, this.input.y, 200);
        }

    }

    // Видалення сміття, яке виходить за межі екрану
    this.trash.children.iterate(function (child) {
        if (child.x < -50) {
            child.x = 1100;
        }
    });
}

// Функція збору сміття
function collectTrash(spaceship, trash) {
    trash.disableBody(true, true);
    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);
}

// Функція оновлення таймера
function updateTimer() {
    this.timeText.setText('Time: ' + this.timer.repeatCount);
}

// Функція завершення гри
function gameOver() {
    this.add.text(400, 250, 'Game Over', { fontSize: '64px', fill: '#fff' });
    this.physics.pause();
    this.timer.paused = true;
}