import SceneKeys from "~/consts/SceneKeys";
import KubernetesGame from "~/scenes/KubernetesGame";
import ColorKeys from "~/consts/ColorKeys";
import Config from "~/game/Config";
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import Button from "~/designsystem/Button";
import Tweens from "~/designsystem/Tweens";
import Slider from "phaser3-rex-plugins/templates/ui/slider/Slider";

export default class UI extends Phaser.Scene
{

  private pointsValueText! : Phaser.GameObjects.Text
  private xForButtons! : number
  private buttons : Button[] = []
  private trafficSliderLabel! : Phaser.GameObjects.Text
  private trafficSlider! : Slider
  rexUI!: UIPlugin;

  constructor()
  {
    super(SceneKeys.UI);
  }

  preload()
  {
  }

  init()
  {
    this.xForButtons = this.sys.canvas.width - Config.CONTROLPANEL_WIDTH / 2

    // Add background for controls
    this.add.rectangle(this.sys.canvas.width,0, Config.CONTROLPANEL_WIDTH, this.sys.canvas.height, Config.CONTROLPANEL_BACKGROUND_COLOR)
      .setOrigin(1,0)

    // Add logo
    this.add.text(
      this.xForButtons,
      40,
      'RAW Kubernetes',
      // TODO: Fix issue that custom font does not work. Reason unknown.
      // I did everything from guide https://www.webtips.dev/webtips/phaser/custom-fonts-in-phaser3
      {fontFamily : 'CustomFontNightmare', color: Config.CONTROLPANEL_TEXT_COLOR}
    ).setOrigin(0.5,0.5)
      .setFontSize(30)

    // Add display for points
    const rightOffsetForPoints = 70
    const topOffset = 70
    this.add.text(this.sys.canvas.width - rightOffsetForPoints - 80, topOffset, 'Points: ', {color : Config.CONTROLPANEL_TEXT_COLOR})
      .setFontFamily(Config.DEFAULT_FONT)
    this.pointsValueText = this.add.text(this.sys.canvas.width - rightOffsetForPoints, topOffset, '')
    this.pointsValueText.setFontFamily(Config.DEFAULT_FONT)

    // Add button to create cluster
    this._addButtonToCreateCluster(180)

    // Add button to create ingress
    this._addButtonToCreateIngress(280)

    // Add button to add node
    this._addButtonToAddNode(380)

    // Add button to create pod
    this._addButtonToAddPod(480)

    // Add button to create service
    this._addButtonToCreateService(580)

    // Add slider to control traffic
    this._addSliderToControlTraffic(730)
  }

  update(time, delta) {
    const gameScene = this.scene.get(SceneKeys.GAME) as KubernetesGame
    const points = gameScene.getGameEngine().getPoints()
    this.pointsValueText.setText(points.toString())
    this.pointsValueText.setColor(points >= 0 ? ColorKeys.GREEN_LIGHT : ColorKeys.RED_LIGHT)
  }

  public hideAllButtons() {
    for (const button in this.buttons) {
      this.buttons[button].setAlpha(0)
    }
    this.trafficSliderLabel.setAlpha(0)
    this.trafficSlider.setAlpha(0)
  }

  public showTrafficSlider() {
    Tweens.fadeIn(this.trafficSliderLabel)
    Tweens.fadeIn(this.trafficSlider)
  }

  public showButton(key : string) {
    if (this.buttons[key]) {
      // Button Fade In
      Tweens.fadeIn(this.buttons[key])
    }
  }

  public getButton(key : string) : Button {
    if (!this.buttons[key]) {
      throw new Error(`Button not found in UI for key "${key}". Known keys: ${Object.keys(this.buttons)}`)
    }
    return this.buttons[key]
  }

  public deactivateButton(key : string) {
    this.getButton(key).deactivate()
  }

  public activateButton(key : string) {
    this.getButton(key).activate()
  }

  private _addButtonToCreateCluster(y) {
    const createCluster = () => {
      const gameEngine = (this.scene.get(SceneKeys.GAME) as KubernetesGame).getGameEngine()
      gameEngine.createCluster()
    }
    const button = this._createButton(y, 'Create Cluster', createCluster)
    this.add.existing(button)
    this.buttons['Cluster'] = button
  }

