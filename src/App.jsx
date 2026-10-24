import { useMemo, useState } from 'react'
import {
  Bell, CalendarCheck2, CalendarDays, ChevronDown, ChevronLeft,
  ChevronRight, Clapperboard, Ellipsis, ExternalLink, FileText, Globe2, Heart,
  House, Link2, ListChecks, MapPin, Mic, MoreHorizontal, Pencil, Plus, Radio,
  Search, Star, Ticket, Trash2, Tv, Video, Clock3,
} from 'lucide-react'

function Icon({ icon: IconComponent, size = 18, ...props }) {
  return <IconComponent aria-hidden="true" size={size} strokeWidth={1.8} {...props} />
}

const categories = [
  { id: '공연', icon: Mic, emoji: '🎤', color: '#8b82d8', pale: '#f0edfb' },
  { id: '방송', icon: Tv, emoji: '📺', color: '#dc8097', pale: '#fbedf0' },
  { id: '라디오', icon: Radio, emoji: '📻', color: '#de9a68', pale: '#fbf1e8' },
  { id: '예능', icon: Clapperboard, emoji: '🎬', color: '#c79d46', pale: '#fbf5e4' },
  { id: '팬싸', icon: Heart, emoji: '🫶', color: '#65a98b', pale: '#eaf4ee' },
  { id: '콘텐츠', icon: Video, emoji: '🎥', color: '#6d9bc4', pale: '#eaf1f7' },
  { id: '기타', icon: Ellipsis, emoji: '✨', color: '#8f929e', pale: '#f0f0f3' },
]

const initialEvents = [
  { id: 1, day: 5, time: '20:00', end: '21:00', type: '예능', title: '아는형님', place: 'JTBC', color: '#c79d46', image: '🎬' },
  { id: 2, day: 8, time: '12:00', end: '14:00', type: '방송', title: '뮤직뱅크', place: 'KBS2 · 본방송', color: '#dc8097', image: '🎤' },
  { id: 3, day: 8, time: '18:00', end: '20:30', type: '공연', title: 'RIIZE FAN-CON TOUR', place: '서울 KSPO DOME', color: '#8b82d8', image: '🎆', location: '서울 KSPO DOME', url: 'https://riize-official.jp/', memo: '티켓: 1층 F구역 12열\n응원봉, 보조배터리 챙기기!' },
  { id: 4, day: 8, time: '21:00', end: '22:00', type: '콘텐츠', title: '콘텐츠 업로드', place: 'YouTube', color: '#65a98b', image: '▶️' },
  { id: 5, day: 12, time: '18:00', end: '19:00', type: '팬싸', title: '팬사인회', place: '서울 영등포 타임스퀘어', color: '#65a98b', image: '🫶' },
  { id: 6, day: 15, time: '20:00', end: '21:00', type: '콘텐츠', title: 'Behind Video', place: 'YouTube', color: '#6d9bc4', image: '🎥' },
  { id: 7, day: 18, time: '19:00', end: '20:00', type: '라디오', title: '아이돌 라디오', place: 'MBC 라디오', color: '#de9a68', image: '📻' },
  { id: 8, day: 21, time: '18:00', end: '19:00', type: '공연', title: 'RIIZE POP-UP', place: '성수 플래그십', color: '#8b82d8', image: '🛍️' },
]

const days = ['일', '월', '화', '수', '목', '금', '토']
const formatDate = (day) => `2026년 10월 ${day}일 (${days[(day + 3) % 7]})`

