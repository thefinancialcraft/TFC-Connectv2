import { useState, useEffect, useRef } from 'react';

interface Slide {
  title: string;
  image: string;
  description: string;
}

const slides: Slide[] = [
  {
    title: "Welcome to TFC Connect",
    image: "https://lh3.googleusercontent.com/d/1At7HgezDw8fFlfowrDBWtmIWVJMhpQI9",
    description: "Transform the way you work with seamless tools designed just for you!"
  },
  {
    title: "One Dashboard, Infinite Possibilities",
    image: "https://lh3.googleusercontent.com/d/1FWD6JK0ADAeh8PGt6C3z3cZbVoWPO-XN",
    description: "Streamline your workflow with an all-in-one platform that adapts to your needs!"
  },
  {
    title: "Effortlessly Track Your Records",
    image: "https://lh3.googleusercontent.com/d/1V7pbwWy8xcET8l5fz9aR6ZSwgtFl4v6n",
    description: "Stay organized and informed with intuitive tracking that keeps you in control!"
  },
  {
    title: "Instantly Mark Your Attendance",
    image: "https://lh3.googleusercontent.com/d/13JN_m24KBSRqYXACgmQ-zeqVkP_81GqP",
    description: "Simplify your routine with our user-friendly attendance feature that saves you time!"
  },
  {
    title: "Celebrate Your Achievements",
    image: "https://lh3.googleusercontent.com/d/1DUvzrq8Wuv2NExXmtRwx0KE_fDxbfbl0",
    description: "Reflect on your journey and stay inspired with clear visibility into your progress!"
  },
  {
    title: "Watch Your Profits Soar",
    image: "https://lh3.googleusercontent.com/d/11xHrJBtBcTx4L7q9fytqQj6415z4RemQ",
    description: "Stay connected to your financial growth with real-time insights and updates"
  },
  {
    title: "Unlock More Exciting Features",
    image: "https://lh3.googleusercontent.com/d/1sYGFJj3guFOM2L7GwLOJXNTO27UptrKP",
    description: "Discover a world of additional tools designed to supercharge your productivity"
  }
];

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = prev + 1;
        // Loop back to first slide after the last one
        if (nextIndex >= slides.length) {
          return 0;
        }
        return nextIndex;
      });
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (sliderRef.current) {
      // Each slide takes 100/slides.length% of the slider width
      // To move to slide N, we translate by N * (100/slides.length)%
      const translateX = -currentIndex * (100 / slides.length);
      sliderRef.current.style.transform = `translateX(${translateX}%)`;
      sliderRef.current.style.transition = 'transform 0.5s ease-in-out';
    }
  }, [currentIndex]);

  const handleSwipe = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="hero-container h-full flex flex-col overflow-hidden" style={{ fontFamily: "'Roboto', sans-serif", backgroundColor: '#f6f5ff' }}>
      {/* Slider Section */}
      <div className="flex-1 relative overflow-hidden" style={{ width: '100%' }}>
        <div 
          ref={sliderRef}
          className="slider flex"
          style={{
            width: `${slides.length * 100}%`,
            height: '100%',
            transform: `translateX(0%)`,
          }}
        >
          {slides.map((slide, index) => (
            <div 
              key={index}
              className="slide flex-shrink-0 flex flex-col items-center justify-center text-center px-4"
              style={{ width: `${100 / slides.length}%`, minWidth: `${100 / slides.length}%`, height: '100%' }}
            >
              <h1 
                className="mb-6"
                style={{ 
                  fontFamily: "'Roboto', sans-serif",
                  color: '#4931e7',
                  fontWeight: 600,
                  width: '80%',
                  fontSize: '1.7vw'
                }}
              >
                {slide.title}
              </h1>
              <div className="mb-6 flex items-center justify-center" style={{ width: '100%', minHeight: '180px', maxHeight: '250px' }}>
                <img 
                  src={slide.image} 
                  alt={slide.title}
                  style={{
                    width: 'auto',
                    height: 'auto',
                    maxWidth: '100%',
                    maxHeight: '250px',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
              </div>
              <p 
                style={{ 
                  fontFamily: "'Roboto', sans-serif",
                  color: '#847fa5',
                  width: '70%',
                  fontSize: '1.1vw',
                  fontWeight: 400
                }}
              >
                {slide.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

