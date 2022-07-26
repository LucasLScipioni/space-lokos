import 'phaser';
import CryptoJS from 'crypto-js';
import { api } from '../Services/api';

interface IPlayer extends Phaser.GameObjects.Sprite {
  life?: number;
  getHit?: (damage: number) => void;

}
type Sound = Phaser.Sound.BaseSound & { loop?: boolean, volume?: number }

interface IEnemy extends Phaser.GameObjects.Sprite {
  life?: number;
  speed?: number;
  getHit?: (damage: number) => void;
  fly?: () => void;
}

interface MainScene extends Phaser.Scene {
  score: number;
  enemiesGroup: Phaser.GameObjects.Group;
  triggerTimer: Phaser.Time.TimerEvent;
  scoreText: Phaser.GameObjects.Text;
  livesText: Phaser.GameObjects.Text;
}

class Enemy extends Phaser.GameObjects.Sprite implements IEnemy {
  life: number;
  scene: MainScene;
  speed: number;
  constructor(scene: MainScene, x: number, y: number) {
    super(scene, x, y, 'enemy');
    this.scene = scene;
    this.life = 2;
    this.speed = 1 + Math.random() / 2;
    this.setScale(0.1, 0.1);
    this.flipY = true;

    scene.add.existing(this);
    scene.enemiesGroup.add(this);
  }
  fly() {
    this.y += this.speed + (this.scene.score / 100);
  }
  getHit = (damage: number) => {
    if (this.life) {
      this.life -= damage;

      if (this.life <= 0) {
        let explosion = this.scene.add.sprite(this.x, this.y, "explosion");
        let explosionSound: Sound = this.scene.sound.add('enemyExplosion')
        explosionSound.volume = 0.1;
        explosionSound.play();
        explosion.depth = 10;
        explosion.play('explode');


        this.scene.cameras.main.shake(150, 0.003);
        this.scene.score += 10;
        this.scene.triggerTimer!.timeScale = 1 + ((this.scene.score / 100));

        if (this.scene.scoreText) {
          this.scene.scoreText.setText(`Score: ${this.scene.score}`);
        }
        this.destroy();
      }
    }
  }

}

export default class Main extends Phaser.Scene {
  score = 0;
  scoreText: Phaser.GameObjects.Text | undefined;
  livesText: Phaser.GameObjects.Text | undefined;
  playerStats = {
    attackSpeed: 50,
    attackSpeedCounter: 0,
  }
  bg: Phaser.GameObjects.TileSprite | undefined;
  bgParallaxVelocity = 0.5;
  stars: Phaser.GameObjects.TileSprite | undefined;
  player: IPlayer | undefined;
  enemiesGroup: Phaser.GameObjects.Group | undefined;
  playerBullets: Phaser.GameObjects.Group | undefined;
  triggerTimer: Phaser.Time.TimerEvent | undefined;
  timerEvent: () => void = () => { };

  //* --- Phaser LifeCycle --- *//

  preload() {
    this.load.audio('mainTheme', 'assets/audio/game_sound.mp3')
    this.load.audio('enemyExplosion', 'assets/audio/enemy-explosion.mp3')
    this.load.audio('playerHit', 'assets/audio/player_hit.mp3')
    this.load.audio('playerShot', 'assets/audio/player_shot.mp3')

    this.load.image('b', 'assets/background.png')
    this.load.image('background', 'assets/space.png')
    this.load.image('stars', 'assets/stars.png')
    this.load.image('player', 'assets/player.png')
    this.load.image('enemy', 'assets/enemy1.png')
    this.load.image('laser', 'assets/laser.png')
    this.load.spritesheet('explosion', 'assets/explosion.png', { frameWidth: 190, frameHeight: 190 })
  }

  create() {
    window.restartGame = () => {
      this.triggerTimer?.destroy();
      this.score = 0;
      this.player!.life = 3;

      this.scene.restart();
      window.setModal(false);
    }

    this.startPlayer();
    this.sceneSetup();
    this.enemiesSetup();
  }

  update() {
    this.playerInput();

    this.colissionDetection();

    // Background Parallax Effect
    this.bg!.tilePositionY -= this.bgParallaxVelocity + ((this.score / 100));
    this.stars!.tilePositionY -= (this.bgParallaxVelocity / 2) + ((this.score / 100));
  }

  //* --- Custom Functions --- *//

  sendScore = (score: number) => {
    const token = localStorage.getItem("token")

    api.post("/leaderboard", { score: CryptoJS.AES.encrypt(`${score}`, "AVoc4t0").toString() }, { headers: { 'Authorization': `${token}` } })
  };

  startPlayer() {
    this.playerBullets = this.add.group();

    this.player = this.add.sprite(this.sys.game.canvas.width / 2, this.sys.game.canvas.height - 80, 'player');
    if (!this.player) {
      return;
    }
    this.player.depth = 1;
    this.player.setScale(0.08, 0.1);
    this.player.life = 3;

    // When the player gets hit game camera shakes, removes 1 life and if life <= 0, send score to the leaderboard and finishes the game 
    this.player.getHit = (damage) => {
      let hitSound: Sound = this.sound.add('playerHit')
      hitSound.volume = 0.1;
      hitSound.play();

      this.cameras.main.shake(350, 0.008);
      if (this.player) {
        if (this.player.life) {
          this.player.life -= damage;

          if (this.livesText) {
            this.livesText.setText(`Lives: ${this.player.life}`);
          }

          if (this.player.life <= 0) {
            let explosion = this.add.sprite(this.player.x, this.player.y, "explosion");
            explosion.depth = 10;
            explosion.play('explode');

            this.sendScore(this.score)

            this.player.destroy();

            setTimeout(() => {
              this.cameras.main.fade(500);

              this.cameras.main.on('camerafadeoutcomplete', () => {
                setTimeout(() => {
                  window.setModal(true);
                }, 1000);
              });
            }, 2000)
          }
        } else {
          this.player.destroy();
        }
      }
    }
  }

