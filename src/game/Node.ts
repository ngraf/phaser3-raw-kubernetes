import KubernetesGame from "~/scenes/KubernetesGame";
import ColorKeys from "~/consts/ColorKeys";
import Config from "~/game/Config";
import DeathZone from "~/game/DeathZone";
import Pod from "~/game/Pod";
import Tweens from "~/designsystem/Tweens";

export default class Node extends Phaser.GameObjects.Container {

  private rectangle : Phaser.GameObjects.Rectangle
  private pods : Pod[]

  scene! : KubernetesGame

  constructor(scene : KubernetesGame, x: number, y: number) {
    super(scene, x, y);
    this.setDepth(Config.DEPTH_NODE)
    this.pods = []
    // Add white rectangle
    this.rectangle = scene.add.rectangle(0, 0, Config.NODE_WIDTH, Config.NODE_HEIGHT, Config.NODE_COLOR)
    this.rectangle.setStrokeStyle(1, ColorKeys.BLACK_0x)
    this.rectangle.setOrigin(0,0)
    this.add(this.rectangle)

    // Add death zone outside node to prevent customers from entering the node without ingress route
    const deathZoneOutside = new DeathZone(scene,0,0, Config.NODE_WIDTH, Config.DEATHZONE_THICKNESS, Config.DEATHZONE_ALPHA)
    deathZoneOutside.setOrigin(0,0.5)
    this.scene.addNewDeathZone(deathZoneOutside)
    this.add(deathZoneOutside)

    // Add death zone inside node at the bottom to let customer die that get into via ingress route, but have no service or pod.
    const deathZoneInside = new DeathZone(scene, 0, Config.NODE_HEIGHT, Config.NODE_WIDTH, Config.DEATHZONE_THICKNESS, Config.DEATHZONE_ALPHA)
    deathZoneInside.setOrigin(0,0.5)
    this.scene.addNewDeathZone(deathZoneInside)
    this.add(deathZoneInside)

    // Add left wall
    const deathZoneLeft = new DeathZone(scene, 0, 0, Config.DEATHZONE_THICKNESS, Config.NODE_HEIGHT, Config.DEATHZONE_ALPHA)
    deathZoneLeft.setOrigin(0.5,0)
    this.scene.addNewDeathZone(deathZoneLeft)
    this.add(deathZoneLeft)

    // Add right wall
    const deathZoneRight = new DeathZone(scene, Config.NODE_WIDTH, 0, Config.DEATHZONE_THICKNESS, Config.NODE_HEIGHT, Config.DEATHZONE_ALPHA)
    deathZoneRight.setOrigin(0.5,0)
    this.scene.addNewDeathZone(deathZoneRight)
    this.add(deathZoneRight)

    // Add "Cluster" label
    const label = this.scene.add.text(Config.NODE_WIDTH - Config.LABEL_PADDING - 10, Config.LABEL_PADDING, 'Node', Config.LABEL_STYLE)
    label.setColor(ColorKeys.DARKGREY)
    label.setOrigin(1,0)
    label.setFontSize(50)
    this.add(label)
  }

  isFull(): boolean {
    return this.pods.length >= Config.NODE_MAX_PODS
  }

  getFreeCapacityForPods(): number {
    return Config.NODE_MAX_PODS - this.pods.length
  }

  addPod() {
    const podX = this.x + Config.POD_X_OFFSET_INSIDE_NODE + this.pods.length * (Config.POD_WIDTH + Config.POD_GAP_BETWEEN_PODS)
    const pod = new Pod(this.scene, podX, Config.POD_Y)
    // Pod Fade In
    pod.setAlpha(0)
    Tweens.fadeIn(pod)

    this.scene.add.existing(pod)
    this.pods.push(pod)

    // Connect possible existing service to new pods
    const service = this.scene.getGameEngine().getCluster()?.getService()
    if (service) {
      service.addPod(pod)
    }
  }

  getPods() : Pod[] {
    return this.pods
  }
}
