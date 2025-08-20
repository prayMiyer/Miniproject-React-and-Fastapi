import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import de from "./img/delete.png";
import ed from "./img/editDocu.png";
import f from "./img/folder.png";
import { getPosts } from "./sns";
import { setContent, summonSPUFS } from "./snsPostUpdateFormSlice";
import SNSReply from "./snsReply";

const SNSPost = (props) => {
    let btnTd;
    const d = useDispatch();
    const [postCSS, setPostCSS] = useState({ opacity: 1 });
    const [replyTxt, setReplyTxt] = useState("");
    const loginMember = useSelector((s) => s.ms.loginMember);
    const [txtCSS, setTxtCSS] = useState({ opacity: 1 });
    const [replys, setReplys] = useState(props.replys);
    const snsReplys = replys.map((r, i) => (
        <SNSReply color={props.color} no={r.no} writer={r.writer} date={r.date}>
            {r.txt}
        </SNSReply>
    ));

    const del = () => {
        if (window.confirm("삭제?")) {
            axios
                .get(`http://localhost:9999/sns.post.delete?no=${props.no}`)
                .then((res) => {
                    alert(res.data.result);
                    getPosts();
                });
        }
    };

    const hidePost = () => {
        setPostCSS({ opacity: 0 });
    };

    const hideTxt = () => {
        setTxtCSS({ opacity: 0 });
    };

    const showPost = () => {
        setPostCSS({ opacity: 1 });
    };

    const showTxt = () => {
        setTxtCSS({ opacity: 1 });
    };

    const summonUpdateForm = () => {
        d(
            setContent({
                no: props.no,
                writer: props.writer,
                txt: props.children,
            })
        );
        d(summonSPUFS());
    };

    const writeReply = () => {
        axios
            .get(
                `http://localhost:9999/sns.post.reply.write?postNo=${
                    props.no
                }&txt=${replyTxt}&member=${sessionStorage.getItem(
                    "loginMember"
                )}`
            )
            .then((res) => {
                alert(JSON.stringify(res.data));
                setReplyTxt("");
                getPosts();
            });
    };

    if (loginMember === undefined) {
        return null;
    } else if (loginMember.id === props.writer) {
        btnTd = (
            <td
                align="right"
                className="titleBlankTd"
                style={{ backgroundColor: props.color + "db" }}
            >
                <img
                    src={ed}
                    alt=""
                    onClick={summonUpdateForm}
                    onMouseEnter={hideTxt}
                    onMouseLeave={showTxt}
                />
                <img
                    src={de}
                    alt=""
                    onClick={del}
                    onMouseEnter={hidePost}
                    onMouseLeave={showPost}
                />
            </td>
        );
    } else {
        btnTd = (
            <td
                align="right"
                className="titleBlankTd"
                style={{ backgroundColor: props.color + "db" }}
            ></td>
        );
    }
    return (
        <table className="aSNSPost" style={postCSS}>
            <tr>
                <td
                    className="titleTd"
                    style={{ backgroundColor: props.color + "db" }}
                >
                    <table>
                        <tr>
                            <td className="idTd">
                                <table>
                                    <tr>
                                        <td>
                                            <img
                                                src={f}
                                                alt=""
                                                className="folder"
                                            />
                                        </td>
                                        <td className="id">{props.writer}</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
                {btnTd}
            </tr>
            <tr>
                <td colSpan={2} className="txtArea">
                    <table className="txtArea2">
                        <tr>
                            <td className="psaTd" align="center" valign="top">
                                <br />
                                <img className="psa" src={props.psa} alt="" />
                            </td>
                            <td className="txt">
                                <div class="txt2" style={txtCSS}>
                                    {props.children}
                                </div>
                                <hr />
                                {snsReplys}

                                <table className="aSNSReply">
                                    <tr>
                                        <td
                                            className="writer"
                                            style={{ color: props.color }}
                                        >
                                            {loginMember.id}&nbsp;
                                        </td>
                                        <td>
                                            <input
                                                style={{
                                                    borderBottom:
                                                        props.color +
                                                        " solid 2px",
                                                }}
                                                value={replyTxt}
                                                onChange={(e) => {
                                                    setReplyTxt(e.target.value);
                                                }}
                                                autoComplete="off"
                                                placeholder="댓글"
                                                maxLength={200}
                                            />
                                            &nbsp;
                                        </td>
                                        <td>
                                            <button onClick={writeReply}>
                                                쓰기
                                            </button>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    );
};

export default SNSPost;
