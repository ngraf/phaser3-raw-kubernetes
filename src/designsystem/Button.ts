import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import RoundRectangle from "phaser3-rex-plugins/templates/ui/roundrectangle/RoundRectangle";
import PopupInfo from "~/designsystem/PopupInfo";
import Config from "~/game/Config";

export default class Button extends Phaser.GameObjects.Container {

  private background : RoundRectangle
  private isButtonPressed : boolean = false
  private text : Phaser.GameObjects.Text
  private shadow : RoundRectangle
  private shadowSize = 5
  private isDeactivated : boolean = false;

  private style = {
    strokeColor: '#000000',
    // hoverColor : 0xe5f6f1, // mint
    hoverColor : 0xD9EDFA, // very light blue
    backgroundColor : 0x000000, // default value not consumed, instead overwrite in constructor. not ideal coding here
    shadowColor: 0xeeeeee, // grey
    warningMessageColor: 0xf3b6b5 // some red
  }
  constructor(scene : Phaser.Scene, x: number, y: number, width: number, heigth: number, text : string, callbackFunction: Function, roundRadius: number = 5, backgroundColor: number =  0xeeeeee, strokeColor : number = 0x000000) {
    super(scene,x,y)
    // @ts-ignore
    if (!scene.rexUI) {
      throw new Error('Designsystem "Button" requires a scene with property "rexUI".')
    }
    // @ts-ignore
    const rexUI = scene.rexUI as UIPlugin

    // Add shadow
    this.shadow = rexUI.add.roundRectangle(- width / 2 + this.shadowSize, this.shadowSize, width, heigth, roundRadius, this.style.shadowColor).setOrigin(0,0.5);
    this.shadow.alpha = 0.3;
    this.add(this.shadow)

    // Add background
    this.style.backgroundColor = backgroundColor
    this.background = rexUI.add.roundRectangle(0, 0, width, heigth, roundRadius, this.style.backgroundColor).setOrigin(0.5,0.5);
    this.background.setStrokeStyle(2, strokeColor);
    this.add(this.background)

    // Add label text
    this.text = scene.add.text(0, 0, text, {color: this.style.strokeColor}).setOrigin(0.5,0.5);
    this.text.setFontFamily(Config.DEFAULT_FONT)
    this.add(this.text)


    // Add button behavior
    this._addButtonBehavior(callbackFunction)
  }

  public getClickableBackground() : RoundRectangle {
    return this.background
  }

  private _addButtonBehavior(callbackFunction : Function) {
    this.background.setInteractive({ useHandCursor: true });

    this.background.on('pointerdown', (pointer) => {
      this._animateButtonPressed();
    }, this);

    this.background.on('pointerup', (pointer) => {
      this._animateButtonReleased();
      if (this.isDeactivated) {
        PopupInfo.showBannerAnimation(this.scene, 'Button is deactivated.', this.style.warningMessageColor)
        return
      }
      callbackFunction()
    }, this);

    this.background.on('pointerover', (pointer) => {
      this.background.setFillStyle(this.style.hoverColor);
    }, this);

    this.background.on('pointerout', (pointer) => {
      this._animateButtonReleased();
      if (this.background.input.enabled) {
        this.background.setFillStyle(this.style.backgroundColor);
      }
    }, this);
  }

  private _animateButtonPressed() {
    if (!this.isButtonPressed) {
      this.x += this.shadowSize; // Press whole container
      this.y += this.shadowSize;
      this.shadow.x -= this.shadowSize;    // ... except shadow
      this.shadow.y -= this.shadowSize;
      this.isButtonPressed = true;
    }
  }

  private _animateButtonReleased() {
    if (this.isButtonPressed) {
      this.x -= this.shadowSize; // Release whole container
      this.y -= this.shadowSize;
      this.shadow.x += this.shadowSize;    // ... except shadow
      this.shadow.y += this.shadowSize;
      this.isButtonPressed = false;
    }
  }

  deactivate() {
    this.isDeactivated = true
  }

  activate() {
    this.isDeactivated = false
  }

}
