import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ChevronLeft, ChevronRight, Home, BookOpen, PenTool, Layers } from 'lucide-react'
import { getTopicById, getAdjacentTopics } from '@/lib/manifestLoader'
import { loadTopicContent, loadFlashcards } from '@/lib/markdownLoader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Flashcard from '@/components/Flashcard'

function TopicPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [topic, setTopic] = useState(null)
  const [content, setContent] = useState({ index: '', exercises: '' })
  const [flashcards, setFlashcards] = useState(null)
  const [navigation, setNavigation] = useState({ previous: null, next: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('content')

  useEffect(() => {
    setLoading(true)
    setError(null)
    setActiveTab('content')

    Promise.all([
      getTopicById(id),
      loadTopicContent(id),
      getAdjacentTopics(id)
    ])
      .then(async ([topicData, contentData, navData]) => {
        if (!topicData) {
          throw new Error('Topic not found')
        }
        setTopic(topicData)
        setContent(contentData)
        setNavigation(navData)
        
        // Load flashcards if available
        if (topicData.flashcards) {
          try {
            const flashcardsData = await loadFlashcards(id)
            setFlashcards(flashcardsData)
          } catch {
            setFlashcards(null)
          }
        } else {
          setFlashcards(null)
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't navigate when in flashcards mode (it has its own key handlers)
      if (activeTab === 'flashcards') return
      
      if (e.key === 'ArrowLeft' && navigation.previous) {
        navigate(`/topic/${navigation.previous.id}`)
      } else if (e.key === 'ArrowRight' && navigation.next) {
        navigate(`/topic/${navigation.next.id}`)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigation, navigate, activeTab])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading topic...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Link to="/">
              <Button variant="outline">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderContent = () => {
    if (activeTab === 'flashcards' && flashcards) {
      return <Flashcard cards={flashcards} />
    }
    
    return (
      <article className="prose">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {activeTab === 'content' ? content.index : content.exercises}
        </ReactMarkdown>
      </article>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <Link to="/">
                <Button variant="ghost" size="icon" className="shrink-0">
                  <Home className="w-5 h-5" />
                </Button>
              </Link>
              <div className="min-w-0">
                <h1 className="text-lg font-semibold truncate">{topic?.title}</h1>
                <p className="text-sm text-muted-foreground">
                  Topic {navigation.currentNumber} of {navigation.total}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant={activeTab === 'content' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('content')}
              >
                <BookOpen className="w-4 h-4 mr-1" />
                Content
              </Button>
              <Button
                variant={activeTab === 'exercises' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('exercises')}
              >
                <PenTool className="w-4 h-4 mr-1" />
                Exercises
              </Button>
              {flashcards && (
                <Button
                  variant={activeTab === 'flashcards' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('flashcards')}
                >
                  <Layers className="w-4 h-4 mr-1" />
                  Flashcards
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6 md:p-8 lg:p-10">
            {renderContent()}
          </CardContent>
        </Card>
      </main>

      <footer className="border-t bg-card/50 backdrop-blur-sm sticky bottom-0">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {navigation.previous ? (
              <Link to={`/topic/${navigation.previous.id}`}>
                <Button variant="outline" className="gap-2">
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                  <span className="hidden md:inline text-muted-foreground">
                    ({navigation.previous.title})
                  </span>
                </Button>
              </Link>
            ) : (
              <div />
            )}

            <span className="text-sm text-muted-foreground hidden sm:block">
              {activeTab === 'flashcards' ? 'Space to flip, 1-4 to rate' : 'Use ← → arrow keys to navigate'}
            </span>

            {navigation.next ? (
              <Link to={`/topic/${navigation.next.id}`}>
                <Button variant="outline" className="gap-2">
                  <span className="hidden md:inline text-muted-foreground">
                    ({navigation.next.title})
                  </span>
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <Link to="/">
                <Button variant="default" className="gap-2">
                  <span>Complete</span>
                  <Home className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}

export default TopicPage
