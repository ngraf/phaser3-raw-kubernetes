import Config from "~/game/Config";

export default class DeathZone extends Phaser.GameObjects.Rectangle {

  constructor(scene: Phaser.Scene, x, y, width, height, alpha : number) {
    super(scene, x, y, width, height);
    this.setOrigin(0,0)
    this.setFillStyle(Config.DEATHZONE_COLOR)
    this.setAlpha(alpha)
    // add a physics body
    scene.physics.add.existing(this);
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setImmovable(true)
    body.setAllowGravity(false)
  }
}
