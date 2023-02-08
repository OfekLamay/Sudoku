// Entry page
// --------------------------------------------------------------

function checkEntryCredentials() // Check the user name and password 
{
    let userName = document.getElementById("username").value; // Get the inserted user name
    let password = document.getElementById("password").value; // Get the inserted password
    
    if (userName == "abcd") 
    {
        if (password == "1234")
        {
            window.alert("You can enter!");
            window.open("gameSelectionIndex.html", "_self");
        }
        else
            window.alert("Wrong password!"); // The password is wrong, the user can try again
    }
    else
        window.alert("Wrong username!"); // The user name is wrong, the user can try again
}

// --------------------------------------------------------------
// Game selection page
// --------------------------------------------------------------

function openGame(difficulty) // Open the game according to the difficulty of the selected game
{
    sessionStorage.setItem("difficulty", difficulty);
    window.open("game.html", "_self");
}

// --------------------------------------------------------------
// Game  page
// --------------------------------------------------------------

let gameBoard, playerBoard; // Will represent the game and the player's boards
let boardEdge, percentageToRemove, minutesToPlay; // Will represent the board size, percentage to complete from it and time to play
let second = 0, minute = 0; 
let numSelected = null; // Will be used to check if a number was selected
let tileSelected = null; // Will be used to check if a tile was selected
const timer = document.getElementById('timer');
let timerInterval; // The timer interval 
let difficulty;

function createGameWithDifficulty()
{
    difficulty = sessionStorage.getItem("difficulty");
    
    if (difficulty == "Easy")
    {
        createGame(9, 0.25, 10);
    }
    else if (difficulty == "Medium")
    {
        createGame(9, 0.5, 20);
    }
    else if (difficulty == "Hard")
    {
        createGame(9, 0.75, 30);
    }
    else if (difficulty == "Custom")
    {
        setCustomSettings();
        boardEdgeToGet = 9; // The size of the board will be 9X9 tiles
        percentageToRemoveToGet = Number(document.getElementById("percentFull").value) * 0.01; 
        minutesToPlayToGet = Number(document.getElementById("gameTime").value); 
        createGame(boardEdgeToGet, percentageToRemoveToGet, minutesToPlayToGet); 
        removeSelectOptions();
    }
    else
        window.prompt("Invalid difficulty!");
}

function removeSelectOptions()
{
    document.getElementById("labels").remove();
    console.log(document);
    console.log(window);
}

// function removeValueFromArray(value)
// {

// }

function randomizeGameBoard()
{
    gameBoard = Array(boardEdge).fill().map(()=>Array(boardEdge).fill());

    for (let row = 0; row < boardEdge; row++) // At the start all numbers in the board are equal to 0
        for(let col = 0; col < boardEdge; col++)
            gameBoard[row][col] = 0;

    // Create completed board
    let timesRunButNoNumberFound; // Used to prevent crushes. 
    let timesCrashed = 0; // Used to prevent crushes.
    let numberNotFoundLimit = boardEdge * boardEdge; // Declare the max amount of numbers randomations before restarting building the row
    let crashedLimit = boardEdge; // Declare the max amount of numbers randomations before restarting building the whole board
    // let numbersInLine = Array.from({length: 9}, (_, i) => i + 1);
    for (let row = 0; row < gameBoard.length; row++)
    {
        for (let col = 0; col < gameBoard.length; col++) 
        {
            timesRunButNoNumberFound = 0;
            // for (let i = 0; i < numbersInLine.length ; i++)
            // {

            // }
            gameBoard[row][col] = getARandomIntBetweenOneToBoardEdge(boardEdge); 
            while (duplicateInLineOrRowOrBlock(gameBoard[row][col], gameBoard, row, col) && timesRunButNoNumberFound < numberNotFoundLimit)
            {   
                timesRunButNoNumberFound++; 
                gameBoard[row][col] = getARandomIntBetweenOneToBoardEdge(boardEdge);
            }
            // numbersInLine = removeValueFromArray(gameBoard[row][col]);
            if (timesRunButNoNumberFound == numberNotFoundLimit && timesCrashed < crashedLimit)
            {   
                timesCrashed++; 
                for (col = 0; col < gameBoard.length; col++) 
                    gameBoard[row][col] = 0;
                col = -1;
            }
            else if (timesCrashed == crashedLimit)
            {   
                timesCrashed = 0; 
                for (row = 0; row < gameBoard.length; row++) 
                    for (col = 0; col < gameBoard.length; col++)
                        gameBoard[row][col] = 0;
                row = -1;
                col = gameBoard.length;
                // numbersInLine = Array.from({length: 9}, (_, i) => i + 1);
            }
            // else
            // {
            //     numbersInLine = Array.from({length: 9}, (_, i) => i + 1);
            // }
        }
    }
}

