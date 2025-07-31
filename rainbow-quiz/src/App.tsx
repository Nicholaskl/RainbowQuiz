import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <Router>
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
                                <Link to="/" className="block py-2 px-4 text-lg hover:bg-gray-100">Quiz</Link>
                            </li>
                            <li>
                                <Link to="/info" className="block py-2 px-4 text-lg hover:bg-gray-100">Info</Link>
                            </li>
                            <li>
                                <Link to="/grid" className="block py-2 px-4 text-lg hover:bg-gray-100">Grid</Link>
                            </li>
                        </ul>
                    </div>
                )}

                <div className="flex flex-col items-center justify-center h-screen bg-gray-100">

                    {/* 
                    Responsive Font Sizing for the main heading:
                    - `text-5xl`: This is the base size, applied on small (mobile) screens.
                    - `md:text-7xl`: On medium screens (768px and up), the font size increases.
                    - `lg:text-9xl`: On large screens (1024px and up), it uses the largest size.
                    This prevents the text from overflowing on smaller viewports by starting small
                    and scaling up.
                */}
                    <h1 className="text-5xl font-bold text-center md:text-7xl lg:text-9xl
                bg-gradient-to-r from-pink-400 to-teal-400 
                text-transparent bg-clip-text animate-text">
                        Rainbow Quiz
                    </h1>

                    <p className="mt-4 text-lg text-center text-gray-600 md:text-2xl">
                        Test to see what flavour of rainbow you are!
                    </p>

                    <button className="mt-10 font-semibold rounded-md py-3 px-6 text-lg md:text-xl
                from-pink-400 to-teal-400 text-white bg-gradient-to-r animate-text
                hover:from-pink-200 hover:to-teal-200 transition-colors duration-300">
                        Let's Start
                    </button>
                </div>


                <Routes>
                    <Route path="/" element={<QuizPage />} />
                    <Route path="/info" element={<InfoPage />} />
                    <Route path="/grid" element={<GridPage />} />
                </Routes>
            </div>
        </Router>
    )
}

function QuizPage() {
    return <div></div>;
}
function InfoPage() {
    return <div></div>;
}
function GridPage() {
    return <div></div>;
}

export default App
export { };
