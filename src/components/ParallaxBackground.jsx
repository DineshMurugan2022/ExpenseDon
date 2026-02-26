import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const ParallaxBackground = () => {
    const bgRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const xPos = (clientX / window.innerWidth - 0.5) * 40;
            const yPos = (clientY / window.innerHeight - 0.5) * 40;

            gsap.to(bgRef.current, {
                x: xPos,
                y: yPos,
                duration: 1,
                ease: "power2.out"
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-background">
            <div
                ref={bgRef}
                className="absolute inset-[-10%] opacity-20"
                style={{
                    backgroundImage: `
                        radial-gradient(circle at 20% 30%, #00f2ff 0%, transparent 40%),
                        radial-gradient(circle at 80% 70%, #10b981 0%, transparent 40%),
                        radial-gradient(circle at 50% 50%, #8b5cf6 0%, transparent 50%)
                    `,
                    filter: "blur(100px)"
                }}
            />
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }} />
        </div>
    );
};

export default ParallaxBackground;
