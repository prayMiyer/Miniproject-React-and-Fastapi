import axios from "axios";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { isEmpty } from "../../../../ssy/ssyValidCheckerReact";
import { loginCheck } from "../../../main";
import { setSignUpPage } from "../../../memberSlice";
import { summon } from "../loginSystemSummonSlice";

const LoginForm = () => {
    const d = useDispatch();
    const [member, setMember] = useState({ id: "", pw: "" });
    const memberFd = new FormData();
    memberFd.append("id", member.id);
    memberFd.append("pw", member.pw);
    const memberInput = useRef({});
    const navi = useNavigate();

    const changeMember = (e) => {
        setMember({ ...member, [e.target.name]: e.target.value });
    };

    const goSignUp = () => {
        navi("/sign.up.go");
        d(summon());
        d(setSignUpPage(true));
    };

    const signIn = () => {
        d(setSignUpPage(false));
        if (isEmpty(member.id) || isEmpty(member.pw)) {
            alert("?");
            memberInput.current.id.focus();
        } else {
            axios
                .post("http://localhost:9999/sign.in", memberFd, {
                    withCredentials: true,
                })
                .then((res) => {
                    if (res.data.result === "로그인 성공") {
                        sessionStorage.setItem("loginMember", res.data.member);
                        loginCheck();
                    } else {
                        alert(res.data.result);
                    }
                });
        }
        setMember({ id: "", pw: "" });
        memberInput.current.id.value = "";
        memberInput.current.pw.value = "";
    };

    return (
        <table id="loginForm">
            <tr>
                <td align="center">
                    <input
                        ref={(thisInput) =>
                            (memberInput.current.id = thisInput)
                        }
                        name="id"
                        value={member.id}
                        onChange={changeMember}
                        autoComplete="off"
                        maxLength={10}
                        placeholder="ID"
                    />
                </td>
            </tr>
            <tr>
                <td align="center">
                    <input
                        ref={(thisInput) =>
                            (memberInput.current.pw = thisInput)
                        }
                        name="pw"
                        value={member.pw}
                        onChange={changeMember}
                        onKeyUp={(e) => {
                            if (e.key === "Enter") {
                                signIn();
                            }
                        }}
                        autoComplete="off"
                        maxLength={10}
                        type="password"
                        placeholder="PW"
                    />
                </td>
            </tr>
            <tr>
                <td align="center">
                    <button onClick={signIn}>로그인</button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <button onClick={goSignUp}>회원가입</button>
                </td>
            </tr>
        </table>
    );
};

export default LoginForm;
