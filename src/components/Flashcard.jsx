import { useState, useEffect, useCallback } from 'react'
import { RotateCcw, Shuffle, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function Flashcard({ cards: initialCards }) {
  const [deck, setDeck] = useState([])
  const [showAnswer, setShowAnswer] = useState(false)
  const [completed, setCompleted] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)

  useEffect(() => {
    if (initialCards?.length) {
      setDeck([...initialCards])
      setShowAnswer(false)
      setCompleted(0)
    }
  }, [initialCards])

  const currentCard = deck[0]
  const total = initialCards?.length || 0
  const progress = total > 0 ? ((completed / total) * 100).toFixed(0) : 0

  const revealAnswer = useCallback(() => {
    if (!showAnswer) {
      setIsFlipping(true)
      setTimeout(() => {
        setShowAnswer(true)
        setIsFlipping(false)
      }, 150)
    }
  }, [showAnswer])

  const markCorrect = useCallback(() => {
    if (!currentCard || deck.length === 0) return
    
    // Remove card from deck (it's done)
    setDeck(prev => prev.slice(1))
    setCompleted(prev => prev + 1)
    setShowAnswer(false)
  }, [currentCard, deck.length])

  const markWrong = useCallback(() => {
    if (!currentCard || deck.length <= 1) return
    
    // Move card to middle of remaining deck
    const [first, ...rest] = deck
    const middleIndex = Math.floor(rest.length / 2)
    const newDeck = [...rest.slice(0, middleIndex), first, ...rest.slice(middleIndex)]
    setDeck(newDeck)
    setShowAnswer(false)
  }, [currentCard, deck])

  const handleShuffle = useCallback(() => {
    setDeck(shuffleArray(deck))
    setShowAnswer(false)
  }, [deck])

  const handleReset = useCallback(() => {
    setDeck([...initialCards])
    setShowAnswer(false)
    setCompleted(0)
  }, [initialCards])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        revealAnswer()
      } else if (e.key === 'y' || e.key === 'Y') {
        e.preventDefault()
        markCorrect()
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault()
        markWrong()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [revealAnswer, markCorrect, markWrong])

  if (!initialCards?.length) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <p className="text-muted-foreground">No flashcards available for this topic.</p>
        </CardContent>
      </Card>
    )
  }

  if (deck.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent className="space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Congratulations!</h3>
            <p className="text-muted-foreground">You've completed all {total} flashcards.</p>
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
          <span>{deck.length} cards remaining</span>
          <span>{progress}% complete ({completed}/{total})</span>
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
      <Card 
        className={`min-h-[300px] cursor-pointer transition-transform duration-300 ${isFlipping ? 'scale-95' : 'scale-100'}`}
        onClick={revealAnswer}
      >
        <CardContent className="p-8 flex flex-col items-center justify-center min-h-[300px] relative">
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
              Press Enter to reveal answer
            </p>
          )}
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          onClick={markWrong}
          className="h-14 gap-2 border-red-200 hover:bg-red-50 hover:border-red-300"
        >
          <X className="w-5 h-5 text-red-500" />
          <span>Don't Know (N)</span>
        </Button>
        <Button
          variant="outline"
          onClick={markCorrect}
          className="h-14 gap-2 border-green-200 hover:bg-green-50 hover:border-green-300"
        >
          <Check className="w-5 h-5 text-green-500" />
          <span>Know It (Y)</span>
        </Button>
      </div>

      {/* Keyboard hints */}
      <p className="text-center text-xs text-muted-foreground">
        Enter = show answer • Y = know it • N = don't know
      </p>
    </div>
  )
}
