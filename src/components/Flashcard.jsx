import { useState, useEffect, useCallback } from 'react'
import { RotateCcw, Shuffle, ChevronLeft, ChevronRight, Eye, EyeOff, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const DIFFICULTY_CONFIG = {
  again: { label: 'Again', color: 'bg-red-500 hover:bg-red-600', multiplier: 0 },
  hard: { label: 'Hard', color: 'bg-orange-500 hover:bg-orange-600', multiplier: 1 },
  good: { label: 'Good', color: 'bg-green-500 hover:bg-green-600', multiplier: 2 },
  easy: { label: 'Easy', color: 'bg-blue-500 hover:bg-blue-600', multiplier: 3 },
}

function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function Flashcard({ cards: initialCards }) {
  const [cards, setCards] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [completed, setCompleted] = useState([])
  const [isFlipping, setIsFlipping] = useState(false)

  useEffect(() => {
    if (initialCards?.length) {
      setCards(initialCards)
      setCurrentIndex(0)
      setShowAnswer(false)
      setCompleted([])
    }
  }, [initialCards])

  const currentCard = cards[currentIndex]
  const remainingCards = cards.length - completed.length
  const progress = cards.length > 0 ? ((completed.length / cards.length) * 100).toFixed(0) : 0

  const flipCard = useCallback(() => {
    setIsFlipping(true)
    setTimeout(() => {
      setShowAnswer(prev => !prev)
      setIsFlipping(false)
    }, 150)
  }, [])

  const handleDifficulty = useCallback((difficulty) => {
    if (!currentCard) return

    if (difficulty !== 'again') {
      setCompleted(prev => [...prev, currentCard.id])
    }

    setShowAnswer(false)
    
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else if (difficulty === 'again') {
      setCurrentIndex(0)
    }
  }, [currentCard, currentIndex, cards.length])

  const goToNext = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      setShowAnswer(false)
      setCurrentIndex(prev => prev + 1)
    }
  }, [currentIndex, cards.length])

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setShowAnswer(false)
      setCurrentIndex(prev => prev - 1)
    }
  }, [currentIndex])

  const handleShuffle = useCallback(() => {
    setCards(shuffleArray(cards))
    setCurrentIndex(0)
    setShowAnswer(false)
  }, [cards])

  const handleReset = useCallback(() => {
    setCards(initialCards)
    setCurrentIndex(0)
    setShowAnswer(false)
    setCompleted([])
  }, [initialCards])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        flipCard()
      } else if (e.key === 'ArrowRight' && showAnswer) {
        handleDifficulty('good')
      } else if (e.key === 'ArrowLeft' && showAnswer) {
        handleDifficulty('again')
      } else if (e.key === '1' && showAnswer) {
        handleDifficulty('again')
      } else if (e.key === '2' && showAnswer) {
        handleDifficulty('hard')
      } else if (e.key === '3' && showAnswer) {
        handleDifficulty('good')
      } else if (e.key === '4' && showAnswer) {
        handleDifficulty('easy')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [flipCard, handleDifficulty, showAnswer])

  if (!cards.length) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <p className="text-muted-foreground">No flashcards available for this topic.</p>
        </CardContent>
      </Card>
    )
  }

  if (completed.length === cards.length) {
    return (
      <Card className="text-center py-12">
        <CardContent className="space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Congratulations!</h3>
            <p className="text-muted-foreground">You've completed all {cards.length} flashcards.</p>
          </div>
          <Button onClick={handleReset} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Study Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Card {currentIndex + 1} of {cards.length}</span>
          <span>{progress}% complete ({completed.length}/{cards.length})</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-2">
        <Button variant="outline" size="sm" onClick={handleShuffle} className="gap-1">
          <Shuffle className="w-4 h-4" />
          Shuffle
        </Button>
        <Button variant="outline" size="sm" onClick={handleReset} className="gap-1">
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
      </div>

      {/* Flashcard */}
      <div 
        className="perspective-1000 cursor-pointer"
        onClick={flipCard}
      >
        <Card 
          className={`min-h-[300px] transition-transform duration-300 ${isFlipping ? 'scale-95' : 'scale-100'}`}
        >
          <CardContent className="p-8 flex flex-col items-center justify-center min-h-[300px]">
            <div className="absolute top-4 right-4">
              {showAnswer ? (
                <EyeOff className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Eye className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            
            <div className="text-center space-y-4">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {showAnswer ? 'Answer' : 'Question'}
              </span>
              <p className="text-xl md:text-2xl font-medium text-foreground leading-relaxed">
                {showAnswer ? currentCard.answer : currentCard.question}
              </p>
            </div>

            {!showAnswer && (
              <p className="absolute bottom-4 text-sm text-muted-foreground">
                Click or press Space to reveal answer
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className="gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        
        <span className="text-sm text-muted-foreground">
          {remainingCards} remaining
        </span>

        <Button
          variant="ghost"
          onClick={goToNext}
          disabled={currentIndex === cards.length - 1}
          className="gap-1"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Difficulty buttons */}
      {showAnswer && (
        <div className="space-y-3">
          <p className="text-center text-sm text-muted-foreground">
            How well did you know this?
          </p>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(DIFFICULTY_CONFIG).map(([key, config]) => (
              <Button
                key={key}
                onClick={() => handleDifficulty(key)}
                className={`${config.color} text-white`}
              >
                {config.label}
              </Button>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Keyboard: 1-4 or ←/→ arrows
          </p>
        </div>
      )}
    </div>
  )
}

