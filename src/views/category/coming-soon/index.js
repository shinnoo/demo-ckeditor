
import Icon from "../../../images/coming_soon.svg"
import { Typography } from "antd";
const ComingSoon = () => {
    const { Title } = Typography;
    return (
        <div>
            <div style={{ textAlign: "center",margin:"50px" }}>
            <Title>Tính năng đang được phát triển, vui lòng thử lại sau</Title>
                <img src={Icon} alt="Coming soon"></img>
            </div>
        </div>
    )
}

export default ComingSoon;