import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

interface RatingOption {
  id: number;
  label: string;
  bgcolor: string;
  hovercolor: string;
}

export const ratingOptions: RatingOption[] = [
  {
    id: 6,
    label: "Excellent",
    bgcolor: "bg-green-500",
    hovercolor: "hover:bg-green-500",
  },
  {
    id: 5,
    label: "Good",
    bgcolor: "bg-blue-500",
    hovercolor: "hover:bg-blue-500",
  },
  {
    id: 4,
    label: "Satisfactory",
    bgcolor: "bg-yellow-500",
    hovercolor: "hover:bg-yellow-500",
  },
  {
    id: 3,
    label: "Unsatisfactory",
    bgcolor: "bg-orange-500",
    hovercolor: "hover:bg-orange-500",
  },
  {
    id: 2,
    label: "Wrong",
    bgcolor: "bg-red-500",
    hovercolor: "hover:bg-red-500",
  },
  {
    id: 1,
    label: "Hallucinating",
    bgcolor: "bg-purple-500",
    hovercolor: "hover:bg-purple-500",
  },
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
        <RatingLabel
          key={option.id}
          rating={option.id}
          onClick={() => handleSelectRating(option.id)}
          deselected={selectedRating !== option.id}
        />
      ))}
    </div>
  );
};

export default Rating;

export function RatingLabel(props: {
  rating: number;
  onClick?: () => void;
  deselected?: boolean;
  className?: string;
}) {
  const { rating, onClick, deselected, className } = props;
  const option = ratingOptions.find((option) => option.id === rating);

  return (
    <button
      className={twMerge(
        `mt-2 sm:mt-0 inline-block rounded-full px-3 py-1 mr-2 font-semibold ${option?.hovercolor} hover:text-primary cursor-pointer ${option?.bgcolor} text-primary ${deselected ? "opacity-20" : ""
        }`,
        className,
      )}
      onClick={onClick}
    >
      {option?.label}
    </button>
  );
}
