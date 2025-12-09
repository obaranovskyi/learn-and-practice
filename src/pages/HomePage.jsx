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
              <h1 className="text-2xl font-bold tracking-tight">Learn & Practice</h1>
              <p className="text-sm text-muted-foreground">Master new concepts step by step</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Table of Contents</h2>
          <p className="text-muted-foreground">
            {topics.length} topic{topics.length !== 1 ? 's' : ''} available
          </p>
        </div>

        <div className="grid gap-4">
          {topics.map((topic, index) => (
            <Link key={topic.id} to={`/topic/${topic.id}`}>
              <Card className="group hover:border-primary/50 hover:shadow-md transition-all duration-200">
                <CardHeader className="flex-row items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {topic.title}
                    </CardTitle>
                    {topic.description && (
                      <CardDescription className="mt-1 truncate">
                        {topic.description}
                      </CardDescription>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

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
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          Built with React & Vite
        </div>
      </footer>
    </div>
  )
}

export default HomePage

