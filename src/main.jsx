import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';

import './index.css'
import App from './App.jsx'
import ContextProvider from './Contexts.jsx';
import ThemeManager from './utils/ThemeManager.jsx';
import UiContextProvider, { UiContextController } from './utils/UiContext.jsx';

createRoot(document.getElementById('root')).render(
	<BrowserRouter>
		<ThemeManager>
			<UiContextProvider>
				<ContextProvider>
					<UiContextController>
						<App />
					</UiContextController>
				</ContextProvider>
			</UiContextProvider>
		</ThemeManager>
	</BrowserRouter>
)
