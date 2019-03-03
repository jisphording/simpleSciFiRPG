// GAME SCENE
// -------------------------------------------------------------
// This file contains our main game loop

// loading fonts and colors
import { RealtimeInterface } from '../utils/realtimeInterface';

export class MainLoop extends Phaser.Scene {
    
    // the unique scene identifier. 
    // individual scene configuration can be passed here as well
    constructor () {
        super({ key: 'MainLoop' });

        this.score = 0;
        this.lives = 6;
    }

    preload () {
        // Load all assets // nameKey - src
        this.load.multiatlas('environments', 'assets/images/tiles/environment-tiles.json', 'assets/images/tiles');
  
    }

    create () {
        // when the game scene is launched we automatically start all the necessary 'game scenes'
        this.scene.launch('Lvl01');
        this.scene.launch('Lvl02');
        this.scene.launch('Lvl03');
        this.scene.bringToTop('MainLoop');

        // getting colors and font from realtimeInterface
        let colors = RealtimeInterface.colors();
        let fontBig = RealtimeInterface.fontBig();

        // creating a recognizable graphic to better visualize which scene is active
        let graphics = this.add.graphics();

        graphics.fillStyle(0xacacff, 1);

        graphics.fillRect(0, 100, 640, 480);
        graphics.fillRect(250, 35, 85, 85);

        this.add.text(250, 35, 'Ga', { font: fontBig, fill: colors });

        // Store the score and the player lives in the Game Registry
        this.registry.set('score', this.score);
        this.registry.set('lives', this.lives);

        // fill the background with boxes
        for ( let i = 0; i < 12; i++ ) {
            let x = Phaser.Math.Between(0, 640);
            let y = Phaser.Math.Between(132, 480);

            let box = this.add.sprite(x, y, 'environments', 'ground-red.png').setInteractive();

            if ( i % 2 ) {
                box.setTint(0xff0000);
            }
        }

        this.input.on('gameobjectup', this.clickHandler, this); 
    }

        clickHandler ( pointer, box ) {
        if ( this.lives === 1 ) {
            // if lives are reduced to 1 the game is lost and we go to boot screen so the player can restart the game (at one, because the check actually happens before the score is reduced in the interface)
            this.scene.start('BootScene');
        }

        // Disable the box
        box.input.enabled = false;
        box.setVisible(false);

        // If box was tinted red you lose a life
        if ( box.tintTopLeft === 255 ) {
            this.lives--;
            this.registry.set('lives', this.lives);
            // updating the dom-interface
            document.getElementById("value-lives").innerText = this.lives;
        }
        else {
            this.score++;
            this.registry.set('score', this.score);
            // updating the dom-interface
            document.getElementById("value-score").innerText = this.score;
        }
    }
}