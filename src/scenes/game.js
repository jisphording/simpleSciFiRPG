// GAME SCENE
// -------------------------------------------------------------
// This file contains our main game loop

export class GameScene extends Phaser.Scene {
    
    // the unique scene identifier. 
    // individual scene configuration can be passed here as well
    constructor () {
        super('GameScene');

        this.score = 0;
        this.lives = 6;
    }

    preload () {
        // Load all assets // nameKey - src
        this.load.image('bracer', 'assets/images/bracer.png');
    }

    create () {

        // Store the score and the player lives in the Game Registry
        this.registry.set('score', this.score);
        this.registry.set('lives', this.lives);

        // fill the background with boxes
        for ( let i = 0; i < 12; i++ ) {
            let x = Phaser.Math.Between(0, 640);
            let y = Phaser.Math.Between(0, 480);

            let box = this.add.image(x, y, 'bracer').setInteractive();

            if ( i % 2 ) {
                box.setTint(0xff0000);
            }
        }

        this.input.on('gameobjectup', this.clickHandler, this);
    }

    clickHandler ( pointer, box ) {
        if ( history.lives === 0 ) {
            return;
        }

        // Disable the box
        box.input.enabled = false;
        box.setVisible(false);

        // If box was tinted red you lose a life
        if ( box.tintTopLeft === 255 ) {
            this.lives--;
            this.registry.set('lives', this.lives);
        }
        else {
            this.score++;
            this.registry.set('score', this.score);
        }
    }
}