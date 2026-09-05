import React from 'react';

// Define the type for the card data
interface CardData {
  id: number;
  colorClass: string;
  date: string;
  title: string;
  description: string;
  progressPercent: string;
  progressValue: string;
  imgSrc1?: string;
  imgAlt1?: string;
  imgSrc2?: string;
  imgAlt2?: string;
  countdownText: string;
}

// Define the props for the Card component
interface CardProps {
  data: CardData;
}

// SVG components (extracted for reusability and clarity)
const EllipsisIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
    <path fillRule="evenodd" d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0" clipRule="evenodd" />
  </svg>
);

const AddIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
    <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
  </svg>
);

const Card: React.FC<CardProps> = ({ data }) => {
  const {
    colorClass,
    date,
    title,
    description,
    progressPercent,
    progressValue,
    imgSrc1,
    imgAlt1,
    imgSrc2,
    imgAlt2,
    countdownText,
  } = data;

  return (
    <div className={`card ${colorClass}`}>
      <div className="card-header">
        <div className="date">{date}</div>
        <EllipsisIcon />
      </div>
      <div className="card-body">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="progress">
          <span>Progress</span>
          <div className="progress-bar"></div>
          <span>{progressValue}</span>
        </div>
      </div>
      <div className="card-footer">
        <ul>
          {imgSrc1 && (
            <li>
              <img src={imgSrc1} alt={imgAlt1 || 'user avatar'} />
            </li>
          )}
          {imgSrc2 && (
            <li>
              <img src={imgSrc2} alt={imgAlt2 || 'user avatar'} />
            </li>
          )}
          <li>
            <a href="#" className="btn-add">
              <AddIcon />
            </a>
          </li>
        </ul>
        <a href="#" className="btn-countdown">{countdownText}</a>
      </div>
    </div>
  );
};

export default Card;