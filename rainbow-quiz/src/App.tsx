import { useState, type ReactElement, isValidElement, cloneElement } from 'react'
import HomePage from './pages/Home';
import QuizPage from './pages/Quiz';

const pageList = [
    { label: 'Home', component: <HomePage /> },
    { label: 'Quiz', component: <QuizPage /> },
    // { label: 'Settings', component: <SettingsPage /> }
] as const

// Add 'Settings' as a possible PageName explicitly,
// because it's a valid page even if not in pageList
type PageName = typeof pageList[number]['label'] | 'Settings';

// Define a type for the common navigation prop that all pages can receive
interface NavigablePageProps {
    onNavigate?: (pageName: PageName) => void;
}

function App() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activePage, setActivePage] = useState<PageName>(pageList[0].label)


    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handlePageChange = (pageName: PageName) => {
        setActivePage(pageName);
        setMenuOpen(false); // Close the menu after selecting a page
    };

    const activeComponent = (() => {
        const foundPage = pageList.find(page => page.label === activePage);

        if (foundPage && isValidElement(foundPage.component)) {
            // Clone the component and pass the generic onNavigate prop
            // We cast foundPage.component to ReactElement to satisfy cloneElement's type
            return cloneElement(foundPage.component as ReactElement<NavigablePageProps>, {
                onNavigate: handlePageChange // Pass the handlePageChange function itself
            });
        }
        return null; // Or a default component/error message
    })();

    return (
        <div>
            <div className="absolute top-4 right-4">
                <button className="p-4 rounded-md bg-gray-300 hover:bg-gray-400 transition-colors duration-200 focus:outline-none"
                    onClick={toggleMenu}>
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
            </div>

            {menuOpen && (
                <div className="absolute top-16 right-4 bg-white shadow-md p-4 z-10 rounded-md">
                    <ul>
                        <li>
                            <button
                                onClick={() => handlePageChange('Home')}
                                className="block w-full text-left p-2 hover:bg-gray-100 rounded-md"
                            >
                                Home
                            </button>
                        </li>
                    </ul>
                </div>
            )}

            {activeComponent}


        </div>
    )
}

export default App;