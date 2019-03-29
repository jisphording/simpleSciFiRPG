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

        // Loading individual sprites. Should be refactored to use spritesheet in the future
        this.load.image('grass-patch', 'assets/images/tiles/grass-patch.png');

        // loading the player character
        // this.load.multiatlas('characters', 'assets/images/entities/player/player.json', 'assets/images/entities/player');
        // our two characters
        this.load.spritesheet('player', 'assets/images/entities/player/characters.png', { frameWidth: 16, frameHeight: 16 });
    }

    // sometimes the playercharacter moves randomly when we switch back from battlescene to worldscene. To top this we reset the keys in the wake function
    wake () {
        this.controls.left.reset();
        this.controls.right.reset();
        this.controls.up.reset();
        this.controls.down.reset();
    }

    create () {
        // getting colors and font from realtimeInterface
        let colors = RealtimeInterface.colors();
        let fontBig = RealtimeInterface.fontBig();

        this.createLayers();
        this.getTrigger();

        // Adding a navigation helper
        this.add.text(25, 35, 'A', { font: fontBig, fill: colors });

        // I need a reference to this in the following function but do not know the proper way of achieving this yet
        let that = this;

        this.input.keyboard.on('keydown_A', function (event) {
            that.transition();
        });

        // Accessing the main camera
        const camera = this.cameras.main;

        // Setup the arrow keys to control the camera
        const cursors = this.input.keyboard.createCursorKeys();
        
        this.controls = new Phaser.Cameras.Controls.FixedKeyControl({
            camera: camera,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            speed: 0.5
        });

        // Constrain the camera so that does not move outside the tilemap.
        camera.setBounds( 0, 0, this.tileMap.widthInPixels, this.tileMap.heightInPixels);

        // Spawn the player
        const spawnPoint = this.tileMap.findObject("player-start", obj => obj.name === "playerSpawn");

        // create the player character through our physics system
        this.player = this.physics.add.sprite( spawnPoint.x, spawnPoint.y, 'player', 6);
        this.player.setScale( 2, 2 );

        // Make camera follow the player
        camera.startFollow(this.player);
        camera.roundPixels = true; // avoid tile bleed

        // creating sprite animations to move the player character
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers( 'player', { frames: [1, 7, 1, 13]}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers( 'player', { frames: [1, 7, 1, 13]}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers( 'player', { frames: [2, 8, 2, 14]}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers( 'player', { frames: [0, 6, 0, 12]}),
            frameRate: 10,
            repeat: -1
        });

        // Don't allow the player to move out of the map
        this.physics.world.bounds.width = this.tileMap.widthInPixels;
        this.physics.world.bounds.height = this.tileMap.heightInPixelsM
        this.player.setCollideWorldBounds( true );
        
        // Don't allow walking on obstacles
        this.physics.add.collider( this.player, this.wallLayer );

    }

    createLayers () {
        // setting the different level layers to build the map from
        const x = 0;
        const y = 0;

        // Creating the level from the tilemap - first pulling the json from above
        this.tileMap = this.add.tilemap('lvl-01-map');
        // Then connecting the json map from tiled with the tile-sheet image preloaded in phaser
        this.tileSet = this.tileMap.addTilesetImage('environment-tiles', 'environment-tiles');
        
        // Creating our Layers by assigning their keys/names from Tiled editor, starting with the background layer
        this.floorLayer = this.tileMap.createDynamicLayer('ground-walkable', this.tileSet);
        // Then adding additional layers // The X, Y here is starting from the top left corner
        this.wallLayer = this.tileMap.createStaticLayer('ground-impassable', this.tileSet, x, y);
        // placing the collectable items
        this.crateLayer = this.tileMap.createStaticLayer('item-crates', this.tileSet, x, y);
        // placing the obstacles
        this.obstacleLayer = this.tileMap.createDynamicLayer('obstacle-pond', this.tileSet, x, y);
    
        // Make all tiles on the wallLayer collidable
        this.wallLayer.setCollisionByExclusion([-1]);
    }

    // creating collectable crates and items for the player
    createCrates () {
    }

    // getTrigger is used to filter out all tiles of the tilemap layer that it is run against
    getTrigger() {
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

    transition () {
        this.scene.bringToTop('Lvl01');
    }

    // freezing the player
    freezePlayer () {
        // set Player Velocity to Zero
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
    }

    update ( time, delta ) {
        // Apply the camera controls each tick
        // this.controls.update( delta );

        // Moving the player character
        // Horizontal Movement
        if ( this.controls.left.isDown )
        {
            this.player.body.setVelocityX(-80);
        }
        else if ( this.controls.right.isDown )
        {
            this.player.body.setVelocityX(80);
        }

        // Stop the character from moving on X-Axis when no button is pressed
        else
        {
            this.player.body.setVelocityX(0);
        }

        // Vertical movement
        if ( this.controls.up.isDown )
        {
            this.player.body.setVelocityY(-80);
        }
        else if ( this.controls.down.isDown )
        {
            this.player.body.setVelocityY(80);
        }

        // Stop the character from moving on Y-Axis when no button is pressed
        else
        {
            this.player.body.setVelocityY(0);
        }

        // Update the animation last and give left/right animations precedence over up/down animations
        if ( this.controls.left.isDown )
        {
            this.player.anims.play('left', true);
            this.player.flipX = true;
        }
        else if ( this.controls.right.isDown )
        {
            this.player.anims.play('right', true);
            this.player.flipX = false;
        }
        else if ( this.controls.up.isDown )
        {
            this.player.anims.play('up', true);
        }
        else if ( this.controls.down.isDown )
        {
            this.player.anims.play('down', true);
        }
        else 
        {
            this.player.anims.stop();
        }

        // Check for player Collision with obstacle Triggers
        if (
            this.player.y > this.obstacleLayer.height ||
            this.physics.world.overlap(this.player, this.triggerGroup)
        ) {

            // Flag that the player is dead, so that we can stop update from running
            this.isPlayerDead = true;

            // Make it a little more visible and dramatic for the player
            this.cameras.main.shake( 100, 0.1 );
            this.cameras.main.fade( 250, 0, 0, 0);
            // Freeze the player to leave them on screen while fading
            this.freezePlayer();

            this.cameras.main.once( 'camerafadeoutcomplete', () => {
                // Disable keyboard input
                this.input.keyboard.enabled = false;

                // this.player.destroy();

                // Restart the scene
                this.scene.restart();

                // Re-enable keyboard input after  a second
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