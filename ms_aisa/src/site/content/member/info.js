import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
    isEmpty,
    isNotType,
    lessThan,
    notContains,
    notEqual,
} from "../../../ssy/ssyValidCheckerReact";
import { loginCheck } from "../../main";

const MemberInfo = () => {
    const loginMember = useSelector((s) => s.ms.loginMember);
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
    memberFD.append("pw", member.pw);
    memberFD.append("name", member.name);
    memberFD.append("addr1", member.addr1);
    memberFD.append("addr2", member.addr2);
    memberFD.append("addr3", member.addr3);
    memberFD.append("psa", member.psa);
    const [psaURL, setPsaURL] = useState();

    useEffect(() => {
        setMember({
            ...loginMember,
            addr1: loginMember.address.split("!")[2],
            addr2: loginMember.address.split("!")[0],
            addr3: loginMember.address.split("!")[1],
            psa: "",
        });
        setPsaURL(
            `http://localhost:9999/member.psa.get?psa=${loginMember.psa}`
        );
    }, []);

    const bye = () => {
        if (window.prompt("진짜 탈퇴하려면 탈퇴라고 입력") === "탈퇴") {
            axios
                .get(
                    `http://localhost:9999/member.bye?member=${sessionStorage.getItem(
                        "loginMember"
                    )}`
                )
                .then((res) => {
                    sessionStorage.removeItem("loginMember");
                    loginCheck();
                });
        }
    };

    const changeMember = (e) => {
        if (e.target.name === "psa") {
            setMember({ ...member, psa: e.target.files[0] });
            if (e.target.files[0] !== undefined) {
                const reader = new FileReader();
                reader.readAsDataURL(e.target.files[0]);
                reader.onloadend = () => {
                    setPsaURL(reader.result);
                };
            } else {
                setMember({ ...member, psa: "" });
            }
        } else {
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

    const update = () => {
        if (validCheck()) {
            memberFD.append("member", sessionStorage.getItem("loginMember"));
            if (member.psa === "") {
                axios
                    .post(
                        "http://localhost:9999/member.update.no.psa",
                        memberFD,
                        {
                            withCredentials: true,
                        }
                    )
                    .then((res) => {
                        alert(res.data.result);
                        if (res.data.result === "수정 성공") {
                            sessionStorage.setItem(
                                "loginMember",
                                res.data.member
                            );
                        }
                        loginCheck();
                    });
            } else {
                axios
                .post("http://localhost:9999/member.update", memberFD, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                })
                .then((res) => {
                        alert(res.data.result);
                        if (res.data.result === "수정 성공") {
                            sessionStorage.setItem(
                                "loginMember",
                                res.data.member
                            );
                        }
                        loginCheck();
                    });
            }
        }
    };

    const validCheck = () => {
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
        if (isEmpty(member.psa)) {
            return true;
        }
        if (
            isNotType(member.psa, "png") &&
            isNotType(member.psa, "gif") &&
            isNotType(member.psa, "jpg") &&
            isNotType(member.psa, "bmp")
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
                <td align="center" style={{ fontSize: "25pt" }}>
                    {member.id}
                </td>
            </tr>
            <tr>
                <td align="center">
                    <input
                        ref={(thisInput) =>
                            (memberInput.current.pw = thisInput)
                        }
                        name="pw"
                        type="password"
                        value={member.pw}
                        className="textTypeInput"
                        onChange={changeMember}
                        autoComplete="off"
                        maxLength={10}
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
                        type="password"
                        value={member.pwChk}
                        className="textTypeInput"
                        onChange={changeMember}
                        autoComplete="off"
                        maxLength={10}
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
                        className="textTypeInput"
                        onChange={changeMember}
                        autoComplete="off"
                        maxLength={10}
                    />
                </td>
            </tr>
            <tr>
                <td>
                    <table>
                        <tr>
                            <td className="textTypeInput">
                                생년월일 : {member.birthday}
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
                        className="textTypeInput"
                        value={member.addr1}
                        onClick={showAddrSearchSystem}
                        readOnly
                        placeholder="우편번호"
                    />
                    <br />
                    <input
                        ref={(thisInput) =>
                            (memberInput.current.addr2 = thisInput)
                        }
                        className="textTypeInput"
                        value={member.addr2}
                        onClick={showAddrSearchSystem}
                        readOnly
                        placeholder="주소"
                    />
                    <br />
                    <input
                        ref={(thisInput) =>
                            (memberInput.current.addr3 = thisInput)
                        }
                        name="addr3"
                        className="textTypeInput"
                        value={member.addr3}
                        placeholder="상세주소"
                        onChange={changeMember}
                        maxLength={30}
                        autoComplete="off"
                    />
                </td>
            </tr>
            <tr>
                <td align="center">
                    <table>
                        <tr>
                            <td className="textTypeInput">
                                프사
                                <br />
                                <br />
                                <img
                                    style={{ maxWidth: "50%" }}
                                    src={psaURL}
                                    alt=""
                                />
                                <br />
                                <input
                                    ref={(thisInput) =>
                                        (memberInput.current.psa = thisInput)
                                    }
                                    type="file"
                                    name="psa"
                                    onChange={changeMember}
                                />
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td align="center">
                    <button onClick={update} style={{ width: "30%" }}>
                        수정
                    </button>
                    <button onClick={bye} style={{ width: "30%" }}>
                        탈퇴
                    </button>
                </td>
            </tr>
        </table>
    );
};

export default MemberInfo;