function createPlayerBoard() 
{
    let amountToRemove = Math.floor(boardEdge * boardEdge * percentageToRemove); // Calculate amount of tiles to remove
    let amountToKeep = boardEdge * boardEdge - amountToRemove; // Calculate amount of tiles to keep

    playerBoard = Array(boardEdge).fill().map(()=>Array(boardEdge).fill()); // Create the player's board
    for (let row = 0; row < boardEdge; row++)  // At the start all numbers in the board are equal to 0
        for(let col = 0; col < boardEdge; col++)
            playerBoard[row][col] = 0;

    console.log("Game board:"); // Can be used for checking everything
    console.log(gameBoard);

    let randomRow, randomCol; 

    for (let counter = 0; counter < amountToKeep; counter++) 
    {
        randomRow = Math.floor(Math.random() * (boardEdge)); 
        randomCol = Math.floor(Math.random() * (boardEdge)); 

        if (playerBoard[randomRow][randomCol] == 0) 
            playerBoard[randomRow][randomCol] = gameBoard[randomRow][randomCol]; 
        else
        {
            while (playerBoard[randomRow][randomCol] != 0) 
            {
                randomRow = Math.floor(Math.random() * (boardEdge)); 
                randomCol = Math.floor(Math.random() * (boardEdge)); 
            }
            playerBoard[randomRow][randomCol] = gameBoard[randomRow][randomCol]; 
        }
    }

    // console.log("Player board:"); // Can be used for checking everything
    // console.log(playerBoard);

}

stopTimer = () => { // Stop the timer from displaying the time and to nothing
    clearInterval(timerInterval); // Stop the previous action
};

startTimer = () => { // A function to start the timer that is being displayed

    clearInterval(timerInterval);

    second = 0,
    minute = 0;

    timerInterval = setInterval(
    function() 
    {
        timer.innerHTML =
            (minute < 10 ? '0' + minute : minute) + ':' +
            (second < 10 ? '0' + second : second);

        second++;

        if (second == 60) {
            minute++;
            second = 0;
        }

        if (minute == minutesToPlay && second == 1) // If reached the game's time limit
        {
            window.alert(
                "You lost :( \nThe game selection page will open up in a new window :)\nYou can click on the again button to start a new game!"
            ); 
            stopGame(); 
            window.open("gameSelectionIndex.html", "_blank");
        }
    }
    , 1000);
};

function sayStartNewGame() // A function that gives the user an alert saying that in order to play again the "again" button must be clicked
{
    window.alert("Click on the again button to start a new game!");
}

function resetEventListeners() // Change back all the event listeners to what they should regularly be
{
    for (let i = 1; i < boardEdge + 1; i++) 
    {
        document.getElementById(i).removeEventListener("click", sayStartNewGame); // Stop saying the user to start a new game
        document.getElementById(i).addEventListener("click", selectNumber); // Use the function to select the wanted number
    }
        

    for (let row = 0; row < boardEdge; row++) 
        for (let col = 0; col < boardEdge; col++)
        {
            document.getElementById(`${row}-${col}`).removeEventListener("click", sayStartNewGame); // Stop saying the user to start a new game 
            document.getElementById(`${row}-${col}`).addEventListener("click", selectTile); // Use the function to select the wanted tile
        }
}

