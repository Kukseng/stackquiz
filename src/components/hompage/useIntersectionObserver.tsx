
// import { useState, useEffect, useRef } from 'react';

// export function useIntersectionObserver  (threshold: number = 0.1, rootMargin: string = '-50px'): [React.RefObject<HTMLElement>, boolean]  {
//   const [isVisible, setIsVisible] = useState<boolean>(false);
//   const ref = useRef<HTMLElement>(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => setIsVisible(entry.isIntersecting),
//       { threshold, rootMargin }
//     );

//     if (ref.current) observer.observe(ref.current);
//     return () => observer.disconnect();
//   }, [threshold, rootMargin]);

//   return [ref, isVisible];
// };