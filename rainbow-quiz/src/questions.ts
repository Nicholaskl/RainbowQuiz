// src/questions.ts

export interface Question {
    id: number;
    quesText: string;
    quesType: 'SEXUAL' | 'ROMANTIC' | 'DEGREE';
    flipped: boolean;
}

// The raw questions data provided by the user, with mixed structures
const rawQuestions = [
    {
        quesText: 'I’ve felt sexually aroused by someone of the same gender.',
        quesType: 'SEXUAL',
        flipped: false
    },
    {
        quesText: 'I’ve fantasized about intimate, non-sexual physical closeness with someone of a different gender.',
        quesType: 'ROMANTIC',
        flipped: true
    },
    {
        quesText: 'I’ve fantasized about intimate, non-sexual physical closeness with someone of the same gender.',
        quesType: 'ROMANTIC',
        flipped: false
    },
    {
        quesText: 'I’ve wanted to be physically intimate or naked in the company of someone of the same gender.',
        quesType: 'SEXUAL',
        flipped: false
    },
    {
        quesText: 'I’ve thought about being in a committed relationship with someone.',
        quesType: 'DEGREE',
        flipped: false
    },
    {
        quesText: 'I’ve entertained the fantasy of a long-term romantic relationship with someone of the same gender.',
        quesType: 'ROMANTIC',
        flipped: false
    },
    {
        quesText: 'I’ve considered going on a date with someone.',
        quesType: 'DEGREE',
        flipped: false
    },
    {
        quesText: 'I’ve thought about going on a date with someone of the same gender.',
        quesType: 'ROMANTIC',
        flipped: false
    },
    {
        quesText: 'I’ve wanted to have sexual intercourse with someone of the same gender.',
        quesType: 'SEXUAL',
        flipped: false
    },
    {
        quesText: 'My thoughts frequently turn to sexual fantasies or desires.', // To help gauge the hypersexual end
        quesType: 'DEGREE',
        flipped: false
    },
    {
        quesText: 'I’ve wanted to engage in mild sexual acts (e.g., kissing) with someone of a different gender.',
        quesType: 'ROMANTIC',
        flipped: true
    },
    {
        quesText: 'I’ve felt sexually attracted to someone.',
        quesType: 'DEGREE',
        flipped: false
    },
    {
        quesText: 'I’ve entertained the fantasy of a long-term romantic relationship with someone of a different gender.',
        quesType: 'ROMANTIC',
        flipped: true
    },
    {
        quesText: 'I’ve found someone of a different gender to be sexually attractive.',
        quesType: 'SEXUAL',
        flipped: true
    },
    {
        quesText: 'I rarely feel the urge to engage in sexual activity.', // To help gauge the asexual end
        quesType: 'DEGREE',
        flipped: true
    },
    {
        quesText: 'I’ve wanted to engage in mild sexual acts (e.g., kissing) with someone of the same gender.',
        quesType: 'ROMANTIC',
        flipped: false
    },
    {
        quesText: 'I feel a general sense of romantic or sexual attraction towards people.',
        quesType: 'DEGREE',
        flipped: false
    },
    {
        quesText: 'I’ve wanted to be physically intimate or naked in the company of someone of a different gender.',
        quesType: 'SEXUAL',
        flipped: true
    },
    {
        quesText: 'I’ve fantasized about intimate, non-sexual physical closeness with someone.',
        quesType: 'DEGREE',
        flipped: false
    },
    {
        quesText: 'I’ve thought about going on a date with someone of a different gender.',
        quesType: 'ROMANTIC',
        flipped: true
    },
    {
        quesText: 'I’ve wanted to have sexual intercourse with someone of a different gender.',
        quesType: 'SEXUAL',
        flipped: true
    },
    {
        quesText: 'I’ve fantasized about a sexual act.',
        quesType: 'DEGREE',
        flipped: false
    },
];

// Flatten the array and assign unique IDs to each question.
// For nested arrays, a compound ID (e.g., 101, 102) is generated.
export const questions: Question[] = rawQuestions.flatMap((item, index) => {
    if (Array.isArray(item)) {
        return item.map((q, subIndex) => ({
            ...q,
            id: parseInt(`${index + 1}${subIndex + 1}`), // Creates unique IDs like 101, 102, 201 etc.
        }));
    } else {
        return { ...item, id: index + 1 }; // Simple ID for non-nested questions
    }
});
