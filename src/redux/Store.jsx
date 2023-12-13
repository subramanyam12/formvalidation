import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./profileslice";

export const Store = configureStore({
    reducer:{
        Profile:profileReducer
    }
})
