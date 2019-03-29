// INDEX SCENE
// -------------------------------------------------------------
// This file contains the basic settings and configuration
// for the Phaser project. They may in part be overwritten
// from other game files (settings, options) during runtime.

import 'phaser';
import { BootScene } from './scenes/boot';
import { ExitGame } from './scenes/exitGame';
import { MainLoop } from './scenes/mainLoop';
import { MenuScene } from './scenes/menu';
import { UIScene } from './scenes/ui';

import { Lvl01 } from './scenes/lvl-01';
import { Lvl02 } from './scenes/lvl-02';
import { Lvl03 } from './scenes/lvl-03';

// The Phaser configuration for this project
const gameConfig = {
  // For more settings see <https://github.com/photonstorm/phaser/blob/master/src/boot/Config.js>
  type: Phaser.WEBGL,
  pixelArt: true, // no Antialiasing
  width: 640, // resolution-x
  height: 480, // resolution-y // corresponds with tile-sizing
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }, // Top down game, so no gravity on y-axis
      debug: true
    }
  },
  scene: [
    BootScene,
    ExitGame,
    MainLoop,
    // MenuScene,
    // UIScene,

    Lvl01,
    Lvl02,
    Lvl03
  ]
};

const game = new Phaser.Game(gameConfig);

// SETUP PWA - PROGRESSIVE WEP APPLICATION

// Registering a service Worker
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/service-worker.js').then(registration => {
//       console.log('SW registered: ', registration);
//     }).catch(registrationError => {
//       console.log('SW registration failed: ', registrationError);
//     });
//   });
// }