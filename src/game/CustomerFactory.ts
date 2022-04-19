import KubernetesGame from "~/scenes/KubernetesGame";
import Config from "~/game/Config";
import Customer from "~/game/Customer";
import ColorKeys from "~/consts/ColorKeys";

export default class CustomerFactory {

  private scene : KubernetesGame
  private spawnPointX : number
  private spawnPointY : number
  private spawnEvent! : Phaser.Time.TimerEvent

  constructor(scene : KubernetesGame, spawnPointX, spawnPointY) {
    this.scene = scene
    this.spawnPointX = spawnPointX
    this.spawnPointY = spawnPointY

    this._addDecorativeWorldBall(spawnPointX, spawnPointY)
    this._addLabelForTheInternet(spawnPointX + 40, spawnPointY - 7)
    this._activateSpawnTimer()
  }

  public setSpawnRate(everyXMilliseconds : number) {
    // @ts-ignore
    this.spawnEvent.delay = everyXMilliseconds
  }

  private _activateSpawnTimer() {
    this.spawnEvent = this.scene.time.addEvent({
      delay: Config.CUSTOMER_FACTORY_SPAWN_EVERY_X_MILLISECONDS_INIT_VALUE,                // ms
      callback: this._spawnNewCustomer,
      //args: [],
      callbackScope: this,
      loop: true
    });
  }

  private _addDecorativeWorldBall(x,y) {
    const worldBall = this.scene.add.text(x, y,'🌎')
    worldBall.setFontSize(50)
    worldBall.setOrigin(0.5,0.5)
    worldBall.setPadding(10,10,10,10); // prevents icon is cut off at top
    worldBall.setDepth(Config.DEPTH_CUSTOMER + 1) // 1 is higher than 0 from the spawning customers. Customers are supposed to be dropping out of world.
    this.scene.add.existing(worldBall)
  }

  private _addLabelForTheInternet(x, y) {
    // Add "The Internet" label
    const label = this.scene.add.text(x, y, 'The Internet', Config.LABEL_STYLE)
    label.setColor(ColorKeys.DARKGREY)
    label.setOrigin(0,0.5)
    label.setFontSize(50)
  }

  private _spawnNewCustomer() {
    // Add customer
    const randomCustomerSpawnX = this.spawnPointX + Phaser.Math.Between(- Config.CUSTOMER_FACTORY_SPAWN_X_MAX_VARIATION, Config.CUSTOMER_FACTORY_SPAWN_X_MAX_VARIATION)
    const newCustomer = new Customer(this.scene, randomCustomerSpawnX, this.spawnPointY)
    this.scene.addNewCustomer(newCustomer)
  }
}
