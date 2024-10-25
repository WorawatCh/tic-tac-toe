  
<script setup>
import { ref } from "vue";
import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth"
import { useRouter } from "vue-router";

const router = useRouter()
  const login = () => {
    const provider = new GoogleAuthProvider()
    signInWithPopup(getAuth(),provider)
    .then((result) => {
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