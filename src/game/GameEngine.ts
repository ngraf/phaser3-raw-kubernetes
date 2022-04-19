import Config from "~/game/Config";
import KubernetesGame from "~/scenes/KubernetesGame";
import Cluster from "~/game/Cluster";
import PopupInfo from "~/designsystem/PopupInfo";
import ColorKeys from "~/consts/ColorKeys";
import CustomerFactory from "~/game/CustomerFactory";
import Dialogue from "~/designsystem/Dialogue";
import SceneKeys from "~/consts/SceneKeys";

export default class GameEngine {

  private points : number = Config.INIT_POINTS
  private scene : KubernetesGame
  private cluster : Cluster | undefined
  private customerFactory : CustomerFactory | undefined
  private gameWon : boolean = false

  constructor(scene : KubernetesGame) {
    this.scene = scene;
  }

  setPoints(points): void {
    this.points = points
  }
  addPoints(pointsToAdd): void {

    this.points += pointsToAdd

    if (this.points > Config.WIN_POINTS && !this.gameWon) {
      this.gameWon = true
      this.scene.setSpeed(0.2)

      Dialogue.confirm(
        this.scene.scene.get(SceneKeys.UI),
        ` 🎉 🎉 🎉
        GAME WON 
        🎉 🎉 🎉
        
        You reached the required ${Config.WIN_POINTS} points to win the game.`,
        'New Game',
        'Continue playing',
        () => {
          this.scene.setSpeed(1);
          this.restartGame()
        },
        () => { this.scene.setSpeed(1) }
      )
    }
  }

  restartGame() {
    this.scene.scene.stop(SceneKeys.GAME)
    this.scene.scene.stop(SceneKeys.UI)
    this.scene.scene.start(SceneKeys.UI)
    this.scene.scene.start(SceneKeys.GAME)
  }

  getPoints() : number{
    return this.points
  }

  createCluster() {
    if (this.cluster) {
      // Show error to user
      PopupInfo.showBannerAnimation(this.scene.scene.get(SceneKeys.UI),'Cluster already exists', ColorKeys.RED_LIGHT_0x)
    } else {
      this.cluster = new Cluster(this.scene, Config.CLUSTER_X, Config.CLUSTER_Y, Config.CLUSTER_WIDTH, Config.CLUSTER_HEIGHT)
      this.scene.add.existing(this.cluster)
    }
    return this.cluster;
  }

  getCluster() : Cluster | undefined {
    return this.cluster
  }

  addNode() {
    if (!this.cluster) {
      // Show error to user
      PopupInfo.showBannerAnimation(this.scene.scene.get(SceneKeys.UI),'Required Cluster does not exist', ColorKeys.RED_LIGHT_0x)
      return
    }

    this.cluster.addNode()
  }

  createIngress() {
    if (!this.cluster) {
      // Show error to user
      PopupInfo.showBannerAnimation(this.scene.scene.get(SceneKeys.UI),'Required Cluster does not exist', ColorKeys.RED_LIGHT_0x)
      return
    }

    this.cluster.createIngress()
  }

  addPod() {
    if (!this.cluster) {
      // Show error to user
      PopupInfo.showBannerAnimation(this.scene.scene.get(SceneKeys.UI),'Required Cluster does not exist', ColorKeys.RED_LIGHT_0x)
      return
    }

    this.cluster.addPod()
  }

  createService() {
    if (!this.cluster) {
      // Show error to user
      PopupInfo.showBannerAnimation(this.scene.scene.get(SceneKeys.UI),'Required Cluster does not exist', ColorKeys.RED_LIGHT_0x)
      return
    }

    this.cluster.createService()
  }

  createCustomerFactory() {
    this.customerFactory = new CustomerFactory(this.scene, Config.CUSTOMER_FACTORY_X, 50)
  }

  getCustomerFactory() : CustomerFactory | undefined {
    return this.customerFactory
  }
}
