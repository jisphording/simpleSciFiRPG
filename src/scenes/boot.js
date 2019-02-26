// BOOT SCENE
// -------------------------------------------------------------
// Here we prepare the barebone elements for startup and greet the player with a Boot-/Intro-/Startup screen while the game continues loading in the background.

export class BootScene extends Phaser.Scene {

    // the unique scene identifier. 
    // individual scene configuration can be passed here as well
    constructor () {
        super('BootScene');
    }

    preload ()  {
        // Load all assets // nameKey - src
        this.load.image('bg', 'assets/images/bg/gradient.jpg');
    }

    create () {
        // adding a beautiful start screen background
        this.add.image(320, 240, 'bg');

        var fontColor = '#00ff00';
        var fontDefinition = "32px Courier";
        
        // Here we display the name ofthe game
        var nameLabel = this.add.text(10, 100, 'simpleSciFiRPG', { font: fontDefinition, fill: fontColor });

        // Player instructions on how to start the game
        var startLabel = this.add.text(10, 150, 'press the "W" key to start', { font: fontDefinition, fill: fontColor });
        
        // Making the 'W' key for pressing available
        // the following is quite hacky at the moment. I do not now the proper JS way of referencing 'this' when it changes. since the scene transition method lives on the BootScene (here = 'this') i save it ti a variable that, because when going into the following keydown function 'this' changes to that function I I do not know yet how to properly get a hold back onto the Scene Object from within the keyboard event to call the transition method.
        let that = this;

        this.input.keyboard.on('keydown_W', function (event) {
            that.transition();
        });
    }

    transition () {
        console.log('Transition');
        this.scene.transition({
            target: 'GameScene',
            duration: 3000,
            moveBelow: true,
            onUpdate: this.transitionOut,
            data: { x: 640, y: 480 }
        });
    }
}