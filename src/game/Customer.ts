import KubernetesGame from "~/scenes/KubernetesGame";
import ColorKeys from "~/consts/ColorKeys";
import Config from "~/game/Config";

export default class Customer extends Phaser.GameObjects.Container {

  private circle
  private icon
  private successful : boolean = false

  constructor(scene : KubernetesGame, x: number, y: number) {
    super(scene, x, y);
    const circleWidth = Config.CUSTOMER_WIDTH;
    this.setDepth(Config.DEPTH_CUSTOMER)
    this.circle = scene.add.circle(0,0,circleWidth, Config.CUSTOMER_BACKGROUND_COLOR).setOrigin(0.5,0.5)
    this.circle.setStrokeStyle(0.5, ColorKeys.BLUE_DARK_0X)
    this.icon = scene.add.text(0,1, '🙂').setOrigin(0.5,0.5)
      .setPadding(10,10,10,10)  // prevents icon is cut off at to
    this.add([this.circle, this.icon])

    // Activate physics
    scene.physics.add.existing(this);

    // Adjust size and position of physics body
    // const body = this.body
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(circleWidth, circleWidth);
    body.setOffset(-circleWidth, -circleWidth);

    // Set physics body from rectangle (default) to circle.
    body.setCircle(circleWidth);
  }

  initDie() {
    this.icon.text = '😡'

    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 1000,
      delay: 500,
      // hold: 500,
      onComplete: () => { this._die() }
    });
  }

  isSuccessful() {
    return this.successful
  }

  initSuccess() {
    this.successful = true
    this.icon.text = '😃'

    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 1000,
      delay: Config.CUSTOMER_HAPPY_DURATION,
      // hold: 500,
      onComplete: () => { this._success() }
    });
  }


  private _die() {
    const kubernetesGame = this.scene as KubernetesGame
    if (kubernetesGame) {
      kubernetesGame.getGameEngine().addPoints(-1)
    }
    this.destroy()
  }

  private _success() {
    const kubernetesGame = this.scene as KubernetesGame
    if (kubernetesGame) {
      kubernetesGame.getGameEngine().addPoints(1)
    }
    this.destroy()
  }
}
