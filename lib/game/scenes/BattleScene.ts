import Phaser from 'phaser';

export class BattleScene extends Phaser.Scene {
  private demonKingHealth: number = 300;
  private playerHealth: number = 150;
  private playerMaxHealth: number = 150;
  private battleLog: string[] = [];
  private battleActive: boolean = false;
  private uiTexts: Phaser.GameObjects.Text[] = [];

  constructor() {
    super({ key: 'BattleScene' });
  }

  create() {
    this.battleActive = true;
    this.playerHealth = this.playerMaxHealth;
    this.battleLog = ['Battle against the Demon King begins!'];

    // Background
    const battleBg = this.make.graphics({ x: 0, y: 0, add: false });
    battleBg.fillStyle(0x330011);
    battleBg.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
    battleBg.generateTexture('battle-bg', this.game.canvas.width, this.game.canvas.height);
    battleBg.destroy();
    this.add.image(this.game.canvas.width / 2, this.game.canvas.height / 2, 'battle-bg');

    // Demon King sprite
    const demonGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    demonGraphics.fillStyle(0xff0000);
    demonGraphics.fillRect(0, 0, 80, 100);
    demonGraphics.generateTexture('demon-king', 80, 100);
    demonGraphics.destroy();
    this.add.image(this.game.canvas.width - 150, 150, 'demon-king');

    // Player sprite in battle
    const playerBattle = this.make.graphics({ x: 0, y: 0, add: false });
    playerBattle.fillStyle(0x3366ff);
    playerBattle.fillRect(0, 0, 64, 80);
    playerBattle.generateTexture('player-battle', 64, 80);
    playerBattle.destroy();
    this.add.image(150, this.game.canvas.height - 150, 'player-battle');

    // Input
    this.input.keyboard!.on('keydown-SPACE', () => this.playerAttack());
    this.input.keyboard!.on('keydown-ESC', () => this.endBattle());

    // UI
    this.updateBattleUI();
  }

  private playerAttack() {
    if (!this.battleActive) return;

    const damage = Phaser.Math.Between(20, 40);
    this.demonKingHealth -= damage;
    this.battleLog.push(`You dealt ${damage} damage!`);

    if (this.demonKingHealth <= 0) {
      this.battleLog.push('Victory! You defeated the Demon King and saved the village!');
      this.battleActive = false;
      this.showVictory();
      return;
    }

    // Demon counterattack
    this.time.delayedCall(500, () => {
      if (!this.battleActive) return;
      const enemyDamage = Phaser.Math.Between(15, 35);
      this.playerHealth -= enemyDamage;
      this.battleLog.push(`Demon King dealt ${enemyDamage} damage!`);

      if (this.playerHealth <= 0) {
        this.battleLog.push('You were defeated... The village is doomed.');
        this.battleActive = false;
        this.showDefeat();
      } else {
        this.updateBattleUI();
      }
    });

    this.updateBattleUI();
  }

  private updateBattleUI() {
    this.uiTexts.forEach((text) => text.destroy());
    this.uiTexts = [];

    // Title
    const titleText = this.add.text(this.game.canvas.width / 2, 50, 'BATTLE: Demon King', {
      fontSize: '32px',
      color: '#ffff00',
    }).setOrigin(0.5);
    this.uiTexts.push(titleText);

    // Player HP
    const playerHPText = this.add.text(100, 100, `Player HP: ${this.playerHealth}/${this.playerMaxHealth}`, {
      fontSize: '16px',
      color: '#66ff66',
    });
    this.uiTexts.push(playerHPText);

    // Demon King HP
    const demonHPText = this.add.text(this.game.canvas.width - 300, 100, 
      `Demon King HP: ${this.demonKingHealth}`, 
      { fontSize: '16px', color: '#ff6666' }
    );
    this.uiTexts.push(demonHPText);

    // Battle Log
    const logText = this.add.text(this.game.canvas.width / 2, this.game.canvas.height / 2, 
      this.battleLog.slice(-3).join('\n'), 
      { fontSize: '14px', color: '#ffffff' }
    ).setOrigin(0.5);
    this.uiTexts.push(logText);

    // Instructions
    const instructText = this.add.text(this.game.canvas.width / 2, this.game.canvas.height - 50, 
      this.battleActive ? 'Press SPACE to Attack | ESC to Retreat' : 'Press ESC to Continue', 
      { fontSize: '14px', color: '#ffff00' }
    ).setOrigin(0.5);
    this.uiTexts.push(instructText);
  }

  private showVictory() {
    const victoryText = this.add.text(this.game.canvas.width / 2, this.game.canvas.height / 2, 
      '⭐ YOU WIN! ⭐\nThe village is saved!\nPress ESC to return', 
      { fontSize: '48px', color: '#00ff00', align: 'center' }
    ).setOrigin(0.5);
    this.uiTexts.push(victoryText);
  }

  private showDefeat() {
    const defeatText = this.add.text(this.game.canvas.width / 2, this.game.canvas.height / 2, 
      '💀 GAME OVER 💀\nThe Demon King prevails...\nPress ESC to return', 
      { fontSize: '48px', color: '#ff0000', align: 'center' }
    ).setOrigin(0.5);
    this.uiTexts.push(defeatText);
  }

  private endBattle() {
    this.scene.start('VillageScene');
  }
}
