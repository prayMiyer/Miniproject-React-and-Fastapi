import axios from "axios";
import { useEffect, useState } from "react";
import e from "./img/edit.png";
import s from "./img/search.png";
import SNSPost from "./snsPost";
import SNSPostUpdateForm from "./snsPostUpdateForm";

export let getPosts;

const SNS = () => {
    const [borderCSS, setBorderCSS] = useState({
        border: "black solid 5px",
    });
    const [borderCSS2, setBorderCSS2] = useState({ backgroundColor: "black" });
    const [fontColorCSS, setFontColorCSS] = useState({ color: "black" });
    const [pageCount, setPageCount] = useState();
    const [page, setPage] = useState(1);
    const [post, setPost] = useState({ color: "000000", txt: "" });
    const [posts, setPosts] = useState([]);
    const [searchTxt, setSearchTxt] = useState("");
    const snsPosts = posts.map((p, i) => {
        return (
            <SNSPost
                no={p.no}
                writer={p.writer}
                psa={`http://localhost:9999/member.psa.get?psa=${p.psa}`}
                color={p.color}
                replys={p.replys}
            >
                {p.txt}
            </SNSPost>
        );
    });

    useEffect(() => {
        getPosts();

        return () => {};
    }, [page]);

    const changePost = (e) => {
        setPost({ ...post, [e.target.name]: e.target.value });
        if (e.target.name === "color") {
            setBorderCSS({ border: "#" + e.target.value + " solid 5px" });
            setFontColorCSS({ color: "#" + e.target.value });
            setBorderCSS2({ backgroundColor: "#" + e.target.value });
        }
    };

    const goNextPage = () => {
        if (page !== pageCount) {
            setPage(page + 1);
        }
    };

    const goPrevPage = () => {
        if (page !== 1) {
            setPage(page - 1);
        }
    };

    getPosts = () => {
        axios
            .get(
                `http://localhost:9999/sns.post.get?page=${page}&search=${searchTxt}`
            )
            .then((res) => {
                setPosts(res.data.posts);
                setPageCount(res.data.pageCount);
            });
    };

    const searchPost = () => {
        if (page === 1) {
            getPosts();
        } else {
            setPage(1);
        }
    };

    const writePost = () => {
        if (post.txt !== "") {
            axios
                .get(
                    `http://localhost:9999/sns.post.write?color=${
                        post.color
                    }&txt=${JSON.stringify(
                        post.txt
                    )}&member=${sessionStorage.getItem("loginMember")}`
                )
                .then((res) => {
                    alert(res.data.result);
                    if (page === 1) {
                        getPosts();
                    } else {
                        setPage(1);
                    }
                    setPost({ color: "000000", txt: "" });
                    setBorderCSS({
                        border: "#000000 solid 5px",
                    });
                    setFontColorCSS({ color: "#000000" });
                    setBorderCSS2({ backgroundColor: "#000000" });
                });
        }
    };

    return (
        <>
            {snsPosts}
            <div id="snsPostBlankArea" />
            <div id="snsPageL" onClick={goPrevPage} />
            <div id="snsPageR" onClick={goNextPage} />
            <table id="snsWriteArea">
                <tr>
                    <td align="center">
                        <table id="snsWriteArea2" style={borderCSS}>
                            <tr>
                                <td align="center">
                                    <input
                                        class="searchInput"
                                        placeholder="검색"
                                        value={searchTxt}
                                        onChange={(e) => {
                                            setSearchTxt(e.target.value);
                                        }}
                                        onKeyUp={(e) => {
                                            if (e.key === "Enter") {
                                                searchPost();
                                            }
                                        }}
                                    />
                                </td>
                                <td align="center">
                                    <img src={s} alt="" onClick={searchPost} />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2} style={borderCSS2}></td>
                            </tr>
                            <tr>
                                <td style={fontColorCSS}>
                                    &nbsp;#
                                    <input
                                        style={fontColorCSS}
                                        name="color"
                                        value={post.color}
                                        onChange={changePost}
                                        maxLength={6}
                                        autoComplete="off"
                                    />
                                </td>
                                <td align="center" rowSpan={2}>
                                    <img src={e} alt="" onClick={writePost} />
                                </td>
                            </tr>
                            <tr>
                                <td align="center">
                                    <textarea
                                        name="txt"
                                        value={post.txt}
                                        onChange={changePost}
                                        maxLength={300}
                                        autoComplete="off"
                                        placeholder="내용"
                                    ></textarea>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            <SNSPostUpdateForm />
        </>
    );
};

export default SNS;
