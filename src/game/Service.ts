import Pod from "~/game/Pod";
import ColorKeys from "~/consts/ColorKeys";
import KubernetesGame from "~/scenes/KubernetesGame";
import Customer from "~/game/Customer";
import Config from "~/game/Config";
import ServiceEntrySensor from "~/game/ServiceEntrySensor";
import Tweens from "~/designsystem/Tweens";

export default class Service extends Phaser.GameObjects.Container {

  private entrySensor : Phaser.GameObjects.Rectangle | undefined
  private serviceLabel! : Phaser.GameObjects.Text
  private pods : Pod[]
  private podPointer : number = 0
  scene! : KubernetesGame

  constructor(scene : KubernetesGame, x, y) {
    super(scene, x, y);
    this.setDepth(Config.DEPTH_SERVICE)
    this.pods = []
    // Add entry sensor for service
    this.addEntrySensor()

    // Add service circle (always visible, even if no pod is connected)
    this._addServiceCircle()
  }

  addPod(pod : Pod) {
    // Add pod to internal array
    this.pods.push(pod)

    // Draw green tunnel to pod entry point
    this._drawTunnel(this.x,  this.y, pod.x, pod.y - Config.SERVICE_TUNNEL_EXITPOINT_GAP_TO_POD_Y)

    // Bring all tunnel labels up after a new tunnel has been drawn. If we don't do this, labels are overlapped in a ugly way.
    this.bringToTop(this.serviceLabel)
  }

  addEntrySensor() {
    const width = 30
    const entrySensor = new ServiceEntrySensor(this.scene,this, 0, width, width, width, ColorKeys.DARKGREEN_0x, 0)
    entrySensor.setOrigin(0.5,0.5)
    this.add(entrySensor)
    this.scene.physics.add.existing(entrySensor)
    const kubernetesGame = this.scene as KubernetesGame
    kubernetesGame.addNewServiceEntrySensor(entrySensor)
  }

  removeEntrySensor() {
    if (this.entrySensor) {
      this.entrySensor.destroy()
    }
  }

  routeCustomerToAPod(customer : Customer) {
    const pod = this._getNextPodToRouteTo()

    if (pod) {
      // Turn of body of customer to move him without interruption
      const customerBody = customer.body as Phaser.Physics.Arcade.Body
      customerBody.enable = false

      // Move customer to entry point of target pod.
      // The x position is a little bit random to make customers bounce in pod
      const randomTargetPodX = pod.x + Phaser.Math.Between(-Config.SERVICE_RELEASE_MAX_X_VARIATION, Config.SERVICE_RELEASE_MAX_X_VARIATION)
      this.scene.add.tween({
        targets: customer,
        x: randomTargetPodX,
        y: pod.y - Config.SERVICE_TUNNEL_EXITPOINT_GAP_TO_POD_Y,
        duration: Config.SERVICE_TRANSPORT_DURATION,
        onComplete: this._releaseCustomer
      });
    }
  }

  private _getNextPodToRouteTo() : Pod | undefined {
    let pod
    let firstLoop = true;
    while (true) {
      if (this.pods[this.podPointer]) {
        pod = this.pods[this.podPointer]
        this.podPointer++
        break;
      }
      this.podPointer++
      if (this.podPointer > this.pods.length) {
        if (firstLoop) {
          firstLoop = false
          this.podPointer = 0
        } else {
          // It is ok if no pod is connected
          return undefined
        }
      }
    }
    return pod;
  }

  private _releaseCustomer(tween : Phaser.Tweens.Tween) {
    const customer = tween.targets.pop() as Customer
    const customerBody = customer.body as Phaser.Physics.Arcade.Body
    if (customerBody) {
      customerBody.enable = true
    }
  }

  private _addServiceCircle() {
    const circle = this.scene.add.circle(0,0, Config.SERVICE_CIRCLE_RADIUS, Config.SERVICE_TUNNEL_COLOR)
    this.add(circle)
    Tweens.fadeIn(circle)

    this.serviceLabel = this.scene.add.text(0, -5, 'Service', Config.LABEL_STYLE)
    this.serviceLabel.setColor(ColorKeys.DARKGREEN)
    this.serviceLabel.setOrigin(0.5,0.5)
    this.serviceLabel.setFontSize(30)
    this.add(this.serviceLabel)
    Tweens.fadeIn(this.serviceLabel)
  }

  private _drawTunnel(x1 : number, y1 : number, x2 : number, y2 : number) : void {
    function getDistance(x1, y1, x2, y2){
      let y = x2 - x1;
      let x = y2 - y1;

      return Math.sqrt(x * x + y * y);
    }
    const middleX = (x2 - x1) / 2
    const middleY = (y2 - y1) / 2

    // Add tunnel
    const tunnel = this.scene.rexUI.add.roundRectangle(middleX, middleY, getDistance(x1,y1,x2,y2), Config.SERVICE_TUNNEL_THICKNESS, Config.SERVICE_TUNNEL_RADIUS, Config.SERVICE_TUNNEL_COLOR)
    const tunnelRotation = Phaser.Math.Angle.Between(x1,y1,x2,y2)
    tunnel.setRotation(tunnelRotation)
    this.add(tunnel)
    // Tunnel Fade-In
    tunnel.setAlpha(0)
    Tweens.fadeIn(tunnel)

  }
}
