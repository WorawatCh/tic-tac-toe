<template>
    <div id="game-container">
      <h1>เกม OX</h1>
      <div id="score">คะแนน: {{ playerScore }}</div>
      <div id="board">
        <div
          v-for="(cell, index) in board"
          :key="index"
          class="cell"
          @click="handleCellClick(index)"
        >
          {{ cell }}
        </div>
      </div>
      <button @click="restartGame">เริ่มเกมใหม่</button>
      <div id="message">{{ message }}</div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const playerScore = ref(0);
  const consecutiveWins = ref(0);
  const board = ref(Array(9).fill(''));
  const gameActive = ref(true);
  const message = ref('');
  
  const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  
  const handleCellClick = (index) => {
    if (board.value[index] !== '' || !gameActive.value) return;
  
    // ผู้เล่นวาง X ลงไปในช่องที่เลือก
    board.value[index] = 'X';
    checkResult();
  
    // ถ้าเกมยังดำเนินอยู่ให้บอทเล่น
    if (gameActive.value) {
      botPlay();
    }
  };
  
  const checkResult = () => {
    let roundWon = false; // ตัวแปรบ่งชี้ว่ามีการชนะหรือไม่
    let winner = null; // ตัวแปรสำหรับเก็บผู้ชนะ ('X' หรือ 'O')
  
    for (let condition of winningConditions) { // วนลูปผ่านเงื่อนไขการชนะ
      const [a, b, c] = condition.map(index => board.value[index]); // เอาค่าจากบอร์ดที่เกี่ยวข้อง
      if (a === '' || b === '' || c === '') continue; // ถ้ามีช่องว่างให้ข้ามไป
      if (a === b && b === c) { // ถ้าทั้งสามช่องมีค่าเท่ากัน
        roundWon = true; // มีการชนะ
        winner = a; // กำหนดผู้ชนะ
        break; // ออกจากลูป
      }
    }
  
    if (roundWon) { // ถ้ามีการชนะ
      gameActive.value = false; // หยุดเกม
      if (winner === 'X') { // ตรวจสอบว่าผู้เล่นชนะ
        playerScore.value++; // เพิ่มคะแนนให้ผู้เล่น
        consecutiveWins.value++; // เพิ่มการชนะติดต่อกัน
        message.value = 'คุณชนะ!'; // ตั้งข้อความว่าผู้เล่นชนะ
        if (consecutiveWins.value === 3) { // ถ้าชนะ 3 ครั้งติดต่อกัน
          playerScore.value++; // เพิ่มคะแนนพิเศษ
          consecutiveWins.value = 0; // รีเซ็ตการนับ
        }
      } else if (winner === 'O') { // ถ้าบอทชนะ
        playerScore.value--; // ลดคะแนนของผู้เล่น
        consecutiveWins.value = 0; // รีเซ็ตการนับการชนะ
        message.value = 'คุณแพ้!'; // ตั้งข้อความว่าผู้เล่นแพ้
      }
      return; // ออกจากฟังก์ชัน
    }
  
    if (!board.value.includes('')) { // ตรวจสอบว่าไม่มีช่องว่างในบอร์ด
      message.value = 'เสมอ!'; // ตั้งข้อความว่าผลเสมอ
      gameActive.value = false; // หยุดเกม
    }
  };
  
  const botPlay = () => {
    const availableCells = board.value.map((cell, index) => (cell === '' ? index : null)).filter(val => val !== null);
    if (availableCells.length > 0) {
      const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
      board.value[randomIndex] = 'O'; // บอทวาง O
      checkResult();
    }
  };
  
  const restartGame = () => {
    board.value = Array(9).fill('');
    gameActive.value = true;
    message.value = '';
  };
  
  </script>
  
  <style scoped>
  #game-container {
    text-align: center;
  }
  
  #board {
    display: grid;
    grid-template-columns: repeat(3, 100px);
    grid-gap: 5px;
  }
  
  .cell {
    width: 100px;
    height: 100px;
    border: 1px solid #000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    cursor: pointer;
  }
  </style>
  