function App() {
  const [page, setPage] = useState('calendar')
  const [selectedDay, setSelectedDay] = useState(8)
  const [selectedEvent, setSelectedEvent] = useState(initialEvents[2])
  const [events, setEvents] = useState(initialEvents)
  const [filter, setFilter] = useState('전체')
  const [favorite, setFavorite] = useState(true)
  const [query, setQuery] = useState('')
  const [form, setForm] = useState({ type: '공연', title: '', place: '', time: '18:00', end: '20:00', link: '', memo: '', day: 8 })

  const dayEvents = useMemo(() => events.filter((event) => event.day === selectedDay), [events, selectedDay])
  const visibleEvents = events.filter((event) => (filter === '전체' || event.type === filter) && `${event.title} ${event.place}`.toLowerCase().includes(query.toLowerCase()))

  const openDay = (day) => { setSelectedDay(day); setPage('day') }
  const openEvent = (event) => { setSelectedEvent(event); setPage('detail') }
  const saveEvent = (event) => {
    if (!event.title.trim()) return
    const category = categories.find((item) => item.id === form.type)
    const saved = { ...form, id: Date.now(), day: Number(form.day), title: form.title.trim(), place: form.place || '일정', type: form.type, color: category.color, image: category.emoji, url: form.link }
    setEvents((items) => [...items, saved].sort((a, b) => a.day - b.day || a.time.localeCompare(b.time)))
    setSelectedDay(saved.day); setSelectedEvent(saved); setPage('detail')
  }

  const openAdd = () => { setForm({ type: '공연', title: '', place: '', time: '18:00', end: '20:00', link: '', memo: '', day: selectedDay }); setPage('add') }

  return (
    <main className="app-shell">
      <div className="app-frame">
        {page === 'calendar' && <CalendarPage events={events} selectedDay={selectedDay} setSelectedDay={setSelectedDay} openDay={openDay} openAdd={openAdd} setPage={setPage} />}
        {page === 'day' && <DayPage events={dayEvents} day={selectedDay} openEvent={openEvent} openAdd={openAdd} setPage={setPage} setSelectedDay={setSelectedDay} />}
        {page === 'detail' && <DetailPage event={selectedEvent} favorite={favorite} setFavorite={setFavorite} setPage={setPage} onEdit={() => { setForm({ type: selectedEvent.type, title: selectedEvent.title, place: selectedEvent.location || selectedEvent.place, time: selectedEvent.time, end: selectedEvent.end, link: selectedEvent.url || '', memo: selectedEvent.memo || '', day: selectedEvent.day }); setPage('add') }} onDelete={() => { setEvents((items) => items.filter((item) => item.id !== selectedEvent.id)); setPage('calendar') }} />}
        {page === 'add' && <AddPage form={form} setForm={setForm} onSave={saveEvent} onCancel={() => setPage('calendar')} />}
        {page === 'list' && <ListPage events={visibleEvents} filter={filter} setFilter={setFilter} query={query} setQuery={setQuery} openEvent={openEvent} />}
        {page !== 'add' && page !== 'detail' && <BottomNav page={page} setPage={setPage} openAdd={openAdd} />}
      </div>
    </main>
  )
}

function CalendarPage({ events, selectedDay, setSelectedDay, openDay, openAdd, setPage }) {
  const cells = Array.from({ length: 35 }, (_, index) => index - 3)
  const selectedEvents = events.filter((event) => event.day === selectedDay)
  return <>
    <header className="calendar-header"><div><h1>2026년 10월 <Icon icon={ChevronDown} className="chevron" size={17} /></h1></div><div className="header-actions"><button aria-label="검색" onClick={() => setPage('list')}><Icon icon={Search} /></button><button aria-label="날짜"><Icon icon={CalendarDays} /></button></div></header>
    <div className="weekdays">{days.map((day, index) => <span className={index === 0 ? 'sunday' : index === 6 ? 'saturday' : ''} key={day}>{day}</span>)}</div>
    <section className="month-grid" aria-label="2026년 10월 달력">{cells.map((value, index) => {
      const day = value < 1 ? 30 + value : value > 31 ? value - 31 : value
      const current = value >= 1 && value <= 31
      const marks = events.filter((event) => event.day === day)
      return <button key={index} className={`date-cell ${current ? '' : 'muted'} ${current && day === selectedDay ? 'selected' : ''}`} onClick={() => { if (current) setSelectedDay(day) }} onDoubleClick={() => current && openDay(day)}><span>{day}</span><i className="dots">{marks.slice(0, 3).map((event) => <b key={event.id} style={{ background: event.color }} />)}</i></button>
    })}</section>
    <section className="agenda-panel"><button className="agenda-heading" onClick={() => openDay(selectedDay)}><strong>10월 {selectedDay}일 ({days[(selectedDay + 3) % 7]})</strong><span className="count-badge">{selectedEvents.length}</span><ChevronRight className="right-chevron" size={18} /></button>
      <div className="agenda-list">{selectedEvents.length ? selectedEvents.map((event) => <EventRow event={event} key={event.id} onClick={() => openDay(selectedDay)} compact />) : <p className="empty-note">등록된 일정이 없어요.</p>}</div>
    </section>
  </>
}

