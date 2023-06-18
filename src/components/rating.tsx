import React, { useState } from 'react';

interface RatingOption {
    id: number;
    label: string;
    bgcolor: string;
    hovercolor: string;
}

export const ratingOptions: RatingOption[] = [
    { id: 6, label: 'Excellent', bgcolor: 'bg-green-500', hovercolor: 'hover:bg-green-500' },
    { id: 5, label: 'Good', bgcolor: 'bg-blue-500', hovercolor: 'hover:bg-blue-500' },
    { id: 4, label: 'Satisfactory', bgcolor: 'bg-yellow-500', hovercolor: 'hover:bg-yellow-500' },
    { id: 3, label: 'Unsatisfactory', bgcolor: 'bg-orange-500', hovercolor: 'hover:bg-orange-500' },
    { id: 2, label: 'Wrong', bgcolor: 'bg-red-500', hovercolor: 'hover:bg-red-500' },
    { id: 1, label: 'Hallucinating', bgcolor: 'bg-purple-500', hovercolor: 'hover:bg-purple-500' },
];

const Rating = (props: { setRating: (rating: number) => void }) => {
    const [selectedRating, setSelectedRating] = useState(0);

    const handleSelectRating = (rating: number) => {
        setSelectedRating(rating);
        props.setRating?.(rating);
    };

    return (
        <div className="flex flex-col sm:flex-row items-center my-2 ml-2 justify-center">
            {ratingOptions.map((option) => (
                <span
                    key={option.id}
                    className={`mt-2 sm:mt-0 inline-block rounded-full px-3 py-1 mr-2 font-semibold ${option.hovercolor} hover:text-white cursor-pointer ${selectedRating === option.id ? `${option.bgcolor} border border-2 border-black text-white` : 'bg-slate-200 text-gray-700'
                        }`}
                    onClick={() => handleSelectRating(option.id)}
                >
                    {option.label}
                </span>
            ))}
        </div>
    );
};

export default Rating;