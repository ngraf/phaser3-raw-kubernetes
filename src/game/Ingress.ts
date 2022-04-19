import KubernetesGame from "~/scenes/KubernetesGame";
import ColorKeys from "~/consts/ColorKeys";
import Config from "~/game/Config";

export default class Ingress extends Phaser.GameObjects.Container {
  constructor(scene : KubernetesGame, x, y) {
    super(scene, x, y);
    this.setDepth(Config.DEPTH_INGRESS)
    const width = 50
    const height = 130
    // Add tunnel as a rectangle
    const rectangle = scene.add.rectangle(0,0, width, height, Config.INGRESS_COLOR_BACKGROUND)
    rectangle.setOrigin(0.5,0.5)
    this.add(rectangle)

    // Add left border
    const leftBorder = scene.add.line(0,0,- width / 2, - height / 2, - width / 2, height / 2, Config.INGRESS_COLOR_BORDER)
    leftBorder.setOrigin(0,0)
    leftBorder.setStrokeStyle(5)
    this.add(leftBorder)

    // Add right border
    const rightBorder = scene.add.line(0,0,width / 2, - height / 2, width / 2, height / 2, Config.INGRESS_COLOR_BORDER)
    rightBorder.setOrigin(0,0)
    rightBorder.setStrokeStyle(5)
    this.add(rightBorder)

    // Add "Ingress" label
    const label = this.scene.add.text(2, 0, 'Ingress', Config.LABEL_STYLE)
    label.setColor(ColorKeys.PURPLE_DARK)
    label.setOrigin(0.5,0.5)
    label.setAngle(90)
    label.setFontSize(40)
    this.add(label)
  }
}
