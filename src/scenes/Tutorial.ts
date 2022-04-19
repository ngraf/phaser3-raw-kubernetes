import SceneKeys from "~/consts/SceneKeys";
import KubernetesGame from "~/scenes/KubernetesGame";
import Dialogue from "~/designsystem/Dialogue";
import UI from "~/scenes/UI";
import Tweens from "~/designsystem/Tweens";
import Config from "~/game/Config";
import Highlighter from "~/designsystem/Highlighter";
import ColorKeys from "~/consts/ColorKeys";

/**
 * Guides user through tutorial
 *
 * TODO: Nice-2-Have: Possiblity to skip tutorial (maybe not a good idea while game is in GameDev Jam Competion)
 */
export default class Tutorial extends Phaser.Scene {

  private kubernetesGameScene! : KubernetesGame
  private ui! : UI
  private activeStep : number = 1

  constructor()
  {
    super(SceneKeys.TUTORIAL);
  }

  preload()
  {
    this.kubernetesGameScene = this.scene.get(SceneKeys.GAME) as KubernetesGame
    this.ui = this.scene.get(SceneKeys.UI) as UI
  }

  create() {
    // 1) Pause Kubernetes Game while and show Welcome screen
    //       -> Offer button to continue
    this._step1Welcome()

    // 3) Hide all buttons from UI so user can't create anything

    // 4) .. let some time pass, so user sees how customers become unhappy when they hit the ground..

    // 5) .. show screen where we explain that customer want to become happy in a pod.
    //       But to get their the first step is to create a cluster.
    //       -> Offer button to ┏ CREATE CLUSTER.

    // 6) .. let some time pass, so user sees how customers become unhappy when they hit the outside wall of cluster ...

    // 7) -> Offer button to CREATE 🟪 INGRESS.

    // 8)  .. let some time pass, so user sees how customers become unhappy when they hit the ground of the cluster ...

    // 9) -> Offer button to CREATE 🔲 NODE.

    // 10)  .. let some time pass, so user sees how customers become unhappy when they hit the node ...

    // 11) -> Offer button to CREATE 🟦 Pod.

    // 12)  .. let some time pass, so user sees that something is missing between ingress and pod ...

    // 13) -> Offer button to CREATE 🟩 Service.

    // 14) .. Now user should earn positive points for happy customer.
    //        After some time explain customer he is now "good" and earns point.

    // 15) Increase traffic ...

    // 16) .. pod will spill over

    // 17) -> Offer button to CREATE 2nd 🟦 🟦 Pod.

    // 18) Increase traffic again ...

    // 19) .. both pods will spill over

    // 20) -> Offer button to CREATE 2nd 🔲 🔲 Node.

    // 21) .. afte some time ...

    // 22) -> Offer button to CREATE 3rd 🟦 🟦 🟦 Pod.

  }

  update(time, delta) {
  }

  getActiveStep() : number {
    return this.activeStep
  }
  private _step1Welcome() {
    this.activeStep = 1
    // Pause Kubernetes Game Scene
    this.scene.pause(SceneKeys.GAME)

    // Hide all buttons from UI
    this.ui.hideAllButtons()

    // TODO: Move this dialogue to main menu scene and let customer decide if he wants to start with tutorial or new game
    // Show welcome screen
    Dialogue.alert(this, `
    Welcome to "RAW Kubernetes"!
    
    This is an educational game about the mechanics behind Kubernetes. 
    Kubernetes is an open-source system for automating deployment, 
    scaling, and management of containerized applications.
    `,
      'Start',
      () => { this._step2CreateCluster() },
      { overlayColor : ColorKeys.WHITE_0X, overlayAlpha : 1 }
    )
  }

