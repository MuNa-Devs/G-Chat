import SignInPage from "./pages/signin_page/SignInPage";
import SignUpPage from "./pages/signup_page/SignUpPage";
import DashBoard from "./pages/dashboard_page/DashBoard";
import RoomPage from "./pages/privateroom_page/RoomPage";
import FriendsPage from "./pages/friends_page/FriendsPage";
import Dorakaled from "./pages/page_not_found/404";
import AprilFool from "./pages/page_not_found/AprilFool";

import { LoginProtector } from "./Contexts";

import { Routes, Route } from "react-router-dom";
import LoadingScreen from "./pages/loading_screen/LoadingScreen";
import Settings from "./pages/settings_page/Settings";
import UserSettings from "./pages/user_settings/UserSettings";

export default function App() {
	return (
		<Routes>
			<Route path="/" element={<SignUpPage />} />

			<Route path="/signin" element={<SignInPage />} />

			<Route path="/signup" element={<SignUpPage />} />

			<Route
				path="/rooms" element={
					<LoginProtector>
						<RoomPage />
					</LoginProtector>
				}
			/>

			<Route
				path="/dashboard" element={
					<LoginProtector>
						<DashBoard />
					</LoginProtector>
				}
			/>

			<Route
				path="/friends" element={
					<LoginProtector>
						<FriendsPage />
					</LoginProtector>
				}
			/>

			<Route
				path="/settings" element={
					<LoginProtector>
						<Settings />
					</LoginProtector>
				}
			/>

			<Route
				path="/user-settings" element={
					<LoginProtector>
						<UserSettings />
					</LoginProtector>
				}
			/>

			<Route
				path="/aprilfool" element={
					<LoginProtector>
						<AprilFool />
					</LoginProtector>
				}
			/>

			<Route path="/loader" element={<LoadingScreen />} />

			<Route
				path="*" element={
					<LoginProtector>
						<Dorakaled />
					</LoginProtector>
				}
			/>
		</Routes>
	);
}