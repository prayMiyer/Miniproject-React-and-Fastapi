import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginCheck } from "../../../main";

const Logined = () => {
    const loginMember = useSelector((s) => s.ms.loginMember);
    const navi = useNavigate();

    const goMemberInfoPage = () => {
        navi("/member.info.go");
    };

    const logout = () => {
        sessionStorage.removeItem("loginMember");
        loginCheck();
    };

    return (
        <table id="loginedTbl">
            <tr>
                <td rowSpan={2} class="imgTd" align="center">
                    <img
                        src={`http://localhost:9999/member.psa.get?psa=${loginMember.psa}`}
                        alt=""
                    />
                </td>
                <td class="idTd">{loginMember.id}</td>
            </tr>
            <tr>
                <td align="right">
                    <button onClick={goMemberInfoPage}>정보확인</button>
                    &nbsp;&nbsp;
                    <button onClick={logout}>로그아웃</button>
                </td>
            </tr>
        </table>
    );
};

export default Logined;
