import KubernetesGame from "~/scenes/KubernetesGame";
import Config from "~/game/Config";
import DeathZone from "~/game/DeathZone";
import ColorKeys from "~/consts/ColorKeys";
import PopupInfo from "~/designsystem/PopupInfo";
import Node from "~/game/Node";
import Ingress from "~/game/Ingress";
import Service from "~/game/Service";
import Tweens from "~/designsystem/Tweens";

export default class Cluster extends Phaser.GameObjects.Container {

  private deathZoneOutside : DeathZone
  private nodes : Node[]
  private ingress : Ingress | undefined
  private service : Service | undefined

  scene! : KubernetesGame

  constructor(scene : KubernetesGame, x, y, width, height) {
    super(scene, x, y);
    this.setDepth(Config.DEPTH_CLUSTER)
    this.nodes = []

    // Add grey rectangle
    const rectangle = scene.add.rectangle(0, 0, width, height, Config.CLUSTER_COLOR)
    rectangle.setStrokeStyle(5, Config.CLUSTER_BORDER_COLOR)
    rectangle.setOrigin(0,0)
    this.add(rectangle)

    // Add death zone outside node to prevent customers from entering the node without ingress route
    this.deathZoneOutside = new DeathZone(scene,0,0, Config.CLUSTER_WIDTH, Config.DEATHZONE_THICKNESS, Config.DEATHZONE_ALPHA)
    this.add(this.deathZoneOutside)
    const kubernetesGame = this.scene as KubernetesGame
    kubernetesGame.addNewDeathZone(this.deathZoneOutside)

    // Add death zone inside node at the bottom to let customer die that get into via ingress route, but have no service or pod.
    const deathZoneInside = new DeathZone(scene, 0, Config.CLUSTER_HEIGHT, Config.CLUSTER_WIDTH, Config.DEATHZONE_THICKNESS, Config.DEATHZONE_ALPHA)
    this.add(deathZoneInside)
    kubernetesGame.addNewDeathZone(deathZoneInside)

    // Add left wall
    const deathZoneLeft = new DeathZone(scene, 0, 0, Config.DEATHZONE_THICKNESS, Config.CLUSTER_HEIGHT, Config.DEATHZONE_ALPHA)
    deathZoneLeft.setOrigin(0.5,0)
    this.scene.addNewDeathZone(deathZoneLeft)
    this.add(deathZoneLeft)

    // Add right wall
    const deathZoneRight = new DeathZone(scene, Config.CLUSTER_WIDTH, 0, Config.DEATHZONE_THICKNESS, Config.CLUSTER_HEIGHT, Config.DEATHZONE_ALPHA)
    deathZoneRight.setOrigin(0.5,0)
    this.scene.addNewDeathZone(deathZoneRight)
    this.add(deathZoneRight)

    // Add "Cluster" label
    const label = this.scene.add.text(width - Config.LABEL_PADDING - 10, Config.LABEL_PADDING, 'Cluster', Config.LABEL_STYLE)
    label.setColor(ColorKeys.DARKGREY)
    label.setOrigin(1,0)
    label.setFontSize(50)
    this.add(label)

    // Cluster Fade In
    this.setAlpha(0)
    Tweens.fadeIn(this)

  }

  destroyOutsideDeathZone() {
    if (this.deathZoneOutside) {
      this.deathZoneOutside.destroy()
    }
  }

  addNode() {
    if (this.nodes.length >= Config.CLUSTER_MAX_NODES) {
      // Show error to user
      PopupInfo.showBannerAnimation(this.scene,`Maximum number of ${Config.CLUSTER_MAX_NODES} nodes exceeded`, ColorKeys.RED_LIGHT_0x)
      return
    }

    // TODO: Make positioning dynamic when CLUSTER_MAX_NODES becomes larger than 1
    const node = new Node(this.scene,Config.NODE_X_FIRST_NODE +  this.nodes.length * (Config.NODE_WIDTH + Config.NODE_GAP_BETWEEN_NODS), Config.NODE_Y)
    this.scene.add.existing(node)
    this.nodes.push(node)
    // Node Fade In
    node.setAlpha(0)
    Tweens.fadeIn(node)

    if (Config.SHOW_SUCCESS_POPUP) {
      PopupInfo.showBannerAnimation(this.scene, 'Node added', PopupInfo.successColor)
    }
  }

  createIngress() {
    if (this.ingress) {
      // Show error to user
      PopupInfo.showBannerAnimation(this.scene,`Ingress already exists`, ColorKeys.RED_LIGHT_0x)
      return
    }
    this.ingress = new Ingress(this.scene, Config.CUSTOMER_FACTORY_X, Config.CLUSTER_Y)
    this.scene.add.existing(this.ingress)
    this.destroyOutsideDeathZone()
    // Ingress Fade In
    this.ingress.setAlpha(0)
    Tweens.fadeIn(this.ingress)

    if (Config.SHOW_SUCCESS_POPUP) {
      PopupInfo.showBannerAnimation(this.scene, 'Ingress created', PopupInfo.successColor)
    }
  }

  addPod() {
    if (this.nodes.length == 0) {
      // Show error to user
      PopupInfo.showBannerAnimation(this.scene,`Required Node does not exist`, ColorKeys.RED_LIGHT_0x)
      return
    }

    const nodeWithMostCapacity = this._getNodeWithMostCapacity()

    if (!nodeWithMostCapacity) {
      // Show error to user
      PopupInfo.showBannerAnimation(this.scene,'All nodes are at full capacity', ColorKeys.RED_LIGHT_0x)
      return
    }

    nodeWithMostCapacity.addPod()

    if (Config.SHOW_SUCCESS_POPUP) {
      PopupInfo.showBannerAnimation(this.scene, 'Pod added', PopupInfo.successColor)
    }
  }

  createService() {
    if (this.service) {
      // Show error to user
      PopupInfo.showBannerAnimation(this.scene,`Service already exists`, ColorKeys.RED_LIGHT_0x)
      return
    }
    this.service = new Service(this.scene, Config.CUSTOMER_FACTORY_X, Config.SERVICE_Y)

    this.nodes.forEach(node => {
      node.getPods().forEach(pod => {
        this.service!.addPod(pod)
      })
    })
    // Service Fade In
    this.service.setAlpha(0)
    Tweens.fadeIn(this.service)
    this.scene.add.existing(this.service)

    if (Config.SHOW_SUCCESS_POPUP) {
      PopupInfo.showBannerAnimation(this.scene, 'Service created', PopupInfo.successColor)
    }
  }

  getService() : Service | undefined {
    return this.service
  }

  private _getNodeWithMostCapacity() : Node | undefined {
    let mostFreeCapacity = 0
    let nodeWithMostCapacity : Node | undefined = undefined

    this.nodes.forEach(node => {
      const freeCapacityOfThisNode = node.getFreeCapacityForPods()
      if (freeCapacityOfThisNode > 0 && freeCapacityOfThisNode > mostFreeCapacity) {
        nodeWithMostCapacity = node
        mostFreeCapacity = node.getFreeCapacityForPods()
      }
    })
    return nodeWithMostCapacity
  }
}
