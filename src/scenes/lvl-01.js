// LEVEL 01
// -------------------------------------------------------------
// This file contains the first level

// loading fonts and colors
import { RealtimeInterface } from '../utils/realtimeInterface';

export class Lvl01 extends Phaser.Scene {

    constructor () {
        super({ key: 'Lvl01' });
    }

    preload () {
        // load all assets // nameKey - src
    }

    create () {
        // getting colors and font from realtimeInterface
        let colors = RealtimeInterface.colors();
        let fontBig = RealtimeInterface.fontBig();

        // creating a recognizable graphic to better visualize which scene is active
        let graphics = this.add.graphics();

        graphics.fillStyle(0xff3300, 1);

        graphics.fillRect(0, 100, 640, 480);
        graphics.fillRect(25, 35, 85, 85);

        this.add.text(25, 35, 'A', { font: fontBig, fill: colors });

        // I need a reference to this in the following function but do not know the proper way of achieving this yet
        let that = this;

        this.input.keyboard.on('keydown_A', function (event) {
            that.transition();
        });
    }

    transition () {
        this.scene.bringToTop('Lvl01');
    }
}