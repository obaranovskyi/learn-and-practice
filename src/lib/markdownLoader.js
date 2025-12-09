const BASE_URL = import.meta.env.BASE_URL

export async function loadMarkdown(path) {
  const response = await fetch(`${BASE_URL}markdowns/${path}`)
  if (!response.ok) {
    throw new Error(`Failed to load markdown: ${path}`)
  }
  return response.text()
}

export async function loadTopicContent(topicId) {
  const [index, exercises] = await Promise.all([
    loadMarkdown(`${topicId}/index.md`),
    loadMarkdown(`${topicId}/exercises.md`)
  ])
  
  return { index, exercises }
}

