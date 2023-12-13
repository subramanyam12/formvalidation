import { createSlice } from "@reduxjs/toolkit";

const ProfileSlice = createSlice({
    name:'profile',
    initialState:[],
    reducers:{
        addprofile :(state,payload)=>{
            if(payload.payload){
             state[0]=payload.payload
            }else{
                state.length && state.pop()
            }
        }
    }
})

export const {addprofile} =ProfileSlice.actions
export default ProfileSlice.reducer