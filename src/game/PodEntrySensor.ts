import KubernetesGame from "~/scenes/KubernetesGame";
import ColorKeys from "~/consts/ColorKeys";
import Customer from "~/game/Customer";
import Config from "~/game/Config";
import PopupInfo from "~/designsystem/PopupInfo";
import SceneKeys from "~/consts/SceneKeys";
import Tutorial from "~/scenes/Tutorial";

export default class PodEntrySensor extends Phaser.GameObjects.Rectangle {

  private enteredCustomers : Customer[] = []
  private podIsFull : boolean = false

  constructor(scene : KubernetesGame, x : number, y : number, width : number, height : number) {
    super(scene,x, y, width, height, ColorKeys.RED_0X, 0);

    // Check every seconds if pod is full
    scene.time.addEvent({
      delay: 1000,
      callback: this._checkIfPodIsFull,
      callbackScope: this,
      loop: true,
    })
  }

  addEnteredCustomer(customer : Customer) {
    this.enteredCustomers.push(customer)
  }

  private _checkIfPodIsFull() {
    let customersInPodEntryZone = 0
    for (let i = 0; i < this.enteredCustomers.length; i++) {
      const customer = this.enteredCustomers[i]
      const customerIsStillInPodEntryZone =  Phaser.Geom.Rectangle.Overlaps(customer.getBounds(), this.getBounds())
      if (customerIsStillInPodEntryZone) {
        customersInPodEntryZone++
      } else {
        this.enteredCustomers.splice(i,1)
      }
    }

    if (customersInPodEntryZone >= Config.POD_MAX_CUSTOMERS_IN_ENTRYZONE) {
      if (!this.podIsFull) { // This helps us the banner animation is not shown every tick
        if (this.scene.scene.isActive(SceneKeys.TUTORIAL)) {
          const tutorialScene = this.scene.scene.get(SceneKeys.TUTORIAL) as Tutorial
          if (tutorialScene.getActiveStep() == 7) {
            tutorialScene.step8PodScaling()
          }
          if (tutorialScene.getActiveStep() == 9) {
            tutorialScene.step10AddNewNode()
          }
        } else {
          if (Config.POD_SHOW_WARNING_WHEN_FULL) {
            PopupInfo.showBannerAnimation(this.scene, 'Pod is full!', ColorKeys.RED_LIGHT_0x)
          }
        }
        this.podIsFull = true
      }
    } else {
      this.podIsFull = false
    }
  }
}
