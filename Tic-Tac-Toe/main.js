class TicTacToe {
    static initialize() {
        TicTacToe.BOARD_STATUS = {
            BLANK: Symbol("BLANK"),
            CIRCLE: Symbol("CIRCLE"),
            CROSS: Symbol("CROSS"),
        };

        TicTacToe.GAME_STATUS = {
            START: Symbol("START"),
            CIRCLE_TURN: Symbol("CIRCLE_TURN"),
            CROSS_TURN: Symbol("CROSS_TURN"),
            WAITING_FOR_CIRCLE: Symbol("WAITING_FOR_CIRCLE"),
            WAITING_FOR_CROSS: Symbol("WAITING_FOR_CROSS"),
            CIRCLE_DONE: Symbol("CIRCLE_DONE"),
            CROSS_DONE: Symbol("CROSS_DONE"),
            CIRCLE_WIN: Symbol("CIRCLE_WIN"),
            CROSS_WIN: Symbol("CROSS_WIN"),
            DRAW: Symbol("DRAW"),
            PRE_END: Symbol("PRE_END"),
            END: Symbol("END"),
        }
    }
    static init = TicTacToe.initialize();

    constructor(game) {
        // board initialize
        this._board = [];
        for (let i = 0; i < 3; ++i) {
            this._board[i] = [];
            for (let j = 0; j < 3; ++j) {
                this._board[i][j] = TicTacToe.BOARD_STATUS.BLANK;
            }
        }

        this.document = document;
        this._game = game;
        this._board_canvas = game.querySelector('canvas');
        this._board_click_detect_area = game.querySelector('.click-detect-area');
        this._board_click_detect_area.addEventListener('click', this._clickDetectAreaClick.bind(this));
    }

    start() {
        this._drawSplitLine();
        this._setupClickDetectArea();

        this._gameStatus = TicTacToe.GAME_STATUS.START;
        this._nextStatus();
    }

    _nextStatus() {
        let breakFlag = false;
        let gameResult;
        while (this._gameStatus !== TicTacToe.GAME_STATUS.END) {
            switch (this._gameStatus) {
                case TicTacToe.GAME_STATUS.START:
                    this._gameStatus = TicTacToe.GAME_STATUS.CIRCLE_TURN;
                    break;
                case TicTacToe.GAME_STATUS.CIRCLE_TURN:
                    this._gameStatus = TicTacToe.GAME_STATUS.WAITING_FOR_CIRCLE;
                    breakFlag = true;
                    this._game.querySelector('.turn-display').innerText = `◯'s turn`;
                    this._setBlockClickable(true, status => status === TicTacToe.BOARD_STATUS.BLANK);
                    break;
                case TicTacToe.GAME_STATUS.CROSS_TURN:
                    this._gameStatus = TicTacToe.GAME_STATUS.WAITING_FOR_CROSS;
                    breakFlag = true;
                    this._game.querySelector('.turn-display').innerText = `✖'s turn`;
                    this._setBlockClickable(true, status => status === TicTacToe.BOARD_STATUS.BLANK);
                    break;
                case TicTacToe.GAME_STATUS.CIRCLE_DONE:
                    this._setBlockClickable(false);
                    gameResult = this._detectGameEnd();
                    if (gameResult.winner === null) {
                        this._gameStatus = TicTacToe.GAME_STATUS.CROSS_TURN;
                    }
                    else if (gameResult.winner === TicTacToe.BOARD_STATUS.CIRCLE) {
                        this._gameStatus = TicTacToe.GAME_STATUS.CIRCLE_WIN;
                        this._drawLine(gameResult.winFrom[0][0], gameResult.winFrom[0][1], gameResult.winFrom[2][0], gameResult.winFrom[2][1]);
                    }
                    else {
                        this._gameStatus = TicTacToe.GAME_STATUS.DRAW;
                    }
                    break;
                case TicTacToe.GAME_STATUS.CROSS_DONE:
                    this._setBlockClickable(false);
                    gameResult = this._detectGameEnd();
                    if (gameResult.winner === null) {
                        this._gameStatus = TicTacToe.GAME_STATUS.CIRCLE_TURN;
                    }
                    else if (gameResult.winner === TicTacToe.BOARD_STATUS.CROSS_WIN) {
                        this._gameStatus = TicTacToe.GAME_STATUS.CROSS_WIN;
                        this._drawLine(gameResult.winFrom[0][0], gameResult.winFrom[0][1], gameResult.winFrom[2][0], gameResult.winFrom[2][1]);
                    }
                    else {
                        this._gameStatus = TicTacToe.GAME_STATUS.DRAW;
                    }
                    break;
                case TicTacToe.GAME_STATUS.CIRCLE_WIN:
                    this._gameStatus = TicTacToe.GAME_STATUS.PRE_END;
                    this._game.querySelector('.turn-display').innerText = `◯ Wins`;
                    break;
                case TicTacToe.GAME_STATUS.CROSS_WIN:
                    this._gameStatus = TicTacToe.GAME_STATUS.PRE_END;
                    this._game.querySelector('.turn-display').innerText = `✖ Wins`;
                    break;
                case TicTacToe.GAME_STATUS.DRAW:
                    this._gameStatus = TicTacToe.GAME_STATUS.PRE_END;
                    this._game.querySelector('.turn-display').innerText = `Draw`;
                    break;
                case TicTacToe.GAME_STATUS.PRE_END:
                    this._gameStatus = TicTacToe.GAME_STATUS.END;
                    break;
            }
            if (breakFlag) break;
        }
    }

    _detectGameEnd() {
        let result = {
            winner: null,
            winFrom: null,
        }

        for (let i = 0; i < 3; ++i) {
            // horizontal
            if (this._board[i][0] !== TicTacToe.BOARD_STATUS.BLANK
                && this._board[i][0] === this._board[i][1]
                && this._board[i][1] === this._board[i][2]) {
                result.winner = this._board[i][0];
                result.winFrom = [[0, i], [1, i], [2, i]];
            }

            // virtical
            if (this._board[0][i] !== TicTacToe.BOARD_STATUS.BLANK
                && this._board[0][i] === this._board[1][i]
                && this._board[1][i] === this._board[2][i]) {
                result.winner = this._board[0][i];
                result.winFrom = [[i, 0], [i, 1], [i, 2]];
            }
        }

        // tilted
        if (this._board[0][0] !== TicTacToe.BOARD_STATUS.BLANK
            && this._board[0][0] === this._board[1][1]
            && this._board[1][1] === this._board[2][2]) {
            result.winner = this._board[1][1];
            result.winFrom = [[0, 0], [1, 1], [2, 2]];
        }
        if (this._board[0][2] !== TicTacToe.BOARD_STATUS.BLANK
            && this._board[0][2] === this._board[1][1]
            && this._board[1][1] === this._board[2][0]) {
            result.winner = this._board[1][1];
            result.winFrom = [[2, 0], [1, 1], [0, 2]];
        }

        // tie
        if (result.winner === null) {
            let tie = true;
            for (let i = 0; i < 3; ++i) {
                for (let j = 0; j < 3; ++j) {
                    if (this._board[j][i] === TicTacToe.BOARD_STATUS.BLANK) {
                        tie = false;
                        break;
                    }
                }
            }
            if (tie) result.winner = TicTacToe.GAME_STATUS.DRAW;
        }        

        return result;
    }

    _setBlockClickable(clickable = true, filter = () => true) {
        for (let i = 0; i < 3; ++i) {
            for (let j = 0; j < 3; ++j) {
                if (filter(this._board[i][j], i, j)) {
                    Array.prototype.forEach.apply(
                        this._board_click_detect_area.querySelectorAll(`.click-detect-block[data-x="${j}"][data-y="${i}"]`),
                        [
                            e => {
                                e.classList.toggle('clickable', clickable);
                            }
                        ]
                    );
                }
            }
        }
    }

    _clickDetectAreaClick(event) {
        let target = event.target;
        let x = +target.dataset.x, y = +target.dataset.y;
        if (Number.isNaN(x) || Number.isNaN(y)) return;
        
        if (this._board[y][x] !== TicTacToe.BOARD_STATUS.BLANK) return;
        
        if (this._gameStatus === TicTacToe.GAME_STATUS.WAITING_FOR_CIRCLE) {
            this._board[y][x] = TicTacToe.BOARD_STATUS.CIRCLE;
            this._drawBlock(x, y, TicTacToe.BOARD_STATUS.CIRCLE);

            this._gameStatus = TicTacToe.GAME_STATUS.CIRCLE_DONE;
            this._nextStatus();
        }
        // assume cross
        else if (this._gameStatus === TicTacToe.GAME_STATUS.WAITING_FOR_CROSS) {
            this._board[y][x] = TicTacToe.BOARD_STATUS.CROSS;
            this._drawBlock(x, y, TicTacToe.BOARD_STATUS.CROSS);

            this._gameStatus = TicTacToe.GAME_STATUS.CROSS_DONE;
            this._nextStatus();
        }
    }

    _setupClickDetectArea() {
        for (let i = 0; i < 3; ++i) {
            for (let j = 0; j < 3; ++j) {
                let block = this.document.createElement('div');
                block.classList.add('click-detect-block');
                block.dataset.x = j;
                block.dataset.y = i;
                this._board_click_detect_area.appendChild(block);
            }
        }
    }

    _drawBlock(boardX, boardY, status) {
        const [x, y] = this._visualPositionToRealPosition(boardX, boardY);
        switch (status) {
            case TicTacToe.BOARD_STATUS.CIRCLE:
                this._drawCircle(x, y);
                break;
            case TicTacToe.BOARD_STATUS.CROSS:
                this._drawCross(x, y);
                break;
            case TicTacToe.BOARD_STATUS.BLANK:
                this._drawBlank(x, y);
                break;
        }
    }

    _drawLine(boardX1, boardY1, boardX2, boardY2) {
        const BLOCK_SIZE = 120;

        const [rawX1, rawY1] = this._visualPositionToRealPosition(boardX1, boardY1);
        const [rawX2, rawY2] = this._visualPositionToRealPosition(boardX2, boardY2);
        let x1 = rawX1, y1 = rawY1, x2 = rawX2, y2 = rawY2;

        if (x1 === x2) {
            x1 += BLOCK_SIZE / 2;
            x2 += BLOCK_SIZE / 2;
        }
        else if (x1 < x2) x2 += BLOCK_SIZE;
        else x1 += BLOCK_SIZE;

        if (y1 === y2) {
            y1 += BLOCK_SIZE / 2;
            y2 += BLOCK_SIZE / 2;
        }
        else if (y1 < y2) y2 += BLOCK_SIZE;
        else y1 += BLOCK_SIZE;

        let ctx = this._getCtx();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    _drawCircle(x, y) {
        const blockSize = 120;
        const radius = 45;
        const lineWidth = 10;

        let circleCenterX = x + (blockSize / 2), circleCenterY = y + (blockSize / 2);
        let ctx = this._getCtx();
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(circleCenterX + radius, circleCenterY);
        ctx.arc(circleCenterX, circleCenterY, radius, 0, 2 * Math.PI, true);
        ctx.stroke();
    }

    _drawCross(x, y) {
        const lineWidth = 10;
        let ctx = this._getCtx();
        ctx.lineWidth = lineWidth;
        const xMin = x + 20, xMax = x + 100, yMin = y + 20, yMax = y + 100;
        ctx.moveTo(xMin, yMin);
        ctx.lineTo(xMax, yMax);
        ctx.moveTo(xMax, yMin);
        ctx.lineTo(xMin, yMax);
        ctx.stroke();
    }

    _drawBlank(x, y) {
        let ctx = this._getCtx();
        const blockSize = 120;
        ctx.clearRect(x, y, x + blockSize, y + blockSize);
    }

    _drawSplitLine() {
        const blockSize = 120;
        const lineWidth = 3;
        let ctx = this._getCtx();
        ctx.lineWidth = lineWidth;
        const xMin = 0, xMax = 3 * blockSize, yMin = 0, yMax = 3 * blockSize;
        for (let i = 1; i < 3; ++i) {
            ctx.moveTo(i * blockSize, yMin);
            ctx.lineTo(i * blockSize, yMax);
            ctx.moveTo(xMin, i * blockSize);
            ctx.lineTo(xMax, i * blockSize);
        }
        ctx.stroke();
    }

    _visualPositionToRealPosition(boardX, boardY) {
        return [120 * boardX, 120 * boardY];
    }

    _getCtx() {
        return this._board_canvas.getContext('2d');
    }
}

let canvas = document.querySelector('#game');
let game = new TicTacToe(canvas);
game.start();