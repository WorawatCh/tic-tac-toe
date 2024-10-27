  
<script setup>
import { ref,onMounted } from "vue";
import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth"
import { useRouter } from "vue-router";
import {useUserStore} from '../stores/user'

const userStore = useUserStore()
const router = useRouter()

onMounted(async () => {
  await userStore.getAllUser()
});

  const login = async () => {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(getAuth(),provider)
    .then(async (result) => {
      const existingUser = userStore.users.find(u => u.uid === result.user.uid);
      if (existingUser) {
      // ถ้ามีข้อมูลผู้ใช้ ให้ตั้งค่าผู้ใช้คนปัจจุบัน
      await userStore.setCurrentUser(existingUser);
      console.log('Logged in user:', userStore.currentUser);
    } else {
      // ถ้าไม่มีข้อมูลผู้ใช้ ให้สร้างผู้ใช้ใหม่
      const newUser = {
        uid: result.user.uid,
        name: result.user.displayName,
        score: 0, // ตั้งค่าคะแนนเริ่มต้น
      };
      await userStore.createUser(newUser);
    }
     
      router.push('/game')
    }).catch((error) =>{
      console.error('Error during login:', error);
    })
  };
</script>

<template>
    <div>
      <h1>Login</h1>
      <button @click="login">Login with Google</button>
    </div>
  </template>