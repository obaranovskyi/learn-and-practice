const BASE_URL = import.meta.env.BASE_URL

export async function loadManifest() {
  const response = await fetch(`${BASE_URL}markdowns/manifest.json`)
  if (!response.ok) {
    throw new Error('Failed to load manifest.json')
  }
  return response.json()
}

export async function getTopicById(id) {
  const manifest = await loadManifest()
  return manifest.find(topic => topic.id === id)
}

export async function getAdjacentTopics(currentId) {
  const manifest = await loadManifest()
  const currentIndex = manifest.findIndex(topic => topic.id === currentId)
  
  return {
    previous: currentIndex > 0 ? manifest[currentIndex - 1] : null,
    next: currentIndex < manifest.length - 1 ? manifest[currentIndex + 1] : null,
    current: manifest[currentIndex],
    total: manifest.length,
    currentNumber: currentIndex + 1
  }
}

