// LEVEL 01
// ---------------------------------------------------------------------------------------- //
// This file contains the first level

// importing necessary modules
import { RealtimeInterface } from '../utils/realtimeInterface';
import { Player } from '../entities/player.js';

export class Lvl01 extends Phaser.Scene {

    constructor () {
        super({ key: 'Lvl01' });
    }

    // Fetching & preparing data that is used in this level
    // ---------------------------------------------------------------------------------------- //
    preload () {
        // loading the tile-sheet itself
        this.load.image('environment-tiles', 'assets/images/tiles/environment-tiles.png');
        // loading the json data for the map created with Tiled Editor
        this.load.tilemapTiledJSON('lvl-01-map', 'assets/maps/lvl-01-map.json');
        // Loading individual sprites. Should be refactored to use spritesheet in the future
        this.load.image('grass-patch', 'assets/images/tiles/grass-patch.png');
        // loading the player character
        this.load.spritesheet('player', 'assets/images/entities/player/characters.png', { frameWidth: 16, frameHeight: 16 });
    }

    // Creating the scene with the prviously fetched assets
    // ---------------------------------------------------------------------------------------- //
    create () {
        // getting colors and font from realtimeInterface
        let colors = RealtimeInterface.colors();
        let fontBig = RealtimeInterface.fontBig();

        // building the layers from the Tiled tilemap
        this.createLayers();
        // pulling out collidable obstacles from certain layers
        this.getTrigger();

        // Scene Transition
        // ---------------------------------------------------------------------------------------- //
        // Adding a temporary navigation helper
        this.add.text(25, 35, 'A', { font: fontBig, fill: colors });

        // I need a reference to this in the following function but do not know the proper way of achieving this yet
        let that = this;
        this.input.keyboard.on('keydown_A', function (event) {
            that.transition();
        });

        // Creating the player character
        // ---------------------------------------------------------------------------------------- //
        // Spawn the player
        const spawnPoint = this.tileMap.findObject("player-start", obj => obj.name === "playerSpawn");

        // create the player character through our physics system
        this.player = new Player( this, spawnPoint.x, spawnPoint.y);

        // Camera Setup & Control
        // ---------------------------------------------------------------------------------------- //
        // Accessing the main camera
        const camera = this.cameras.main;

        // Constrain the camera so that does not move outside the tilemap.
        camera.setBounds( 0, 0, this.tileMap.widthInPixels, this.tileMap.heightInPixels);

        // Make camera follow the player
        camera.startFollow(this.player.sprite);
        camera.roundPixels = true; // avoid tile bleed
    }

    // Build up the layers that form the playable level map
    // ---------------------------------------------------------------------------------------- //
    createLayers () {
        // zero out x and y, because we start building from top left corner
        const x = 0;
        const y = 0;

        // Connecting the Map & Layer Data
        // ---------------------------------------------------------------------------------------- //
        // Creating the level from the tilemap - first pulling the 'Tiled' json from preload
        this.tileMap = this.add.tilemap('lvl-01-map');
        // Then connecting the json map from tiled with the tile-sheet image preloaded in phaser
        this.tileSet = this.tileMap.addTilesetImage('environment-tiles', 'environment-tiles');
        
        // Building the layers
        // ---------------------------------------------------------------------------------------- //
        // Creating our Layers by assigning their keys/names from Tiled editor, starting with the background layer
        this.floorLayer = this.tileMap.createDynamicLayer('ground-walkable', this.tileSet);
        // Then adding additional layers // The X, Y here is starting from the top left corner
        this.wallLayer = this.tileMap.createStaticLayer('ground-impassable', this.tileSet, x, y);
        // placing the collectable items
        this.crateLayer = this.tileMap.createStaticLayer('item-crates', this.tileSet, x, y);
        // placing the obstacles
        this.obstacleLayer = this.tileMap.createDynamicLayer('obstacle-pond', this.tileSet, x, y);
    
        // Adding Physics to the layers
        // ---------------------------------------------------------------------------------------- //
        // Make all tiles on the wallLayer collidable
        this.wallLayer.setCollisionByExclusion([-1]);
    }

    // Setting up collidable entities & triggers from the map data
    // ---------------------------------------------------------------------------------------- //
    getTrigger() {
        // getTrigger is used to filter out all tiles of the tilemap layer that it is run against
        // Creating a physics group to collide the player against obstacles to trigger events
        this.triggerGroup = this.physics.add.staticGroup();

        // Loop over each Tile
        this.obstacleLayer.forEachTile(tile => {
            if ( tile.index > 0 ) { // where to look up the actual tile index?
                // A sprite has it's origin at the center, so we place the sprite at the center of the tie
                const x = tile.getCenterX();
                const y = tile.getCenterY();
                const trigger = this.triggerGroup.create( x, y, 'grass-patch');

                // The map has spike tiles that have been rotated in Tiled ("z" key), so parse out that angle
                // to the correct body placement
                trigger.rotation = tile.rotation;
                if ( trigger.angle === 0 ) trigger.body;
                else if ( trigger.angle === -90 ) trigger.body;
                else if ( trigger.angle === 90 ) trigger.body;

                // Remove the original tile from the layer
                this.obstacleLayer.removeTileAt( tile.x, tile.y );
            }
        });
    }

    // Scene Transition
    // ---------------------------------------------------------------------------------------- //
    transition () {
        this.scene.bringToTop('Lvl01');
    }

    // The Update & Game Loop
    // ---------------------------------------------------------------------------------------- //
    update ( time, delta ) {
        // Allowing the player to respond to the key presses and update itself
        this.player.update();

        // Checking for player collision with map entities & obstacle triggers
        // ---------------------------------------------------------------------------------------- //
        // TODO - There seems to be an error when the players 'Y' reaches the level bounds 
        // Check for player Collision with obstacle Triggers
        if (
            this.player.sprite.y > this.obstacleLayer.height ||
            this.physics.world.overlap(this.player.sprite, this.triggerGroup)
        ) {

            // Flag that the player is dead, so that we can stop update from running
            this.isPlayerDead = true;

            // Make it a little more visible and dramatic for the player
            this.cameras.main.shake( 100, 0.1 );
            this.cameras.main.fade( 250, 0, 0, 0);

            // Freeze the player to leave them on screen while fading
            this.player.freezePlayer();

            this.cameras.main.once( 'camerafadeoutcomplete', () => {
                // Disable keyboard input
                this.input.keyboard.enabled = false;

                // Restart the scene
                this.scene.restart();

                // TODO // Re-enable keyboard input after  a second
                // currently this seems a little bit overkill to use a callback and it's own variable
                // for that. This should probably be refactored further down the road
                var keyboardRef = this.input.keyboard;
                function callback () {
                    return function () {
                        keyboardRef.enabled = true;
                    }
                }

                setTimeout(callback( ), 1000);
            });
        }
    }
}