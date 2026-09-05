import { cn } from "@/lib/utils";
import { useState } from "react";
import { DotLottiePlayer } from '@dotlottie/react-player';
import '@dotlottie/react-player/dist/index.css';

export interface EstimatedDateCardProps {
    dateRange?: string;
    lottieUrl?: string;
    label?: string;
}

const EstimatedDateCard: React.FC<EstimatedDateCardProps> = ({
    dateRange = 'January 7 - 10',
    lottieUrl = 'https://lottie.host/cbf27e7b-ff7d-49bf-bec8-0893ea01f1b6/Lop8linOoN.lottie',
    label = 'Estimated Arrival Date',
}) => {
    return (
        <div className="est-card">
            <DotLottiePlayer
                src={lottieUrl}
                autoplay
                loop
                style={{ width: '100%', height: '36px' }}
            />

            <div className="est-arrives-by">
                <svg className="calendar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
                <span className="est-label">{label}</span>
            </div>

            <div className="est-date-text">{dateRange}</div>
        </div>
    );
};

export default EstimatedDateCard;
