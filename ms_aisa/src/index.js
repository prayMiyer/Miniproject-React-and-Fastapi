import { configureStore } from "@reduxjs/toolkit";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import loginSystemSummonSlice from "./site/layout/menu/loginSystemSummonSlice";
import memberSlice from "./site/memberSlice";
import snsPostUpdateFormSlice from "./site/content/sns/snsPostUpdateFormSlice";

const ms_aisa_store = configureStore({
    reducer: {
        lsss: loginSystemSummonSlice,
        ms: memberSlice,
        spufs: snsPostUpdateFormSlice,
    },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider store={ms_aisa_store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
