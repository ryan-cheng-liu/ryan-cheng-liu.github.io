class StageManager {
    constructor(game) {
        // Singleton
        if (typeof StageManager._instance != 'undefined') return StageManager._instance;
        StageManager._instance = this;

        let self = this;
        self._game = game;
        self._currentStage = null;
        self._stages = {};
        self._stageHistory = [];
    }

    get currentStage() {
        return this._currentStage.name;
    }

    async forwardStage(stageName) {
        let self = this;
        let Game = self._game;

        let Stage = await Game.getStageTemplate(stageName);
        self._currentStage = new Stage();
        self._stageHistory.push(self._currentStage);
        self._game.app.stage = self._currentStage;

        return this;
    }

    backStage() {
        let self = this;
        let history = self._stageHistory;
        if (history.length === 0) return this;

        history.pop();

        let newCurrentStage = history.length !== 0 ? history[history.length - 1] : null;
        self._game.app.stage = self._currentStage = newCurrentStage;

        return this;
    }

    initialize() {
        let self = this;
        self.forwardStage('TitleStage');
    }
}

export default StageManager;
