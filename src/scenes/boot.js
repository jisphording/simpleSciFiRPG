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
        this.load.image('screenTitle', 'assets/images/screens/title.png');
    }

    create () {
        // Make it topmost in the beginning
        this.scene.bringToTop('BootScene');

        this.add.image(320, 240, 'screenTitle');
        
        // Making the 'W' key for pressing available
        // the following is quite hacky at the moment. I do not now the proper JS way of referencing 'this' when it changes. since the scene transition method lives on the BootScene (here = 'this') i save it as a variable that, because when going into the following keydown function 'this' changes to that function I I do not know yet how to properly get a hold back onto the Scene Object from within the keyboard event to call the transition method.
        let that = this;

        this.input.keyboard.on('keydown_W', function (event) {
            that.transition();
            let element = document.getElementsByClassName('game-detail');
            element[0].innerHTML = '<p class="alert-green">Yeah, the game is running!</p>';    
        });
    }

    transition () {
        console.log('Transition to starting the game!');
        this.scene.start('MainLoop');
    }
}