  private _step2CreateCluster() {
    this.activeStep = 2
    this.scene.resume(SceneKeys.GAME)

    this.time.delayedCall(
      Config.TUTORIAL_WAITTIME_BETWEEN_STEPS,
      () => {
        this.kubernetesGameScene.setSpeed(Config.TUTORIAL_REDUCED_SPEED)

        Dialogue.alert(
          this,
          `Tutorial 1/12
          
          What is happening?
          
          On the top left you can see 🙂 customers falling out of the 🌎 internet.
          They currently crash on the 🟥 red ground with the result that they turn unhappy and disappear.
          For each unhappy customer you get -1 point.
          
          Your job in "RAW Kubernetes" is to make all 🙂 customers 😃 happy. 
          Each 😃 happy customer earns you +1 point.
          You win the game at ${Config.WIN_POINTS} points.
          `,
          'Continue',
          () => {
            this.time.delayedCall(
              1000,
              () => {
                this.ui.showButton('Cluster')

                const message = Dialogue.message(
                  this,
                  `Tutorial 2/12
                  
                  A 🙂 customer becomes a 😃 happy customer when he/she reaches a Kubernetes 🟦 Pod.
    
                  In order to create a 🟦 Pod for your customers, you must first create a Kubernetes ⬜️ Cluster.
    
    
    
                  Click on the button "Create Cluster" on the right side to do so.
                  `
                )

                // Remove message after user successfully created a cluster
                const clusterButton = this.ui.getButton('Cluster')
                const clusterButtonBackground = clusterButton.getClickableBackground()
                const highlightEllipse = Highlighter.ellipse(clusterButton)
                clusterButtonBackground.once(
                  'pointerup',
                  () => {
                    this.kubernetesGameScene.setSpeed(1)
                    Tweens.fadeOut(message, () => {
                      message.destroy()
                    });
                    highlightEllipse.stop()
                    this._step3CreateIngress()
                  })
              }
            )
          }
        )
      }
    );
  }

  private _step3CreateIngress() {
    this.activeStep = 3
    this.time.delayedCall(
      Config.TUTORIAL_WAITTIME_BETWEEN_STEPS,
      () => {
        this.kubernetesGameScene.setSpeed(Config.TUTORIAL_REDUCED_SPEED)

        this.ui.showButton('Ingress')

        const message = Dialogue.message(
          this,
          `Tutorial 3/12
          
          Your 😡 unhappy customers can't enter your cluster. 
          An 🟪 Ingress resource will enable traffic to enter your cluster.
          
          
          Click on button "Create Ingress".
          `
        )

        // Remove message after user successfully created an Ingress
        const ingressButton =  this.ui.getButton('Ingress')
        const ingressButtonBackground = ingressButton.getClickableBackground()
        const highlightEllipse = Highlighter.ellipse(ingressButton)
        ingressButtonBackground.once(
          'pointerup',
          () => {
            this.kubernetesGameScene.setSpeed(1)
            Tweens.fadeOut(message, () => message.destroy())
            highlightEllipse.stop()
            this._step4AddNode()
          })
      }
    )
  }

  private _step4AddNode() {
    this.activeStep = 4
    this.time.delayedCall(
      Config.TUTORIAL_WAITTIME_BETWEEN_STEPS,
      () => {
        this.kubernetesGameScene.setSpeed(Config.TUTORIAL_REDUCED_SPEED)

        this.ui.showButton('Node')

        const message = Dialogue.message(
          this,
          `Tutorial 4/12
          
          Customers are inside your cluster now.
          
          It is about time to create a 🟦 Pod inside a cluster to make them happy.
          But to be hosted each 🟦 Pod requires a machine first. In Kubernetes this machine is called a 🔲 Node and is part of your ⬜️ Cluster.
          
          
          
          
          Click on button "Add Node".
          `
        )

        // Remove message after user successfully added a node
        const nodeButton =  this.ui.getButton('Node')
        const nodeButtonBackground = nodeButton.getClickableBackground()
        const highlightEllipse = Highlighter.ellipse(nodeButton)
        nodeButtonBackground.once(
          'pointerup',
          () => {
            this.kubernetesGameScene.setSpeed(1)
            Tweens.fadeOut(message, () => message.destroy())
            highlightEllipse.stop()
            nodeButton.deactivate()
            this._step5AddPod()
          })
      }
    )
  }

