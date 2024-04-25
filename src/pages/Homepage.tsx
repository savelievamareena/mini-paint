import { useLocation } from "react-router-dom";

const Homepage = () => {
    const location = useLocation();
    const { email } = location.state || {};
    console.log("EMAIL HOME", email);

    return <div>{email}</div>;
};

export default Homepage;
