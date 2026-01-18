import React, { useState, useRef, useEffect } from 'react';
import { X, Heart, Star, SkipForward, RotateCcw, ThumbsDown, ThumbsUp } from 'lucide-react';

export interface Position {
  x: number;
  y: number;
}

export type SwipeDirection = 'left' | 'right' | 'up' | 'down';

export interface CardItem {
  image: string;
  title: string;
  description: string;
  [key: string]: any;
}

export interface SwipeCardProps {
  item: CardItem;
  onSwipe: (direction: SwipeDirection) => void;
  isTop: boolean;
  zIndex: number;
  triggerSwipe: SwipeDirection | null;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({ item, onSwipe, isTop, zIndex, triggerSwipe }) => {
  const [{ x, y }, setPos] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startPos, setStartPos] = useState<Position>({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleStart = (clientX: number, clientY: number, e?: React.MouseEvent | React.TouchEvent): void => {
    // Prevent default to stop Safari scrolling
    if (e) {
      e.preventDefault();
    }
    setIsDragging(true);
    setStartPos({ x: clientX - x, y: clientY - y });
    // Prevent scrolling while dragging
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
  };

  const handleMove = (clientX: number, clientY: number, e?: React.MouseEvent | React.TouchEvent): void => {
    if (!isDragging) return;
    // Prevent default to stop Safari scrolling
    if (e) {
      e.preventDefault();
    }
    const newX = clientX - startPos.x;
    const newY = clientY - startPos.y;
    setPos({ x: newX, y: newY });
  };

  const handleEnd = (): void => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // Re-enable scrolling
    document.body.style.overflow = '';
    document.body.style.touchAction = '';

    const threshold = 100;
    let direction: SwipeDirection | null = null;

    if (Math.abs(x) > Math.abs(y)) {
      if (x > threshold) direction = 'right';
      else if (x < -threshold) direction = 'left';
    } else {
      if (y > threshold) direction = 'down';
      else if (y < -threshold) direction = 'up';
    }

    if (direction) {
      animateExit(direction);
    } else {
      setPos({ x: 0, y: 0 });
    }
  };

  const animateExit = (direction: SwipeDirection): void => {
    const exitX = direction === 'right' ? 1000 : direction === 'left' ? -1000 : x;
    const exitY = direction === 'up' ? -1000 : direction === 'down' ? 1000 : y;
    setPos({ x: exitX, y: exitY });
    setTimeout(() => onSwipe(direction), 300);
  };

  useEffect(() => {
    if (triggerSwipe && isTop) {
      animateExit(triggerSwipe);
    }
  }, [triggerSwipe, isTop]);

  // Cleanup: re-enable scrolling if component unmounts while dragging
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, []);

  const rotation = x / 20;

  return (
    <div
      ref={cardRef}
      onMouseDown={(e: React.MouseEvent) => handleStart(e.clientX, e.clientY, e)}
      onMouseMove={(e: React.MouseEvent) => handleMove(e.clientX, e.clientY, e)}
      onMouseUp={handleEnd}
      onTouchStart={(e: React.TouchEvent) => handleStart(e.touches[0].clientX, e.touches[0].clientY, e)}
      onTouchMove={(e: React.TouchEvent) => handleMove(e.touches[0].clientX, e.touches[0].clientY, e)}
      onTouchEnd={handleEnd}
      className="absolute select-none cursor-grab active:cursor-grabbing"
      style={{
        transform: `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${isTop ? 1 : 0.95})`,
        transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        zIndex,
        width: '100%',
        height: '100%',
        touchAction: 'none',
      }}
    >
      <div className="w-full h-full bg-white rounded-2xl overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-2/3 object-cover pointer-events-none"
          draggable="false"
        />
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{item.title}</h2>
          <p className="text-gray-600">{item.description}</p>
        </div>
      </div>

      {isTop && Math.abs(x) > 50 && (
        <div
          className="absolute top-8 right-8 text-6xl font-bold border-4 px-4 py-2 rounded-lg rotate-12"
          style={{
            opacity: Math.abs(x) / 100,
            color: x > 0 ? '#22c55e' : '#ef4444',
            borderColor: x > 0 ? '#22c55e' : '#ef4444',
          }}
        >
          {x > 0 ? 'LIKE' : 'NOPE'}
        </div>
      )}

      {isTop && Math.abs(y) > 50 && Math.abs(x) < 50 && (
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl font-bold border-4 px-4 py-2 rounded-lg"
          style={{
            opacity: Math.abs(y) / 100,
            color: y < 0 ? '#3b82f6' : '#f59e0b',
            borderColor: y < 0 ? '#3b82f6' : '#f59e0b',
          }}
        >
          {y < 0 ? 'SUPER' : 'SKIP'}
        </div>
      )}
    </div>
  );
};

