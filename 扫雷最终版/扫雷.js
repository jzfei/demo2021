function renderBoard(numRows, numCols, grid) {
    let boardEl = document.querySelector("#board");

    document.oncontextmenu = function () { return false };

    for (let i = 0; i < numRows; i++) {
        let trEl = document.createElement("tr");
        for (let j = 0; j < numCols; j++) {
            let cellEl = document.createElement("div");
            cellEl.className = "cell";
            grid[i][j].cellEl = cellEl;

            cellEl.onmousedown = function (e) {
                if (e.button == 2) {
                    cellEl.classList.add("flag");
                }
                cellEl.onmousedown = function (e) {
                    if (e.button == 2) {
                        cellEl.classList.remove("flag");
                    }
                }
            }




            // if ( grid[i][j].count === -1) {
            //     cellEl.innerText = "*";    
            // } else {
            //     cellEl.innerText = grid[i][j].count;
            // }






            cellEl.addEventListener("click", (e) => {
                if (grid[i][j].count === 1) {
                    grid[i][j].cellEl.classList.add("num1");
                }
                if (grid[i][j].count === 2) {
                    grid[i][j].cellEl.classList.add("num2");
                }
                if (grid[i][j].count === 3) {
                    grid[i][j].cellEl.classList.add("num3");
                }
                if (grid[i][j].count === 4) {
                    grid[i][j].cellEl.classList.add("num4");
                }
                if (grid[i][j].count === -1) {
                    explode(grid, i, j, numRows, numCols)
                    return;
                }

                if (grid[i][j].count === 0) {
                    searchClearArea(grid, i, j, numRows, numCols);
                } else if (grid[i][j].count > 0) {
                    grid[i][j].clear = true;
                    cellEl.classList.add("clear");
                    grid[i][j].cellEl.innerText = grid[i][j].count;
                }

                checkAllClear(grid);
                // cellEl.classList.add("clear");
            });

            let tdEl = document.createElement("td");
            tdEl.append(cellEl);

            trEl.append(tdEl);
        }
        boardEl.append(trEl);
    }
}

const directions = [
    [-1, -1], [-1, 0], [-1, 1], // TL, TOP, TOP-RIGHT
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1],
]

function initialize(numRows, numCols, numMines) {
    let grid = new Array(numRows);
    for (let i = 0; i < numRows; i++) {
        grid[i] = new Array(numCols);
        for (let j = 0; j < numCols; j++) {
            grid[i][j] = {
                clear: false,
                count: 0
            };
        }
    }

    let mines = [];
    for (let k = 0; k < numMines; k++) {
        let cellSn = Math.trunc(Math.random() * numRows * numCols);
        let row = Math.trunc(cellSn / numCols);
        let col = cellSn % numCols;

        console.log(cellSn, row, col);

        grid[row][col].count = -1;
        mines.push([row, col]);
    }

    // 计算有雷的周边为零的周边雷数
    for (let [row, col] of mines) {
        console.log("mine: ", row, col);
        for (let [drow, dcol] of directions) {
            let cellRow = row + drow;
            let cellCol = col + dcol;
            if (cellRow < 0 || cellRow >= numRows || cellCol < 0 || cellCol >= numCols) {
                continue;
            }
            if (grid[cellRow][cellCol].count === 0) {
                console.log("target: ", cellRow, cellCol);

                let count = 0;
                for (let [arow, acol] of directions) {
                    let ambientRow = cellRow + arow;
                    let ambientCol = cellCol + acol;
                    if (ambientRow < 0 || ambientRow >= numRows || ambientCol < 0 || ambientCol >= numCols) {
                        continue;
                    }

                    if (grid[ambientRow][ambientCol].count === -1) {
                        console.log("danger!", ambientRow, ambientCol);
                        count += 1;
                    }
                }



                if (count > 0) {

                    grid[cellRow][cellCol].count = count;


                }
            }
        }

    }



    // console.log(grid);

    return grid;
}

