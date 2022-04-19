export default class Tweens {

  public static fadeIn(gameObject : Phaser.GameObjects.GameObject, delay : number = 0, duration : number = 1000) {
    gameObject.scene.tweens.add({
      targets:  gameObject,
      alpha: 1,
      duration: duration,
      delay : delay,
      ease: 'Power2'
    });
  }

  public static fadeOut(gameObject : Phaser.GameObjects.GameObject, callbackFunction : Function = () => {}, delay : number = 0, duration : number = 1000) {
    gameObject.scene.tweens.add({
      targets:  gameObject,
      alpha: 0,
      duration: duration,
      delay : 0,
      ease: 'Power2',
      onComplete: callbackFunction
    });
  }

  public static scaleDown(gameObject : Phaser.GameObjects.GameObject, callbackFunction : Function = () => {}, delay : number = 0, duration : number = 1000) {
    gameObject.scene.tweens.add({
      targets:  gameObject,
      scale: 0,
      duration: duration,
      delay : 0,
      ease: 'Power2',
      onComplete: callbackFunction
    });
  }
}
