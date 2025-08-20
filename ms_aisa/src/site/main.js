import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Content from "./layout/content/content";
import Menu from "./layout/menu/menu";
import Title from "./layout/title/title";
import Weather from "./layout/weather/weather";
import { setLoginMember } from "./memberSlice";
import { hideSPUFS } from "./content/sns/snsPostUpdateFormSlice";

let d = null;
let navi = null;
let signUpPage = null;
export const loginCheck = () => {
    axios
        .get(
            `http://localhost:9999/member.info.get?member=${sessionStorage.getItem(
                "loginMember"
            )}`
        )
        .then((res) => {
            d(setLoginMember(res.data.member));
            if (!signUpPage && res.data.member === undefined) {
                d(hideSPUFS());
                navi("/");
            } else {
                axios
                    .get(
                        `http://localhost:9999/member.sign.in.exp.update?member=${sessionStorage.getItem(
                            "loginMember"
                        )}`
                    )
                    .then((updateRes) => {
                        sessionStorage.setItem(
                            "loginMember",
                            updateRes.data.member
                        );
                    });
            }
        });
};
const Main = () => {
    d = useDispatch();
    navi = useNavigate();
    signUpPage = useSelector((s) => s.ms.signUpPage);

    useEffect(() => {
        document.addEventListener("click", loginCheck);
        return () => {
            document.removeEventListener("click", loginCheck);
        };
    }, []);

    return (
        <>
            <Title />
            <Content />
            <Menu />
            <Weather />
        </>
    );
};

export default Main;
