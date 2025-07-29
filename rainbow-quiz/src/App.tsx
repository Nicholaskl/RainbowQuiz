import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <Router>

            <div className="absolute top-4 right-4">
                <button className="p-3 rounded-md bg-gray-300 hover:bg-gray-400 transition-colors duration-200 focus:outline-none"
                    onClick={toggleMenu}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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

                <h1 className="text-9xl font-bold 
                bg-gradient-to-r from-purple-500 to-green-500 
                text-transparent bg-clip-text animate-text">
                    Rainbow Quiz
                </h1>

                <p className="mt-4 text-2xl text-gray-600 ">
                    Test to see what flavour of rainbow you are!
                </p>

                <button className="mt-10 font-semibold rounded-fields py-3 px-6 text-xl
                from-purple-400 to-green-400 text-white bg-gradient-to-r animate-text
                hover:from-purple-200 hover:to-green-200 transition-colors duration-300">
                    Let's Start
                </button>
            </div>


            <Routes>
                <Route path="/" element={<QuizPage />} />
                <Route path="/info" element={<InfoPage />} />
                <Route path="/grid" element={<GridPage />} />
            </Routes>

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
