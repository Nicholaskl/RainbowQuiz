import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions, type Question } from '../questions'; // Import questions and the Question interface
import Button from '../components/button'; // Assuming you have a Button component

// Define the structure for storing user answers
interface UserAnswer {
    questionId: number;
    questionText: string;
    category: 'SEXUAL' | 'ROMANTIC' | 'DEGREE'; // Explicitly type categories
    originalAnswerValue: number; // The value chosen by the user (0-4)
    scoreContribution: number; // The score after considering 'flipped'
}

// Define the structure for category scores
interface CategoryScores {
    SEXUAL: number;
    ROMANTIC: number;
    DEGREE: number;
}

// Helper function to convert HSB to RGB
// H: 0-360, S: 0-100, B: 0-100
function hsbToRgb(h: number, s: number, b: number): [number, number, number] {
    s /= 100;
    b /= 100;
    const k = (n: number) => (n + h / 60) % 6;
    const f = (n: number) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
    return [255 * f(5), 255 * f(3), 255 * f(1)].map(Math.round) as [number, number, number];
}

function QuizPage() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
    const [categoryScores, setCategoryScores] = useState<CategoryScores>({
        SEXUAL: 0,
        ROMANTIC: 0,
        DEGREE: 0,
    });
    const [quizColor, setQuizColor] = useState<string>('#FFFFFF'); // State to store the final hex color
    const [copyMessage, setCopyMessage] = useState<string>(''); // State for copy confirmation message

    // Map answer option values to their corresponding scores
    const answerOptionValuesToScores: { [key: number]: number } = {
        0: -3, // Never
        1: -1, // Not Often
        2: 0,  // Sometimes (Don't know)
        3: 1,  // Often
        4: 3,  // Always
    };

    // Define the answer options with their display text and a numerical value
    const answerOptions = [
        { text: "Never", value: 0 },
        { text: "Not Often", value: 1 },
        { text: "Sometimes", value: 2 },
        { text: "Often", value: 3 },
        { text: "Always", value: 4 },
    ];

    const currentQuestion: Question | undefined = questions[currentQuestionIndex];
    const isQuizComplete = currentQuestionIndex >= questions.length;

    // Calculate category scores and the final color when the quiz is complete
    useEffect(() => {
        if (isQuizComplete) {
            const newCategoryScores: CategoryScores = { SEXUAL: 0, ROMANTIC: 0, DEGREE: 0 };
            const categoryQuestionCounts: { [key: string]: number } = { SEXUAL: 0, ROMANTIC: 0, DEGREE: 0 };

            // First, count questions per category to determine min/max possible scores
            questions.forEach(q => {
                categoryQuestionCounts[q.quesType]++;
            });

            // Sum up scores for each category
            userAnswers.forEach(answer => {
                newCategoryScores[answer.category] += answer.scoreContribution;
            });

            setCategoryScores(newCategoryScores);

            // --- Color Calculation Logic (HSB) ---
            // Normalizes a score from its possible min/max range to a desired output range.
            const normalizeScore = (score: number, category: 'SEXUAL' | 'ROMANTIC' | 'DEGREE', outputMin: number, outputMax: number): number => {
                const numQuestions = categoryQuestionCounts[category];
                if (numQuestions === 0) {
                    return (outputMin + outputMax) / 2; // Return mid-range if no questions in category
                }

                const minPossibleScore = numQuestions * -3; // Min score for this category
                const maxPossibleScore = numQuestions * 3;   // Max score for this category

                // Avoid division by zero if min and max are the same (e.g., only one question with 0 score)
                if (maxPossibleScore === minPossibleScore) {
                    return (outputMin + outputMax) / 2;
                }

                // Normalize score to a 0-1 range
                const normalized = (score - minPossibleScore) / (maxPossibleScore - minPossibleScore);

                // Scale to the desired output range and clamp
                const scaled = normalized * (outputMax - outputMin) + outputMin;
                return Math.max(outputMin, Math.min(outputMax, scaled));
            };

            const toHex = (c: number): string => {
                const hex = Math.round(c).toString(16); // Ensure integer for hex conversion
                return hex.length === 1 ? "0" + hex : hex;
            };

            // Normalize each category score to HSB components
            // Hue (H): Influenced by ROMANTIC score, mapped to a vibrant spectrum (e.g., 270 (purple) to 30 (orange))
            const HUE_MIN = 40; // Pink
            const HUE_MAX = 300;  // Orange (wraps around 0/360)
            const normalisedSexual = normalizeScore(newCategoryScores.SEXUAL, 'SEXUAL', 0, 1);
            let hue;
            if (HUE_MIN > HUE_MAX) { // Handles wrapping around 360 (e.g., 270 to 30)
                hue = (normalisedSexual * (360 - HUE_MIN + HUE_MAX) + HUE_MIN) % 360;
            } else {
                hue = normalisedSexual * (HUE_MAX - HUE_MIN) + HUE_MIN;
            }

            // Saturation (S): Influenced by ROMANTIC score, mapped to a high saturation range (e.g., 50% to 100%)
            const SAT_MIN = 100;
            const SAT_MAX = 60;
            const saturation = normalizeScore(newCategoryScores.ROMANTIC, 'ROMANTIC', SAT_MIN, SAT_MAX);

            // Brightness (B): Influenced by DEGREE score, mapped to a bright range (e.g., 70% to 100%)
            const BRIGHT_MIN = 100;
            const BRIGHT_MAX = 70;
            const brightness = normalizeScore(newCategoryScores.DEGREE, 'DEGREE', BRIGHT_MIN, BRIGHT_MAX);

            const [r, g, b] = hsbToRgb(hue, saturation, brightness);
            setQuizColor(`#${toHex(r)}${toHex(g)}${toHex(b)}`);

        }
    }, [isQuizComplete, userAnswers]); // Recalculate when quiz is complete or answers change

    const handleAnswer = (selectedAnswerValue: number) => {
        if (!currentQuestion) return;

        const rawScore = answerOptionValuesToScores[selectedAnswerValue];
        // If flipped is true, invert the raw score (e.g., 3 becomes -3, -3 becomes 3)
        const scoreContribution = currentQuestion.flipped ? -rawScore : rawScore;

        const newAnswer: UserAnswer = {
            questionId: currentQuestion.id,
            questionText: currentQuestion.quesText, // Use quesText from new structure
            category: currentQuestion.quesType,    // Use quesType from new structure
            originalAnswerValue: selectedAnswerValue,
            scoreContribution: scoreContribution,
        };

        setUserAnswers((prevAnswers) => [...prevAnswers, newAnswer]);
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        console.debug("Score Contribution", scoreContribution)
    };

    const handleRestartQuiz = () => {
        setCurrentQuestionIndex(0);
        setUserAnswers([]);
        setCategoryScores({ SEXUAL: 0, ROMANTIC: 0, DEGREE: 0 });
        setQuizColor('#FFFFFF');
        setCopyMessage(''); // Clear copy message on restart
    };

    const copyColorToClipboard = () => {
        const colorToCopy = quizColor.toUpperCase();
        try {
            // Create a temporary textarea element to copy text
            const textarea = document.createElement('textarea');
            textarea.value = colorToCopy;
            textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in some browsers
            textarea.style.opacity = '0'; // Make it invisible
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy'); // Execute copy command
            document.body.removeChild(textarea); // Remove the textarea

            setCopyMessage('Copied!');
            setTimeout(() => setCopyMessage(''), 2000); // Clear message after 2 seconds
        } catch (err) {
            console.error('Failed to copy color:', err);
            setCopyMessage('Failed to copy!');
            setTimeout(() => setCopyMessage(''), 2000);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full text-center">
                {isQuizComplete ? (
                    <div className="flex flex-col items-center justify-center">
                        <h2 className="text-4xl font-bold text-teal-600 mb-4">Quiz Complete!</h2>
                        <p className="text-lg text-gray-700 mb-6">Your Rainbow Quiz Results:</p>

                        <div className="mb-6 w-full max-w-sm mx-auto">
                            <h3 className="text-2xl font-semibold mb-3">Category Scores:</h3>
                            {Object.entries(categoryScores).map(([category, score]) => (
                                <p key={category} className="text-lg text-gray-800">
                                    <strong>{category}:</strong> {score}
                                </p>
                            ))}
                        </div>

                        <div className="mb-8">
                            <h3 className="text-2xl font-semibold mb-3">Your Rainbow Color:</h3>
                            <div
                                style={{ backgroundColor: quizColor }}
                                className="w-40 h-40 rounded-full mx-auto border-4 border-gray-300 shadow-lg"
                            ></div>
                            <p
                                className="mt-4 text-xl font-bold text-gray-800 cursor-pointer hover:underline"
                                onClick={copyColorToClipboard} // Add onClick handler here
                                title="Click to copy color code"
                            >
                                {quizColor.toUpperCase()}
                            </p>
                            {copyMessage && (
                                <p className="text-green-600 text-sm mt-1 animate-fade-in-out">
                                    {copyMessage}
                                </p>
                            )}
                            <p className="text-sm text-gray-600 mt-2">
                                (Romantic: Hue, Sexual: Saturation, Degree: Brightness)
                            </p>
                        </div>

                        <Button
                            onClick={handleRestartQuiz}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            Restart Quiz
                        </Button>
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-gray-500 mb-2">
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </p>
                        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-800">
                            {currentQuestion?.quesText} {/* Use quesText */}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {answerOptions.map((option) => (
                                <Button
                                    key={option.value}
                                    onClick={() => handleAnswer(option.value)}
                                    className="w-full py-3 px-4 rounded-lg text-lg font-medium
                                               bg-gradient-to-r from-purple-400 to-pink-500 text-white
                                               hover:from-purple-500 hover:to-pink-600
                                               transition-all duration-300 ease-in-out transform hover:scale-105
                                               shadow-md hover:shadow-lg"
                                >
                                    {option.text}
                                </Button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default QuizPage;
