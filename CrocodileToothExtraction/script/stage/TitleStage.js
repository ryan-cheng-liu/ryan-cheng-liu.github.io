class TitleStage extends PIXI.Container {
    constructor() {
        super();
        this.addChild(this.createBackground());
        this.addChild(this.createOverlay());
        this.addChild(this.createTitleText());
        this.addChild(this.createSinglePlayerBtn());
    }

    createBackground() {
        let background = new PIXI.Sprite.fromImage("./resource/image/titleBackground_1024x768.png");
        return background;
    }

    createOverlay() {
        let sprite = new PIXI.Sprite.fromImage("./resource/image/overlay.png");
        sprite.position.set(10, 760);
        sprite.anchor.y = 1;
        sprite.scale.x = 0.7;
        sprite.scale.y = 0.55;
        return sprite;
    }

    createTitleText() {
        let title = new PIXI.Sprite.fromImage("./resource/image/title.png");
        title.position.set(20, 450);
        title.scale.set(0.8);
        return title;
    }

    createSinglePlayerBtn() {
        let startGameBtn = new PIXI.Sprite.fromImage("./resource/image/singlePlayerBtn.png");

        startGameBtn.position.set(80, 80);
        startGameBtn.scale.set(0.7);

        startGameBtn.interactive = true;
        startGameBtn.buttonMode = true;
        startGameBtn
            .on('pointerdown', event => {
                Game.StageManager.forwardStage('GameStage');
            })
            .on("mouseover", event => {
                startGameBtn.texture = new PIXI.Texture.fromImage("./resource/image/singlePlayerBtn_hover.png");
            })
            .on("mouseout", event => {
                startGameBtn.texture = new PIXI.Texture.fromImage("./resource/image/singlePlayerBtn.png");
            });

        return startGameBtn;
    }
}

export default TitleStage;