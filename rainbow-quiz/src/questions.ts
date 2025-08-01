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
        quesText: 'Found myself sexually aroused by a member of the same sex',
        quesType: 'SEXUAL',
        flipped: false
    },
    {
        quesText: 'Fantasized about non-sexual petting and/or bodily closeness with a member of the opposite sex',
        quesType: 'ROMANTIC',
        flipped: true
    },
    {
        quesText: 'Fantasized about non-sexual petting and/or bodily closeness with the same sex',
        quesType: 'ROMANTIC',
        flipped: false
    },
    ,
    {
        quesText: 'Found myself sexually aroused by a member of the same sex',
        quesType: 'SEXUAL',
        flipped: false
    },
    {
        quesText: 'Wanted to touch the Same sex intimately and/or be naked in the company of the same sex',
        quesType: 'SEXUAL',
        flipped: false
    },
    {
        quesText: 'Thought about being in a relationship with someone',
        quesType: 'DEGREE',
        flipped: false
    },
    {
        quesText: 'Entertained the fantasy of being in a long-term romantic relationship with a member of the same sex',
        quesType: 'ROMANTIC',
        flipped: false
    },
    {
        quesText: 'Entertained the notion of going on a date with someone',
        quesType: 'DEGREE',
        flipped: false
    },
    {
        quesText: 'Thought about going on a date with someone of the same sex',
        quesType: 'ROMANTIC',
        flipped: false
    },
    {
        quesText: 'Found myself wanting to have real-life sexual intercourse with a member of the same sex',
        quesType: 'SEXUAL',
        flipped: false
    },
    {
        quesText: 'Wanted to engage in mild sexual acts with a member of the opposite sex (e.g. Kissing)',
        quesType: 'ROMANTIC',
        flipped: true
    },
    {
        quesText: 'Found myself sexually attracted to someone',
        quesType: 'DEGREE',
        flipped: false
    },
    {
        quesText: 'Entertained the fantasy of being in a long-term romantic relationship with a member of the opposite sex',
        quesType: 'ROMANTIC',
        flipped: true
    },
    {
        quesText: 'Found a member of the opposite sex attractive',
        quesType: 'SEXUAL',
        flipped: true
    },
    {
        quesText: 'Wanted to engage in mild sexual acts with a member of the same sex (e.g. Kissing)',
        quesType: 'ROMANTIC',
        flipped: false
    },
    {
        quesText: 'Wanted to touch the opposite sex intimately and/or be naked in the company of the opposite sex',
        quesType: 'SEXUAL',
        flipped: true
    },
    {
        quesText: 'Fantasized about non-sexual petting and/or bodily closeness with someone',
        quesType: 'DEGREE',
        flipped: false
    },
    {
        quesText: 'Thought about going on a date with someone of the opposite sex',
        quesType: 'ROMANTIC',
        flipped: true
    },
    {
        quesText: 'Found myself wanting to have real-life sexual intercourse with a member of the opposite sex',
        quesType: 'SEXUAL',
        flipped: true
    },
    {
        quesText: 'Fantasized about a sexual act',
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
