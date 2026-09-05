"use client";
import React, { useState } from 'react';
import Image from 'next/image';

interface Tag {
  name: string;
  textColor: string;
  backgroundColor: string;
  rounding?: number;
  alignment?: 'left' | 'center' | 'right';
}

interface InflectedCardProps {
  id: string;
  image: string;
  title: string;
  description: string;
  tags: Tag[];
  parentBackgroundColor: string;
  onClick?: (hoverTarget: string, id: string) => void;
  onHover?: (hoverTarget: string, id: string) => void;
  cardRounding?: number;
  fontSizes?: {
    title?: string;
    description?: string;
    tags?: string;
    price?: string;
  };
  margins?: {
    title?: string;
    description?: string;
    tags?: string;
  };
  buttonIcon: React.ReactElement;
  buttonIconSize?: number;
  buttonIconColor?: string;
  buttonIconHoverColor?: string;
  buttonBackgroundColor?: string;
  buttonBackgroundHoverColor?: string;
  imageHoverScale?: number; // Use this prop!
  titleColor?: string;
  descriptionColor?: string;
  mirrored?: boolean;
  titleAlignment?: 'left' | 'center' | 'right';
  descriptionAlignment?: 'left' | 'center' | 'right';
  tagsAlignment?: 'left' | 'center' | 'right';
  maxWidth?: string;
  price?: string;
  priceTagTextColor?: string;
  oldPrice?: string;
  oldPriceOnTheRight?: boolean;
  oldPriceTextColor?: string;
  priceTagRounding?: string;
  priceTagBackgroundColor?: string;
}