function EventRow({ event, onClick, compact = false }) {
  return <button className={`event-row ${compact ? 'compact' : ''}`} onClick={onClick}><span className="event-dot" style={{ background: event.color }} /><span className="event-time">{event.time}</span><span className="event-copy"><span className="category-pill" style={{ color: event.color, background: `${event.color}22` }}>{event.type}</span><strong>{event.title}</strong><small>{event.place}</small></span><span className="event-thumb tossface" style={{ background: `${event.color}25` }}>{event.image}</span></button>
}

function DayPage({ events, day, openEvent, openAdd, setPage, setSelectedDay }) {
  const slots = [10, 12, 14, 16, 18, 20, 22]
  return <><header className="sub-header"><button onClick={() => setPage('calendar')} aria-label="뒤로"><Icon icon={ChevronLeft} /></button><strong>{formatDate(day)}</strong><button aria-label="날짜 선택"><Icon icon={CalendarDays} /></button></header><div className="week-strip">{[5, 6, 7, 8, 9, 10, 11].map((item) => <button className={item === day ? 'active' : ''} onClick={() => setSelectedDay(item)} key={item}><small>{days[(item + 3) % 7]}</small><b>{item}</b><i>{events.some((event) => event.day === item) ? '•' : ''}</i></button>)}</div>
    <section className="timeline">{slots.map((hour) => <div className="time-row" key={hour}><span>{String(hour).padStart(2, '0')}:00</span><i /></div>)}{events.map((event) => <button key={event.id} className="timeline-event" style={{ '--event-color': event.color, '--event-pale': `${event.color}20`, top: `${(Number(event.time.slice(0, 2)) - 10) * 38}px` }} onClick={() => openEvent(event)}><span className="timeline-dot" /><span className="category-pill" style={{ color: event.color, background: '#fff' }}>{event.type}</span><strong>{event.title}</strong><small>{event.place}</small><b className="tossface">{event.image}</b><span className="bell"><Icon icon={Bell} size={14} /></span></button>)}</section><button className="floating-add" onClick={openAdd} aria-label="일정 추가"><Icon icon={Plus} size={26} /></button></>
}

function DetailPage({ event, favorite, setFavorite, setPage, onEdit, onDelete }) {
  return <section className="detail-page"><header className="detail-cover" style={{ background: `linear-gradient(135deg, ${event?.color || '#8b82d8'}, #557d70)` }}><button onClick={() => setPage('calendar')} aria-label="뒤로"><Icon icon={ChevronLeft} /></button><button aria-label="더보기"><Icon icon={MoreHorizontal} /></button><span className="tossface">{event?.image}</span></header><article className="detail-card"><div className="detail-type"><span className="category-pill" style={{ color: event.color, background: `${event.color}22` }}>{event.type}</span><button className="star" onClick={() => setFavorite(!favorite)} aria-label={favorite ? '즐겨찾기 해제' : '즐겨찾기'}><Icon icon={Star} size={22} fill={favorite ? 'currentColor' : 'none'} /></button></div><h2>{event.title}</h2><p className="info-line"><Icon icon={CalendarCheck2} /><span>{formatDate(event.day)}<small><Clock3 size={13} /> {event.time} ~ {event.end} (약 2시간 30분)</small></span></p><p className="info-line"><Icon icon={MapPin} /><span>{event.location || event.place}<small>{event.location && <button className="map-button">지도 열기</button>}</small></span></p>{event.url && <p className="info-line"><Icon icon={Link2} /><a href={event.url}><ExternalLink size={13} /> {event.url}</a></p>}{event.memo && <div className="memo-box"><b><FileText size={14} />　메모</b><p>{event.memo}</p></div>}<p className="related-label"><Link2 size={14} />　관련 링크</p><div className="related-links"><button><Globe2 size={15} />　공식 홈페이지</button><button><Ticket size={15} />　티켓 예매</button></div><div className="detail-actions"><button className="edit-button" onClick={onEdit}><Pencil size={15} />　수정하기</button><button className="delete-button" onClick={onDelete} aria-label="일정 삭제"><Trash2 size={17} /></button></div></article></section>
}

