import SignInPage from "./pages/signin_page/SignInPage";
import SignUpPage from "./pages/signup_page/SignUpPage";

import { Routes, Route } from "react-router-dom";

export default function App() {

	return (
		<Routes>
			<Route path="/" element={<SignUpPage />} />

			<Route path="/signin" element={<SignInPage />} />

			<Route path="/signup" element={<SignUpPage />} />
		</Routes>
	)
}