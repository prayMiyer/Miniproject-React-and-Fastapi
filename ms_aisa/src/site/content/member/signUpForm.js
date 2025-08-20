import axios from "axios";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    containsHS,
    isEmpty,
    isNotNum,
    isNotType,
    lessThan,
    notContains,
    notEqual,
} from "../../../ssy/ssyValidCheckerReact";
import { setSignUpPage } from "../../memberSlice";

const SignUpForm = () => {
    const d = useDispatch();
    const [member, setMember] = useState({
        id: "",
        pw: "",
        pwChk: "",
        name: "",
        jumin1: "",
        jumin2: "",
        addr1: "",
        addr2: "",
        addr3: "",
        psa: "",
    });
    const memberInput = useRef({});
    const memberFD = new FormData();
    memberFD.append("id", member.id);
    memberFD.append("pw", member.pw);
    memberFD.append("name", member.name);
    memberFD.append("jumin1", member.jumin1);
    memberFD.append("jumin2", member.jumin2);
    memberFD.append("addr1", member.addr1);
    memberFD.append("addr2", member.addr2);
    memberFD.append("addr3", member.addr3);
    memberFD.append("psa", member.psa);
    const navi = useNavigate();
    const [idInputCSS, setIdInputCSS] = useState({ color: "white" });

    const changeMember = (e) => {
        if (e.target.name === "psa") {
            setMember({ ...member, psa: e.target.files[0] });
        } else {
            if (e.target.name === "id") {
                axios
                    .get(
                        `http://localhost:9999/member.id.check?id=${e.target.value}`
                    )
                    .then((res) => {
                        if (res.data.result === "존재하는 ID") {
                            setIdInputCSS({ color: "red" });
                        } else {
                            setIdInputCSS({ color: "white" });
                        }
                    });
            }
            setMember({ ...member, [e.target.name]: e.target.value });
        }
    };

    const showAddrSearchSystem = () => {
        new window.daum.Postcode({
            oncomplete: function (data) {
                setMember({
                    ...member,
                    addr1: data.zonecode,
                    addr2: data.roadAddress,
                });
            },
        }).open();
    };

    const signUp = () => {
        if (validCheck()) {
            axios
                .post("http://localhost:9999/sign.up", memberFD, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                })
                .then((res) => {
                    alert(res.data.result);
                    navi("/");
                    d(setSignUpPage(false));
                });
        }
    };

    const validCheck = () => {
        if (
            isEmpty(member.id) ||
            containsHS(member.id) ||
            idInputCSS.color === "red"
        ) {
            alert("ID?");
            setMember({ ...member, id: "" });
            memberInput.current.id.value = "";
            memberInput.current.id.focus();
            return false;
        }
        if (
            isEmpty(member.pw) ||
            lessThan(member.pw, 4) ||
            notEqual(member.pw, member.pwChk) ||
            notContains(member.pw, "1234567890")
        ) {
            alert("PW?");
            setMember({ ...member, pw: "" });
            memberInput.current.pw.value = "";
            memberInput.current.pwChk.value = "";
            memberInput.current.pw.focus();
            return false;
        }
        if (isEmpty(member.name)) {
            alert("이름?");
            setMember({ ...member, name: "" });
            memberInput.current.name.focus();
            return false;
        }
        if (
            isEmpty(member.jumin1) ||
            isEmpty(member.jumin2) ||
            isNotNum(member.jumin1) ||
            isNotNum(member.jumin2) ||
            lessThan(member.jumin1, 6) ||
            lessThan(member.jumin2, 1)
        ) {
            alert("주민번호?");
            setMember({ ...member, jumin1: "", jumin2: "" });
            memberInput.current.jumin1.value = "";
            memberInput.current.jumin2.value = "";
            memberInput.current.jumin1.focus();
            return false;
        }
        if (
            isEmpty(member.addr1) ||
            isEmpty(member.addr2) ||
            isEmpty(member.addr3)
        ) {
            alert("주소?");
            setMember({ ...member, addr1: "", addr2: "", addr3: "" });
            memberInput.current.addr1.value = "";
            memberInput.current.addr2.value = "";
            memberInput.current.addr3.value = "";
            memberInput.current.addr3.focus();
            return false;
        }
        if (
            isEmpty(member.psa) ||
            (isNotType(member.psa, "png") &&
                isNotType(member.psa, "gif") &&
                isNotType(member.psa, "jpg") &&
                isNotType(member.psa, "bmp"))
        ) {
            alert("프사?");
            setMember({ ...member, psa: "" });
            memberInput.current.psa.value = "";
            return false;
        }
        return true;
    };

    return (
        <table id="signUpForm">
            <tr>
                <td align="center">
                    <input
                        style={idInputCSS}
                        ref={(thisInput) =>
                            (memberInput.current.id = thisInput)
                        }
                        name="id"
                        value={member.id}
                        onChange={changeMember}
                        placeholder="ID"
                        className="textTypeInput"
                        maxLength={10}
                        autoComplete="off"
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
                        placeholder="PW(숫자 하나이상)"
                        className="textTypeInput"
                        type="password"
                        maxLength={10}
                        autoComplete="off"
                    />
                </td>
            </tr>
            <tr>
                <td align="center">
                    <input
                        ref={(thisInput) =>
                            (memberInput.current.pwChk = thisInput)
                        }
                        name="pwChk"
                        value={member.pwChk}
                        onChange={changeMember}
                        placeholder="PW확인"
                        className="textTypeInput"
                        type="password"
                        maxLength={10}
                        autoComplete="off"
                    />
                </td>
            </tr>
            <tr>
                <td align="center">
                    <input
                        ref={(thisInput) =>
                            (memberInput.current.name = thisInput)
                        }
                        name="name"
                        value={member.name}
                        onChange={changeMember}
                        placeholder="이름"
                        className="textTypeInput"
                        maxLength={10}
                        autoComplete="off"
                    />
                </td>
            </tr>
            <tr>
                <td>
                    <table>
                        <tr>
                            <td className="textTypeInput">
                                주민번호 :{" "}
                                <input
                                    ref={(thisInput) =>
                                        (memberInput.current.jumin1 = thisInput)
                                    }
                                    name="jumin1"
                                    value={member.jumin1}
                                    onChange={changeMember}
                                    placeholder="XXXXXX"
                                    className="juminNoInput1"
                                    maxLength={6}
                                    autoComplete="off"
                                />{" "}
                                -{" "}
                                <input
                                    ref={(thisInput) =>
                                        (memberInput.current.jumin2 = thisInput)
                                    }
                                    name="jumin2"
                                    value={member.jumin2}
                                    onChange={changeMember}
                                    placeholder="X"
                                    className="juminNoInput2"
                                    maxLength={1}
                                    autoComplete="off"
                                />
                                XXXXXX
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td align="center">
                    <input
                        ref={(thisInput) =>
                            (memberInput.current.addr1 = thisInput)
                        }
                        value={member.addr1}
                        onClick={showAddrSearchSystem}
                        readOnly
                        placeholder="우편번호"
                        className="textTypeInput"
                    />
                    <br />
                    <input
                        ref={(thisInput) =>
                            (memberInput.current.addr2 = thisInput)
                        }
                        value={member.addr2}
                        onClick={showAddrSearchSystem}
                        readOnly
                        placeholder="주소"
                        className="textTypeInput"
                    />
                    <br />
                    <input
                        ref={(thisInput) =>
                            (memberInput.current.addr3 = thisInput)
                        }
                        name="addr3"
                        value={member.addr3}
                        onChange={changeMember}
                        placeholder="상세주소"
                        className="textTypeInput"
                        maxLength={30}
                        autoComplete="off"
                    />
                    <br />
                </td>
            </tr>
            <tr>
                <td align="center">
                    <table>
                        <tr>
                            <td className="textTypeInput">
                                프사 :
                                <input
                                    ref={(thisInput) =>
                                        (memberInput.current.psa = thisInput)
                                    }
                                    name="psa"
                                    onChange={changeMember}
                                    className="fileTypeInput"
                                    type="file"
                                />
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td align="center">
                    <button onClick={signUp}>가입</button>
                </td>
            </tr>
        </table>
    );
};

export default SignUpForm;
