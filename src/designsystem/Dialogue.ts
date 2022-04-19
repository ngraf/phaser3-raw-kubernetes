import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import Button from "~/designsystem/Button";
import Tweens from "~/designsystem/Tweens";
import RoundRectangle from "phaser3-rex-plugins/templates/ui/roundrectangle/RoundRectangle";
import Config from "~/game/Config";

interface IOverwrite {
  overlayAlpha? : number
  overlayColor? : number
}

/**
 * Phaser3 Dialogues similar to "alert, confirm, prompt ..." dialogues in Vanilla Javascript
 */
export default class Dialogue {

  // private static MODAL_BACKGROUND_COLOR : number = 0xf4efd9 // Cream light
  private static MODAL_BACKGROUND_COLOR : number = 0x316CE5 // Kubernetes blue

  // private static MODAL_BORDER_COLOR : number = 0xcbb189 // Cream dark
  private static MODAL_BORDER_COLOR : number = 0x30487c // Very dark blue
  private static OVERLAY_COLOR : number = 0x000000 // = ⬛️ black
  private static OVERLAY_ALPHA : number = 0
  private static HIDE_DURATION : number = 1000

  public static message(scene : Phaser.Scene, textString: string, overwrite : IOverwrite = {}) : Phaser.GameObjects.Container {
    // Check scene has rexUI
    // @ts-ignore
    if (!scene.rexUI) {
      throw new Error('Class "Dialogue" only works with scenes that have required "rexUI" property.')
    }

    // Make overlay disappear for type "message" unless overwritten by user
    overwrite.overlayAlpha = overwrite.overlayAlpha ? overwrite.overlayAlpha : 0

    // Create container
    const container = scene.add.container(scene.sys.canvas.width / 2, scene.sys.canvas.height / 2)

    // Add black overlay across canvas
    this._addBlackOverlay(container, overwrite)

    // Add text
    const text = this._addText(container, textString, false)

    // Add background of modal
    this._addModalBackground(container, text)

    return container
  }

  public static alert(scene : Phaser.Scene, textString : string, buttonText, callbackFunction : Function, overwrite : IOverwrite  = {}) {
    // Check scene has rexUI
    // @ts-ignore
    if (!scene.rexUI) {
        throw new Error('Class "Dialogue" only works with scenes that have required "rexUI" property.')
    }
    // Create container
    const container = scene.add.container(scene.sys.canvas.width / 2, scene.sys.canvas.height / 2)
    // Add black overlay across canvas
    this._addBlackOverlay(container, overwrite)

    // Add text
    const text = this._addText(container, textString, true)

    // Add background of modal
    const modalBackground = this._addModalBackground(container, text)

    // Add confirm button
    this._addButton(container, 0, buttonText, modalBackground, callbackFunction)

    // Fade in Container
    Tweens.fadeIn(container)
  }

  public static confirm(scene : Phaser.Scene, textString: string, leftButtonText : string, rightButtonText : string, callbackFunctionLeftButton : Function, callbackFunctionRightButton : Function, overwrite : IOverwrite  = {}) {
    // Check scene has rexUI
    // @ts-ignore
    if (!scene.rexUI) {
      throw new Error('Class "Dialogue" only works with scenes that have required "rexUI" property.')
    }
    // Create container
    const container = scene.add.container(scene.sys.canvas.width / 2, scene.sys.canvas.height / 2)

    // Add black overlay across canvas
    this._addBlackOverlay(container, overwrite)

    // Add text
    const text = this._addText(container, textString, true)

    // Add background of modal
    const modalBackground = this._addModalBackground(container, text)

    // Add left button
    this._addButton(container, - 150, leftButtonText, modalBackground, callbackFunctionLeftButton)

    // Add right button
    this._addButton(container, 150, rightButtonText, modalBackground, callbackFunctionRightButton)

    // Fade in Container
    Tweens.fadeIn(container)
  }

  private static _addBlackOverlay(container : Phaser.GameObjects.Container, overwrite : IOverwrite) {

    const overlay = container.scene.add.rectangle(
      0,
      0,
      container.scene.sys.canvas.width,
      container.scene.sys.canvas.height,
      overwrite.overlayColor !== undefined ? overwrite.overlayColor : this.OVERLAY_COLOR,
      overwrite.overlayAlpha !== undefined ? overwrite.overlayAlpha : this.OVERLAY_ALPHA
    ).setOrigin(0.5,0.5)
    container.add(overlay)
  }

  private static _addModalBackground(container : Phaser.GameObjects.Container, text : Phaser.GameObjects.Text) : RoundRectangle {
    // @ts-ignore
    const rexUI = container.scene.rexUI as UIPlugin
    console.log('HEIGHT', text.getBounds().height)
    const modalBackground = rexUI.add.roundRectangle(
      0,
      0,
      container.scene.sys.canvas.width * 0.6,
      text.getBounds().height + 150,
      10,
      this.MODAL_BACKGROUND_COLOR
    ).setOrigin(0.5,0.5)
    modalBackground.setStrokeStyle(3, this.MODAL_BORDER_COLOR)
    container.add(modalBackground)

    container.bringToTop(text)
    return modalBackground
  }

  private static _addText(container: Phaser.GameObjects.Container, textString : string, dialogueHasButtons : boolean) : Phaser.GameObjects.Text {
    const textStyle = {
      font: `25px ${Config.DEFAULT_FONT}`,
      color: '#FFFFFF',
      wordWrap: { width: container.scene.sys.canvas.width * 0.6 - 100, useAdvancedWrap: true }
    }
    const text = container.scene.add.text(0, 0 - ( dialogueHasButtons ? 50 : 0), textString, textStyle)
    text.setOrigin(0.5,0.5)
    container.add(text)

    return text
  }

  private static _addButton(container: Phaser.GameObjects.Container, x: number, buttonText : string, modalBackground : RoundRectangle, callbackFunction : Function) : Button {
    const modifiedCallbackFunction = () => {
      container.scene.tweens.add({
          targets:  container,
          alpha: 0,
          duration: this.HIDE_DURATION,
          delay : 0,
          ease: 'Power2',
          onComplete: () => {
            container.destroy()
          }
      })
      callbackFunction()
    }
    const button = new Button(container.scene,x, modalBackground.height / 2 - 60, 200, 50, buttonText, modifiedCallbackFunction)
    container.add(button)

    return button
  }
}
