import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';

import './index.css'
import App from './App.jsx'
import { AppProvider } from './Contexts.jsx';
import ThemeManager from './utils/ThemeManager.jsx';
import UiContextProvider, { UiContextController } from './utils/UiContext.jsx';
import { DMProvider } from './utils/DMContext.jsx';
import { FriendProvider } from './utils/FriendContexts.jsx';

createRoot(document.getElementById('root')).render(
	<BrowserRouter>
		<DMProvider>
			<FriendProvider>
				<ThemeManager>
					<UiContextProvider>
						<AppProvider>
							<UiContextController>
								<App />
							</UiContextController>
						</AppProvider>
					</UiContextProvider>
				</ThemeManager>
			</FriendProvider>
		</DMProvider>
	</BrowserRouter>
);