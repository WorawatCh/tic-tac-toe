import { defineStore } from "pinia";
import axios from 'axios'

export const useUserStore = defineStore('user',{
    state: () => ({
        currentUser:null,
        users: []
    }),
    actions: {
        async setScore(point){
            this.currentUser.score += point
            try {
                const response =  await axios.put(`https://671b5f142c842d92c37f9c6f.mockapi.io/user/${this.currentUser.id}`,this.currentUser)
                this.currentUser.score = response.data.score
              } catch (error) {
                console.error('Error fetching users:', error);
              }
        },
        setCurrentUser(user){
            this.currentUser = user;
        },
        async clearCurrentUser() {
            this.currentUser = null;
          },
        async createUser(user){
            try {
                const response =  await axios.post("https://671b5f142c842d92c37f9c6f.mockapi.io/user",user)
                this.currentUser={}
                this.currentUser.uid = response.data.uid
                this.currentUser.score = 0
                this.currentUser.name = response.data.name
              } catch (error) {
                console.error('Error fetching users:', error);
              }
        },
        async getAllUser(){
            try {
                const response = await axios.get("https://671b5f142c842d92c37f9c6f.mockapi.io/user")
                this.users = response.data; // เก็บข้อมูลผู้ใช้ทั้งหมดใน state
              } catch (error) {
                console.error('Error fetching users:', error);
              }
            
        },
        async fetchCurrentUser(id) {
            try {
              const response = await axios.get(`https://671b5f142c842d92c37f9c6f.mockapi.io/user/${id}`);
              console.log(response)
              this.currentUser = response.data;
            } catch (error) {
              console.error('Error fetching current user:', error);
            }
          },
        async isUserExists(uid){
            const allUser = await this.getAllUser()
            console.log('allUser',allUser)
            
        }
    }
})