export interface SwipeCardsProps {
  cards: CardItem[];
  onSwipeLeft?: (card: CardItem, index: number) => void;
  onSwipeRight?: (card: CardItem, index: number) => void;
  onSwipeUp?: (card: CardItem, index: number) => void;
  onSwipeDown?: (card: CardItem, index: number) => void;
  enableLeft?: boolean;
  enableRight?: boolean;
  enableUp?: boolean;
  enableDown?: boolean;
  showButtons?: boolean;
}

export const SwipeCards: React.FC<SwipeCardsProps> = ({
  cards,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  enableLeft = true,
  enableRight = true,
  enableUp = true,
  enableDown = true,
  showButtons = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [removedCards, setRemovedCards] = useState<number[]>([]);
  const [triggerSwipe, setTriggerSwipe] = useState<SwipeDirection | null>(null);

  const handleSwipe = (direction: SwipeDirection): void => {
    const card = cards[currentIndex];
    
    const handlers: Record<SwipeDirection, ((card: CardItem, index: number) => void) | undefined> = {
      left: enableLeft ? onSwipeLeft : undefined,
      right: enableRight ? onSwipeRight : undefined,
      up: enableUp ? onSwipeUp : undefined,
      down: enableDown ? onSwipeDown : undefined,
    };

    const handler = handlers[direction];
    if (handler) {
      handler(card, currentIndex);
      setRemovedCards([...removedCards, currentIndex]);
      setCurrentIndex(currentIndex + 1);
      setTriggerSwipe(null);
    }
  };

  const handleButtonClick = (direction: SwipeDirection): void => {
    setTriggerSwipe(direction);
  };

  const handleUndo = (): void => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setRemovedCards(removedCards.slice(0, -1));
    }
  };

  const visibleCards = cards.slice(currentIndex, currentIndex + 3);

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="relative w-full flex-1 mb-6">
        {visibleCards.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-2xl text-gray-400 mb-4">No more cards!</p>
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setRemovedCards([]);
                }}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        ) : (
          visibleCards.map((card, idx) => (
            <SwipeCard
              key={currentIndex + idx}
              item={card}
              onSwipe={handleSwipe}
              isTop={idx === 0}
              zIndex={visibleCards.length - idx}
              triggerSwipe={idx === 0 ? triggerSwipe : null}
            />
          ))
        )}
      </div>

      {showButtons && visibleCards.length > 0 && (
        <>
          {/* Desktop buttons */}
          <div className="hidden md:flex gap-4 justify-center">
            <button
              onClick={handleUndo}
              disabled={currentIndex === 0}
              className="w-14 h-14 rounded-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white shadow-lg transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
              title="Undo"
            >
              <RotateCcw size={24} />
            </button>
            {enableLeft && (
              <button
                onClick={() => handleButtonClick('left')}
                className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
                title="Nope"
              >
                <X size={32} />
              </button>
            )}
            {enableUp && (
              <button
                onClick={() => handleButtonClick('up')}
                className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
                title="Super Like"
              >
                <Star size={24} />
              </button>
            )}
            {enableRight && (
              <button
                onClick={() => handleButtonClick('right')}
                className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
                title="Like"
              >
                <Heart size={32} />
              </button>
            )}
            {enableDown && (
              <button
                onClick={() => handleButtonClick('down')}
                className="w-14 h-14 rounded-full bg-purple-500 hover:bg-purple-600 text-white shadow-lg transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
                title="Skip"
              >
                <SkipForward size={24} />
              </button>
            )}
          </div>

          {/* Mobile buttons */}
          <div className="md:hidden w-full px-4">
            <div className="flex gap-3 justify-center mb-3">
              {enableLeft && (
                <button
                  onClick={() => handleButtonClick('left')}
                  className="flex-1 max-w-[160px] h-14 rounded-full bg-red-500 active:bg-red-600 text-white shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <ThumbsDown size={24} />
                  <span className="font-semibold">Nope</span>
                </button>
              )}
              {enableRight && (
                <button
                  onClick={() => handleButtonClick('right')}
                  className="flex-1 max-w-[160px] h-14 rounded-full bg-green-500 active:bg-green-600 text-white shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <ThumbsUp size={24} />
                  <span className="font-semibold">Like</span>
                </button>
              )}
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleUndo}
                disabled={currentIndex === 0}
                className="w-12 h-12 rounded-full bg-yellow-500 active:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white shadow-lg transition-all active:scale-95 flex items-center justify-center"
              >
                <RotateCcw size={20} />
              </button>
              {enableUp && (
                <button
                  onClick={() => handleButtonClick('up')}
                  className="w-12 h-12 rounded-full bg-blue-500 active:bg-blue-600 text-white shadow-lg transition-all active:scale-95 flex items-center justify-center"
                >
                  <Star size={20} />
                </button>
              )}
              {enableDown && (
                <button
                  onClick={() => handleButtonClick('down')}
                  className="w-12 h-12 rounded-full bg-purple-500 active:bg-purple-600 text-white shadow-lg transition-all active:scale-95 flex items-center justify-center"
                >
                  <SkipForward size={20} />
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

