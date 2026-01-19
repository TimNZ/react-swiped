# react-swiped

A React component library for swipeable card interfaces.

## Installation

```bash
npm install react-swiped
```

## Usage

```tsx
import { SwipeCards, CardItem } from 'react-swiped';

const cards: CardItem[] = [
  {
    image: 'https://example.com/image1.jpg',
    title: 'Beautiful Sunset',
    description: 'A stunning sunset over the mountains',
  },
  {
    image: 'https://example.com/image2.jpg',
    title: 'Ocean Waves',
    description: 'Peaceful waves crashing on the shore',
  },
];

function App() {
  return (
    <SwipeCards
      cards={cards}
      onSwipeLeft={(card, index) => console.log('Nope:', card.title)}
      onSwipeRight={(card, index) => console.log('Like:', card.title)}
      onSwipeUp={(card, index) => console.log('Super Like:', card.title)}
      onSwipeDown={(card, index) => console.log('Skip:', card.title)}
      showButtons={true}
    />
  );
}
```

## API

### SwipeCards

A fully-featured swipeable card interface component with touch and mouse support.

#### Props

| Prop           | Type                                      | Default      | Description                        |
| -------------- | ----------------------------------------- | ------------ | ---------------------------------- |
| `cards`        | `CardItem[]`                              | **Required** | Array of card objects to display   |
| `onSwipeLeft`  | `(card: CardItem, index: number) => void` | `undefined`  | Callback when card is swiped left  |
| `onSwipeRight` | `(card: CardItem, index: number) => void` | `undefined`  | Callback when card is swiped right |
| `onSwipeUp`    | `(card: CardItem, index: number) => void` | `undefined`  | Callback when card is swiped up    |
| `onSwipeDown`  | `(card: CardItem, index: number) => void` | `undefined`  | Callback when card is swiped down  |
| `enableLeft`   | `boolean`                                 | `true`       | Enable left swipe functionality    |
| `enableRight`  | `boolean`                                 | `true`       | Enable right swipe functionality   |
| `enableUp`     | `boolean`                                 | `true`       | Enable up swipe functionality      |
| `enableDown`   | `boolean`                                 | `true`       | Enable down swipe functionality    |
| `showButtons`  | `boolean`                                 | `true`       | Show/hide action buttons           |

#### Swipe Directions

| Direction | Color  | Label   | Purpose                    |
| --------- | ------ | ------- | -------------------------- |
| `left`    | Red    | "NOPE"  | Dislike/reject action      |
| `right`   | Green  | "LIKE"  | Like/accept action         |
| `up`      | Blue   | "SUPER" | Super like/favorite action |
| `down`    | Orange | "SKIP"  | Skip/postpone action       |

## Features

### Gesture Support

- **Touch Gestures**: Full mobile touch support with swipe detection
- **Mouse Gestures**: Desktop mouse drag functionality
- **Threshold-based**: 100px minimum movement to trigger swipe
- **Visual Feedback**: Overlays appear at 50px movement threshold

### Card Stack

- **Stacked Display**: Shows up to 3 cards simultaneously
- **Depth Effect**: Cards scale and stack with realistic perspective
- **Smooth Animations**: CSS transitions for natural card movement
- **Rotation Effect**: Cards rotate based on horizontal swipe distance

### Button Controls

- **Responsive Design**: Different layouts for desktop vs mobile
- **Desktop**: Large circular icon buttons (64x64px for main actions)
- **Mobile**: Smaller buttons with text labels for better touch targets
- **Undo Functionality**: Built-in undo button to reverse last swipe
- **Conditional Visibility**: Buttons only show when corresponding direction is enabled

### Visual Effects

- **Swipe Overlays**: Color-coded overlays with directional labels
- **Rotation Physics**: Natural rotation effect during horizontal swipes
- **Scale Transitions**: Top card scales to 1.0, background cards to 0.95
- **Smooth Exits**: Cards animate out when swiped beyond threshold

### Empty State

- **No Cards Message**: Displays when all cards have been swiped
- **Reset Button**: One-click reset to restart from beginning
- **Graceful Handling**: Clean transition when reaching end of stack

## Examples

### Basic Usage

```tsx
<SwipeCards cards={cards} />
```

### Disable Specific Directions

```tsx
<SwipeCards
  cards={cards}
  enableUp={false} // Disable super like
  enableDown={false} // Disable skip
  onSwipeLeft={handleNope}
  onSwipeRight={handleLike}
/>
```

### Buttonless Interface

```tsx
<SwipeCards
  cards={cards}
  showButtons={false} // Hide all action buttons
  onSwipeLeft={handleNope}
  onSwipeRight={handleLike}
/>
```

### Data Tracking

```tsx
const handleSwipe = (card: CardItem, index: number, action: string) => {
  analytics.track('card_swipe', {
    cardId: card.id,
    cardTitle: card.title,
    action,
    originalIndex: index,
  });
};

<SwipeCards
  cards={cards}
  onSwipeLeft={(card, index) => handleSwipe(card, index, 'left')}
  onSwipeRight={(card, index) => handleSwipe(card, index, 'right')}
  onSwipeUp={(card, index) => handleSwipe(card, index, 'up')}
  onSwipeDown={(card, index) => handleSwipe(card, index, 'down')}
/>;
```

## Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## License

MIT
