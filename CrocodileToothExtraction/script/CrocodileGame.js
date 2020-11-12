import StageManager from './StageManager.js';

class CrocodileGame {
    constructor() {
        // Singleton
        if (typeof CrocodileGame._instance != 'undefined') return CrocodileGame._instance;
        CrocodileGame._instance = this;

        let self = this;
        self.app = null;
        self._stageTemplateCache = {};
    }

    initilize() {
        let self = this;
        self.app = new PIXI.Application({ width: 1024, height: 768 });
        document.body.appendChild(self.app.view);

        this.StageManager = new StageManager(this);
        this.StageManager.initialize();
    }

    async getStageTemplate(stageName) {
        let self = this,
            Stage;

        // find in Cache
        Stage = self._stageTemplateCache[stageName];
        if (Stage) return Stage;

        Stage = (await import('./stage/' + stageName + '.js')).default;
        self._stageTemplateCache[stageName] = Stage;
        return Stage;
    }
}

export default CrocodileGame;
