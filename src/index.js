// BOOT SCENE
// -------------------------------------------------------------
// This file contains the basic settings and configuration
// for the Phaser project. They may in part be overwritten
// from other game files (settings, options) during runtime.

import 'phaser';
import { BootScene } from './scenes/boot';
import { GameScene } from './scenes/game';
import { MenuScene } from './scenes/menu';
import { UIScene } from './scenes/ui';

// The Phaser configuration for this project
const gameConfig = {
  // For more settings see <https://github.com/photonstorm/phaser/blob/master/src/boot/Config.js>
  type: Phaser.WEBGL,
  pixelArt: true, // no Antialiasing
  width: 640, // resolution-x
  height: 480, // resolution-y
  physics: {
    default: 'arcade',
    arcade: {
      debug: true
    }
  },
  scene: [
    BootScene,
    GameScene,
    MenuScene,
    UIScene
  ]
};

const game = new Phaser.Game(gameConfig);