function stopGame() // A function for stopping the game when it ends
{
    stopTimer(); 

    for (let i = 1; i < boardEdge + 1; i++) 
    {
        document.getElementById(i).removeEventListener("click", selectNumber); // Stop using the function to select the wanted number 
        document.getElementById(i).addEventListener("click", sayStartNewGame); // Start saying the user to start a new game
    }

    for (let row = 0; row < boardEdge; row++) 
        for (let col = 0; col < boardEdge; col++)
        {
            document.getElementById(`${row}-${col}`).removeEventListener("click", selectTile); // Stop using the function to select the wanted tile 
            document.getElementById(`${row}-${col}`).addEventListener("click", sayStartNewGame); // Start saying the user to start a new game
        }
}

window.onload = function(){ 

    let pageName = (document.title) 

    if (pageName == "Sudoku Game") // If the game is a costum game
    {
        difficulty = sessionStorage.getItem("difficulty");
        document.getElementById("subTitle").innerText += ` ${difficulty}`;
        if (difficulty == "Custom")
            setCustomSettings() // Create costum options
        return;
    } 
}

function createGame(boardEdgeToGet, percentageToRemoveToGet, minutesToPlayToGet) // A function for creating the game
{
    minutesToPlay = minutesToPlayToGet; 
    boardEdge = boardEdgeToGet; 
    percentageToRemove = percentageToRemoveToGet; 
    startTimer(); 

    randomizeGameBoard();
    createPlayerBoard();

    
    for (let i = 1; i < boardEdge + 1; i++) // Create the numbers to select elements - from one to the board edge value
    { 
        let number = document.createElement("div"); 
        number.id = i 
        number.innerText = i; 
        number.addEventListener("click", selectNumber); 
        number.classList.add("number"); 
        document.getElementById("digits").appendChild(number); 
    }

    // Draw the board by creating the cells and draw the block lines in a clear way.
    let blockLineNumber = boardEdge / 3; // Will help showing a the seperation between blocks easily
    for (let row = 0; row < boardEdge; row++) 
    {
        for (let col = 0; col < boardEdge; col++) 
        { 
            let tile = document.createElement("div"); 
            tile.id = `${row}-${col}`; 
            if (playerBoard[row][col] != "0") 
            {
                tile.innerText = playerBoard[row][col]; 
                tile.classList.add("tile-start");
            }
            tile.classList.add("tile"); // Add the tile class (also for deisgn)

            if ((row + 1) % blockLineNumber == 0 && row + 1 != boardEdge) // If the tile is over a block seperating line
                tile.classList.add("horizontal-line"); 
            if ((col + 1) % blockLineNumber == 0 && col + 1 != boardEdge)  // If the tile is aside a block seperating line
                tile.classList.add("vertical-line"); 

            tile.addEventListener("click", selectTile); // Add the functionallity of clicking a tile
            document.getElementById("board").append(tile); 
        }
    }

    let tileFullSize = 50; // Full tile size is 50px * 50px - 48px for width and height + 2px for borders
    
    document.getElementById("board").style.width = `${tileFullSize*boardEdge}px`; // The size of the board width is number of tiles in row times tile size
    document.getElementById("board").style.height = `${tileFullSize*boardEdge}px`;  // The size of the board height is number of tiles in column times tile size

    document.getElementById("digits").style.height = `${tileFullSize}px`; // The size of the numbers height is the same as of a tile
    document.getElementById("digits").style.width = `${tileFullSize*boardEdge}px`; // The size of the numbers width is number of tiles in row times tile size

    document.getElementById("container").style.visibility = "visible"; 
    document.getElementById("board").style.visibility = "visible"; 
    document.getElementById("digits").style.visibility = "visible"; 

    document.getElementById("start").remove();
}

