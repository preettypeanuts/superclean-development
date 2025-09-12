import { useState } from "react";
import { FaStar } from "react-icons/fa";

interface StarRatingProps {
  totalStars: number;
  initialSelected: number;
  onChange: (index: number) => void,
  readonly?: boolean;
}

function StarRating(
  {
    totalStars = 5,
    initialSelected = 0,
    onChange = () => { },
    readonly = true
  }
    : StarRatingProps
) {
  const [selectedStars, setSelectedStars] = useState<number>(initialSelected);
  const [hoveredStar, setHoveredStar] = useState<number>(initialSelected);

  const onHover = (index: number = 0) => {
    if (readonly) return;
    setHoveredStar(index + 1);
  };

  const onLeave = () => {
    setHoveredStar(selectedStars);
  };

  const onClick = (index: number) => {
    if (readonly) return;
    setSelectedStars(index + 1);
    onChange(index + 1);
  };

  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => (
        <FaStar
          key={index}
          className={`${readonly ? "cursor-default" : "cursor-pointer"} inline-block mr-2 ${index < (hoveredStar ?? selectedStars) ? "text-yellow-500" : "text-gray-300"}`}
          size={40}
          onMouseEnter={() => onHover(index)}
          onMouseLeave={() => onLeave()}
          onClick={() => onClick(index)}
        />
      ))}
    </div>
  );
}

StarRating.displayName = "StarRating";
export { StarRating };
