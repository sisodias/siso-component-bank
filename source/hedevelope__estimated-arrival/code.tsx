import { cn } from "@/lib/utils";
import { useState } from "react";

export interface EstimatedDateBadgeProps {
    estimatedDate?: string;
    dayOfWeek?: string;
    deliveryType?: string;
}

const EstimatedDateBadge: React.FC<EstimatedDateBadgeProps> = ({
    estimatedDate = 'September 28',
    dayOfWeek = 'Friday delivery',
    deliveryType = 'Free',
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleDetails = (): void => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="slide-in">
            <div className="badge-wrapper">
                <div className="badge-container">
                    <div
                        className="badge-card"
                        onClick={toggleDetails}
                    >
                        <div className="shimmer-overlay"></div>

                        <div className="badge-content">
                            <div className="icon-container">
                                <div className="icon-wrapper">
                                    <svg className="clock-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                            </div>

                            <div className="text-content">
                                <p className="label">Estimated Arrival</p>
                                <h3 className="date">{estimatedDate}</h3>
                                <p className="day">{dayOfWeek}</p>
                            </div>

                            <div className="badge-pill-container">
                                <div className="badge-pill">
                                    <p className="badge-text">{deliveryType}</p>
                                </div>
                                <svg
                                    className={`arrow-icon ${isOpen ? 'open' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <svg className="border-svg">
                        <rect
                            x="1"
                            y="1"
                            width="calc(100% - 2px)"
                            height="calc(100% - 2px)"
                            rx="16"
                            ry="16"
                            fill="none"
                            stroke="#db5d34"
                            strokeWidth="2"
                            className="sliding-line"
                            pathLength="1"
                        />
                    </svg>
                </div>

                <div className={`details-section ${isOpen ? 'open' : ''}`}>
                    <div className="details-card">
                        <div className="details-content">
                            <div className="detail-item">
                                <h4 className="detail-title">
                                    <span className="detail-number">1</span>
                                    Delivery Time
                                </h4>
                                <p className="detail-text">
                                    Orders are usually delivered within 7 working days.
                                </p>
                            </div>

                            <div className="detail-item detail-item-2">
                                <h4 className="detail-title">
                                    <span className="detail-number">2</span>
                                    Assembly
                                </h4>
                                <p className="detail-text">
                                    Products are sent unassembled. All necessary parts and assembly instructions are included in the package.
                                </p>
                            </div>

                            <div className="detail-item detail-item-3">
                                <h4 className="detail-title">
                                    <span className="detail-number">3</span>
                                    Technical Support
                                </h4>
                                <p className="detail-text">
                                    If needed, you can contact our technical team at <strong>+1 555 55 5</strong> phone number.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EstimatedDateBadge;