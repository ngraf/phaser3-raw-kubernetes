import Phaser from 'phaser'
import SceneKeys from "~/consts/SceneKeys";
import Config from "~/game/Config";

export default class Preloader extends Phaser.Scene
{
    constructor()
    {
        super(SceneKeys.PRELOADER)
    }

    preload()
    {
        this.load.image('example-asset', 'assets/images/example-asset.png');

        // Required by "designsystem/PopupInfo.ts"
        this.load.image('bar', 'assets/images/grey-bar-narrow.png');

        // Required by "designsystem/Highlighter.ts"
        this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json');
    }

    create()
    {
        this.scene.start(SceneKeys.GAME)
        this.scene.start(SceneKeys.UI)
        if (Config.TUTORIAL_ENABLED) {
            this.scene.start(SceneKeys.TUTORIAL)
        }
    }
}
