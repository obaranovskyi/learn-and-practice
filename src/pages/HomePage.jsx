import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, ChevronRight, Sparkles } from 'lucide-react'
import { loadManifest } from '@/lib/manifestLoader'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

function HomePage() {
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadManifest()
      .then(setTopics)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex items-center gap-2 text-muted-foreground">
          <Sparkles className="w-5 h-5" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">English Grammar</h1>
              <p className="text-sm text-muted-foreground">Learn & Practice</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-1">Table of Contents</h2>
          <p className="text-sm text-muted-foreground">
            {topics.length} topic{topics.length !== 1 ? 's' : ''} available
          </p>
        </div>

        <Card>
          <div className="divide-y">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
              {/* Split topics into two columns for md+ screens */}
              {[0, 1].map(colIndex => (
                <div key={colIndex} className="divide-y">
                  {topics
                    .filter((_, i) => i % 2 === colIndex)
                    .map((topic) => {
                      const originalIndex = topics.findIndex(t => t.id === topic.id)
                      return (
                        <Link 
                          key={topic.id} 
                          to={`/topic/${topic.id}`}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-colors group"
                        >
                          <span className="text-xs font-mono text-muted-foreground w-8 shrink-0">
                            {String(originalIndex + 1).padStart(3, '0')}
                          </span>
                          <span className="flex-1 text-sm font-medium group-hover:text-primary transition-colors truncate">
                            {topic.title}
                          </span>
                          <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
                        </Link>
                      )
                    })}
                </div>
              ))}
            </div>
          </div>
        </Card>

        {topics.length === 0 && (
          <Card className="text-center py-12">
            <CardHeader>
              <CardTitle className="text-muted-foreground">No topics found</CardTitle>
              <CardDescription>
                Add markdown files to the public/markdowns folder and run generate-manifest
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-xs text-muted-foreground">
          English Grammar Course • {topics.length} Topics
        </div>
      </footer>
    </div>
  )
}

export default HomePage
