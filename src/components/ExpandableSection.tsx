import React, { useState, useRef, useEffect, ReactNode } from 'react';

interface ExpandableSectionProps {
  buttonId: string;
  sectionId: string;
  children: ReactNode;
}

export const ExpandableSection: React.FC<ExpandableSectionProps> = ({ buttonId, sectionId, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const buttonElement = document.getElementById(buttonId);
    const sectionElement = document.getElementById(sectionId);

    if (buttonElement && sectionElement) {
      buttonRef.current = buttonElement as HTMLButtonElement;
      sectionRef.current = sectionElement as HTMLDivElement;

      const handleClick = () => {
        setIsExpanded((prev) => !prev);
      };

      buttonRef.current.addEventListener('click', handleClick);

      return () => {
        if (buttonRef.current) {
          buttonRef.current.removeEventListener('click', handleClick);
        }
      };
    }
  }, [buttonId, sectionId]);

  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.style.display = isExpanded ? 'block' : 'none';
    }
  }, [isExpanded]);

  return <>{children}</>;
};

// Example Usage:

// const MyComponent: React.FC = () => {
//   return (
//     <div>
//       <button id="myButton">Toggle Section</button>

//       <div style={{ marginTop: '50px' }}>
//         {/* Some other content */}
//         <p>This is some other content on the page.</p>
//       </div>

//       <div id="mySection" style={{ display: 'none', border: '1px solid #ccc', padding: '10px' }}>
//         <p>This is the expanded section content.</p>
//         <ul>
//           <li>Item 1</li>
//           <li>Item 2</li>
//           <li>Item 3</li>
//         </ul>
//       </div>

//       <ExpandableSection buttonId="myButton" sectionId="mySection">
//           {/* Children are optional when using this approach */}
//       </ExpandableSection>










//       <button id="anotherButton">Toggle Another Section</button>

//       <div id="anotherSection" style={{ display: 'none', border: '1px solid blue', padding: '10px' }}>
//         <p>Another section!</p>
//       </div>

//       <ExpandableSection buttonId="anotherButton" sectionId="anotherSection" >
//         {/* Children are optional when using this approach */}
//       </ExpandableSection>
//     </div>
//   );
// };

// export default MyComponent;