function AddPage({ form, setForm, onSave, onCancel }) {
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  return <section className="add-page"><header className="add-header"><button onClick={onCancel}>취소</button><strong>스케줄 추가</strong><button className="save-button" onClick={onSave}>저장</button></header><div className="category-grid">{categories.map((category) => <button key={category.id} className={form.type === category.id ? 'chosen' : ''} onClick={() => update('type', category.id)}><span style={{ color: category.color, background: category.pale }}><Icon icon={category.icon} size={20} /></span>{category.id}</button>)}</div><label className="input-wrap"><span><FileText size={16} /></span><input placeholder="제목을 입력하세요" value={form.title} onChange={(e) => update('title', e.target.value)} /></label><label className="input-wrap textarea-wrap"><span><FileText size={16} /></span><textarea placeholder="내용을 입력하세요 (선택)" value={form.memo} onChange={(e) => update('memo', e.target.value)} /></label><div className="toggle-row"><span><Clock3 size={17} /></span><b>하루 종일</b><button className="toggle" aria-label="하루 종일 전환" /></div><div className="form-row"><b>시작</b><input type="date" value={`2026-10-${String(form.day).padStart(2, '0')}`} onChange={(e) => update('day', Number(e.target.value.slice(-2)))} /><input type="time" value={form.time} onChange={(e) => update('time', e.target.value)} /></div><div className="form-row"><b>종료</b><input type="date" value={`2026-10-${String(form.day).padStart(2, '0')}`} onChange={(e) => update('day', Number(e.target.value.slice(-2)))} /><input type="time" value={form.end} onChange={(e) => update('end', e.target.value)} /></div><label className="input-wrap"><span><MapPin size={16} /></span><input placeholder="장소를 입력하세요" value={form.place} onChange={(e) => update('place', e.target.value)} /></label><label className="input-wrap"><span><Link2 size={16} /></span><input placeholder="관련 링크를 입력하세요" value={form.link} onChange={(e) => update('link', e.target.value)} /></label><label className="input-wrap"><span><Bell size={16} /></span><select defaultValue="10분 전"><option>알림 없음</option><option>10분 전</option><option>30분 전</option><option>1시간 전</option></select></label><div className="color-row"><b>색상</b>{['#f4b5c9', '#ffd0b9', '#ffe28d', '#bce8d7', '#b9ddfa', '#d6c9fa', '#ccced6'].map((color) => <button key={color} style={{ background: color }} />)}</div></section>
}

function ListPage({ events, filter, setFilter, query, setQuery, openEvent }) {
  const tabs = ['전체', '공연', '방송', '콘텐츠', '기타']
  return <><header className="list-header"><strong>스케줄 목록</strong><label><Search size={20} /><input aria-label="검색어" value={query} onChange={(event) => setQuery(event.target.value)} /></label></header><nav className="filter-tabs">{tabs.map((tab) => <button key={tab} className={filter === tab ? 'active' : ''} onClick={() => setFilter(tab)}>{tab}</button>)}</nav><p className="list-month">2026년 10월</p><div className="list-events">{events.map((event) => <button className="list-event" key={event.id} onClick={() => openEvent(event)}><i style={{ background: event.color }} /><span className="list-date">10.{String(event.day).padStart(2, '0')} ({days[(event.day + 3) % 7]})</span><time>{event.time}</time><span className="list-copy"><b className="category-pill" style={{ color: event.color, background: `${event.color}22` }}>{event.type}</b><strong>{event.title}</strong><small>{event.place}</small></span><span className="list-thumb tossface" style={{ background: `${event.color}22` }}>{event.image}</span></button>)}</div></>
}

function BottomNav({ page, setPage, openAdd }) {
  return <nav className="bottom-nav"><button className={page === 'calendar' || page === 'day' ? 'active' : ''} onClick={() => setPage('calendar')}><span><House size={20} /></span>캘린더</button><button className={page === 'list' ? 'active' : ''} onClick={() => setPage('list')}><span><ListChecks size={20} /></span>스케줄</button><button className="nav-add" onClick={openAdd} aria-label="일정 추가"><Plus size={24} /></button><button onClick={() => setPage('list')}><span><Heart size={20} /></span>아티스트</button><button onClick={() => setPage('list')}><span><Ellipsis size={20} /></span>더보기</button></nav>
}

export default App