export const InflectedCard: React.FC<InflectedCardProps> = ({
  id,
  image,
  title,
  description,
  tags,
  parentBackgroundColor,
  onClick,
  onHover,
  cardRounding = 20,
  fontSizes = {},
  margins = {},
  buttonIcon,
  buttonIconSize = 24,
  buttonIconColor = '#fff',
  buttonIconHoverColor = '#fff',
  buttonBackgroundColor = '#282828',
  buttonBackgroundHoverColor = '#484848',
  imageHoverScale = 1.1, // Default scale
  titleColor = '#f7f7ff',
  descriptionColor = '#c7c7cf',
  mirrored = false,
  titleAlignment = 'left',
  descriptionAlignment = 'left',
  tagsAlignment = 'left',
  maxWidth = '100%',
  price,
  priceTagTextColor = '#ffffff',
  oldPrice,
  oldPriceOnTheRight = false,
  oldPriceTextColor = '#c1c1c7',
  priceTagRounding = '5px',
  priceTagBackgroundColor = 'rgba(0,0,0,0.7)',
}) => {
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);

  const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
    onClick && onClick(hoveredElement || 'card', id);
  };
  const handleMouseEnter = (element: string) => {
    setHoveredElement(element);
    onHover && onHover(element, id);
  };
  const handleButtonMouseEnter = () => {
    setIsButtonHovered(true);
    handleMouseEnter('button');
  };
  const handleButtonMouseLeave = () => {
    setIsButtonHovered(false);
  };
  const isRTLCheck = (text: string): boolean => {
    return /[\u0590-\u05FF\u0600-\u06FF\u0700-\u074F]/.test(text);
  };
  const mirroredStyle: React.CSSProperties = mirrored ? { transform: 'scaleX(-1)' } : {};
  const reverseMirrorStyle: React.CSSProperties = mirrored ? { transform: 'scaleX(-1)' } : {};

  return (
    <>
      <div
        className="inflected-card"
        style={{
          '--card-rounding': `${cardRounding}px`,
          maxWidth: maxWidth,
          ...mirroredStyle,
        } as React.CSSProperties}
        onClick={handleCardClick}
      >
        <div
          className="inflected-cardInner"
          style={{ '--parent-bg': parentBackgroundColor } as React.CSSProperties}
        >
          <div className="inflected-box">
            <div
              className="inflected-imgBox"
              style={{
                ...reverseMirrorStyle,
                borderRadius: `${cardRounding}px`,
                overflow: 'hidden',
                width: '100%',
                height: '100%',
                position: 'absolute',
                inset: 0,
              } as React.CSSProperties}
              onMouseEnter={() => setIsImageHovered(true)}
              onMouseLeave={() => setIsImageHovered(false)}
            >
              <Image
                src={image}
                alt={title}
                layout="fill"
                objectFit="cover"
                draggable={false}
                style={{
                  transition: 'transform 0.3s ease',
                  willChange: 'transform',
                  transform: isImageHovered
                    ? `scale(${imageHoverScale})`
                    : 'scale(1)',
                  width: '100%',
                  height: '100%',
                  display: 'block',
                }}
              />
              {price && (
                <div
                  className="inflected-priceTag"
                  style={{
                    position: 'absolute',
                    top: '12px',
                    [mirrored ? 'right' : 'left']: '12px',
                    backgroundColor: priceTagBackgroundColor,
                    color: priceTagTextColor,
                    padding: '9px 15px',
                    borderRadius: priceTagRounding,
                    fontSize: fontSizes.price || '1rem',
                  }}
                  onMouseEnter={() => handleMouseEnter('priceTag')}
                  onClick={(event) => {
                    event.stopPropagation();
                    onClick && onClick('priceTag', id);
                  }}
                >
                  {oldPriceOnTheRight ? (
                    <>
                      <span
                        className="inflected-new-price"
                        style={{ fontWeight: 'bold' }}
                      >
                        {price}
                      </span>
                      {oldPrice && (
                        <span
                          className="inflected-old-price"
                          style={{
                            marginLeft: '8px',
                            textDecoration: 'line-through',
                            opacity: 0.7,
                            fontWeight: 'bold',
                            color: oldPriceTextColor,
                          }}
                        >
                          {oldPrice}
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      {oldPrice && (
                        <span
                          className="inflected-old-price"
                          style={{
                            textDecoration: 'line-through',
                            opacity: 0.7,
                            marginRight: '8px',
                            fontWeight: 'bold',
                            color: oldPriceTextColor,
                          }}
                        >
                          {oldPrice}
                        </span>
                      )}
                      <span
                        className="inflected-new-price"
                        style={{ fontWeight: 'bold' }}
                      >
                        {price}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
            <div
              className="inflected-icon"
              onMouseEnter={handleButtonMouseEnter}
              onMouseLeave={handleButtonMouseLeave}
            >
              <a
                className="inflected-iconBox"
                style={{
                  '--button-bg': buttonBackgroundColor,
                  '--button-hover-bg': buttonBackgroundHoverColor,
                  '--icon-color': buttonIconColor,
                  '--icon-hover-color': buttonIconHoverColor,
                  '--icon-size': `${buttonIconSize}px`,
                } as React.CSSProperties}
              >
                {React.cloneElement(buttonIcon, {
                  size: buttonIconSize,
                  color: isButtonHovered
                    ? buttonIconHoverColor
                    : buttonIconColor,
                })}
              </a>
            </div>
          </div>
        </div>
        <div className="inflected-content">
          <h3
            style={{
              fontSize: fontSizes.title,
              color: titleColor,
              margin: margins.title,
              fontWeight: 'bold',
              direction: isRTLCheck(title) ? 'rtl' : 'ltr',
              textAlign: titleAlignment,
              ...reverseMirrorStyle,
            }}
            onMouseEnter={() => handleMouseEnter('title')}
          >
            {title}
          </h3>
          <p
            style={{
              fontSize: fontSizes.description,
              color: descriptionColor,
              margin: margins.description,
              direction: isRTLCheck(description) ? 'rtl' : 'ltr',
              textAlign: descriptionAlignment,
              ...reverseMirrorStyle,
            }}
            onMouseEnter={() => handleMouseEnter('description')}
          >
            {description}
          </p>
          <ul
            style={{
              margin: margins.tags,
              display: 'flex',
              justifyContent: tagsAlignment,
              flexWrap: 'wrap',
              gap: '0.625rem',
              ...reverseMirrorStyle,
            }}
          >
            {tags.map((tag, index) => (
              <li
                key={index}
                style={{
                  '--tag-bg': tag.backgroundColor,
                  '--tag-color': tag.textColor,
                  '--tag-rounding': `${tag.rounding}px`,
                  fontSize: fontSizes.tags,
                  direction: isRTLCheck(tag.name) ? 'rtl' : 'ltr',
                  textAlign: tag.alignment || 'left',
                  display: 'inline-block',
                } as React.CSSProperties}
                onMouseEnter={() => handleMouseEnter(`tag-${tag.name}`)}
              >
                {tag.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <style jsx>{`
        .inflected-card {
          position: relative;
          border-radius: var(--card-rounding);
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .inflected-cardInner {
          position: relative;
          width: 100%;
          height: 18.75rem;
          background: var(--parent-bg);
          border-radius: var(--card-rounding);
          border-bottom-right-radius: 0;
          overflow: hidden;
        }
        .inflected-box {
          width: 100%;
          height: 100%;
          overflow: hidden;
          position: relative;
        }
        .inflected-imgBox {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          border-radius: var(--card-rounding);
        }
        .inflected-icon {
          position: absolute;
          bottom: -0.375rem;
          right: -0.375rem;
          width: 6rem;
          height: 6rem;
          background: var(--parent-bg);
          border-top-left-radius: 50%;
          transition: all 0.3s ease;
        }
        .inflected-icon:hover .inflected-iconBox {
          transform: scale(1.1);
          cursor: pointer;
        }
        .inflected-icon::before {
          position: absolute;
          content: "";
          bottom: 0.375rem;
          left: -1.25rem;
          background: transparent;
          width: 1.25rem;
          height: 1.25rem;
          border-bottom-right-radius: 1.25rem;
          box-shadow: 0.313rem 0.313rem 0 0.313rem var(--parent-bg);
        }
        .inflected-icon::after {
          position: absolute;
          content: "";
          top: -1.25rem;
          right: 0.375rem;
          background: transparent;
          width: 1.25rem;
          height: 1.25rem;
          border-bottom-right-radius: 1.25rem;
          box-shadow: 0.313rem 0.313rem 0 0.313rem var(--parent-bg);
        }
        .inflected-iconBox {
          position: absolute;
          inset: 0.625rem;
          background: var(--button-bg);
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.3s ease;
        }
        .inflected-iconBox:hover {
          background: var(--button-hover-bg);
        }
        .inflected-iconBox :global(span) {
          color: var(--icon-color);
          font-size: var(--icon-size);
          transition: color 0.3s ease;
        }
        .inflected-iconBox:hover :global(span) {
          color: var(--icon-hover-color);
        }
        .inflected-content {
          padding: 0.938rem 0.625rem;
        }
        .inflected-content h3 {
          transition: color 0.3s ease;
        }
        .inflected-content p {
          transition: color 0.3s ease;
        }
        .inflected-content ul {
          margin: 0;
          padding: 0;
          list-style-type: none;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.625rem;
        }
        .inflected-content ul li {
          background: var(--tag-bg);
          color: var(--tag-color);
          font-weight: 700;
          padding: 0.375rem 0.625rem;
          border-radius: var(--tag-rounding);
          transition: all 0.3s ease;
        }
        .inflected-content ul li:hover {
          opacity: 0.8;
        }
      `}</style>
    </>
  );
};

export default InflectedCard;
