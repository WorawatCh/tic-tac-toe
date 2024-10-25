  
<script setup>
import { ref } from "vue";
import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth"
import { useRouter } from "vue-router";
import {useUserStore} from '../stores/user'

const userStore = useUserStore()
const router = useRouter()
  const login = () => {
    const provider = new GoogleAuthProvider()
    signInWithPopup(getAuth(),provider)
    .then((result) => {
      if(userStore.userList.length==0 || userStore.userList.some(item => item.uid !== result.user.uid)){
        console.log('in')
        userStore.createUser(result.user)
      }
      router.push('/game')
    }).catch((error) =>{

    })
  };
</script>

<template>
    <div>
      <h1>Login</h1>
      <button @click="login">Login with Google</button>
    </div>
  </template>