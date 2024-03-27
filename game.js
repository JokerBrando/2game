// Ініціалізація Phaser
var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 500,
    scene: {

        
        physics: {  //задаємо стиль фізики гри
            default: 'arcade',
            arcade: {
                debug: false
            }
        },

        preload: preload,
        create: create, 
        update: update

    }
};

var video;
var audio;
var trash;
var spaceship;
var game = new Phaser.Game(config);
var spaceKey;
var isAccelerating = false;

// Попереднє завантаження ресурсів
function preload() {
    this.load.video('2', 'assets/2.mp4', 'loadeddata', false, true); // Завантаження відео
    this.load.audio('1', 'assets/1.mp3'); // Завантаження аудіо
    this.load.audio('ford', 'assets/ford.mp3'); // Завантаження аудіо

    this.load.image('space', 'assets/space.jpg');
    this.load.image('spaceship', 'assets/spaceship1.png');
    this.load.image('trash', 'assets/trash1.png');
    this.load.image('dmg', 'assets/dmg.png');
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
        repeat: 2,
        setXY: { x: 200, y: 200, stepX: 300 }
    });

    // Збір сміття
    this.physics.add.collider(this.spaceship, this.trash, collectTrash, null, this);








    // Додавання лазерів
    this.dmg = this.physics.add.group();

    this.time.addEvent({
        delay: 700, // кожні 0.7 секунди
        loop: true,
        callback: function () {
            var side = Phaser.Math.Between(0, 3);
            var x;
            var y;

            if (side === 0) {
                x = 0;
                y = Phaser.Math.Between(0, game.config.height);
            } else if (side === 1) {
                x = Phaser.Math.Between(0, game.config.width);
                y = 0;
            } else if (side === 2) {
                x = game.config.width;
                y = Phaser.Math.Between(0, game.config.height);
            } else {
                x = Phaser.Math.Between(0, game.config.width);
                y = game.config.height;
            }

            var dmg = this.dmg.create(x, y, 'dmg'); // змінив змінну laser на dmg
            this.physics.moveToObject(dmg, this.spaceship, 200); // Змінив spaceship на this.spaceship
        },
        callbackScope: this
    });

    // Додавання колізії між космічним кораблем і лазерами (dmg)
    this.physics.add.collider(this.spaceship, this.dmg, shipHit, null, this); // Змінив spaceship на this.spaceship

 

// Додавання сміття
this.time.addEvent({
    delay: 1000, // кожні 1 секунди
    loop: true,
    callback: function () {
        var side = Phaser.Math.Between(0, 3); // вибираємо випадкову сторону
        var x;
        var y;

        if (side === 0) { // зліва
            x = 0;
            y = Phaser.Math.Between(0, game.config.height);
        } else if (side === 1) { // зверху
            x = Phaser.Math.Between(0, game.config.width);
            y = 0;
        } else if (side === 2) { // справа
            x = game.config.width;
            y = Phaser.Math.Between(0, game.config.height);
        } else { // знизу
            x = Phaser.Math.Between(0, game.config.width);
            y = game.config.height;
        }

        var trash = this.trash.create(x, y, 'trash'); 
        this.physics.moveToObject(trash, this.spaceship, 200); 
 
    },
    callbackScope: this
});

















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





    // Перевіряємо рахунок і відтворюємо звук "ford", якщо рахунок менше 200
    if (this.score < 200) {
        playFordSound.call(this);
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

    // Перевіряємо, чи досягнута кількість балів для відтворення відео та звуку
    checkScore.call(this);
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
    
    setTimeout(() => {
        location.reload(); // Оновлення сторінки через 5 секунд
    }, 5000);
}

// Реакція на зіткнення корабля з лазерами
function shipHit(spaceship, dmg) {
    this.score -= 50;
    this.scoreText.setText('Score: ' + this.score);

    if (this.score < 0) {
       
        this.add.text(400, 250, 'Game Over', { fontSize: '64px', fill: '#fff' }); // Виведення повідомлення "Game Over"
        this.physics.pause(); // Призупинення фізики гри
        this.timer.paused = true; // Призупинення таймера
        setTimeout(() => {
            location.reload(); // Оновлення сторінки через 5 секунд
        }, 5000);
    }

    dmg.destroy();
}

// Функція для зупинки генерації сміття та лазерів
function stopGenerating() {
    this.time.removeAllEvents(); // Видалення всіх подій з часової системи
}

function checkScore() {
    if (this.score >= 200) {
        playWinVideoAndSound.call(this); // Викликати функцію playWinVideoAndSound у контексті сцени
        this.scene.pause(); // Пауза сцени
    }
}

// Функція для відтворення відео та звуку при досягненні 200 очок
function playWinVideoAndSound() {
    // Відтворення звуку
    audio = this.sound.add('1');
    audio.play();
   
    // Відтворення відео
    video = this.add.video(500, 250, '2'); // Позиція відео на екрані
    video.play(true);
    
   
}








// Функція для відтворення звуку "ford"
function playFordSound() {
    // Перевіряємо, чи вже відтворюється звук "ford"
    if (!audio || !audio.isPlaying) {
        // Відтворення звуку "ford"
        audio = this.sound.add('ford');
        audio.play();
    }
}