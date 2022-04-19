import KubernetesGame from "~/scenes/KubernetesGame";
import Config from "~/game/Config";
import ColorKeys from "~/consts/ColorKeys";
import PodEntrySensor from "~/game/PodEntrySensor";

export default class Pod extends Phaser.GameObjects.Container {
  constructor(scene : KubernetesGame, x, y) {
    super(scene, x, y);
    this.setDepth(Config.DEPTH_POD)

    const width = Config.POD_WIDTH
    const height = Config.POD_HEIGHT
    const wallThickness = Config.POD_WALL_THICKNESS

    // Add background
    const backgroundOfPod = scene.add.rectangle(0,0, width, height, Config.POD_COLOR_BACKGROUND)
    backgroundOfPod.setOrigin(0.5,0)
    this.add(backgroundOfPod)

    // Add floor
    const floor = scene.add.rectangle(0, height, width, wallThickness, Config.POD_COLOR_WALL)
    floor.setOrigin(0.5, 1)
    scene.physics.add.existing(floor);
    const floorBody = floor.body as Phaser.Physics.Arcade.Body
    floorBody.setImmovable(true)
    floorBody.setAllowGravity(false)
    this.add(floor)
    scene.addNewNeutralCollider(floor)

    // Add left wall
    const leftWall = scene.add.rectangle(- width / 2, 0, wallThickness, height, Config.POD_COLOR_WALL)
    leftWall.setOrigin(0.5,0)
    scene.physics.add.existing(leftWall);
    const leftWallBody = leftWall.body as Phaser.Physics.Arcade.Body
    leftWallBody.setImmovable(true)
    leftWallBody.setAllowGravity(false)
    this.add(leftWall)
    scene.addNewNeutralCollider(leftWall)

    // Add right wall
    const rightWall = scene.add.rectangle(width / 2, 0, wallThickness, height, Config.POD_COLOR_WALL)
    rightWall.setOrigin(0.5,0)
    scene.physics.add.existing(rightWall);
    const rightWallBody = rightWall.body as Phaser.Physics.Arcade.Body
    rightWallBody.setImmovable(true)
    rightWallBody.setAllowGravity(false)
    this.add(rightWall)
    scene.addNewNeutralCollider(rightWall)

    // Add entry sensor
    const entrySensor = new PodEntrySensor(scene,0, 0, width - wallThickness, wallThickness)
    entrySensor.setOrigin(0.5,0)
    this.add(entrySensor)
    scene.physics.add.existing(entrySensor)
    scene.addNewPodEntrySensor(entrySensor)

    // Add "Pod" label
    const label = scene.add.text(Config.POD_WIDTH / 2 - Config.LABEL_PADDING - wallThickness - 10, Config.LABEL_PADDING, 'Pod', Config.LABEL_STYLE)
    label.setColor(ColorKeys.BLUE_JEANS)
    label.setOrigin(0.5,0)
    label.setFontSize(40)
    this.add(label)
  }
}
