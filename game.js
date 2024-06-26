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
    this.load.audio('win', 'assets/win.mp3'); // Завантаження аудіо
    this.load.audio('lose', 'assets/lose.mp3'); // Завантаження аудіо


    this.load.image('flowey', 'assets/flowey.png');
    this.load.image('java', 'assets/java.png');
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

 // Додавання космічного сміття
 this.trash = this.physics.add.group({
    key: 'java',
    repeat: 1,
    setXY: { x: 400, y: 400, stepX: 300 }
});

this.physics.add.collider(this.spaceship, this.trash, collectJava, null, this);




this.floweyGroup = this.physics.add.group();
this.flowey = this.floweyGroup.create(Phaser.Math.Between(100, 900), Phaser.Math.Between(100, 400), 'flowey');
this.flowey.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-200, 200)); // Встановлення випадкової швидкості Flowey



this.physics.add.overlap(this.spaceship, this.floweyGroup, function(spaceship, flowey) {
    var points = Phaser.Math.Between(0, 1) === 0 ? -150 : 150; // Випадково визначаємо, чи додати чи відняти 100 балів
    this.score += points;
    this.scoreText.setText('Score: ' + this.score);

    if (this.score < 0) { // Перевіряємо, чи рахунок від'ємний
        audio = this.sound.add('lose');
        audio.play();
        this.add.text(400, 250, 'Game Over', { fontSize: '64px', fill: '#fff' }); // Виведення повідомлення "Game Over"
        this.physics.pause(); // Призупинення фізики гри
        this.timer.paused = true; // Призупинення таймера
        setTimeout(() => {
            location.reload(); // Оновлення сторінки через 3 секунди
        }, 3000);
    }

    flowey.destroy(); // Знищення об'єкта Flowey після зіткнення
}, null, this);



if (this.score < 0) {
    audio = this.sound.add('lose');
    audio.play();

    this.add.text(400, 250, 'Game Over', { fontSize: '64px', fill: '#fff' }); // Виведення повідомлення "Game Over"
    this.physics.pause(); // Призупинення фізики гри
    this.timer.paused = true; // Призупинення таймера
    setTimeout(() => {
        location.reload(); // Оновлення сторінки через 3 секунд
    }, 3000);
}





















// Додавання лазерів
this.dmg = this.physics.add.group();

this.time.addEvent({
    delay: 1700, // кожні 2 секунди
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
        this.physics.moveToObject(dmg, this.spaceship, 200); 
    },
    callbackScope: this
});



    // Додавання лазерів
    this.dmg = this.physics.add.group();

    this.time.addEvent({
        delay: 950, // кожні 0.95 секунд
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
            this.physics.moveToObject(dmg, this.spaceship, 200); 
        },
        callbackScope: this
    });

    // Додавання колізії між космічним кораблем і лазерами (dmg)
    this.physics.add.collider(this.spaceship, this.dmg, shipHit, null, this); 

 

// Додавання сміття
this.time.addEvent({
    delay: 1400, // кожні 1.4 секунди
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




// Додавання сміття java
this.time.addEvent({
    delay: 3400, // кожні 3.4 секунди
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

        var trash = this.trash.create(x, y, 'java'); 
        this.physics.moveToObject(trash, this.spaceship, 200); 
 
    },
    callbackScope: this
});



this.time.addEvent({
    delay: 9000, // кожні 9 секунд
    loop: true,
    callback: function () {
        var flowey = this.floweyGroup.create(Phaser.Math.Between(100, 900), Phaser.Math.Between(100, 400), 'flowey');
        this.physics.add.overlap(this.spaceship, flowey, function(spaceship, flowey) {
            addRandomPoints.call(this); // Викликаємо функцію, що додає випадкову кількість очок
            flowey.destroy(); // Знищення об'єкта Flowey після зіткнення
        }, null, this);
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





    // Перевіряємо рахунок і відтворюємо звук "ford", якщо рахунок менше 500
    if (this.score < 500) {
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



function collectJava(spaceship, java) {
    java.disableBody(true, true);
    this.score += 20; // За сміття типу "java" можна додати більше балів
    this.scoreText.setText('Score: ' + this.score);
    checkScore.call(this);
}




















function addRandomPoints() {
    var points = Phaser.Math.Between(0, 1) === 0 ? -100 : 100; // Випадково визначаємо, чи додати чи відняти 100 балів
    this.score += points;
    this.scoreText.setText('Score: ' + this.score);
}





















// Функція оновлення таймера
function updateTimer() {
    this.timeText.setText('Time: ' + this.timer.repeatCount);
}

// Функція завершення гри
function gameOver() {
    audio = this.sound.add('lose');
    audio.play();

    this.add.text(400, 250, 'Game Over', { fontSize: '64px', fill: '#fff' });
    this.scene.pause(); // Пауза сцени
    this.timer.paused = true;
    
    setTimeout(() => {
        location.reload(); // Оновлення сторінки через 3 секунд
    }, 3000);
}





// Реакція на зіткнення корабля з лазерами
function shipHit(spaceship, dmg) {
    this.score -= 50;
    this.scoreText.setText('Score: ' + this.score);


    

    if (this.score < 0) {
       
        audio = this.sound.add('lose');
        audio.play();
    
        this.add.text(310, 220, 'Game Over', { fontSize: '64px', fill: '#fff' }); // Виведення повідомлення "Game Over"

        this.scene.pause(); // Пауза сцени
        this.timer.paused = true; // Призупинення таймера
        setTimeout(() => {
            location.reload(); // Оновлення сторінки через 3 секунд
        }, 3000);
    }

    dmg.destroy();
}
















// Функція для зупинки генерації сміття та лазерів
function stopGenerating() {
    this.time.removeAllEvents(); // Видалення всіх подій з часової системи
}

function checkScore() {
    if (this.score >= 500) {
        playWinVideoAndSound.call(this); // Викликати функцію playWinVideoAndSound у контексті сцени
        this.scene.pause(); // Пауза сцени
    }
}

// Функція для відтворення відео та звуку при досягненні 200 очок
function playWinVideoAndSound() {
    audio = this.sound.add('win');
    audio.play();

    this.add.text(400, 250, 'YOU WIN', { fontSize: '64px', fill: '#fff' }); // Виведення повідомлення "Game Over"
  
    setTimeout(() => {
   // Відтворення відео
   video = this.add.video(500, 250, '2'); // Позиція відео на екрані
   video.play(true);
   
   
   
        // Відтворення звуку
    audio = this.sound.add('1');
    audio.play();
   
   
    

    setTimeout(() => {
        location.reload(); // Оновлення сторінки через 200 секунд
    }, 200000);  
}, 2500); // Затримка перед початком відтворення

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