// function createCustomGame() // A function to create what needed for a costum game
// {
//     boardEdgeToGet = 9; // The size of the board will be 9X9 tiles
//     percentageToRemoveToGet = Number(document.getElementById("percentFull").value) * 0.01; // Get the percentage of the board to complete
//     minutesToPlayToGet = Number(document.getElementById("gameTime").value); // Get the amount of minutes the player wants to play
//     createGame(boardEdgeToGet, percentageToRemoveToGet, minutesToPlayToGet); // Create a costum game with the wanted conditions
//     document.getElementById("gameTime").remove(); // Remove the option selection tag
//     document.getElementById("percentFull").remove(); // Remove the option selection tag 
// }

function setCustomSettings() // Create the needed elements to select the wanted costum game settings
{
    let selection = document.createElement("select");
    selection.id = "gameTime";
    selection.classList.add("slectOption");
    selection.style.margin = "10px";
    document.getElementById("labels").appendChild(selection);

    selection = document.createElement("select");
    selection.id = "percentFull";
    selection.classList.add("slectOption");
    document.getElementById("labels").appendChild(selection);

    for (let i = 5; i <= 59; i++) // Create the 5-59 minutes to play options
    {
        let option = document.createElement("option"); 
        option.id = `gameTime${i}`; 
        option.value = i; 
        option.innerText = `${i} minutes`; 
        option.classList.add("slectOption"); 
        document.getElementById("gameTime").appendChild(option); 
    }

    for (let i = 20; i <= 80; i++) // Create the 20-80 percents of board to complete options
    {
        let option = document.createElement("option"); 
        option.id = `percentFull${i}`; 
        option.value = i; 
        option.innerText = `${i}%`; 
        option.classList.add("slectOption"); 
        document.getElementById("percentFull").appendChild(option); 
    }
}

function playAgain() // A function created for playing again
{
    if (isNaN(boardEdge)) // If the boardEdge did not recieve a value, then the a game wasn't even started
        {
            window.alert("Start a game before playing again >:("); // Tell the user to start a game before trying to play again
            return;
        }
    
    startTimer(); 

    randomizeGameBoard();
    createPlayerBoard();
    resetEventListeners() // Make sure all clicks will make everything operate as it should

    // Draw the board by creating the cells and draw the block lines in a clear way.
    let blockLineNumber = boardEdge / 3; // Will help showing a the seperation between blocks easily
    for (let row = 0; row < boardEdge; row++) 
    {
        for (let col = 0; col < boardEdge; col++) 
        {
            let tile = document.getElementById(`${row}-${col}`); // Get the tile with it's ID. Reminder - the tiles were already created
            tile.className = ""; // Clear the tile from the previous classes it had
            tile.innerText = ""; // Clear the value the tile had before
            if (playerBoard[row][col] != "0") 
            {
                tile.innerText = playerBoard[row][col]; 
                tile.classList.add("tile-start");
            }
                tile.classList.add("tile"); // Add the tile class (also for deisgn) 

            if ((row + 1) % blockLineNumber == 0 && row + 1 != boardEdge) // If the tile is over a block seperating line
                tile.classList.add("horizontal-line"); 
            if ((col + 1) % blockLineNumber == 0 && col + 1 != boardEdge) // If the tile is aside a block seperating line
                tile.classList.add("vertical-line");
        }
    }
}

function selectNumber() // A function to select the wanted number
{
    if (numSelected != null) // If a number was selected before
        numSelected.classList.remove("number-selected"); // Remove the selected number from before
    numSelected = this;
    numSelected.classList.add("number-selected"); // Show the selected number
}

