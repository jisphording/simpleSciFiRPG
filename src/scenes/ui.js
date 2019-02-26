// UI SCENE
// -------------------------------------------------------------
// We seperate out the user interface into it's own scene.
// This file contains all ui elements that lay on top of the game.

export class UIScene extends Phaser.Scene {

    // the unique scene identifier. 
    // individual scene configuration can be passed here as well
    constructor () {
        super({ key: 'UIScene', active: true });

        this.scoreText;
        this.livesText;
    }

    create () {
        var fontColor = '#00ff00';
        var fontDefinition = "32px Courier";

        // A Text object to display the score
        this.scoreText = this.add.text(10, 10, 'Score: 0', { font: fontDefinition, fill: fontColor });
        this.livesText = this.add.text(10, 50, 'Lives: 6', { font: fontDefinition, fill: fontColor });

        // Check the Registry and hit our callback every time the 'score' value is updated
        this.registry.events.on('changedata', this.updateData, this);
    }

    updateData ( parent, key, data ) {
        if ( key === 'score' ) {
            this.scoreText.setText('Score: ' + data);
        }
        else if ( key === 'lives' ) {
            this.livesText.setText('Lives: ' + data);
        }
    }
}