function searchClearArea(grid, row, col, numRows, numCols) {
    let gridCell = grid[row][col];
    gridCell.clear = true;
    gridCell.cellEl.classList.add("clear");


    for (let [drow, dcol] of directions) {
        let cellRow = row + drow;
        let cellCol = col + dcol;
        console.log(cellRow, cellCol, numRows, numCols);
        if (cellRow < 0 || cellRow >= numRows || cellCol < 0 || cellCol >= numCols) {
            continue;
        }

        let gridCell = grid[cellRow][cellCol];

        console.log(cellRow, cellCol, gridCell);
        if (gridCell.count === 1) {
            gridCell.cellEl.classList.add("num1");
        }
        if (gridCell.count === 2) {
            gridCell.cellEl.classList.add("num2");
        }
        if (gridCell.count === 3) {
            gridCell.cellEl.classList.add("num3");
        }
        if (gridCell.count === 4) {
            gridCell.cellEl.classList.add("num4");
        }

        if (!gridCell.clear) {
            gridCell.clear = true;
            gridCell.cellEl.classList.add("clear");

            if (gridCell.count === 0) {
                searchClearArea(grid, cellRow, cellCol, numRows, numCols);
            } else if (gridCell.count > 0) {
                gridCell.cellEl.innerText = gridCell.count;



            }
        }
    }
}

function explode(grid, row, col, numRows, numCols) {
    grid[row][col].cellEl.classList.add("exploded");

    for (let cellRow = 0; cellRow < numRows; cellRow++) {
        for (let cellCol = 0; cellCol < numCols; cellCol++) {
            let cell = grid[cellRow][cellCol];
            cell.clear = true;
            cell.cellEl.classList.add('clear');



            if (cell.count === -1) {
                cell.cellEl.classList.add('landmine');

            }
            else {
                if (cell.count === 0) {
                    continue;
                }
                cell.cellEl.innerText = cell.count;



                if (cell.count === 1) {
                    cell.cellEl.classList.add("num1");
                }
                if (cell.count === 2) {
                    cell.cellEl.classList.add("num2");
                }
                if (cell.count === 3) {
                    cell.cellEl.classList.add("num3");
                }
                if (cell.count === 4) {
                    cell.cellEl.classList.add("num4");
                }

            }
        }
    }
    alert("游戏结束！")
}

function checkAllClear(grid) {
    for (let row = 0; row < grid.length; row++) {
        let gridRow = grid[row];
        for (let col = 0; col < gridRow.length; col++) {
            let cell = gridRow[col];
            if (cell.count !== -1 && !cell.clear) {
                return false;
            }
        }
    }

    for (let row = 0; row < grid.length; row++) {
        let gridRow = grid[row];
        for (let col = 0; col < gridRow.length; col++) {
            let cell = gridRow[col];

            if (cell.count === -1) {
                cell.cellEl.classList.add('landmine');
            }

            cell.cellEl.classList.add("success");
        }
    }
    alert("扫雷成功！")
    return true;

}

window.onload = function () {


    let btns = document.getElementsByTagName("button")
    let arr = [[9, 9, 9], [16, 16, 40], [20, 20, 60]]
    let table = document.getElementsByTagName("table")
    for (let i = 0; i < btns.length - 1; i++) {
        btns[i].onclick = function () {
            let boardEl = document.querySelector("#board");
            boardEl.innerHTML = null
            let grid = initialize(arr[i][0], arr[i][1], arr[i][2])
            renderBoard(arr[i][0], arr[i][1], grid);
            let className = btns[i].className

            let allnew = btns[3]
            allnew.onclick = function () {
                for (var i = 0; i < btns.length - 1; i++) {
                    if (btns[i].className == className) {
                        btns[i].onclick();

                    }
                }
            }
        }
    }
}


let grid = initialize(9, 9, 9);


renderBoard(9, 9, grid);

