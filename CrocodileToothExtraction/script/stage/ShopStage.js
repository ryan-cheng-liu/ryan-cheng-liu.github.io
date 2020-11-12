class ShopStage extends PIXI.Container {
    constructor() {
        super();

        let stageHistory = Game.StageManager._stageHistory;
        this.gameStage = stageHistory[stageHistory.length - 1];

        this.addChild(this.createBackground());
        this.addChild(this.createUiBackground());
        this.addChild(this.createUiBack());
        this.addChild(this.createScoreboard());
        this.addChild(this.createTeethRemovedCounter());
        this.addChild(this.createShopItems());
    }

    createUiBack() {
        let app = Game.app;
        let background = new PIXI.Sprite.fromImage("./resource/image/uiBack.png");

        background.position.set(app.screen.width - 110, 10);
        background.interactive = true;
        background.buttonMode = true;
        background
            .on('pointerdown', event => {
                Game.StageManager.backStage();
            });

        return background;
    }

    createBackground() {
        let background = new PIXI.Sprite.fromImage("./resource/image/shopBackground.png");
        return background;
    }

    createUiBackground() {
        let background = new PIXI.Sprite.fromImage("./resource/image/uiBackground.png");
        return background;
    }

    createScoreboard() {
        let app = Game.app;
        let scoreboard = new PIXI.Container();
        scoreboard.name = 'scoreboard';
        scoreboard.position.set(80, 30);

        let scoreboardBackground = new PIXI.Sprite.fromImage("./resource/image/uiScore.png");
        scoreboard.addChild(scoreboardBackground);

        let score = new PIXI.Text(this.gameStage.score, new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: ['#001ca3'], // gradient
            align : 'center',
        }));
        score.anchor.set(0.5);
        score.position.set(47, 37);
        score.name = 'score';
        scoreboard.addChild(score);

        this.gameStage.registScoreChange(function (v) {
            score.text = v;
        });

        return scoreboard;
    }


    createTeethRemovedCounter() {
        let app = Game.app;

        let counter = new PIXI.Container();
        counter.name = 'TeethCounter';
        counter.position.set(210, 30);

        let background = new PIXI.Sprite.fromImage("./resource/image/uiTeeth.png");
        counter.addChild(background);

        let value = new PIXI.Text(this.gameStage.ownTeethCount, new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: ['#001ca3'], // gradient
            align : 'center',
        }));
        value.anchor.set(0.5);
        value.position.set(45, 38);
        value.name = 'ownTeethCount';
        counter.addChild(value);

        this.gameStage.registOwnTeethChange(function (v) {
            value.text = v;
        });

        return counter;
    }

    createShopItems() {
        let Container = PIXI.Container;
        let Sprite = PIXI.Sprite;

        let items = new Container();
        items.position.set(0, 200);

        let oneCoinItem = new Container();
        oneCoinItem.position.set(300, 200);
        oneCoinItem.interactive = true;
        oneCoinItem.buttonMode = true;
        oneCoinItem
            .on('pointerdown', event => {
                if (this.gameStage.ownTeethCount < 1) {
                    alert("牙齒不足");
                    return;
                }

                this.gameStage.score += 1;
                this.gameStage.ownTeethCount -= 1;
            });
        let oneCoinItemBackground = new Sprite.from('./resource/image/oneCoin.png');
        oneCoinItem.addChild(oneCoinItemBackground);
        items.addChild(oneCoinItem);

        let threeCoinItem = new Container();
        threeCoinItem.position.set(600, 200);
        threeCoinItem.interactive = true;
        threeCoinItem.buttonMode = true;
        threeCoinItem
            .on('pointerdown', event => {
                if (this.gameStage.ownTeethCount < 2) {
                    alert("牙齒不足");
                    return;
                }

                this.gameStage.score += 3;
                this.gameStage.ownTeethCount -= 2;
            });
        let threeCoinItemBackground = new Sprite.from('./resource/image/threeCoins.png');
        threeCoinItem.addChild(threeCoinItemBackground);
        items.addChild(threeCoinItem);

        return items;
    }
}

export default ShopStage;
