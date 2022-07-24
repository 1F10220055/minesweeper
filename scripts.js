// ゲームに使用する変数
let boardHeight = 10;
let boardWidth = 10;
let bombCount = 10;
const generateArray = (h, w, init = undefined) => Array.from({ length: h }, () => Array.from({ length: w }, () => init));
let isVisible = generateArray(boardHeight, boardWidth, false);
let boardStatus = generateArray(boardHeight, boardWidth, 0);
let gameStatus = 'waiting';
let openCount = 0;
// 幅優先探索で使う
let searched = generateArray(boardHeight, boardWidth, false);

// 使用するHTMLの要素
const board = document.getElementById('board');
const heightInput = document.getElementById('height');
const widthInput = document.getElementById('width');
const bombsInput = document.getElementById('bombs');


heightInput.value = boardHeight;
widthInput.value = boardWidth;
bombsInput.value = bombCount;


// ボタンがクリックされた時の処理
const handleClick = (h, w) => {
    // ボムの数がBoardの面積を超えた時
    if (boardHeight * boardWidth <= bombCount) {
        alert('ボムが多すぎます');
        return;
    }
    // ボムの位置を初期化
    if (gameStatus === 'waiting') {
        gameStatus = 'playing';
        heightInput.disabled = true;
        widthInput.disabled = true;
        bombsInput.disabled = true;
        for (let i = 0; i < bombCount; i++) {
            // 0からBoardの高さ・幅までのランダムな数を生成してボムの位置を決定
            let x = Math.floor(Math.random() * boardWidth);
            let y = Math.floor(Math.random() * boardHeight);
            // ボムの位置がすでにボムの位置になっていた場合、またはクリックされた位置の場合、もう一度生成
            if (boardStatus[y][x] === true || (y === h && x === w)) {
                i--;
            } else {
                boardStatus[y][x] = true;
                // Boardにボムの数字を付ける
                for (let i = -1; i < 2; i++) {
                    for (let j = -1; j < 2; j++) {
                        if (i === 0 && j === 0) continue
                        if (y + i < 0 || y + i >= boardHeight || x + j < 0 || x + j >= boardWidth) continue
                        if (boardStatus[y + i][x + j] === true) continue
                        boardStatus[y + i][x + j]++;
                    }
                }
            }
        }
    }

    let cell = document.getElementById(`${h}-${w}`);
    // ボムがクリックされた時
    searched[h][w] = true;
    if (boardStatus[h][w] === true) {
        cell.innerHTML = `<p>●</p>`;
        alert('game over');
        return
    } else if (boardStatus[h][w] !== 0) {
        // 0でなければ、クリックした位置のみを開ける
        cell.innerHTML = `<p>${boardStatus[h][w]}</p>`;
        openCount++;
    } else {
        // 幅優先探索
        let queue = [];
        queue.push([h, w]);
        openCount++;
        cell.innerHTML = `<p>${boardStatus[h][w] !== 0 ? boardStatus[h][w] : ''}</p>`;
        while (queue.length > 0) {
            pos = queue.shift();
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    if (i === 0 && j === 0) continue
                    if (pos[0] + i < 0 || pos[0] + i >= boardHeight || pos[1] + j < 0 || pos[1] + j >= boardWidth) continue
                    if (searched[pos[0] + i][pos[1] + j]) continue
                    if (boardStatus[pos[0] + i][pos[1] + j] === 0) {
                        // 隣接したマスが0であれば、探索を続行
                        queue.push([pos[0] + i, pos[1] + j]);
                    }
                    searched[pos[0] + i][pos[1] + j] = true;
                    
                    openCount++;
                    // Boardを開ける
                    let cell = document.getElementById(`${pos[0] + i}-${pos[1] + j}`);
                    cell.innerHTML = `<p>${boardStatus[pos[0] + i][pos[1] + j] !== 0 ? boardStatus[pos[0] + i][pos[1] + j] : ''}</p>`;
                }
            }
        }
    }
    if (openCount === boardHeight * boardWidth - bombCount) {
        alert('clear');
    }
}

// Boardを生成する関数
const generateBoard = () => {
    board.innerHTML = '';
    for (let h = 0; h < boardHeight; h++) {
        let newTbody = document.createElement('tbody');
        let newTr = document.createElement('tr');
        newTr.setAttribute('class', 'row');
        for (let w = 0; w < boardWidth; w++) {
            let newTd = document.createElement('td');
            newTd.setAttribute('class', 'cell');
            newTd.setAttribute('id', `${h}-${w}`);
            let newButton = document.createElement('button');
            newButton.addEventListener('click', () => handleClick(h, w));
            newTd.appendChild(newButton);
            newTr.appendChild(newTd);
        }
        newTbody.appendChild(newTr);
        board.appendChild(newTbody);
    }
}


// 高さの変更があった時に、boardHeightを書き換え、Boardを再生成する
heightInput.addEventListener('input', () => {
    boardHeight = document.getElementById('height').value;
    isVisible = generateArray(boardHeight, boardWidth, false);
    boardStatus = generateArray(boardHeight, boardWidth, 0);
    generateBoard();
})


// 幅の変更があった時に、boardWidthを書き換え、Boardを再生成する
widthInput.addEventListener('input', () => {
    boardWidth = document.getElementById('width').value;
    isVisible = generateArray(boardHeight, boardWidth, false);
    boardStatus = generateArray(boardHeight, boardWidth, 0);
    generateBoard();
})


// 爆弾の数の変更があった時に、bombCountを書き換える
bombs.addEventListener('input', () => {
    bombCount = document.getElementById('bombs').value;
})


// Boardを生成する
generateBoard();