import { groq } from './groq'

export async function getPassiveRecommendations(userBooks: any[]) {
  // Demo mock if no API key
  if (!process.env.GROQ_API_KEY) {
    return [
      { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', reason: 'Because you liked Oscar Wilde' },
      { title: 'If We Were Villains', author: 'M.L. Rio', reason: 'Matches your interest in The Secret History' }
    ]
  }

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: "You are a professional book librarian. Analyze the user's reading history and suggest exactly 5 new books they might love. Return a JSON object with a key 'books' containing an array of objects with 'title', 'author', and 'reason'."
        },
        {
          role: 'user',
          content: `My reading list: ${userBooks.map(b => `${b.title} by ${b.author}`).join(', ')}. Recommend 5 new books.`
        }
      ],
      response_format: { type: 'json_object' }
    })

    const content = completion.choices[0]?.message?.content || '{"books": []}'
    const parsed = JSON.parse(content)
    const recommendations = parsed.books || []
    
    return recommendations.length > 0 ? recommendations : [
      { title: 'The Shadow of the Wind', author: 'Carlos Ruiz Zafón', reason: 'Matches your interest in gothic mysteries.' }
    ]
    
  } catch (error) {
    console.error('Groq recommendation error:', error)
    return [
      { title: 'The Shadow of the Wind', author: 'Carlos Ruiz Zafón', reason: 'Matches your interest in gothic mysteries.' }
    ]
  }
}
