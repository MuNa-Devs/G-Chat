import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';

import './index.css'
import App from './App.jsx'
import AuthProvider from './AuthContext.jsx';
import ThemeManager from './utils/ThemeManager.jsx';

createRoot(document.getElementById('root')).render(
	<BrowserRouter>
		<ThemeManager>
			<AuthProvider>
				<App />
			</AuthProvider>
		</ThemeManager>
	</BrowserRouter>
)
