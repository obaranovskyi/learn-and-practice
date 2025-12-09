import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, ChevronRight, Sparkles, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { loadManifest } from '@/lib/manifestLoader'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

function HomePage() {
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [collapsedCategories, setCollapsedCategories] = useState({})

  useEffect(() => {
    loadManifest()
      .then(data => {
        setTopics(data)
        // Collapse all categories by default
        const allCollapsed = {}
        data.forEach(topic => {
          if (topic.category) {
            allCollapsed[topic.category] = true
          }
        })
        setCollapsedCategories(allCollapsed)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  // Group topics by category and subcategory
  const groupedTopics = useMemo(() => {
    const groups = {}
    topics.forEach((topic, index) => {
      const cat = topic.category || 'Uncategorized'
      const subcat = topic.subcategory || ''
      
      if (!groups[cat]) {
        groups[cat] = { subcategories: {}, order: index }
      }
      if (!groups[cat].subcategories[subcat]) {
        groups[cat].subcategories[subcat] = []
      }
      groups[cat].subcategories[subcat].push({ ...topic, globalIndex: index })
    })
    return groups
  }, [topics])

  const toggleCategory = (cat) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }))
  }

  const expandAll = () => {
    setCollapsedCategories({})
  }

  const collapseAll = () => {
    const allCollapsed = {}
    Object.keys(groupedTopics).forEach(cat => {
      allCollapsed[cat] = true
    })
    setCollapsedCategories(allCollapsed)
  }

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

  const categories = Object.keys(groupedTopics).sort((a, b) => 
    groupedTopics[a].order - groupedTopics[b].order
  )

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
              <p className="text-sm text-muted-foreground">{topics.length} topics to master</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-4">
        {/* Expand/Collapse buttons */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={expandAll}>
            <ChevronsUpDown className="w-4 h-4 mr-1" />
            Expand All
          </Button>
          <Button variant="outline" size="sm" onClick={collapseAll}>
            <ChevronsUpDown className="w-4 h-4 mr-1 rotate-90" />
            Collapse All
          </Button>
        </div>

        {categories.map((category) => {
          const catData = groupedTopics[category]
          const isCollapsed = collapsedCategories[category]
          const subcategories = Object.keys(catData.subcategories)
          const topicCount = Object.values(catData.subcategories).flat().length

          return (
            <Card key={category}>
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-accent/50 transition-colors rounded-t-lg"
              >
                <div className="flex items-center gap-3">
                  <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isCollapsed ? '-rotate-90' : ''}`} />
                  <h2 className="text-lg font-semibold text-foreground">{category}</h2>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {topicCount}
                  </span>
                </div>
              </button>

              {/* Subcategories and Topics */}
              {!isCollapsed && (
                <div className="border-t">
                  {subcategories.map((subcategory) => {
                    const subcatTopics = catData.subcategories[subcategory]
                    
                    return (
                      <div key={subcategory || 'default'}>
                        {/* Subcategory Header */}
                        {subcategory && (
                          <div className="px-4 py-2 bg-muted/30 border-b flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-primary" />
                            <h3 className="text-sm font-medium text-muted-foreground">{subcategory}</h3>
                          </div>
                        )}
                        
                        {/* Topics List */}
                        <div className="divide-y">
                          {subcatTopics.map((topic) => (
                            <Link 
                              key={topic.id} 
                              to={`/topic/${topic.id}`}
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent/50 transition-colors group"
                            >
                              <span className="text-xs font-mono text-muted-foreground w-7 shrink-0">
                                {String(topic.globalIndex + 1).padStart(2, '0')}
                              </span>
                              <span className="flex-1 text-sm group-hover:text-primary transition-colors">
                                {topic.title}
                              </span>
                              <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </Card>
          )
        })}

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
