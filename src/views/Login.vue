  
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
      userStore.setCurrentUser(existingUser);
    } else {
      const newUser = {
        uid: result.user.uid,
        name: result.user.displayName,
        score: 0, 
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