function selectTile() // A function to select the wanted tile
{
    if (numSelected) // Check if a number to place was already selected. If no number was selected, we do not know what number to place
    {
        if (this.classList.contains("tile-start")) // Check if this is a tile that has a value from the start of the game
            return; // These tiles can not be changed in their value
        
        let rowAndCol = this.id.split("-"); //["0", "0"] - Get an array with two number that represent the row and column of the selected tile
        let row = Number(rowAndCol[0]); // Save the first number, which stands for the row number
        let col = Number(rowAndCol[1]); // Save the second number, which stands for the column number

        if (document.getElementById(`${row}-${col}`).classList.contains("tile")) // Check that the selected element is actually a tile
            this.innerText = numSelected.id; 
    }
}

function isDuplicateInRow(number, array) // Check if an number appears more than once in a row
{
    if (timesExist(array, number) > 1) 
        return true; 
    return false; 
}

function isDuplicateInColumn(number, matr, column) // Check if an number appears more than once in a column
{
    let columnArr = []; // Create an empty array to contain all the numbers from the selected column

    for (let row = 0; row < matr.length; row++) 
        columnArr.push(matr[row][column]); 

    if (timesExist(columnArr, number) > 1) 
        return true; 
    return false; 
}

function isDuplicateInBlock(number, matr, numberRow, numberColumn) // Check if an number appears more than once in a column
{
    let blockEdge = matr.length / 3; // Define the size of the block - 9 / 3 -> 3X3 square
    let blockLineNum, blockColNum, blockNum; // Define variables that indicates the block line and column numbers as well as the block number
    let blockesArrays; // Create an array of blockes saving all the numbers from each block
    blockesArrays = Array(9).fill().map(()=>Array(0).fill()); // The size will be 9 -> 9 blocks

    for (let row = 0; row < matr.length; row++) 
    {
        blockLineNum = Math.floor((row) / blockEdge); // Each block has 3 rows and columns -> lines 0,1,2 have blocks 1, 2, 3 
        for (let col = 0; col < matr[row].length; col++)
        {
            blockColNum = Math.floor((col) / blockEdge); // The block is seperated by the third row -> lines 2, 5, 8
            blockNum = blockLineNum * 3 + blockColNum; // If the row number is after 2, we are looking at 3 new blocks
            blockesArrays[blockNum].push(matr[row][col]); // Add the number from this position of the tile to it's block array
        }
    }

    blockLineNum = Math.floor((numberRow) / blockEdge); 
    blockColNum = Math.floor((numberColumn) / blockEdge); 
    blockNum = blockLineNum * 3 + blockColNum; // For every block row number, the block number increases by 3

    if (timesExist(blockesArrays[blockNum], number) > 1) 
        return true;
    return false; 
}

function duplicateInLineOrRowOrBlock(number, matr, numberRow, numberColumn) // Check if a number appears more than once in a row or column or block
{
    if (isDuplicateInRow(number ,matr[numberRow])) 
        return true; 
    if (isDuplicateInColumn(number, matr, numberColumn)) 
        return true; 
    if (isDuplicateInBlock(number, matr, numberRow, numberColumn))
        return true 
    return false; 
}

function getARandomIntBetweenOneToBoardEdge(boardEdge) 
{
    return Math.floor(Math.random() * ((boardEdge + 1) - 1)) + 1;
}

function timesExist(arr, object) // Count how many times a number exists in an array
{
    if (!isExist(arr, object)) 
        return 0; 
    let counter = 0; 
    for (let i = 0; i < arr.length; i++) 
        if (arr[i] == object) 
            counter++; 
    return counter; 
}

function isExist(arr, object) // Check if a number exists in an array
{
    for (let i = 0; i < arr.length; i++) 
        if (arr[i] == object) 
            return true; 
    return false; 
}

