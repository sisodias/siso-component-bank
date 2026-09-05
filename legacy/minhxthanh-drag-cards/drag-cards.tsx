import React, { useState, useEffect, useRef } from 'react';

// Card data with titles and image URLs
const travelDestinations = [
  {
    id: 1,
    title: 'Mountain Retreat',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1752659924623-491a6e7e2546?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 2,
    title: 'Coastal Village',
    imageUrl: 'https://images.unsplash.com/photo-1752986002031-579569bd3d6d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzNXx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 3,
    title: 'Desert Adventure',
    imageUrl: 'https://images.unsplash.com/photo-1752517497978-9c30910641af?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0NHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 4,
    title: 'Lakeside Serenity',
    imageUrl: 'https://images.unsplash.com/photo-1752835251736-244769f0aa5e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0OXx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 5,
    title: 'Ancient Ruins',
    imageUrl: 'https://images.unsplash.com/photo-1750688650077-143cec3d0aa8?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMTN8fHxlbnwwfHx8fHw%3D%3D',
  },
  {
    id: 6,
    title: 'Canyon Exploration',
    imageUrl: 'https://images.unsplash.com/photo-1682686581264-c47e25e61d95?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMXx8fGVufDB8fHx8fA%3D%3D',
  },
];

/**
 * A single draggable card component.
 * It manages its own position and handles drag events for mouse and touch.
 */
const DraggableCard = ({ id, title, imageUrl, initialPosition, rotation, containerRef, zIndex, onBringToFront }) => {
  // State to hold the card's position
  const [position, setPosition] = useState(initialPosition);
  // State to track dragging status
  const [isDragging, setIsDragging] = useState(false);
  // Ref to the card element
  const cardRef = useRef(null);
  // Ref to store the offset between mouse/touch point and card's top-left corner
  const dragOffset = useRef({ x: 0, y: 0 });

  // Common function to start dragging
  const handleDragStart = (clientX, clientY) => {
    if (!cardRef.current) return;
    
    onBringToFront(id);
    setIsDragging(true);

    const cardRect = cardRef.current.getBoundingClientRect();
    // Calculate and store the initial offset
    dragOffset.current = {
      x: clientX - cardRect.left,
      y: clientY - cardRect.top,
    };
    
    // Prevent text selection while dragging
    document.body.style.userSelect = 'none';
  };

  // Mouse down event handler
  const onMouseDown = (e) => {
    handleDragStart(e.clientX, e.clientY);
  };

  // Touch start event handler
  const onTouchStart = (e) => {
    handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
  };

  // Common function to handle the drag movement
  const handleDragMove = (clientX, clientY) => {
    if (!isDragging || !containerRef.current || !cardRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const cardRect = cardRef.current.getBoundingClientRect();

    // Calculate new position relative to the container
    let newX = clientX - containerRect.left - dragOffset.current.x;
    let newY = clientY - containerRect.top - dragOffset.current.y;

    // Constrain the card within the container boundaries
    newX = Math.max(0, Math.min(newX, containerRect.width - cardRect.width));
    newY = Math.max(0, Math.min(newY, containerRect.height - cardRect.height));

    setPosition({ x: newX, y: newY });
  };
  
  // Effect to add and clean up move/end event listeners
  useEffect(() => {
    const onMouseMove = (e) => handleDragMove(e.clientX, e.clientY);
    const onTouchMove = (e) => handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
    
    const handleDragEnd = () => {
      setIsDragging(false);
      // Re-enable text selection
      document.body.style.userSelect = '';
    };

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', handleDragEnd);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, containerRef]);


  return (
    <div
      ref={cardRef}
      className="absolute w-48 md:w-56 bg-white rounded-xl shadow-lg cursor-grab active:cursor-grabbing transition-all duration-300 hover:shadow-xl"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: zIndex,
        touchAction: 'none', // Prevents default touch behaviors like scrolling
        transform: `rotate(${rotation}deg)`, // Apply initial rotation
      }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      <img
        src={imageUrl}
        alt={title}
        className="w-full aspect-[2/3] object-cover rounded-t-xl pointer-events-none"
        // Fallback placeholder image
        onError={(e) => {
          e.target.onerror = null; 
          e.target.src="https://placehold.co/400x600/e2e8f0/4a5568?text=Image+Not+Found";
        }}
      />
      <div className="p-4">
        <h3 className="text-center font-semibold text-gray-800">{title}</h3>
      </div>
    </div>
  );
};

export const CardDrag = () => {
  const containerRef = useRef(null);
  const [initialLayouts, setInitialLayouts] = useState([]);
  // State to manage z-index of cards
  const [cardZIndices, setCardZIndices] = useState({});

  // Initialize card positions and z-indices once the container is available
  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const cardWidth = 224; // Corresponds to md:w-56

      // Define static layouts (position and rotation) for each card
      // to match the user's image.
      const layouts = [
        // Left side cards
        { id: 2, x: 80,  y: 100, rotation: -8 },
        { id: 3, x: 180, y: 300, rotation: 5 },
        { id: 6, x: 60,  y: 480, rotation: -3 },
        // Right side cards
        { id: 1, x: containerWidth - cardWidth - 100, y: 120, rotation: 8 },
        { id: 4, x: containerWidth - cardWidth - 200, y: 320, rotation: -6 },
        { id: 5, x: containerWidth - cardWidth - 90,  y: 520, rotation: 4 },
      ];

      // Match layouts to the travelDestinations array
      const sortedLayouts = travelDestinations.map(card => {
        const layout = layouts.find(l => l.id === card.id);
        return {
            position: { x: layout.x, y: layout.y },
            rotation: layout.rotation,
        };
      });

      setInitialLayouts(sortedLayouts);

      // Initialize z-indices, starting from a base value higher than the title
      const zIndices = {};
      travelDestinations.forEach((card, index) => {
        zIndices[card.id] = 20 + index; // Start z-indices from 20
      });
      setCardZIndices(zIndices);
    }
  }, []);

  // Function to bring a card to the front by giving it the highest z-index
  const bringToFront = (cardId) => {
    setCardZIndices(prevZIndices => {
      const maxZ = Math.max(...Object.values(prevZIndices));
      // Only update if the clicked card is not already on top
      if (prevZIndices[cardId] <= maxZ) {
        return {
          ...prevZIndices,
          [cardId]: maxZ + 1,
        };
      }
      return prevZIndices;
    });
  };


  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-white dark:bg-black overflow-hidden"
    >
      {/* Centered Title */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-10 p-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-400 opacity-40">Plan Your Next Adventure</h1>
          <p className="text-lg text-gray-600 mt-2 opacity-50">Discover and plan your perfect getaway.</p>
      </div>

      {/* Draggable Cards */}
      {initialLayouts.length > 0 && travelDestinations.map((card, index) => (
        <DraggableCard
          key={card.id}
          id={card.id}
          title={card.title}
          imageUrl={card.imageUrl}
          initialPosition={initialLayouts[index].position}
          rotation={initialLayouts[index].rotation}
          containerRef={containerRef}
          zIndex={cardZIndices[card.id] || 20}
          onBringToFront={bringToFront}
        />
      ))}
    </div>
  );
};