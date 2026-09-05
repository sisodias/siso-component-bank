"use client";

import React, {Fragment, MouseEvent, useMemo, useRef, useState} from "react";

const numberOfCols = 15;

const colors = ["#007BFF", "#FFD700", "#32CD32"];

const imagePositions = [
    {
        distanceFromLeft: 7,
        distanceFromTop: 12,
        height: 4,
        width: 3,
        url: "https://ik.imagekit.io/khoaphan/playground/Tiles%20Background/anime%20painting.webp?updatedAt=1727431865607",
        text: "Beach",
    },
    {
        distanceFromLeft: 20,
        distanceFromTop: 16,
        height: 4,
        width: 3,
        url: "https://ik.imagekit.io/khoaphan/playground/Tiles%20Background/minimal.webp?updatedAt=1727431865328",
        text: "Forest",
    },
    {
        distanceFromLeft: 14,
        distanceFromTop: 20,
        width: 4,
        height: 3,
        url: "https://ik.imagekit.io/khoaphan/playground/Tiles%20Background/A%20person%20standing%20inside%20of%20a%20wooden%20structure.webp?updatedAt=1727431865057",
        text: "Cave",
    },
    {
        distanceFromLeft: 16,
        distanceFromTop: 11,
        width: 3,
        height: 2,
        url: "https://ik.imagekit.io/khoaphan/playground/Tiles%20Background/cube%20cutout%20of%20an%20isometric%20oil%20painters%20studio.webp?updatedAt=1727431865089",
        text: "Home",
    },
    {
        distanceFromLeft: 9,
        distanceFromTop: 7,
        width: 4,
        height: 3,
        url: "https://ik.imagekit.io/khoaphan/playground/Tiles%20Background/Drawing%20rice%20field%20terrasses%20on%20mountains%20in%20the%20p.webp?updatedAt=1727433283382",
        text: "Terrace",
    },
];

export const TilesBackground = () => {
    const left = useRef(0);
    const top = useRef(0);
    const indicator = useRef<HTMLDivElement>(null);
    const [imageText, setImageText] = useState<string>(imagePositions[0].text);

    // To create the image size (unit is tile)
    const createSize = ({
        distanceFromLeft,
        distanceFromTop,
        width,
        height,
    }: {
        distanceFromLeft: number;
        distanceFromTop: number;
        width: number;
        height: number;
    }) => {
        const totalCols = numberOfCols * 2;

        const left = (distanceFromLeft / totalCols) * 100;
        const top = (distanceFromTop / totalCols) * 100;
        const tileWidth = (width / totalCols) * 100;
        const aspectRatio = width / height;

        return {
            left: `${left}%`,
            top: `${top}%`,
            width: `${tileWidth}%`,
            aspectRatio,
        };
    };

    // Mouse events on tiles
    const onMouseTileEnter = (event: MouseEvent<HTMLDivElement>) => {
        (event.target as HTMLDivElement).style.backgroundColor =
            colors[Math.floor(Math.random() * colors.length)];
    };

    const onMouseTileLeave = (event: MouseEvent<HTMLDivElement>) => {
        (event.target as HTMLDivElement).style.backgroundColor = "transparent";
    };

    // Mouse events on image
    const onMouseImageMove = (
        event: MouseEvent<HTMLDivElement>,
        text: string
    ) => {
        if (text !== imageText) setImageText(text);

        left.current = event.clientX;
        top.current = event.clientY;

        indicator.current?.animate(
            {
                transform: `translate(${left.current}px, calc(-100% + ${top.current}px) )`,
                opacity: 1,
            },
            {duration: 1000, fill: "forwards"}
        );
    };
    const onMouseImageLeave = () => {
        indicator.current?.animate(
            {
                opacity: 0,
            },
            {duration: 300, fill: "forwards"}
        );
    };

    const staticTiles = useMemo(
        () =>
            Array.from({length: Math.pow(numberOfCols, 2)}).map((_, index) => {
                return (
                    <div
                        className="relative grid grid-cols-2 text-white/70"
                        key={index}>
                        <svg
                            viewBox="0 0 114 113"
                            className="absolute left-1/2 top-1/2 size-[15%] -translate-x-1/2 -translate-y-1/2">
                            <path
                                d="M57.5 0L57.5 113M0.5 56H113.5"
                                stroke="currentColor"
                                strokeWidth={3}
                            />
                        </svg>

                        {Array.from({length: 4}).map((_, childIndex) => {
                            return (
                                <div
                                    onMouseLeave={onMouseTileLeave}
                                    onMouseEnter={onMouseTileEnter}
                                    key={childIndex}
                                    className="aspect-square bg-transparent outline outline-1 outline-white/5 transition duration-1000 ease-linear hover:duration-0"></div>
                            );
                        })}
                    </div>
                );
            }),
        []
    );

    return (
        <Fragment>
            <article className="aspect-square overflow-hidden bg-white/5">
                <div
                    // to center to grid container
                    className="relative -ml-[10%] -mt-[10%] grid w-[120%]"
                    style={{
                        gridTemplateColumns: `repeat(${numberOfCols},1fr)`,
                        transform: "skewX(-48deg) skewY(14deg) scaleX(2)",
                    }}>
                    {staticTiles}
                    {imagePositions.map((image, index) => {
                        return (
                            <div
                                key={index}
                                onMouseMove={(e) =>
                                    onMouseImageMove(e, image.text)
                                }
                                onMouseLeave={onMouseImageLeave}
                                style={createSize(image)}
                                className="group absolute z-10 bg-white/5 shadow-[12px_20px_50px] shadow-white/20">
                                <img
                                    src={image.url}
                                    className="h-full w-full object-cover grayscale transition-[filter] duration-200 group-hover:grayscale-0"
                                    alt="tile image"
                                />
                            </div>
                        );
                    })}

                    <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-center font-poppins text-[3vw] font-semibold text-white">
                        Explore
                    </div>
                </div>
            </article>
            <div
                ref={indicator}
                className="pointer-events-none fixed left-0 top-0 z-10 opacity-0 mix-blend-difference will-change-transform">
                <p className="-translate-x-1/2 text-white">{imageText}</p>
                <div className="h-20 w-px bg-white"></div>
            </div>
        </Fragment>
    );
};