  private _step5AddPod() {
    this.activeStep = 5
    this.time.delayedCall(
      Config.TUTORIAL_WAITTIME_BETWEEN_STEPS,
      () => {
        this.kubernetesGameScene.setSpeed(Config.TUTORIAL_REDUCED_SPEED)

        this.ui.showButton('Pod')

        const message = Dialogue.message(
          this,
          `Tutorial 5/12
          
          Now finally you can add a 🟦 Pod.
          
          The 🟦 Pod will be added to the 🔲 Node you just created.
          
          
          Click on button "Add Pod".
          `
        )

        // Remove message after user successfully added a pod
        const podButton =  this.ui.getButton('Pod')
        const podButtonBackground = podButton.getClickableBackground()
        const highlightEllipse = Highlighter.ellipse(podButton)
        podButtonBackground.once(
          'pointerup',
          () => {
            this.kubernetesGameScene.setSpeed(1)
            Tweens.fadeOut(message, () => message.destroy())
            highlightEllipse.stop()
            podButton.deactivate()
            this._step6CreateService()
          })
      }
    )
  }

  private _step6CreateService() {
    this.activeStep = 6
    this.time.delayedCall(
      Config.TUTORIAL_WAITTIME_BETWEEN_STEPS,
      () => {
        this.kubernetesGameScene.setSpeed(Config.TUTORIAL_REDUCED_SPEED)

        this.ui.showButton('Service')

        const message = Dialogue.message(
          this,
          `Tutorial 6/12
          
          Still we observe 😡 unhappy customers inside your cluster...
          
          It is because one last piece is missing to route customers from the 🟪 Ingress to the 🟦 Pod: 
          
          A Kubernetes 🟩 Service
          
          Click on button "Create Service".
          `
        )

        // Remove message after user successfully added a service
        const serviceButton =  this.ui.getButton('Service')
        const serviceButtonBackground = serviceButton.getClickableBackground()
        const highlightEllipse = Highlighter.ellipse(serviceButton)
        serviceButtonBackground.once(
          'pointerup',
          () => {
            this.kubernetesGameScene.setSpeed(1)
            Tweens.fadeOut(message, () => message.destroy())
            highlightEllipse.stop()
            this._step7Finish1stChapter()
          })
      }
    )
  }

  private _step7Finish1stChapter() {
    this.activeStep = 7
    this.time.delayedCall(
      Config.TUTORIAL_WAITTIME_BETWEEN_STEPS * 2,
      () => {
        this.kubernetesGameScene.setSpeed(Config.TUTORIAL_REDUCED_SPEED)

        Dialogue.alert(
          this,
          `Tutorial 7/12
          
          Look, you have your first 😃 happy customers in the 🟦 Pod.
          
          Congratulations 🎉
          
          You learned that a Kubernetes  ⬜️ Cluster needs at least one 🔲 Node to host a 🟦 Pod.
          The traffic is routed via an external 🟪 Ingress and an internal 🟩 Service to your 🟦 Pod. 
          
          
          
          You learned a lot. Let's get some rest and watch your 😃 happy customers.
          After a few seconds 😃 happy customers will disappear and make space for new customers in the 🟦 Pod.
          
          I will be back in a moment to teach you more.
          `,
          'Ok',
          () => {
            this.kubernetesGameScene.setSpeed(1)
          }
        )
      }
    )
  }

  public step8PodScaling() {
    this.activeStep = 8

    this.kubernetesGameScene.setSpeed(Config.TUTORIAL_REDUCED_SPEED)

    const message = Dialogue.message(
      this,
      `Tutorial 8/12
      
      Oh no! Our 🟦 pod can't handle this many customers.
      Mitigate the problem by adding another pod to our service. 
      The 🟩 Service will equally balance the load between the pods.
      
      
      
      Click on button "Add pod".
      `
    )

    // Remove message after user successfully added a service
    const podButton =  this.ui.getButton('Pod')
    podButton.activate()
    const podButtonBackground = podButton.getClickableBackground()
    const highlightEllipse = Highlighter.ellipse(podButton)
    podButtonBackground.once(
      'pointerup',
      () => {
        this.kubernetesGameScene.setSpeed(1)
        Tweens.fadeOut(message, () => message.destroy())
        podButton.deactivate()
        highlightEllipse.stop()
        this.step9AdditionalCustomers()
      }
    )
  }

