import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    css: {
        top: "-100%",
        left: "-100%",
    },
    content: {
        no: "",
        writer: "",
        txt: "",
    },
};

const snsPostUpdateFormSlice = createSlice({
    name: "spufs",
    initialState,
    reducers: {
        summonSPUFS: (state, action) => {
            state.css = {
                top: 0,
                left: 0,
            };
        },
        hideSPUFS: (state, action) => {
            state.css = {
                top: "-100%",
                left: "-100%",
            };
        },
        setContent: (state, action) => {
            state.content = {
                no: action.payload.no,
                writer: action.payload.writer,
                txt: action.payload.txt,
            };
        },
    },
});

export const { summonSPUFS, hideSPUFS, setContent } =
    snsPostUpdateFormSlice.actions;

export default snsPostUpdateFormSlice.reducer;
