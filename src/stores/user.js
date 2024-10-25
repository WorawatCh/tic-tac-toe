import { defineStore } from "pinia";
import axios from 'axios'

export const useUserStore = defineStore('user',{
    state: () => ({
        userList:[]
    }),
    actions: {
        setPoint(point){
            // this.score = point
        },
        setUser(uid){
        //    this.uid = uid
        },
        async createUser(user){
            const request ={
                uid:user.uid,
                score:0,
                name:user.displayName
            }
         const response = await axios.post(`https://671b5f142c842d92c37f9c6f.mockapi.io/user`,request)
         this.userList.push(response.data)
        }

    }
})