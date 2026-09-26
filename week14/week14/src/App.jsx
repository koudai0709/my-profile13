import BookCard from './components/BookCard.jsx'

const books = [
  {
    id: 1,
    title: 'こころ',
    author: '夏目漱石',
    rating: 5,
    comment: '人の心について深く考えさせられる一冊です。',
  },
  {
    id: 2,
    title: '銀河鉄道の夜',
    author: '宮沢賢治',
    rating: 4,
    comment: '幻想的な世界観が印象に残りました。',
  },
  {
    id: 3,
    title: '走れメロス',
    author: '太宰治',
    rating: 5,
    comment: '友情と信頼について考えられる物語です。',
  },
]

export default function App() {
  return (
    <main className="min-h-screen bg-gray-100 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">
          私のおすすめ本
        </h1>

        <div className="grid gap-6 md:grid-cols-3">
          {books.map((book) => (
            <BookCard
              key={book.id}
              title={book.title}
              author={book.author}
              rating={book.rating}
              comment={book.comment}
            />
          ))}
        </div>
      </div>
    </main>
  )
}