import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    position: "fixed",
    transition: "all 0.2s ease-in",
    bottom: -400,
    width: 300,
    height: 400,
    opacity: 0,
    backgroundColor: "#ffffffaa",
};

const loginSystemSummonSlice = createSlice({
    name: "lss",
    initialState,
    reducers: {
        summon: (curState) => {
            if (curState.bottom === -400) {
                curState.bottom = 50;
                curState.opacity = 1;
            } else {
                curState.bottom = -400;
                curState.opacity = 0;
            }
        },
        hide: (curState) => {
            curState.bottom = -400;
            curState.opacity = 0;
        },
    },
});

export const { summon, hide } = loginSystemSummonSlice.actions;

export default loginSystemSummonSlice.reducer;
