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
        // loading the tile-sheet itself
        this.load.image('environment-tiles', 'assets/images/tiles/environment-tiles.png');
        // loading the json data for the map created with Tiled Editor
        this.load.tilemapTiledJSON('lvl-01-map', 'assets/maps/lvl-01-map.json');
    }

    create () {
        // getting colors and font from realtimeInterface
        let colors = RealtimeInterface.colors();
        let fontBig = RealtimeInterface.fontBig();

        // Creating the level from the tilemap - first pulling the json from above
        this.tileMap = this.add.tilemap('lvl-01-map');
        // Then connecting the json map from tiled with the tile-sheet image preloaded in phaser
        this.tileSet = this.tileMap.addTilesetImage('lvl-01-map', 'environment-tiles');
        // Creating our Layers by assigning their keys/names from Tiled editor, starting with the background layer
        this.backgroundLayer = this.tileMap.createStaticLayer('ground-walkable', this.tileSet);
        // Then adding additional layers // The X, Y here is starting from the top left corner
        this.tileMap.createStaticLayer('ground-impassable', this.tileSet, 0, 0);

        // Adding a navigation helper
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