  public step9AdditionalCustomers() {
    this.time.delayedCall(
      Config.TUTORIAL_WAITTIME_BETWEEN_STEPS + Config.TUTORIAL_STEP9_ADDITIONAL_WAIT_TIME_BEFORE_ANNOUNCING_MORE_TRAFFIC,
      () => {
        this.activeStep = 9
        this.kubernetesGameScene.setSpeed(Config.TUTORIAL_REDUCED_SPEED)
        this.kubernetesGameScene.getGameEngine().getCustomerFactory()?.setSpawnRate(Config.TUTORIAL_STEP10_HIGH_SPAWN_RATE)
        const message = Dialogue.alert(
          this,
          `Tutorial 9/12
          
          Things are just fine.
          It can continue forever like this.
          
          But what is this?
          A new marketing campaign flushes in additional customers!
          
          How will we handle this?
          `,
          'Continue',
          () => {
            this.kubernetesGameScene.setSpeed(1)
            // Procced to step 10 will be handled in pod entry sensor when it spills over
          }
        )
      }
    )
  }

  public step10AddNewNode() {
    this.activeStep = 10

    this.time.delayedCall(
      Config.TUTORIAL_WAITTIME_BETWEEN_STEPS,
      () => {
        this.kubernetesGameScene.setSpeed(Config.TUTORIAL_REDUCED_SPEED)

        const message = Dialogue.message(
          this,
          `Tutorial 10/12
          
          We need more 🟦 Pods.
          But our 🔲 Node can only handle a maximum of 2 🟦 Pods.
          What we need to do is to buy a new 🔲 Node to be able to host more 🟦 Pods.
          Let's assume our boss is ok with the additional machine costs ;)
          
          
          
          Click on button "Add Node".
          `
        )

        // Remove message after user successfully added a service
        const nodeButton =  this.ui.getButton('Node')
        nodeButton.activate()
        const nodeButtonBackground = nodeButton.getClickableBackground()
        const highlightEllipse = Highlighter.ellipse(nodeButton)
        nodeButtonBackground.once(
          'pointerup',
          () => {
            this.kubernetesGameScene.setSpeed(1)
            Tweens.fadeOut(message, () => message.destroy())
            highlightEllipse.stop()
            this._step11AddPodToNewNode()
          })
      }
    )
  }

  private _step11AddPodToNewNode() {
    this.activeStep = 11
    this.time.delayedCall(
      Config.TUTORIAL_WAITTIME_BETWEEN_STEPS,
      () => {
        this.kubernetesGameScene.setSpeed(Config.TUTORIAL_REDUCED_SPEED)

        const message = Dialogue.message(
          this,
          `Tutorial 11/12
          
          Now we can create our 3rd 🟦 Pod inside the new Node.
          
          
          Click on button "Add pod".
          `
        )

        // Remove message after user successfully added a service
        const podButton =  this.ui.getButton('Pod')
        podButton.activate()
        const podButtonBackground = podButton.getClickableBackground()
        const highlightEllipse = Highlighter.ellipse(podButton)
        podButtonBackground.once(
          'pointerup',
          () => {
            this.kubernetesGameScene.setSpeed(1)
            Tweens.fadeOut(message, () => message.destroy())
            highlightEllipse.stop()
            this._step12FinishTutorial()
          })
      }
    )
  }

  private _step12FinishTutorial() {
    this.activeStep = 12
    this.time.delayedCall(
      Config.TUTORIAL_WAITTIME_BETWEEN_STEPS,
      () => {
        this.kubernetesGameScene.setSpeed(Config.TUTORIAL_REDUCED_SPEED)

        const message = Dialogue.alert(
          this,
          `Tutorial 13/13
          
          You are finished learning the basics of Kubernetes.
          
          
          Good job 👍
          
          Have fun with the rest of the game.
          
          You beat the game when you reach ${Config.WIN_POINTS} points.
          `,
          'Finish Tutorial',
          () => {
            this.kubernetesGameScene.setSpeed(1)
            this.ui.showTrafficSlider()
            this.scene.stop(SceneKeys.TUTORIAL)
          }
        )
      }
    )
  }
}
