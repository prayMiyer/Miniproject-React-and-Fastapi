import { Link } from "react-router-dom";

const Title = () => {
    return (
        <table id="siteTitleArea">
            <tr>
                <td align="center">
                    <table id="siteTitle">
                        <tr>
                            <td>
                                <Link to="/">
                                    [Microsoft] 인공지능 SW 아카데미
                                </Link>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    );
};

export default Title;
