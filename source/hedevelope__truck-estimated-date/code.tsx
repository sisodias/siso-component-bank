import { cn } from "@/lib/utils";
import { DotLottiePlayer } from '@dotlottie/react-player';
import '@dotlottie/react-player/dist/index.css';

export interface DeliveryWidgetProps {
    estimatedDate?: string;
    deliveryDays?: number;
    freeShipping?: boolean;
    deliveryTimeText?: string;
    assemblyText?: string;
    lottieUrl?: string;
}

const DeliveryWidget: React.FC<DeliveryWidgetProps> = ({
    estimatedDate = 'November 28',
    deliveryDays = 7,
    freeShipping = true,
    deliveryTimeText = 'Orders are usually delivered within 7 working days.',
    assemblyText = 'Products are sent unassembled. All necessary parts and assembly instructions are included in the package.',
    lottieUrl = 'https://lottie.host/96b5edc1-a42a-4c40-b1e2-a6e2f01912c2/2R0x49XZKb.lottie'
}) => {
    return (
        <div className="delivery-widget">
            <div className="widget-header">
                <DotLottiePlayer
                    src={lottieUrl}
                    autoplay
                    loop
                    style={{ width: '64px', height: '64px' }}
                />
                <div className="header-content">
                    <div className="header-top-row">
                        <div className="header-text">
                            <h3>Estimated Date</h3>
                            <p>{estimatedDate}</p>
                        </div>
                        {freeShipping && <span className="badge-free">Free Shipping</span>}
                    </div>
                </div>
            </div>

            <div className="info-list">
                <div className="info-row">
                    <div className="icon-dot"></div>
                    <div className="info-content">
                        <h4>Delivery Time</h4>
                        <p>{deliveryTimeText}</p>
                    </div>
                </div>

                <div className="info-row">
                    <div className="icon-dot"></div>
                    <div className="info-content">
                        <h4>Assembly</h4>
                        <p>{assemblyText}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryWidget;
