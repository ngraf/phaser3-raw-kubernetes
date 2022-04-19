import SceneKeys from "~/consts/SceneKeys";
import DeathZone from "~/game/DeathZone";
import GameEngine from "~/game/GameEngine";
import Customer from "~/game/Customer";
import Config from "~/game/Config";
import ServiceEntrySensor from "~/game/ServiceEntrySensor";
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import PodEntrySensor from "~/game/PodEntrySensor";

export default class KubernetesGame extends Phaser.Scene
{
    // private ground! : DeathZone
    private deathZones! : Phaser.Physics.Arcade.Group
    private neutralCollidingObjects! : Phaser.Physics.Arcade.Group
    private gameEngine! : GameEngine
    private customers! : Phaser.Physics.Arcade.Group
    private podEntrySensors! : Phaser.Physics.Arcade.Group
    private serviceEntrySensors! : Phaser.Physics.Arcade.Group
    rexUI!: UIPlugin;

    constructor()
    {
        super(SceneKeys.GAME);
    }

    preload()
    {
    }

    create()
    {
        this.gameEngine = new GameEngine(this)

        // Add (empty) group of pod entry sensors
        this.podEntrySensors = this.physics.add.group({
            immovable: true,
            allowGravity: false
        })

        // Add (empty) group of service entry sensors
        this.serviceEntrySensors = this.physics.add.group({
            immovable: true,
            allowGravity: false
        })

        // Add (empty) group of death zones
        this.deathZones = this.physics.add.group({
            immovable: true,
            allowGravity: false
        })
        // Add (empty) group of customers
        this.customers = this.physics.add.group({
            frictionX: Config.CUSTOMER_FRICTION,
            frictionY: Config.CUSTOMER_FRICTION,
            bounceX: Config.CUSTOMER_BOUNCE_X,
            bounceY: Config.CUSTOMER_BOUNCE_Y,
            velocityY : 300,
            collideWorldBounds: true // prevents customer gets out of screen
        })
        // Add (empty) group of neutral colliding objects
        this.neutralCollidingObjects = this.physics.add.group({
            immovable: true,
            allowGravity: false
        })

        // Add ground
        const ground = new DeathZone(this, 0, this.sys.canvas.height - Config.DEATHZONE_THICKNESS, this.sys.canvas.width, Config.DEATHZONE_THICKNESS, 1)
        this.add.existing(ground)
        this.deathZones.add(ground)

        // Add customer factory
        this.gameEngine.createCustomerFactory()

        if (Config.INIT_CLUSTER_AT_START) {
            this._createInitCluster()
        }
    }

    update(time, delta) {
    }

    setSpeed(speed : number) {
        // if (speed < 0 || speed > 1) {
        //     throw new Error(`Invalid argument. Value for speed is "${speed}", but must be between 0 and 1.`)
        // }
        this.tweens.timeScale = speed; // tweens
        this.physics.world.timeScale = 1 / speed; // physics
        this.time.timeScale = speed; // time events
    }

    private _createInitCluster() {
        const cluster = this.getGameEngine().createCluster()
        cluster.createIngress()
        cluster.addNode()
        cluster.addPod()
        cluster.addPod()
        cluster.createService()
    }

    addNewCustomer(newCustomer : Customer) {
        this.add.existing(newCustomer)

        this.physics.add.collider(this.customers, newCustomer)
        this.customers.add(newCustomer)
        this.physics.add.collider(newCustomer, this.deathZones, this._handleDeathZoneCustomerCollision)
        this.physics.add.collider(this.neutralCollidingObjects, newCustomer)
        this.physics.add.overlap(newCustomer, this.podEntrySensors, this._handlePodEntrySensorCollision)
        this.physics.add.overlap(newCustomer, this.serviceEntrySensors, this._handleServiceEntrySensorCollision)
    }

    addNewDeathZone(newDeathZone : DeathZone) {
        this.deathZones.add(newDeathZone)
        this.physics.add.collider(this.customers, newDeathZone, this._handleDeathZoneCustomerCollision)
    }

    addNewNeutralCollider(newGameObject : Phaser.GameObjects.GameObject) {
        this.neutralCollidingObjects.add(newGameObject)
        this.physics.add.collider(this.customers, newGameObject)
    }

    addNewPodEntrySensor(podEntrySensor : PodEntrySensor) {
        this.podEntrySensors.add(podEntrySensor)
        this.physics.add.overlap(podEntrySensor, this.customers, this._handlePodEntrySensorCollision) // weird order .. but the other way around it crashes
    }

    addNewServiceEntrySensor(newServiceEntrySensor : ServiceEntrySensor) {
        this.serviceEntrySensors.add(newServiceEntrySensor)
        this.physics.add.overlap(newServiceEntrySensor, this.customers, this._handleServiceEntrySensorCollision) // weird order .. but the other way around it crashes
    }

    getGameEngine() : GameEngine {
        return this.gameEngine
    }

    private _handleDeathZoneCustomerCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
        const customer = obj1.constructor.name === 'Customer' ? obj1 as Customer: obj2 as Customer;
        customer.initDie()
    }

    private _handlePodEntrySensorCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
        // TODO: Nice-2-Have. Find out why it is so unpredictable if obj1 is customer or obj2
        const customer = obj1.constructor.name === 'Customer' ? obj1 as Customer: obj2 as Customer;
        const podEntrySensor = obj1.constructor.name === 'PodEntrySensor' ? obj1 as PodEntrySensor: obj2 as PodEntrySensor;
        if (!customer.isSuccessful()) {
            podEntrySensor.addEnteredCustomer(customer)
            customer.initSuccess()
        }
    }

    private _handleServiceEntrySensorCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
        // TODO: Nice-2-Have. Find out why it is so unpredictable if obj1 is customer or obj2
        const customer = obj1.constructor.name === 'Customer' ? obj1 as Customer: obj2 as Customer;
        const serviceEntrySensor = obj1.constructor.name === 'ServiceEntrySensor' ? obj1 as ServiceEntrySensor: obj2 as ServiceEntrySensor;

        serviceEntrySensor.getService().routeCustomerToAPod(customer)
    }
}
