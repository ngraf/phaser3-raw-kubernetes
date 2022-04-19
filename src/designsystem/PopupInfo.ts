import Tweens from "./Tweens";
import Config from "~/game/Config";

export default class PopupInfo {

    private static Y : integer = 80;
    private static DURATION : integer = 1500 ;
    private static defaultColor : number = 0xeeeeee // grey
    public static successColor : number = 0x00ff00 // green
    private static textColor : string = '#000000' // black

    public static showBannerAnimation(scene : Phaser.Scene, text : string, color : number = this.defaultColor, duration : integer|undefined = undefined, y : number = this.Y) {
        if (duration !== undefined) {
            this.DURATION = duration;
        }
        // Animation of grey flying-in box
        var eases = [
            'Quad.easeOut',
            'Cubic.easeOut',
            'Quart.easeOut',
            'Quint.easeOut',
            'Sine.easeOut',
            'Expo.easeOut',
            'Circ.easeOut',
            'Back.easeOut',

            'Quad.easeIn',
            'Cubic.easeIn',
            'Quart.easeIn',
            'Quint.easeIn',
            'Sine.easeIn',
            'Expo.easeIn',
            'Circ.easeIn',
            'Back.easeIn',
            'Bounce.easeIn',

            // Not in use:
            // 'Bounce.easeOut',
            // 'Quad.easeInOut',
            // 'Cubic.easeInOut',
            // 'Quart.easeInOut',
            // 'Quint.easeInOut',
            // 'Sine.easeInOut',
            // 'Expo.easeInOut',
            // 'Circ.easeInOut',
            // 'Back.easeInOut',
            // 'Bounce.easeInOut',
            // 'Linear',
        ];

        //@ts-ignore
        var images = scene.add.group({ key: 'bar', repeat: 9, setXY: { x: -200, y: y, stepY: 5 }, alpha: 0.5});

        images.children.iterate(  (child) => {

            // Move in from left

            // @ts-ignore
            child.setTint(color);
            scene.tweens.add({
                targets: child,
                x: scene.sys.canvas.width/2,
                ease: eases.shift(),
                duration: this.DURATION - 500,
                delay: 0,
            });

            // Move out to right
            scene.tweens.add({
                targets: child,
                x: scene.sys.canvas.width + 300,
                ease: eases.shift(),
                duration: this.DURATION,
                delay: this.DURATION + 150,
                onComplete: () => {
                    images.destroy()
                }
            });
        });


        // Display text message

        const textObject = scene.add.text(scene.sys.canvas.width / 2, this.Y + 20, text, { font : `23px ${Config.DEFAULT_FONT}`});
        textObject.setFill(this.textColor)
        textObject.setAlpha(0)
        textObject.setOrigin(0.5,0.5);

        // Text Fade In
        Tweens.fadeIn(textObject, this.DURATION - 300)

        // Text Fade Out
        scene.tweens.add({
            targets: textObject,
            alpha: 0,
            delay: this.DURATION + 150,
            duration: this.DURATION,
            ease: 'Power2',
            onComplete: () => {
                textObject.destroy()
                images.destroy()
            }
        });

        // Set depths
        images.setDepth(100)
        textObject.setDepth(101)
    }
}
