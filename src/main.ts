import Phaser from 'phaser'
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import Preloader from './scenes/Preloader';
import KubernetesGame from "~/scenes/KubernetesGame";
import ColorKeys from "~/consts/ColorKeys";
import UI from "~/scenes/UI";
import Config from "~/game/Config";
import Tutorial from "~/scenes/Tutorial";

export default new Phaser.Game({
	type: Phaser.AUTO,
	width: 1200,
	height: 800,
	backgroundColor: ColorKeys.GREY_0X,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 },
			debug: Config.DEBUG_ENABLED // Show physics bodies
		}
	},
	plugins: {
		scene: [
			{
				key: 'rexUI',
				plugin: UIPlugin,
				mapping: 'rexUI'
			},
		]
	},
	scene: [Preloader, KubernetesGame, UI, Tutorial],
	scale: {
		// zoom: 1,
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
	}
})