  private _addButtonToCreateIngress(y) {
    const addIngress = () => {
      const gameEngine = (this.scene.get(SceneKeys.GAME) as KubernetesGame).getGameEngine()
      gameEngine.createIngress()
    }
    const button = this._createButton(y, 'Create Ingress',  addIngress, Config.INGRESS_COLOR_BACKGROUND)
    this.add.existing(button)
    this.buttons['Ingress'] = button
  }

  private _addButtonToAddNode(y) {
    const addNode = () => {
      const gameEngine = (this.scene.get(SceneKeys.GAME) as KubernetesGame).getGameEngine()
      gameEngine.addNode()
    }
    const button = this._createButton(y, 'Add Node', addNode, Config.NODE_COLOR)
    this.add.existing(button)
    this.buttons['Node'] = button
  }

  private _addButtonToAddPod(y) {
    const addPod = () => {
      const gameEngine = (this.scene.get(SceneKeys.GAME) as KubernetesGame).getGameEngine()
      gameEngine.addPod()
    }
    const button = this._createButton(y, 'Add Pod', addPod, Config.POD_COLOR_BACKGROUND)
    this.add.existing(button)
    this.buttons['Pod'] = button
  }

  private _addButtonToCreateService(y) {
    const createService = () => {
      const gameEngine = (this.scene.get(SceneKeys.GAME) as KubernetesGame).getGameEngine()
      gameEngine.createService()
    }
    const button = this._createButton(y, 'Create Service', createService, Config.SERVICE_TUNNEL_COLOR)
    this.add.existing(button)
    this.buttons['Service'] = button
  }

  private _addSliderToControlTraffic(y) {
    // Add Label
    this.trafficSliderLabel = this.add.text(this.xForButtons, y - 30, '🙂 Customers:', {
      font : `15px ${Config.DEFAULT_FONT}`,
      color: ColorKeys.WHITE
    })
      .setPadding(10,10,10,10)  // prevents icon is cut off at to
      .setOrigin(0.5,0.5);

    // Add Slider
    const sliderHeight = 20
    this.trafficSlider = this.rexUI.add.slider({
      x: this.xForButtons,
      y: y,
      width: 130,
      height: sliderHeight,
      orientation: 'x',

      track: this.rexUI.add.roundRectangle(0, 0, 0, 0, sliderHeight / 2, ColorKeys.PRIMARY_DARK_0X),
      indicator: this.rexUI.add.roundRectangle(0, 0, 0, 0, sliderHeight / 2, ColorKeys.PRIMARY_LIGHT_0X),
      thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, sliderHeight / 2, ColorKeys.PRIMARY_LIGHT_0X),

      input: 'click', // 'drag'|'click'
      valuechangeCallback: (newValue, oldValue, slider) => {

        const actualValue = slider.getValue(Config.CUSTOMER_FACTORY_SPAWNRATE_MAX, Config.CUSTOMER_FACTORY_SPAWNRATE_MIN)
        const gameScene = this.scene.get(SceneKeys.GAME) as KubernetesGame
        gameScene.getGameEngine().getCustomerFactory()?.setSpawnRate(actualValue)
      },
      enable: true,
      draggable: false
    }).setOrigin(0.5,0.5);
    this.trafficSlider.setValue(Config.CUSTOMER_FACTORY_SPAWN_EVERY_X_MILLISECONDS_INIT_VALUE, Config.CUSTOMER_FACTORY_SPAWNRATE_MIN, Config.CUSTOMER_FACTORY_SPAWNRATE_MAX);
    this.trafficSlider.layout();
  }

  private _createButton(y, text, callbackFunction, color? : number) {
    return new Button(
      this,
      this.xForButtons,
      y,
      Config.BUTTON_WIDTH,
      Config.BUTTON_HEIGHT,
      text,
      callbackFunction,
      Config.BUTTON_ROUND_RADIUS,
      color ? color : Config.BUTTON_BACKGROUND_COLOR,
      Config.BUTTON_STROKE_COLOR
    );
  }
}
