class GameOverStage extends PIXI.Container {
    constructor() {
        super();
        this.addChild(this.createBackground());
        this.addChild(this.createTitleText());
        this.addChild(this.createTitleBtn());
    }

    createBackground() {
        return new PIXI.Graphics()
            .beginFill(0x5b0010)
            .drawPolygon([0, 0, Game.app.screen.width, 0, Game.app.screen.width, Game.app.screen.width, 0, Game.app.screen.width]);
    }

    createTitleText() {
        let titleText = new PIXI.Text('遊戲結束', new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 72,
            fontWeight: 'bold',
            fill: ['#ffc1ba'], // gradient
            stroke: '#4a1850',
            align : 'right',
        }));
        titleText.position.set(Game.app.screen.width / 2, Game.app.screen.height / 6);
        titleText.anchor.set(0.5);
        return titleText;
    }

    createTitleBtn() {
        let titleBtn = new PIXI.Container();

        let gameOverBtnBackground = new PIXI.Sprite.fromImage("./resource/image/buttonBackground.png");
        gameOverBtnBackground.position.set(Game.app.screen.width / 2, Game.app.screen.height * 2 / 5);
        gameOverBtnBackground.anchor.set(0.5);
        gameOverBtnBackground.scale.set(0.7);
        titleBtn.addChild(gameOverBtnBackground);

        let gameOverBtnText = new PIXI.Text('回到標題', new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fontWeight: 'bold',
            fill: ['#5b0010'], // gradient
            stroke: '#4a1850',
        }));
        gameOverBtnText.anchor.set(0.5);
        gameOverBtnText.position.set(Game.app.screen.width / 2, Game.app.screen.height * 2 / 5);
        titleBtn.addChild(gameOverBtnText);

        titleBtn.interactive = true;
        titleBtn.buttonMode = true;
        titleBtn.on('pointerdown', event => {
            Game.StageManager.forwardStage('TitleStage');
        });

        return titleBtn;
    }
}

export default GameOverStage;
