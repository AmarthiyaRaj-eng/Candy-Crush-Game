import React, { useEffect, useState } from 'react';
import Blank from './images/Blank.png';
import BlueCandy from './images/BlueCandy.jpeg';
import GreenCandy from './images/GreenCandy.jpeg';
import OrangeCandy from './images/OrangeCandy.jpeg';
import PurpleCandy from './images/PurpleCandy.jpeg';
import RedCandy from './images/RedCandy.jpeg';
import YellowCandy from './images/YellowCandy.jpeg';
import ScoreBoard from './scoreBoard.jsx';

const width = 8;

const candyColor = [
  BlueCandy, 
  GreenCandy,
  OrangeCandy,
  PurpleCandy,
  RedCandy,
  YellowCandy,
  Blank
];

const App = () => {
  const [currentColorArrangement, setCurrentColorArrangement] = useState([])
  
  const [squareBeingDragged , setSquareBeingDragged] = useState(null)
  const [squareBeingReplaced , setSquareBeingReplaced] = useState(null)
  const [scoreDisplay , setScoreDisplay] = useState(0)

  const checkForColumnOfFour = () => {
    for (let i = 0; i <= 39; i++) {
      const columnOfFour = [i , i + 1 , i + width * 2 , i + width * 3];
      const decidedColor = currentColorArrangement[i];
      const isBlank = currentColorArrangement[i] === Blank;

      if(columnOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        setScoreDisplay((score) => score + 4)
        console.log('Column of four found');
        columnOfFour.forEach(square => currentColorArrangement[square] = Blank)
      }
    }
  }
  
  const checkForColumnOfThree = () => {
    for (let i = 0; i <= 47; i++) {
      const columnOfThree = [i, i + width, i + width * 2];
      const decidedColor = currentColorArrangement[i];
      
      if(columnOfThree.every(square => currentColorArrangement[square] === decidedColor)) {
        setScoreDisplay((score) => score + 3)
        console.log('Column of three found');
        columnOfThree.forEach(square => currentColorArrangement[square] = Blank)
        return true
      }
    }
  }
  const checkForRowOfFour = () => {
    for (let i = 0; i <= 47; i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3];
      const decidedColor = currentColorArrangement[i];
      const notValid = [5,6,7,13,14,15,21,22,23,29,30,31,37,38,39,45,46,47,53,54,55,61,62,63,64];
      if(notValid.includes(i)) continue
      
      if(rowOfFour.every(square => currentColorArrangement[square] === decidedColor)) {
        setScoreDisplay((score) => score + 4)
        console.log('Row of four found');
        rowOfFour.forEach(square => currentColorArrangement[square] = Blank)
        return true
      }
    }
  }

  const checkForRowOfThree = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i , i + 1 , i + 2];
      const decidedColor = currentColorArrangement[i];
      const notValid = [6,7,14,15,22,23,30,31,38,39,46,47,54,55,62,63,64];
      if(notValid.includes(i)) continue

      if(rowOfThree.every(square => currentColorArrangement[square] === decidedColor)) {
        setScoreDisplay((score) => score + 3)
        console.log('Row of three found');
        rowOfThree.forEach(square => currentColorArrangement[square] = Blank)
      }
    }
  }

  const moveIntoSquareBelow = () => {
    for(let i = 0; i <= 55; i++) {
      const firstRow = [0,1,2,3,4,5,6,7];
      if(firstRow.includes(i) && currentColorArrangement[i] === Blank) {
        let randomNumber = Math.floor(Math.random()*candyColor.length)
        currentColorArrangement[i] = candyColor[randomNumber] 
      }
      if((currentColorArrangement[i + width]) === Blank) {
        currentColorArrangement[i + width] = currentColorArrangement[i]
        currentColorArrangement[i] = Blank
      }
    }
  }

  console.log(scoreDisplay)

  const dragStart = (e) => {
    console.log(e.target)
    console.log('drag Start')
    setSquareBeingDragged(e.target);  
  };

  const dragDrop = (e) => {
    console.log(e.target)
    console.log
    setSquareBeingReplaced(e.target);
  };

const dragEnd = (e) => {
  console.log('drag End')

  const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'))
  const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'))

  currentColorArrangement[squareBeingReplacedId] = squareBeingDragged.getAttribute('src')
  currentColorArrangement[squareBeingDraggedId] = squareBeingReplaced.getAttribute('src')

  console.log(squareBeingDraggedId , squareBeingReplacedId)
  const validMoves = [
    squareBeingDraggedId - 1,
    squareBeingDraggedId - width,
    squareBeingDraggedId + 1,
    squareBeingDraggedId + width 
  ]
 
  const validMove = validMoves.includes(squareBeingReplacedId)

  const isAColumnOfFour = checkForColumnOfFour()
  const isARowOfFour = checkForRowOfFour()
  const isAColumnOfThree = checkForColumnOfThree()
  const isARowOfThree = checkForRowOfThree()

   if(squareBeingReplacedId&& validMove &&(isARowOfThree || isARowOfFour || isAColumnOfThree || isAColumnOfFour)) {
    setSquareBeingDragged(null)
    setSquareBeingReplaced(null)
   } else {
    currentColorArrangement[squareBeingReplacedId] = squareBeingReplaced.getAttribute('src')
    currentColorArrangement[squareBeingDraggedId] = squareBeingDragged.getAttribute('src')
    setCurrentColorArrangement([...currentColorArrangement])
   }
}



  const createBoard = () => {
    const randomColorArrangement = [];
    for (let i = 0; i < width * width; i++) {
      const randomColor =
        candyColor[Math.floor(Math.random() * candyColor.length)];
      randomColorArrangement.push(randomColor);
    }
    setCurrentColorArrangement(randomColorArrangement);
  };

  
  useEffect(() => {
    createBoard();
  }, []);

  
  useEffect(() => {
    const timer = setInterval(() => {
      moveIntoSquareBelow();
      checkForColumnOfFour();
      checkForRowOfFour();
      checkForColumnOfThree();
      checkForRowOfThree();
      setCurrentColorArrangement([...currentColorArrangement])
    }, 100);
    return () => clearInterval(timer);
  }, [checkForColumnOfFour, checkForRowOfFour, checkForColumnOfThree, checkForRowOfThree, moveIntoSquareBelow, currentColorArrangement]);

  // console.log(currentColorArrangement);

  return (
  <div className="app">
    <div className="game">
      {currentColorArrangement.map((candy, index) => (
        <img
          key={index}
          src={candy}
          alt="candy"
          data-id={index}
          draggable={true}
          onDragStart={dragStart}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={(e) => e.preventDefault()}
          onDragLeave={(e) => e.preventDefault()}
          onDrop={dragDrop}
          onDragEnd={dragEnd}
          style={{
            width: "50px",
            height: "50px",
            border: "1px solid black"
          }}
        />
      ))}
    </div>
    <ScoreBoard score={scoreDisplay} />
  </div>
);

};

export default App;

