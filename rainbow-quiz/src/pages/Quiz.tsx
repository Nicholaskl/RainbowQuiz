import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions } from '../questions'
import Button from '../components/button';

function QuizPage() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    // In a real app, you'd likely store scores in a more complex state object
    // const [scores, setScores] = useState({});

    const handleAnswer = (answerValue: number) => {
        console.log(
            `Question ${questions[currentQuestionIndex].id} answered with value: ${answerValue}`
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-8">Quiz</h1>
        </div>
    )
}

export default QuizPage;

// Here you would implement
