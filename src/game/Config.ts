import ColorKeys from "~/consts/ColorKeys";

export default class Config {

  // 🔨 Debug
  static PRODUCTION = true // set to "true" before releasing to production
  static DEBUG_ENABLED =
    false
    // true // if "true" scene is rendered with debug information
  static INIT_CLUSTER_AT_START = Config.PRODUCTION ? false :
    true

  // 🎓 Tutorial
  static TUTORIAL_ENABLED = Config.PRODUCTION ? true :
    false
    // true
  static TUTORIAL_WAITTIME_BETWEEN_STEPS = Config.PRODUCTION ? 4000 : 1000
  static TUTORIAL_REDUCED_SPEED = 0.2
  static TUTORIAL_STEP9_ADDITIONAL_WAIT_TIME_BEFORE_ANNOUNCING_MORE_TRAFFIC = 13000
  static TUTORIAL_STEP10_HIGH_SPAWN_RATE = 400

  // 🏁 Win condition
  static WIN_POINTS = Config.PRODUCTION ? 100 :
    30;

  // 🔀 Depths
  static DEPTH_CLUSTER = 1
  static DEPTH_INGRESS = 2
  static DEPTH_NODE = 3
  static DEPTH_POD = 4
  static DEPTH_SERVICE = 5
  static DEPTH_CUSTOMER = 10

  // 🙂 Customer

  static CUSTOMER_WIDTH = 15;
  static CUSTOMER_BACKGROUND_COLOR = ColorKeys.BLUE_LIGHT_0x
  static CUSTOMER_FRICTION = 0.005
  static CUSTOMER_BOUNCE_X = 0.9
  static CUSTOMER_BOUNCE_Y = 0.5
  static CUSTOMER_HAPPY_DURATION = 20000 // time in milliseconds how long customer stays in pod before he/she vanishes

  // 🏭🙂 Customer factory

  static CUSTOMER_FACTORY_X = 100
  static CUSTOMER_FACTORY_SPAWN_EVERY_X_MILLISECONDS_INIT_VALUE = 750 // < 250 causes chaos in spawn point of factory
  static CUSTOMER_FACTORY_SPAWNRATE_MIN = 250 // highest spawn rate supported by the slider to control traffic
  static CUSTOMER_FACTORY_SPAWNRATE_MAX = 1250 // lowest spawn rate supported by the slider to control traffic
  static CUSTOMER_FACTORY_SPAWN_X_MAX_VARIATION = 5

  // 🕹 Game
  static INIT_POINTS = 0

  // ┏ Cluster

  static CLUSTER_X = 30
  static CLUSTER_Y = 150
  static CLUSTER_WIDTH = 940
  static CLUSTER_HEIGHT = 610
  static CLUSTER_COLOR = ColorKeys.GREY_0X
  static CLUSTER_BORDER_COLOR = ColorKeys.BLUE_DARK_0X
  static CLUSTER_MAX_NODES = 2 // Max 🔲 Nodes

  // 🟪 Ingress
  static INGRESS_COLOR_BACKGROUND = ColorKeys.PURPLE_0X
  static INGRESS_COLOR_BORDER = ColorKeys.PURPLE_DARK_0X

  // 🔲 Node

  static NODE_X_FIRST_NODE = 45
  static NODE_Y = 330
  static NODE_WIDTH = 440
  static NODE_HEIGHT = 415
  static NODE_COLOR = ColorKeys.WHITE_0X
  static NODE_MAX_PODS = 2 // Max 🟦 Pods
  static NODE_GAP_BETWEEN_NODS = 25

  // 🟦 Pod

  static POD_COLOR_WALL = ColorKeys.BLUE_DARK_0X
  static POD_COLOR_BACKGROUND = ColorKeys.BLUE_LIGHT_0x
  static POD_X_OFFSET_INSIDE_NODE = Config.CUSTOMER_FACTORY_X + 50
  static POD_Y = 460
  static POD_WIDTH = 100
  static POD_HEIGHT = 270
  static POD_WALL_THICKNESS = 20
  static POD_GAP_BETWEEN_PODS = 60
  static POD_MAX_CUSTOMERS_IN_ENTRYZONE = 3
  static POD_SHOW_WARNING_WHEN_FULL = false

  // 🟩 Service

  static SERVICE_Y = Config.CLUSTER_Y + 125
  static SERVICE_TRANSPORT_DURATION = 1000 // time it takes to transport customer to pod. Smaller means faster
  static SERVICE_RELEASE_MAX_X_VARIATION = 10
  static SERVICE_TUNNEL_COLOR = ColorKeys.GREEN_LIGHT_0X
  static SERVICE_TUNNEL_THICKNESS = 20
  static SERVICE_TUNNEL_RADIUS = 10
  static SERVICE_CIRCLE_RADIUS = 40
  static SERVICE_TUNNEL_EXITPOINT_GAP_TO_POD_Y = 100 // y-distance of service's tunnel exit point to top of pod in pixels

  // ☠️ Death zone
  static DEATHZONE_THICKNESS = 10
  static DEATHZONE_COLOR = ColorKeys.RED_MILD_0x
  static DEATHZONE_ALPHA = Config.DEBUG_ENABLED ? 0.2 : 0

  // 🏷 Labels
  static LABEL_PADDING = 10
  static LABEL_STYLE = { fontFamily: 'CustomFontNightmare'}

  // 🎛 UI Control Panel (on the right side)
  static CONTROLPANEL_WIDTH = 200
  static CONTROLPANEL_BACKGROUND_COLOR = ColorKeys.BLUE_KUBERNETES_0X
  static CONTROLPANEL_TEXT_COLOR = ColorKeys.WHITE
  // 👉 Button
  static BUTTON_BACKGROUND_COLOR = ColorKeys.GREY_LIGHT_0X
  static BUTTON_WIDTH = 150
  static BUTTON_HEIGHT = 50
  static BUTTON_ROUND_RADIUS = 5
  static BUTTON_STROKE_COLOR = ColorKeys.BLACK_0x

  // ⁉️ Misc
  static SHOW_SUCCESS_POPUP = false // Will show green success message after something was added to cluster
  static DEFAULT_FONT = 'CustomFontKGRedHands'
}
