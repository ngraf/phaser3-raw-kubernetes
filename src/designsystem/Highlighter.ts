export default class Highlighter {

  /**
   * Highlights a game object with a moving circle,
   * see example at https://phaser.io/examples/v3/view/game-objects/particle-emitter/particles-on-a-path
   *
   * Important: Requires 'flares' atlas present. See example above how to preload it.
   *
   * @param gameObject
   */
  public static ellipse(gameObject : Phaser.GameObjects.GameObject, width : number = 90, height : number = 50) {
    // @ts-ignore
    var path = new Phaser.Curves.Path(gameObject.x + width, gameObject.y).ellipseTo(width, height)
      //.circleTo(100, true, 180);

    var particles = gameObject.scene.add.particles('flares');

    const emitter = particles.createEmitter({
      frame: { frames: [ 'red' /*, 'green', 'blue' */ ], cycle: true },
      scale: { start: 0.3, end: 0 },
      blendMode: 'ADD',
      emitZone: { type: 'edge', source: path, quantity: 48, yoyo: false }
    });


    return emitter
  }

}
