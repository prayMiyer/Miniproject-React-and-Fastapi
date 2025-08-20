import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./site/content/home";
import MemberInfo from "./site/content/member/info";
import "./site/content/member/member.css";
import SignUpForm from "./site/content/member/signUpForm";
import "./site/layout/layout.css";
import "./site/layout/menu/loginSystem/login.css";
import Main from "./site/main";
import "./site/content/sns/sns.css";
import SNS from "./site/content/sns/sns";

function App() {
    return (
        <>
            <Routes>
                <Route element={<Main />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/sign.up.go" element={<SignUpForm />} />
                    <Route path="/member.info.go" element={<MemberInfo />} />
                    <Route path="/sns.go" element={<SNS />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
