import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';

import './index.css'
import App from './App.jsx'
import {AppProvider} from './Contexts.jsx';
import ThemeManager from './utils/ThemeManager.jsx';
import UiContextProvider, { UiContextController } from './utils/UiContext.jsx';

function setVh() {
  const vh = window.visualViewport
    ? window.visualViewport.height
    : window.innerHeight;

  document.documentElement.style.setProperty('--vh', `${vh}px`);
}
setVh();
window.addEventListener('resize', setVh);
window.addEventListener('orientationchange', setVh);

createRoot(document.getElementById('root')).render(
	<BrowserRouter>
		<ThemeManager>
			<UiContextProvider>
				<AppProvider>
					<UiContextController>
						<App />
					</UiContextController>
				</AppProvider>
			</UiContextProvider>
		</ThemeManager>
	</BrowserRouter>
)
