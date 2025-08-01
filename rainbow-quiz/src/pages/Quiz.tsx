import { useState, useEffect } from 'react';
import { questions, type Question } from '../questions'; // Import questions and the Question interface
import Button from '../components/button'; // Assuming you have a Button component
import ColourText from '../components/colourtext';

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
    const [sliderValue, setSliderValue] = useState<number>(2); // State for the current slider value, defaults to 'Sometimes' (0 score)

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

    // Reset slider value when moving to a new question
    useEffect(() => {
        if (!isQuizComplete) {
            setSliderValue(2); // Reset to 'Sometimes' for the new question
        }
    }, [currentQuestionIndex, isQuizComplete]);

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
            const HUE_MIN = 40; // Purple
            const HUE_MAX = 300;  // Orange (wraps around 0/360)
            const normalizedSexual = normalizeScore(newCategoryScores.SEXUAL, 'SEXUAL', 0, 1);
            let hue;
            if (HUE_MIN > HUE_MAX) { // Handles wrapping around 360 (e.g., 270 to 30)
                hue = (normalizedSexual * (360 - HUE_MIN + HUE_MAX) + HUE_MIN) % 360;
            } else {
                hue = normalizedSexual * (HUE_MAX - HUE_MIN) + HUE_MIN;
            }

            // Saturation (S): Influenced by SEXUAL score, mapped to a high saturation range (e.g., 50% to 100%)
            const SAT_MIN = 50;
            const SAT_MAX = 100;
            const saturation = normalizeScore(newCategoryScores.ROMANTIC, 'ROMANTIC', SAT_MIN, SAT_MAX);

            // Brightness (B): Influenced by DEGREE score, mapped to a bright range (e.g., 70% to 100%)
            const BRIGHT_MIN = 70;
            const BRIGHT_MAX = 100;
            const brightness = normalizeScore(newCategoryScores.DEGREE, 'DEGREE', BRIGHT_MIN, BRIGHT_MAX);

            const [r, g, b] = hsbToRgb(hue, saturation, brightness);
            setQuizColor(`#${toHex(r)}${toHex(g)}${toHex(b)}`);

        }
    }, [isQuizComplete, userAnswers]); // Recalculate when quiz is complete or answers change

    const handleSubmitAnswer = () => {
        // Use the current sliderValue as the selectedAnswerValue
        handleAnswer(sliderValue);
    };

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
    };

    const handleRestartQuiz = () => {
        setCurrentQuestionIndex(0);
        setUserAnswers([]);
        setCategoryScores({ SEXUAL: 0, ROMANTIC: 0, DEGREE: 0 });
        setQuizColor('#FFFFFF');
        setCopyMessage(''); // Clear copy message on restart
        setSliderValue(2); // Reset slider for the first question
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white p-8 lg:p-12 rounded-lg max-w-4xl w-full text-center">
                {isQuizComplete ? (
                    <div className="flex flex-col items-center justify-center">
                        <ColourText className="text-4xl lg:text-6xl">
                            Quiz Complete!
                        </ColourText>
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
                                (Sexual: Hue, Romantic: Saturation, Degree: Brightness)
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
                        <p className="text-md text-gray-500 mb-2">
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </p>
                        <h2 className="text-2xl md:text-4xl font-semibold mb-6 text-gray-800 pb-8">
                            {currentQuestion?.quesText}
                        </h2>

                        <div className="flex flex-col items-center w-full max-w-xl mx-auto relative">
                            {/* Labels above the slider */}
                            <div className="absolute -top-7 left-0 right-0 flex justify-between text-[10px] md:text-xs text-gray-600">
                                {answerOptions.map((option) => (
                                    <span key={option.value} className="min-w-[40px] text-center">
                                        {option.text}
                                    </span>
                                ))}
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="4"
                                value={sliderValue}
                                onChange={(e) => setSliderValue(Number(e.target.value))}
                                className="w-full h-2 pb-8 rounded-lg appearance-none cursor-pointer
                                           [&::-webkit-slider-runnable-track]:bg-gradient-to-r
                                           [&::-webkit-slider-runnable-track]:from-pink-400
                                           [&::-webkit-slider-runnable-track]:to-teal-400
                                           [&::-webkit-slider-runnable-track]:h-1.5
                                           [&::-webkit-slider-runnable-track]:rounded-lg
                                           [&::-webkit-slider-thumb]:bg-purple-600
                                           [&::-webkit-slider-thumb]:w-5
                                           [&::-webkit-slider-thumb]:h-5
                                           [&::-webkit-slider-thumb]:rounded-full
                                           [&::-webkit-slider-thumb]:appearance-none
                                           [&::-webkit-slider-thumb]:-mt-[6px]
                                           [&::-moz-range-track]:bg-gradient-to-r
                                           [&::-moz-range-track]:from-pink-400
                                           [&::-moz-range-track]:to-teal-400
                                           [&::-moz-range-track]:h-1.5
                                           [&::-moz-range-track]:rounded-lg
                                           [&::-moz-range-thumb]:bg-slate-200
                                           [&::-moz-range-thumb]:w-5
                                           [&::-moz-range-thumb]:h-5
                                           [&::-moz-range-thumb]:rounded-full
                                           [&::-moz-range-thumb]:-mt-[6px]
                                           "
                            />
                            <Button
                                onClick={handleSubmitAnswer}
                            >
                                Submit Answer
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default QuizPage;
