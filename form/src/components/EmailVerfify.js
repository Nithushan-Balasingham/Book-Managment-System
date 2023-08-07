import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import success from "../images/success.png";

const EmailVerify = () => {
	const [validUrl, setValidUrl] = useState(true);
	const param = useParams();
    const navigate=useNavigate()

	useEffect(() => {
		const verifyEmailUrl = async () => {
			try {
				const url = `/api/users/${param.id}/verify/${param.token}`;
				const { data } = await axios.get(url);
				console.log(data);
				setValidUrl(true);
                navigate('/')
			} catch (error) {
				console.log(error);
				setValidUrl(false);
			}
		};
		verifyEmailUrl();
	}, [param]);

	return (
		<>
			{validUrl ? (
				<div>
					<img src={success} alt="success_img"  />
					<h1>Email verified successfully</h1>
					<Link to="/">
						<button>Login</button>
					</Link>
				</div>
			) : (
				<h1>404 Not Found</h1>
			)}
		</>
	);
};

export default EmailVerify;