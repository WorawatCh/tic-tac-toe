<template>
    <div id="game-container">
      <h1>เกม OX</h1>
      <h2>สวัสดี {{ userStore.currentUser?.name }}</h2>
      <div id="score" class="pt-2 pb-2">คะแนนสะสม: {{ userStore.currentUser?.score }}</div>
      <div id="score" class="pt-2 pb-2">คะแนน: {{ playerScore}}</div>
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
      <button @click="restartGame" class="mt-3 me-3">เริ่มเกมใหม่</button>
      <button @click="handleSignOut" class="mt-3" v-if="isLoggedIn">Sign out</button>
      <div id="message">{{ message }}</div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import {getAuth, onAuthStateChanged, signOut} from "firebase/auth"
  import { useRouter } from "vue-router";
  import {useUserStore} from '../stores/user'

  const consecutiveWins = ref(0);
  const board = ref(Array(9).fill(''));
  const gameActive = ref(true);
  const message = ref('');
  const isLoggedIn = ref(false)
  const router = useRouter()
  const userStore = useUserStore()
  const playerScore = ref(0);

  let auth;
  onMounted(async () =>{
    auth = getAuth()
    await userStore.getAllUser()
    onAuthStateChanged(auth,async (user) =>{
      if(user){
        const existingUser = userStore.users.find(u => u.uid === user.uid);
        console.log('existingUser',existingUser)
        await userStore.fetchCurrentUser(existingUser.id);
        console.log('userStore.currentUser',userStore.currentUser)
        isLoggedIn.value = true
      } else{
        isLoggedIn.value = false
      }
    })
  })


  const setScore = async(point) =>{
    await userStore.setScore(point)
  }
  
  const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  
  const handleCellClick = (index) => {
    if (board.value[index] !== '' || !gameActive.value) return;
  
    board.value[index] = 'X';
    checkResult();
  
    if (gameActive.value) {
      botPlay();
    }
  };
  
  const checkResult = () => {
    let roundWon = false; 
    let winner = null;
  
    for (let condition of winningConditions) { 
      const [a, b, c] = condition.map(index => board.value[index]);
      if (a === '' || b === '' || c === '') continue; 
      if (a === b && b === c) { 
        roundWon = true;
        winner = a; 
        break;
      }
    }
  
    if (roundWon) { 
      gameActive.value = false;
      if (winner === 'X') { 
        playerScore.value++; 
        consecutiveWins.value++; 
        message.value = 'คุณชนะ!'; 
        setScore(1)
        if (consecutiveWins.value === 3) { 
          playerScore.value++;
          setScore(1)
          consecutiveWins.value = 0; 
        }
      } else if (winner === 'O') { 
        playerScore.value--; 
        consecutiveWins.value = 0;
        message.value = 'คุณแพ้!';
        setScore(-1)
      }
      
      return;
    }
  
    if (!board.value.includes('')) {
      message.value = 'เสมอ!';
      gameActive.value = false;
    }
  };
  
  const botPlay = () => {
    const availableCells = board.value.map((cell, index) => (cell === '' ? index : null)).filter(val => val !== null);
    if (availableCells.length > 0) {
      const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
      board.value[randomIndex] = 'O';
      checkResult();
    }
  };
  
  const restartGame = () => {
    board.value = Array(9).fill('');
    gameActive.value = true;
    message.value = '';
  };

  const handleSignOut = () => {
    signOut(auth).then(async () =>{
      await userStore.clearCurrentUser();
      router.push('/')
    })
  } 
  
  </script>
  
  <style scoped>
  #game-container {
    text-align: center;
  }
  
  #board {
    display: grid;
    grid-template-columns: repeat(3, 100px);
    grid-gap: 5px;
    place-content: center;
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
  