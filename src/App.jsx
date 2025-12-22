import SignInPage from "./pages/signin_page/SignInPage";
import SignUpPage from "./pages/signup_page/SignUpPage";
import DashBoard from "./pages/dashboard_page/DashBoard";
import RoomPage from "./pages/privateroom_page/RoomPage";
import Temp from "./Temp";

import { Routes, Route } from "react-router-dom";

export default function App() {

	return (
		<Routes>
			<Route path="/" element={<SignUpPage />} />

			<Route path="/signin" element={<SignInPage />} />

			<Route path="/signup" element={<SignUpPage />} />

			<Route path="/rooms" element={<RoomPage />} />

			<Route path="/dashboard" element={<DashBoard/>} />
		</Routes>
	)
}