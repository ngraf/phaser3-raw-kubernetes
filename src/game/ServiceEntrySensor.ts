import Service from "~/game/Service";

export default class ServiceEntrySensor extends Phaser.GameObjects.Rectangle {
  private service : Service
  constructor(scene, service, x, y, width, height, color, alpha) {
    super(scene, x, y, width, height, color, alpha);
    this.service = service
  }

  getService() : Service {
    return this.service
  }
}
