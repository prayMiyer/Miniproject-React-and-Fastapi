const SNSReply = (props) => {
    return (
        <table className="aSNSReply">
            <tr>
                <td className="writer" style={{ color: props.color }}>
                    {props.writer}&nbsp;
                </td>
                <td>{props.children}&nbsp;</td>
                <td>{props.date}</td>
                <td>
                    <button>수정</button>
                    <button>삭제</button>
                </td>
            </tr>
        </table>
    );
};

export default SNSReply;
