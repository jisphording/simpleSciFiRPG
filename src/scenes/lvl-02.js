// LEVEL 02
// -------------------------------------------------------------
// This file contains the second level

export class Lvl02 extends Phaser.Scene {

    constructor () {
        super({ key: 'Lvl02' });
    }

    preload () {
        // load all assets // nameKey - src
    }

    create () {
        // creating a recognizable graphic to better visualize which scene is active
        let graphics = this.add.graphics();

        graphics.fillStyle(0xff9933, 1);

        graphics.fillRect(0, 100, 640, 480);
        graphics.fillRect(100, 35, 85, 85);

        this.add.text(100, 35, 'B', { font: '72px Courier', fill: '#000000' });

        // I need a reference to this in the following function but do not know the proper way of achieving this yet
        let that = this;

        this.input.keyboard.on('keydown_B', function (event) {
            that.transition();
        });
    }

    transition () {
        this.scene.bringToTop('Lvl02');
    }
}