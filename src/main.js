import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router';
import 'bootstrap/dist/css/bootstrap.css'
import { createPinia } from 'pinia'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBon5DgJ0TA4PgauqutpzcoJShotaHbdns",
  authDomain: "vue-firebase-auth-9d7bd.firebaseapp.com",
  projectId: "vue-firebase-auth-9d7bd",
  storageBucket: "vue-firebase-auth-9d7bd.appspot.com",
  messagingSenderId: "1039036914865",
  appId: "1:1039036914865:web:76c8815b130bab5c78d690"
};
const pinia = createPinia()

// Initialize Firebase
initializeApp(firebaseConfig);

const app = createApp(App);
app.use(router);
app.use(pinia)
app.mount('#app');

