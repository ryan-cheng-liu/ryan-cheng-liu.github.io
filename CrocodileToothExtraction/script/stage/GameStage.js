class GameStage extends PIXI.Container {
    constructor() {
        super();

        const TOOTH_COUNT = 14;

        this.isGameover = false;
        this._score = 0;
        this.decayTeethIndex = Math.floor(Math.random() * TOOTH_COUNT);
        this.isToothRemoved = new Array(TOOTH_COUNT).fill(false);
        this.removeCount = 0;
        this._ownTeethCount = 0;

        this._scoreChangeCallbacks = [];
        this._ownTeethChangeCallbacks = [];

        this.addChild(this.createBackground());
        this.addChild(this.createCrocodile());
        this.addChild(this.createUiBackground());
        this.addChild(this.createScoreboard());
        this.addChild(this.createUiShop());
        this.addChild(this.createTeethRemovedCounter());
    }

    get score() {
        return this._score;
    }
    set score(v) {
        this._score = v;

        this._scoreChangeCallbacks.forEach(cb => {
           cb(v);
        });
    }

    get ownTeethCount() {
        return this._ownTeethCount;
    }
    set ownTeethCount(v) {
        this._ownTeethCount = v;

        this._ownTeethChangeCallbacks.forEach(cb => {
            cb(v);
        });
    }

    createBackground() {
        let background = new PIXI.Sprite.fromImage("./resource/image/background.png");
        return background;
    }

    createUiBackground() {
        let background = new PIXI.Sprite.fromImage("./resource/image/uiBackground.png");
        return background;
    }

    createUiShop() {
        let background = new PIXI.Sprite.fromImage("./resource/image/uiShop.png");
        background.position.set(900, 5);

        background.interactive = true;
        background.buttonMode = true;
        background
            .on('pointerdown', event => {
                Game.StageManager.forwardStage('ShopStage');
            })
            .on('mouseover', event => {
                background.position.set(900, 3);
            })
            .on('mouseout', event => {
                background.position.set(900, 5);
            });

        return background;
    }

    createTeethRemovedCounter() {
        let counter = new PIXI.Container();
        counter.name = 'TeethCounter';
        counter.position.set(210, 30);

        let background = new PIXI.Sprite.fromImage("./resource/image/uiTeeth.png");
        counter.addChild(background);

        let value = new PIXI.Text('0', new PIXI.TextStyle({
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

        this.registOwnTeethChange(function (v) {
            value.text = v;
        });

        return counter;
    }

    createCrocodile() {
        let crocodile = new PIXI.Container();

        let crocodileImage = new PIXI.Sprite.fromImage("./resource/image/crocodileMouthAndBackground.png");
        crocodile.addChild(crocodileImage);

        const TEETH_WIDTH = 71;
        const TEETH_HEIGHT = 81;
        const TOOTH_POSITIONS = [
            { x: 170, y: 200 },
            { x: 165, y: 300 },
            { x: 160, y: 400 },
            { x: 155, y: 500 },
            { x: 210, y: 580 },
            { x: 300, y: 630 },
            { x: 420, y: 650 },
            { x: 550, y: 650 },
            { x: 670, y: 630 },
            { x: 750, y: 580 },
            { x: 800, y: 500 },
            { x: 800, y: 400 },
            { x: 800, y: 300 },
            { x: 800, y: 200 }
        ];

        let teethTexture = new PIXI.Texture.fromImage("./resource/image/teeth.png");
        for (let i = 0; i < TOOTH_POSITIONS.length; ++i) {
            let teeth = new PIXI.Sprite.from(teethTexture);
            teeth.width = TEETH_WIDTH;
            teeth.height = TEETH_HEIGHT;
            teeth.position.set(TOOTH_POSITIONS[i].x, TOOTH_POSITIONS[i].y);
            teeth.interactive = true;
            teeth.buttonMode = true;
            teeth.on('pointerdown', this.onTeethRemoved.bind(this, i, teeth));
            crocodile.addChild(teeth);
        }

        return crocodile;
    }

    createScoreboard() {
        let app = Game.app;
        let scoreboard = new PIXI.Container();
        scoreboard.name = 'scoreboard';
        scoreboard.position.set(80, 30);

        let scoreboardBackground = new PIXI.Sprite.fromImage("./resource/image/uiScore.png");
        scoreboard.addChild(scoreboardBackground);

        let score = new PIXI.Text('0', new PIXI.TextStyle({
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

        this.registScoreChange(function (v) {
            score.text = v;
        });

        return scoreboard;
    }

    registScoreChange(cb) {
        this._scoreChangeCallbacks.push(cb);
    }

    registOwnTeethChange(cb) {
        this._ownTeethChangeCallbacks.push(cb);
    }

    onTeethRemoved(index, teeth) {
        if (this.isGameover) return;
        if (this.isToothRemoved[index]) return;

        if (index === this.decayTeethIndex) {
            teeth.texture = new PIXI.Texture.from("./resource/image/teeth_decay.png");
            this.isGameover = true;

            window.setTimeout(() => {
                Game.StageManager.forwardStage('GameOverStage');

                alert("遊戲結束，你最終因拔到蛀牙被鱷魚咬死。死前你共獲得 " + this.score + " 枚金幣！");
            }, 2000);
        }
        else {
            teeth.texture = new PIXI.Texture.from("./resource/image/teeth_removed.png");

            ++this.ownTeethCount;
            this.isToothRemoved[index] = true;
        }
    }

}

export default GameStage;
