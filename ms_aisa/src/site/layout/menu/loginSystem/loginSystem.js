import { useSelector } from "react-redux";
import axiosLogo from "../img/logo/axios.png";
import fastAPILogo from "../img/logo/fastAPI.png";
import oracleDBLogo from "../img/logo/oracleDB.png";
import jwtLogo from "../img/logo/jwt.png";
import reactLogo from "../img/logo/react.png";
import reduxLogo from "../img/logo/redux.png";
import LoginForm from "./loginForm";
import Logined from "./logined";

const LoginSystem = () => {
    const loginSystemCSS = useSelector((s) => s.lsss);
    const loginMember = useSelector((s) => s.ms.loginMember);
    let loginPage = null;
    if (loginMember === undefined) {
        loginPage = <LoginForm />;
    } else {
        loginPage = <Logined />;
    }

    return (
        <table id="loginSystem" style={loginSystemCSS}>
            <tr>
                <td valign="top" align="center">
                    {loginPage}
                </td>
            </tr>
            <tr>
                <td valign="bottom" align="center">
                    <img
                        className="techLogo"
                        src={reactLogo}
                        style={{ height: 40 }}
                        alt=""
                    />
                    <img className="techLogo" src={reduxLogo} alt="" />
                    <img className="techLogo" src={axiosLogo} alt="" />
                    <br />
                    <img className="techLogo" src={jwtLogo} alt="" />
                    <img className="techLogo" src={fastAPILogo} alt="" />
                    <img
                        className="techLogo"
                        src={oracleDBLogo}
                        style={{ width: 45, margin: 0 }}
                        alt=""
                    />
                </td>
            </tr>
        </table>
    );
};

export default LoginSystem;
