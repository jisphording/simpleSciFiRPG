// THE PLAYER CLASS
// ---------------------------------------------------------------------------------------- //
// Handling everything regarding the player character and it's actor in the game world

import 'phaser';

export class Player {
    constructor( scene, x, y ) {
        this.scene = scene;

        // Moving the player
        // ---------------------------------------------------------------------------------------- //
        // Create the animations we need from the player spritesheet
        const anims = scene.anims;

        anims.create({
            key: 'left',
            frames: anims.generateFrameNumbers( 'player', { frames: [1, 7, 1, 13]}),
            frameRate: 10,
            repeat: -1
        });

        anims.create({
            key: 'right',
            frames: anims.generateFrameNumbers( 'player', { frames: [1, 7, 1, 13]}),
            frameRate: 10,
            repeat: -1
        });

        anims.create({
            key: 'up',
            frames: anims.generateFrameNumbers( 'player', { frames: [2, 8, 2, 14]}),
            frameRate: 10,
            repeat: -1
        });

        anims.create({
            key: 'down',
            frames: anims.generateFrameNumbers( 'player', { frames: [0, 6, 0, 12]}),
            frameRate: 10,
            repeat: -1
        });

        // Create the physics based sprite & set various properties
        // ---------------------------------------------------------------------------------------- //
        this.sprite = scene.physics.add.sprite( x, y, 'player', 6)
        // scaling the sprite to better fit with the game world
        this.sprite.setScale( 2, 2 );

        // Don't allow the player to move out of the map
        this.scene.physics.world.bounds.width = this.scene.tileMap.widthInPixels;
        this.scene.physics.world.bounds.height = this.scene.tileMap.heightInPixelsM
        this.sprite.setCollideWorldBounds(true);

        // Don't allow walking on obstacles
        this.scene.physics.add.collider(this.sprite, this.wallLayer);

        // Setup the keys for controlling the player
        // ---------------------------------------------------------------------------------------- //
        // Setup the arrow keys to control the camera
        // const cursors = this.input.keyboard.createCursorKeys();
        const { LEFT, RIGHT, UP, DOWN } = Phaser.Input.Keyboard.KeyCodes;

        this.controls = scene.input.keyboard.addKeys({
            left: LEFT,
            right: RIGHT,
            up: UP,
            down: DOWN
        });
    }

    // TODO - Currently not used? // sometimes the playercharacter moves randomly when we switch back from battlescene to worldscene. To top this we reset the keys in the wake function
    wake () {
        this.controls.left.reset();
        this.controls.right.reset();
        this.controls.up.reset();
        this.controls.down.reset();
    }

    // freezing the player
    freezePlayer () {
        // set Player Velocity to Zero
        this.sprite.body.velocity.x = 0;
        this.sprite.body.velocity.y = 0;
    }

    update () {
        const controls = this.controls;
        const sprite = this.sprite;
        
        // Moving the player character
        // Horizontal Movement
        if ( controls.left.isDown )
        {
            sprite.body.setVelocityX(-80);
        }
        else if ( controls.right.isDown )
        {
            sprite.body.setVelocityX(80);
        }

        // Stop the character from moving on X-Axis when no button is pressed
        else
        {
            sprite.body.setVelocityX(0);
        }

        // Vertical movement
        if ( controls.up.isDown )
        {
            sprite.body.setVelocityY(-80);
        }
        else if ( controls.down.isDown )
        {
            sprite.body.setVelocityY(80);
        }

        // Stop the character from moving on Y-Axis when no button is pressed
        else
        {
            sprite.body.setVelocityY(0);
        }

        // Update the animation last and give left/right animations precedence over up/down animations
        if ( controls.left.isDown )
        {
            sprite.anims.play('left', true);
            sprite.flipX = true;
        }
        else if ( controls.right.isDown )
        {
            sprite.anims.play('right', true);
            sprite.flipX = false;
        }
        else if ( controls.up.isDown )
        {
            sprite.anims.play('up', true);
        }
        else if ( controls.down.isDown )
        {
            sprite.anims.play('down', true);
        }
        else 
        {
            sprite.anims.stop();
        }
    }
}