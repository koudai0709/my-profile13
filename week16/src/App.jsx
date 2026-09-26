import { useEffect, useState } from 'react';

const DIARY_KEY = 'week16-diaries';
const MEMO_KEY = 'week16-memo';
const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

// UTCへ変換せず、端末の現地の日付で保存用のキーを作ります。
function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function loadSavedData() {
  try {
    const diaries = JSON.parse(localStorage.getItem(DIARY_KEY) || '{}');
    if (!diaries || typeof diaries !== 'object' || Array.isArray(diaries)
      || !Object.values(diaries).every((text) => typeof text === 'string')) {
      throw new Error('Invalid diary data');
    }
    return { diaries, memo: localStorage.getItem(MEMO_KEY) || '', error: '' };
  } catch {
    return { diaries: {}, memo: '', error: '保存データを読み込めませんでした。ブラウザーの保存設定を確認してください。' };
  }
}

export default function App() {
  const [savedData] = useState(loadSavedData);
  const [today] = useState(() => new Date());
  const [displayMonth, setDisplayMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(() => dateKey(today));
  const [diaries, setDiaries] = useState(savedData.diaries);
  const [diaryText, setDiaryText] = useState(() => savedData.diaries[dateKey(today)] || '');
  const [memo, setMemo] = useState(savedData.memo);
  const [savedMemo, setSavedMemo] = useState(savedData.memo);
  const [diaryMessage, setDiaryMessage] = useState('');
  const [memoMessage, setMemoMessage] = useState('');

  // 日付を選び直したら、その日の保存済み日記を入力欄に反映します。
  useEffect(() => {
    setDiaryText(diaries[selectedDate] || '');
  }, [selectedDate, diaries]);

  const year = displayMonth.getFullYear();
  const month = displayMonth.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cellCount = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
  const cells = Array.from({ length: cellCount }, (_, index) => {
    const day = index - firstWeekday + 1;
    return day >= 1 && day <= daysInMonth ? day : null;
  });
  const diaryChanged = diaryText !== (diaries[selectedDate] || '');
  const [selectedYear, selectedMonth, selectedDay] = selectedDate.split('-').map(Number);
  const selectedLabel = `${selectedYear}年${selectedMonth}月${selectedDay}日`;

  function selectDate(day) {
    const nextDate = dateKey(new Date(year, month, day));
    if (nextDate === selectedDate) return;
    if (diaryChanged && !window.confirm('未保存の日記があります。変更を破棄して別の日付に移動しますか？')) return;
    setSelectedDate(nextDate);
    setDiaryMessage('');
  }

  function changeMonth(amount) {
    setDisplayMonth(new Date(year, month + amount, 1));
  }

  function saveDiary() {
    const nextDiaries = { ...diaries };
    if (diaryText.trim()) nextDiaries[selectedDate] = diaryText;
    else delete nextDiaries[selectedDate];
    try {
      localStorage.setItem(DIARY_KEY, JSON.stringify(nextDiaries));
      setDiaries(nextDiaries);
      setDiaryMessage(diaryText.trim() ? '日記を保存しました。' : 'この日の日記を空欄にしました。');
    } catch {
      setDiaryMessage('保存できませんでした。入力は残っています。ブラウザーの保存設定や空き容量を確認してください。');
    }
  }

  function saveMemo() {
    try {
      localStorage.setItem(MEMO_KEY, memo);
      setSavedMemo(memo);
      setMemoMessage('メモを保存しました。');
    } catch {
      setMemoMessage('保存できませんでした。入力は残っています。ブラウザーの保存設定や空き容量を確認してください。');
    }
  }

  const buttonStyle = 'rounded-xl bg-teal-800 px-6 py-3 text-sm font-bold text-white transition hover:bg-teal-900';
  const inputStyle = 'mt-4 w-full resize-y rounded-xl border border-stone-300 bg-white p-4 text-base leading-7 placeholder:text-stone-400 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20';

  return (
    <main className="min-h-screen bg-stone-100 px-4 py-8 text-stone-800 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 border-b border-stone-300 pb-6">
          <p className="mb-2 text-xs font-bold tracking-[0.2em] text-teal-800">MY DAILY NOTE</p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">日記と、メモ。</h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">今日の出来事も、ふと思いついたことも。自分のペースで書き残そう。</p>
        </header>
        {savedData.error && <p role="alert" className="mb-6 rounded-xl bg-amber-100 p-4 text-sm">{savedData.error}</p>}
        <div className="grid items-start gap-6 lg:grid-cols-2">
          <section aria-labelledby="calendar-heading" className="min-w-0 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-6 flex items-center justify-between gap-2">
              <button type="button" onClick={() => changeMonth(-1)} aria-label="前の月" className="min-h-11 min-w-11 rounded-xl border border-stone-200 px-3 hover:bg-stone-100">‹</button>
              <h2 id="calendar-heading" aria-live="polite" className="text-xl font-bold">{year}年 <span className="text-teal-800">{month + 1}月</span></h2>
              <button type="button" onClick={() => changeMonth(1)} aria-label="次の月" className="min-h-11 min-w-11 rounded-xl border border-stone-200 px-3 hover:bg-stone-100">›</button>
            </div>
            <div className="grid grid-cols-7 text-center">
              {weekdays.map((weekday, index) => (
                <div key={weekday} className={`pb-3 text-xs font-bold ${index === 0 ? 'text-rose-600' : index === 6 ? 'text-blue-600' : 'text-stone-500'}`}>{weekday}</div>
              ))}
              {cells.map((day, index) => {
                if (!day) return <div key={`blank-${index}`} aria-hidden="true" />;
                const key = dateKey(new Date(year, month, day));
                const selected = key === selectedDate;
                const hasDiary = Boolean(diaries[key]?.trim());
                const isToday = key === dateKey(today);
                return (
                  <button key={key} type="button" onClick={() => selectDate(day)}
                    aria-label={`${year}年${month + 1}月${day}日${isToday ? '、今日' : ''}${hasDiary ? '、日記あり' : ''}`}
                    aria-pressed={selected} aria-current={isToday ? 'date' : undefined}
                    className={`relative my-0.5 flex min-h-12 flex-col items-center justify-center rounded-xl text-sm transition sm:min-h-14 ${selected ? 'bg-teal-800 font-bold text-white' : `hover:bg-teal-50 ${index % 7 === 0 ? 'text-rose-600' : index % 7 === 6 ? 'text-blue-600' : 'text-stone-700'} ${isToday ? 'ring-1 ring-inset ring-teal-600' : ''}`}`}>
                    {day}
                    {hasDiary && <span aria-hidden="true" className={`absolute bottom-1.5 h-1.5 w-1.5 rounded-full ${selected ? 'bg-white' : 'bg-teal-700'}`} />}
                  </button>
                );
              })}
            </div>
            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-stone-100 pt-4 text-xs text-stone-500">
              <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-teal-700" />日記あり</span>
              <span>緑の背景：選択中</span><span>緑の枠：今日</span>
            </div>
          </section>
          <div className="grid min-w-0 gap-6">
            <section aria-labelledby="diary-heading" className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-xs font-bold tracking-widest text-teal-800">DIARY</p>
              <h2 id="diary-heading" className="mt-2 text-xl font-bold">{selectedLabel}</h2>
              <label htmlFor="diary" className="mt-4 block text-sm text-stone-600">この日の日記</label>
              <textarea id="diary" value={diaryText} onChange={(event) => { setDiaryText(event.target.value); setDiaryMessage(''); }} placeholder="今日はどんな一日でしたか？" rows={7} className={inputStyle} />
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-stone-500">{diaryChanged ? '未保存の変更があります' : diaries[selectedDate] ? '保存済み' : 'まだ日記はありません'}</p>
                <button type="button" onClick={saveDiary} className={buttonStyle}>日記を保存</button>
              </div>
              <p role="status" className="mt-3 text-sm text-teal-800">{diaryMessage}</p>
              <p className="mt-1 text-xs text-stone-500">空欄で保存すると、この日の日記を削除します。</p>
            </section>
            <section aria-labelledby="memo-heading" className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm sm:p-6">
              <p className="text-xs font-bold tracking-widest text-amber-800">FREE MEMO</p>
              <h2 id="memo-heading" className="mt-2 text-xl font-bold"><label htmlFor="memo">自由メモ</label></h2>
              <p className="mt-2 text-sm text-stone-600">日付に関係なく、アイデアや覚えておきたいことを。</p>
              <textarea id="memo" value={memo} onChange={(event) => { setMemo(event.target.value); setMemoMessage(''); }} placeholder="思いついたことを、ここに。" rows={4} className={inputStyle} />
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-stone-500">{memo !== savedMemo ? '未保存の変更があります' : '変更はありません'}</p>
                <button type="button" onClick={saveMemo} className={buttonStyle}>メモを保存</button>
              </div>
              <p role="status" className="mt-3 text-sm text-teal-800">{memoMessage}</p>
            </section>
          </div>
        </div>
        <footer className="mt-8 text-center text-xs leading-6 text-stone-500">保存ボタンで、このブラウザーに記録します。<br />別の端末とは共有されません。ブラウザーのデータを消去すると記録も消えます。</footer>
      </div>
    </main>
  );
}
