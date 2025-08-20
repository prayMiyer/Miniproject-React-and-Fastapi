import { useDispatch } from "react-redux";
import a from "./img/article.png";
import f from "./img/folder.png";
import i from "./img/image.png";
import w from "./img/windows.png";
import LoginSystem from "./loginSystem/loginSystem";
import { hide, summon } from "./loginSystemSummonSlice";
import { useNavigate } from "react-router-dom";

const Menu = () => {
    const d = useDispatch();
    const navi = useNavigate();

    const goSNS = () => {
        navi("/sns.go");
        d(hide());
    };

    const summonLoginSystem = () => {
        d(summon());
    };

    return (
        <>
            <table id="siteMenuArea">
                <tr>
                    <td>
                        <img src={w} alt="" onClick={summonLoginSystem} />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <img src={a} alt="" onClick={goSNS} />
                        <img src={f} alt="" />
                        <img src={i} alt="" />
                    </td>
                </tr>
            </table>

            <LoginSystem />
        </>
    );
};

export default Menu;
