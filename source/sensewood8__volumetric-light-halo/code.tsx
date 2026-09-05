import React, { useEffect, useRef } from 'react';

interface VolumetricLightHaloProps {
    projectId?: string;
    className?: string;
}

declare global {
    interface Window {
        UnicornStudio?: any;
    }
}

const VolumetricLightHalo: React.FC<VolumetricLightHaloProps> = ({
    projectId = "BhoqrigscYbD7NN1fwcp",
    className = ""
}) => {
    const container1Ref = useRef<HTMLDivElement>(null);
    const container2Ref = useRef<HTMLDivElement>(null);
    const scriptLoadedRef = useRef(false);

    useEffect(() => {
        const loadScript = () => {
            if (scriptLoadedRef.current) return;

            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js';
            script.async = true;

            script.onload = () => {
                scriptLoadedRef.current = true;
                if (window.UnicornStudio) {
                    console.log('Unicorn Studio loaded, initializing project...');
                    // Initialize the Unicorn Studio project
                    window.UnicornStudio.init();
                }
            };

            document.head.appendChild(script);

            return () => {
                if (script.parentNode) {
                    script.parentNode.removeChild(script);
                }
            };
        };

        loadScript();
    }, [projectId]);

    return (
        <div className={`relative w-full h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 overflow-hidden ${className}`}>
            <div
                ref={container1Ref}
                data-us-project={projectId}
                className="absolute top-0 left-0 w-full h-full"
            />
            <div
                ref={container2Ref}
                data-us-project={projectId}
                className="absolute top-0 left-0 w-full h-full"
            />
        </div>
    );
};

export default VolumetricLightHalo;