  sceneSetup() {
    // Score Text
    this.scoreText = this.add.text(30, 20, `Score: ${this.score}`, {
      font: '28px'
    });
    this.scoreText.depth = 1000;

    // Score Text
    this.livesText = this.add.text(this.sys.game.canvas.width - 170, 20, `Lives: ${this.player!.life}`, {
      font: '28px'
    });
    this.livesText.depth = 1000;

    // Play game Theme
    let theme: Phaser.Sound.BaseSound & { loop?: boolean, volume?: number } = this.sound.add('mainTheme')
    theme.loop = true;
    theme.volume = 0.1;
    theme.play();

    // Background as tile for Parallax effect
    this.bg = this.add.tileSprite(this.sys.game.canvas.width / 2, this.sys.game.canvas.height / 2, this.sys.game.canvas.width, this.sys.game.canvas.height, 'background');
    this.bg.depth = -1;
    this.stars = this.add.tileSprite(this.sys.game.canvas.width / 2, this.sys.game.canvas.height / 2, this.sys.game.canvas.width, this.sys.game.canvas.height, 'stars');
    this.stars.depth = 0;
  }

  enemiesSetup() {
    // Create enemy group
    this.enemiesGroup = this.add.group();

    // Create enemy explosion effect
    this.anims.create({
      key: "explode",
      frameRate: 30,
      frames: this.anims.generateFrameNumbers("explosion", { start: 0, end: 15 }),
    });

    // Event to spawn the enemy Class Object
    this.timerEvent = function () {
      new Enemy(this as MainScene, Math.random() * this.sys.game.canvas.width, -50)
    }

    // Phaser timer event to respawn enemies based on the current score
    this.triggerTimer = this.time.addEvent({
      callback: this.timerEvent,
      callbackScope: this,
      delay: 1500 / ((1 + this.score) * 1.05),
      loop: true
    })
  }

  playerInput() {
    if (this.player && this.player.life! > 0) {
      const upArrow = this.input.keyboard.addKey('up')
      const downArrow = this.input.keyboard.addKey('down')
      const leftArrow = this.input.keyboard.addKey('left')
      const rightArrow = this.input.keyboard.addKey('right')
      const space = this.input.keyboard.addKey('space')

      const playerMoveSpeed = 3;

      if (this.playerStats.attackSpeedCounter < this.playerStats.attackSpeed) {
        this.playerStats.attackSpeedCounter += 1 + ((this.score / 1000));
      }

      if (space.isDown && this.playerStats.attackSpeedCounter >= this.playerStats.attackSpeed && this.player) {
        this.playerStats.attackSpeedCounter = 0;
        if (this.playerBullets) {
          this.playerBullets.create(this.player.x, this.player.y - (this.player.displayHeight / 2), 'laser');
        }
        let shotSound: Sound = this.sound.add('playerShot')
        shotSound.volume = 0.03;
        shotSound.play();
      }

      if (this.player) {
        if (upArrow.isDown) {
          this.player.y -= playerMoveSpeed;

          this.bgParallaxVelocity = 0.8;

          if (this.player.y < (this.player.displayHeight / 2)) this.player.y = 0 + (this.player.displayHeight / 2)
        }

        if (downArrow.isDown) {
          this.player.y += (playerMoveSpeed / 1.5);
          this.bgParallaxVelocity = 0.45;

          if (this.player.y > this.sys.game.canvas.height - (this.player.displayHeight / 2)) this.player.y = this.sys.game.canvas.height - (this.player.displayHeight / 2)
        }

        if (leftArrow.isDown) {
          this.player.x -= playerMoveSpeed;

          if (this.player.x < (this.player.displayWidth / 2)) this.player.x = 0 + (this.player.displayWidth / 2)
        }

        if (rightArrow.isDown) {
          this.player.x += playerMoveSpeed;

          if (this.player.x > this.sys.game.canvas.width - (this.player.displayWidth / 2)) this.player.x = this.sys.game.canvas.width - (this.player.displayWidth / 2)
        }
      }
    }
  }

  colissionDetection() {
    // Enemies
    Phaser.Actions.Call(this.enemiesGroup!.getChildren(), (item) => {
      (item as IEnemy).fly!();

      let enemyRect = (item as Phaser.GameObjects.Sprite).getBounds();
      let playerRect = this.player!.getBounds();

      if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, enemyRect) && this.player!.life! > 0) {
        this.cameras.main.shake(350, 0.008);

        (item as IEnemy).getHit!(999);
        this.player!.getHit!(1);
      }
    }, this);

    // Player bullets
    Phaser.Actions.Call(this.playerBullets!.getChildren(), (playerBullet) => {
      const bulletSprite = playerBullet as Phaser.GameObjects.Sprite;
      bulletSprite.y -= 5;

      let playerBulletRect = (playerBullet as Phaser.GameObjects.Sprite).getBounds();

      Phaser.Actions.Call(this.enemiesGroup!.getChildren(), (enemyGObj) => {
        const enemy: IEnemy = enemyGObj as IEnemy;
        let enemyRect = enemy.getBounds();

        if (Phaser.Geom.Intersects.RectangleToRectangle(playerBulletRect, enemyRect)) {
          enemy.getHit!(1);
          playerBullet.destroy();
        }
      }, this)
    }, this);
  }
}