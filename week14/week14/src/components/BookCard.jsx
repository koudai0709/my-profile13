export default function BookCard({ title, author, rating, comment }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="mt-2 text-gray-600">著者：{author}</p>
        <p className="mt-2 text-yellow-600">評価：{rating} / 5</p>
        <p className="mt-3 text-gray-700">{comment}</p>
        </div>
    );
}
