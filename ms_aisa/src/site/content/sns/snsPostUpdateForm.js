import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import c from "./img/close.png";
import e from "./img/editWhite.png";
import { getPosts } from "./sns";
import { hideSPUFS, setContent } from "./snsPostUpdateFormSlice";

const SNSPostUpdateForm = () => {
    const spufsData = useSelector((s) => s.spufs);
    const d = useDispatch();

    const close = () => {
        d(hideSPUFS());
    };

    const changeSpufsTxt = (e) => {
        d(setContent({ ...spufsData.content, txt: e.target.value }));
    };

    const updatePost = () => {
        if (spufsData.content.txt !== "") {
            axios
                .get(
                    `http://localhost:9999/sns.post.update?no=${
                        spufsData.content.no
                    }&txt=${JSON.stringify(
                        spufsData.content.txt
                    )}&member=${sessionStorage.getItem("loginMember")}`
                )
                .then((res) => {
                    alert(res.data.result);
                    d(hideSPUFS());
                    getPosts();
                });
        }
    };

    return (
        <table id="snsPostUpdateArea" style={spufsData.css}>
            <tr>
                <td align="center">
                    <table id="snsPostUpdateForm">
                        <tr>
                            <td className="id">{spufsData.content.writer}</td>
                            <td align="center">
                                <img src={c} alt="" onClick={close} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <textarea
                                    value={spufsData.content.txt}
                                    onChange={changeSpufsTxt}
                                    maxLength={300}
                                    autoComplete="off"
                                    placeholder="내용"
                                />
                            </td>
                            <td align="center" rowSpan={2}>
                                <img src={e} alt="" onClick={updatePost} />
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    );
};

export default SNSPostUpdateForm;
