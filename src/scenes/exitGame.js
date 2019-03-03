// EXIT SCREEN
// -------------------------------------------------------------
// On pressing Escape the user exits the game / goes back to the boot SCREEN
export class ExitGame extends Phaser.Scene {

    constructor () {
        super({ key: 'ExitGame', active: true });
    }

    create () {
        let that = this;

        this.input.keyboard.on('keydown_ESC', function (event) {
            that.scene.start('BootScene');
        });
    }
}