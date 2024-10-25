import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Game from '../views/Game.vue';
import {getAuth, onAuthStateChanged} from "firebase/auth"

const routes = [
  { path: '/', component: Login },
  { path: '/game', 
    component: Game ,
    meta:{
      requireAuth: true,
    }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const getCurrentUser = () => {
  return new Promise((resolve, reject) =>{
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) =>{
        removeListener()
        resolve(user)
      }
      ,reject
    )
  })
}

router.beforeEach(async(to, from, next) => {
  if(to.matched.some((record) => record.meta.requireAuth)){
    if(await getCurrentUser()){
      next()
    } else{
      alert("Please log in")
      next("/")
    }
  } else{
    next()
  }
});

export default router;