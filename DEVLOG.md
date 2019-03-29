# DEVLOG - Simple SciFiRPG

*This document is a kind of small, personal devlog where I keep additional notes on development, difficulties I had and problems and solutions I encountered. It goes a little bit beyond the scope of the readme file so I broke it out into a seperate document. Please bare in mind that this is just a personal notebook and not a completed writeup, so it may contain a lot of unfinished and unpolished thoughts.*
*But maybe it can be useful for someone else looking for help while getting started with Phaser 3.*

----

## Modularizing your code

*Modular code makes it much easier to build and maintain reusable blocks of code. While the basic idea sounds simple, actually getting it to work in a good manner is not that easy. But since in my eyes the advantages far outweigh the overhead of getting modules to work I thought why not give it a shot. This is a learning project anyways.*

Ressources: [Eloquent Javascript: Chapter 10 - Modules](https://eloquentjavascript.net/10_modules.html)

----

## Getting Tilemaps into Phaser 3

*To create the tilemaps for the project I chose to work with Photoshop for creating the tiles, Texture Packer for packing them up into a compact Sprite Sheet and Tiled to create a Map from that Sprite Sheet.*

But to get this to work has actually been a little bit counterintuitive for me on the first try, so I write it down here as a reminder.

### 01. Sprite design in Photoshop

This is straight forward. Create a new canvas with a base 64 size and multiples of that (64x64, 128x128, 256x256 etc.). All your tiles should fill up a square 64x64 tile or multiples of that. To retain sharp edges go to the Program Settings and set image scaling from "bicubic" to "nearest-neighbor". Export your layers as .png.

### 02. Sprite-Sheet creation in Texture Packer

This is the most convenient method since texture packer exports to Phaser 3 out of the box. Just import all your previously created Photoshop-Tiles into Texture Packer and set the appropriate options in the "Settings" Panel on the right:

- Data Format: Phaser 3
- Trim Sprite Names 
- Texture Format (if possible) to PNG-8 (indexed)

And then simply publish your Sprite Sheet from Texture Packer. To make it available in Phaser you have to use:

<code>
preload () {
    this.load.image('name-of-the-spritesheet', 'path/to/where/the/spritesheet/is/located/name-of-the-spritesheet+filesuffix');
}
</code>

And then you can reference it by:

<code>
create () { 
    this.tileSet = this.tileMap.addTilesetImage('environment-tiles', 'environment-tiles');
}
</code>

### 03. Map creation in Tiled

After you created the Sprite-Sheet in Texture Packer you Start a new project in tiled. The map has to use the same tile-size as the tiles you created in Photoshop. 
If you just drag-and-drop your Texture Packer image file onto the "tilesets" area on the right, Tiled thinks the whole tile-sheet is just a single tile. To avoid this confusion and to actually use the individual tiles that texture packer created (and saved on export as a .json file) you have to:

- Select "New Tileset" in the right hand panel
- give the tile set a name (I find it easiest to just use the name you gave the tile-sheet itself in Texture Packer)
- Type has to be: "Based on tileset"
- Embed into map
- Tile-Size the same you chose in Photoshop for the creation step

Then you can create your map like you normally would in Tiled and export the map layout to .json when you finished.

The last step is to get the map data from said .json into Phaser 3. To do this you need to:

<code> 
preload () {
    this.load.tilemapTiledJSON('name-of-the-map', 'path/to/where/the/map/json/is/located/name-of-the-map+filesuffix');
}
</code>

Then to connect the json map from Tiled with the tile-sheet image from Texture Packer preloaded in Phaser you have to:

<code>
create () {
    this.tileMap = this.add.tilemap('name-of-the-map');
}

### Additional information

- The original tile image names you used when exporting from photoshop are referenced by Texture Packer and Tiled to reference the corresponding tiles in the .json, so be careful with renaming your files. If you do you need to double check your .json files and update them if needed.

- Sometimes a Texture Packer Export does not always cleanly exports transparency over to Tiled resulting in wrong cut tile borders. To repair that it is (most of the time) sufficient to just open the .json and make sure the affected tiles have the correct dimensions. If not, you can manually correct that here. 

- Sometimes Texture Packer changes the tile dimensions on export. To remedy that just open the tile-sheet in Photoshop and scale it back to the original dimensions (without rearranging the tiles of course.)

----

## Filtering out Tiles from a Tilemap created in Tile

To aid in map creation I am using the [Tiled Map Editor](https://www.mapeditor.org/) which makes the process much easier by providing a visual interface, different objects/layers and a handy way of exporting JSON to be used in Phaser. 

Getting the basic map loaded from JSON by Phaser works so far. But I have difficulties dynamically filtering out the spawn point tile from a Tiled layer as shown here in the [Sokoban remake tutorial](https://www.crazygames.com/blog/2018/10/24/Sokoban-Series-Part-2-Creating-an-Interactive-Level/). 

I have read up on the issue in the [Phaser Devlog](https://phaser.io/phaser3/devlog/108), but do not yet fully understand the implications of why it's not working. To go around this issue for now I have used the solution from [Michael Hadleys Modular Game Worlds Series](https://medium.com/@michaelwesthadley/modular-game-worlds-in-phaser-3-tilemaps-1-958fc7e6bbd6) and converted the player Spawn from a tile-layer into an object layer. 
This is working find for the time being, but I'll probably have to get back to the solution of filtering out tiles from a tile layer anyway.

----