function isWinningBoard() // Check if all the board is good 
{
    if (isNaN(boardEdge)) // If the boardEdge did not recieve a value, then the a game wasn't even started 
        {
            window.alert("Start a game before you check the win >:("); // Tell the player to start a new game
            return; // Go back
        }

    let win = false; // Before checking, we can't say the player won
    for (let row = 0; row < playerBoard.length; row++) // For every row of tiles from the board 
        for(let col = 0; col < playerBoard[row].length; col++) // For every every tile from the row 
            playerBoard[row][col] = document.getElementById(`${row}-${col}`).innerHTML; // Set the player's board values as the board

    // Check lines, columns & blocks
    if (areRowsWinning(playerBoard))
        if (areColumnsWinning(playerBoard))
            if (areBlocksWinning(playerBoard))
                win = true; // All of them are good after checking them
    
    if (win) // The player won
    {
        window.alert("Nice win :D"); // Let the player know
        stopGame(); // Stop the game
        window.alert("The game selection page will open up in a new window :) \nYou can come back and click on the again button to start a new game!");
        window.open("gameSelectionIndex.html", "_blank") // Tell the player that the game selection page was opened and a new game can be started
    }  
    else // The player did not win
        window.alert("You lost :( \nYou can try again as long as you have time though"); // Let the player know and that the game is not over
}

function areRowsWinning(matr) // Check if all the rows are good
{
    for (let row = 0; row < matr.length; row++) // For all the rows in the board
        for (let i = 1; i < matr.length + 1; i++) // For every number from one to the size of the board
            if (!isExist(matr[row], i)) // Check if it exists in the row
                return false; // If one of the numbers is not the row then the row is not good, so not all row are good
    return true; // No row was labeled as a bad one, so all of them are good
}

function isColumnValid(matr, colNum) // Check if the column is good
{
    let entireCol = []; // Create an array for the numbers that represent the column

    for (let row = 0; row < matr[0].length; row++) // For every number that is in this column
        entireCol.push(matr[row][colNum]); // Put it also in the array from before

    for (let i = 1; i < matr[0].length + 1; i++) // For every number from one to the size of the board
        if (!isExist(entireCol, i)) // Check if it exists in the column
            return false; // If one of the numbers is not there, then the column is not good
    return true; // If no number is missing then the column is good
}

function areColumnsWinning(matr) // Check if all the columns in the board are good
{
    for (let colNum = 0; colNum < matr[0].length; colNum++) // For every column
        if (!isColumnValid(matr, colNum)) // Check if the column is good
            return false; // If one of the columns is not good then not everything is good
    return true; // No column was labeled as a bad one, so all of them are good
}

function areBlocksWinning(matr) // Check if all blocks in the board are good
{   // General assumptions - 1) There are only 9 blocks of numbers, no matter what is the size of the board.
    //                       2) The amount of the rows and the columns of the board is equal and can be divided naturally by 3. 
    let blockEdge = matr.length / 3; // Define the size of the block - 9 / 3 -> 3X3 square
    let blockLineNum, blockColNum, blockNum; // Define variables that indicates the block line and column numbers as well as the block number
    let blockesArrays; // Create an array of blockes saving all the numbers from the each block
    blockesArrays = Array(9).fill().map(()=>Array(0).fill()); // The size will be 9 -> 9 blocks

    for (let row = 0; row < matr.length; row++) // Check all of the tiles in the board
    {
        blockLineNum = Math.floor((row) / blockEdge); // Each block has 3 rows and columns -> lines 0,1,2 have blocks 1, 2, 3 
        for (let col = 0; col < matr[row].length; col++)
        {
            blockColNum = Math.floor((col) / blockEdge); // The block is seperated by the third row -> lines 2, 5, 8
            blockNum = blockLineNum * 3 + blockColNum; // If the row number is after 2, we are looking at 3 new blocks
            blockesArrays[blockNum].push(matr[row][col]); // Add the number from this position of the tile to it's block array
        }
    }

    for (let j = 0; j < blockesArrays.length; j++) 
        for (let i = 1; i < matr[0].length + 1; i++) 
            if (!isExist(blockesArrays[j], i)) 
                return false; 
    return true; 
}