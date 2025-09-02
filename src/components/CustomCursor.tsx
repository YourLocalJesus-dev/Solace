// src/components/CustomCursor.tsx
import React, { useEffect, useRef } from 'react';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hide the default cursor for all elements
    const hideDefaultCursor = () => {
      const style = document.createElement('style');
      style.innerHTML = `
        * {
          cursor: none !important;
        }
      `;
      document.head.appendChild(style);
      return style;
    };

    const styleElement = hideDefaultCursor();

    // Use requestAnimationFrame for smooth animation
    let animationFrameId: number;
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const animate = () => {
      // Smooth follow with lerp (linear interpolation)
      cursorX = lerp(cursorX, mouseX, 0.2);
      cursorY = lerp(cursorY, mouseY, 0.2);
      
      if (cursorRef.current) {
        cursorRef.current.style.left = `${cursorX}px`;
        cursorRef.current.style.top = `${cursorY}px`;
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.onclick !== null ||
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.classList.contains('cursor-pointer')
      ) {
        cursorRef.current?.classList.add('pointer');
      } else {
        cursorRef.current?.classList.remove('pointer');
      }
    };

    const onMouseEnter = () => {
      cursorRef.current?.classList.remove('hidden');
    };

    const onMouseLeave = () => {
      cursorRef.current?.classList.add('hidden');
    };

    // Start animation
    animate();

    // Add event listeners
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      // Clean up
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
      
      if (styleElement && document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  // Inline styles for the cursor
  const cursorStyles = `
    .custom-cursor {
      width: 8px;
      height: 8px;
      background-color: #fff;
      border-radius: 50%;
      position: fixed;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      transition: width 0.15s ease, height 0.15s ease, background-color 0.15s ease;
      box-shadow: 0 0 10px rgba(192, 132, 252, 0.8),
                  0 0 20px rgba(192, 132, 252, 0.5);
      left: 0;
      top: 0;
    }
    
    .custom-cursor.pointer {
      width: 16px;
      height: 16px;
      background-color: rgba(236, 72, 153, 0.8);
      box-shadow: 0 0 15px rgba(236, 72, 153, 0.8),
                  0 0 30px rgba(236, 72, 153, 0.6);
    }
    
    .custom-cursor.hidden {
      opacity: 0;
    }
  `;

  return (
    <>
      <style>{cursorStyles}</style>
      <div 
        ref={cursorRef}
        className="custom-cursor"
      />
    </>
  );
};

export default CustomCursor;