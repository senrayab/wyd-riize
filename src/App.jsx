import { useMemo, useState } from 'react'
import {
  Bell, BellRing, CalendarCheck2, CalendarDays, CalendarCog, ChevronDown, ChevronLeft,
  ChevronRight, Clapperboard, Copy, Ellipsis, ExternalLink, FileText, Globe2, Heart,
  House, Link2, ListChecks, MapPin, Mic, MoreHorizontal, Pencil, Plus, Radio,
  Search, Settings2, Star, Ticket, Trash2, Tv, Video, Clock3, CircleHelp,
  Download, Info, UserRound, Users, BarChart3, Target, Sparkles,
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
const rabbitWaveSrc = `${import.meta.env.BASE_URL}art/rabbit-wave.png`
const rabbitPlannerSrc = `${import.meta.env.BASE_URL}art/rabbit-planner.png`
const rabbitCheerSrc = `${import.meta.env.BASE_URL}art/rabbit-cheer.png`
const artists = [
  { id: 'shotaro', name: '쇼타로', english: 'SHOTARO', color: '#d9ece4' },
  { id: 'eunseok', name: '은석', english: 'EUNSEOK', color: '#eee9f8' },
  { id: 'sungchan', name: '성찬', english: 'SUNGCHAN', color: '#f7e8e8' },
  { id: 'wonbin', name: '원빈', english: 'WONBIN', color: '#e9eef8' },
  { id: 'sohee', name: '소희', english: 'SOHEE', color: '#f8f0df' },
  { id: 'anton', name: '앤톤', english: 'ANTON', color: '#e6f1f4' },
]

function App() {
  const [page, setPage] = useState('calendar')
  const [selectedDay, setSelectedDay] = useState(8)
  const [selectedEvent, setSelectedEvent] = useState(initialEvents[2])
  const [events, setEvents] = useState(initialEvents)
  const [filter, setFilter] = useState('전체')
  const [favorite, setFavorite] = useState(true)
  const [selectedArtist, setSelectedArtist] = useState(artists[0])
  const [artistFavorites, setArtistFavorites] = useState(['riize'])
  const [showFavoriteArtists, setShowFavoriteArtists] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [weekStartsMonday, setWeekStartsMonday] = useState(false)
  const [detailMenuOpen, setDetailMenuOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [editingEventId, setEditingEventId] = useState(null)
  const [query, setQuery] = useState('')
  const [form, setForm] = useState({ type: '공연', title: '', place: '', time: '18:00', end: '20:00', link: '', memo: '', day: 8, allDay: false, color: categories[0].color })

  const dayEvents = useMemo(() => events.filter((event) => event.day === selectedDay), [events, selectedDay])
  const visibleEvents = events.filter((event) => (filter === '전체' || event.type === filter) && `${event.title} ${event.place}`.toLowerCase().includes(query.toLowerCase()))

  const openDay = (day) => { setSelectedDay(day); setPage('day') }
  const openEvent = (event) => { setSelectedEvent(event); setPage('detail') }
  const showToast = (message) => { setToast(message); window.setTimeout(() => setToast(''), 2200) }
  const duplicateEvent = (event) => {
    const copy = { ...event, id: Date.now(), title: `${event.title} (복사)`, day: selectedDay }
    setEvents((items) => [...items, copy].sort((a, b) => a.day - b.day || a.time.localeCompare(b.time)))
    setSelectedEvent(copy); setPage('detail'); showToast('일정을 복제했어요')
  }
  const copyEventLink = async () => {
    try { await navigator.clipboard.writeText(window.location.href); showToast('일정 링크를 복사했어요') }
    catch { showToast('링크 복사를 지원하지 않는 환경이에요') }
  }
  const exportEvents = () => {
    const file = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(file)
    const anchor = document.createElement('a')
    anchor.href = url; anchor.download = 'wyd-riize-schedules.json'; anchor.click()
    URL.revokeObjectURL(url); showToast('일정 파일을 저장했어요')
  }
  const saveEvent = () => {
    if (!form.title.trim()) return
    const category = categories.find((item) => item.id === form.type)
    const saved = { ...form, id: editingEventId ?? Date.now(), day: Number(form.day), title: form.title.trim(), place: form.place || '일정', type: form.type, color: form.color || category.color, image: category.emoji, url: form.link }
    setEvents((items) => (editingEventId ? items.map((item) => item.id === editingEventId ? saved : item) : [...items, saved]).sort((a, b) => a.day - b.day || a.time.localeCompare(b.time)))
    setSelectedDay(saved.day); setSelectedEvent(saved); setPage('detail')
    setEditingEventId(null)
  }

  const openAdd = () => { setEditingEventId(null); setForm({ type: '공연', title: '', place: '', time: '18:00', end: '20:00', link: '', memo: '', day: selectedDay, allDay: false, color: categories[0].color }); setPage('add') }

  return (
    <main className="app-shell">
      <div className="app-frame">
        <DesktopSidebar page={page} setPage={setPage} openAdd={openAdd} />
        <div className="page-content">
          {page === 'calendar' && <CalendarPage events={events} selectedDay={selectedDay} setSelectedDay={setSelectedDay} openDay={openDay} openAdd={openAdd} weekStartsMonday={weekStartsMonday} query={query} setQuery={setQuery} openEvent={openEvent} />}
          {page === 'day' && <DayPage events={dayEvents} day={selectedDay} openEvent={openEvent} openAdd={openAdd} setPage={setPage} setSelectedDay={setSelectedDay} />}
          {page === 'detail' && <DetailPage event={selectedEvent} favorite={favorite} setFavorite={setFavorite} menuOpen={detailMenuOpen} setMenuOpen={setDetailMenuOpen} setPage={setPage} onEdit={() => { setEditingEventId(selectedEvent.id); setForm({ type: selectedEvent.type, title: selectedEvent.title, place: selectedEvent.location || selectedEvent.place, time: selectedEvent.time, end: selectedEvent.end, link: selectedEvent.url || '', memo: selectedEvent.memo || '', day: selectedEvent.day, allDay: Boolean(selectedEvent.allDay), color: selectedEvent.color }); setPage('add') }} onDuplicate={() => duplicateEvent(selectedEvent)} onCopyLink={copyEventLink} onDelete={() => { setEvents((items) => items.filter((item) => item.id !== selectedEvent.id)); setPage('calendar'); showToast('일정을 삭제했어요') }} />}
          {page === 'add' && <AddPage form={form} setForm={setForm} onSave={saveEvent} onCancel={() => { setEditingEventId(null); setPage('calendar') }} isEditing={editingEventId !== null} />}
          {page === 'list' && <ListPage events={visibleEvents} filter={filter} setFilter={setFilter} query={query} setQuery={setQuery} openEvent={openEvent} />}
          {page === 'artists' && <ArtistsPage events={events} artists={artists} favorites={artistFavorites} setFavorites={setArtistFavorites} showFavoritesOnly={showFavoriteArtists} toggleFavoriteFilter={() => setShowFavoriteArtists((value) => !value)} onSelect={(artist) => { setSelectedArtist(artist); setPage('artist-detail') }} onGroupSchedule={() => setPage('list')} />}
          {page === 'artist-detail' && <ArtistDetailPage artist={selectedArtist} events={events} onBack={() => setPage('artists')} onEvent={openEvent} isFavorite={artistFavorites.includes(selectedArtist.id)} onFavorite={() => setArtistFavorites((items) => items.includes(selectedArtist.id) ? items.filter((id) => id !== selectedArtist.id) : [...items, selectedArtist.id])} />}
          {page === 'more' && <MorePage events={events} setPage={setPage} onExport={exportEvents} />}
          {page === 'categories' && <CategoriesPage onBack={() => setPage('more')} />}
          {page === 'insights' && <InsightsPage events={events} onBack={() => setPage('more')} onEvent={openEvent} />}
          {page === 'settings' && <SettingsPage notificationsEnabled={notificationsEnabled} setNotificationsEnabled={setNotificationsEnabled} weekStartsMonday={weekStartsMonday} setWeekStartsMonday={setWeekStartsMonday} onBack={() => setPage('more')} />}
          {page !== 'add' && page !== 'detail' && <div className="mobile-dock-shell"><BottomNav page={page} setPage={setPage} /><button className="mobile-add-button" onClick={openAdd} aria-label="새 일정 등록"><Plus size={25} strokeWidth={2.2} /></button></div>}
        </div>
        <DesktopAside events={events} page={page} openEvent={openEvent} openAdd={openAdd} setPage={setPage} />
        {toast && <div className="toast" role="status">{toast}</div>}
      </div>
    </main>
  )
}

function CalendarPage({ events, selectedDay, setSelectedDay, openDay, openAdd, weekStartsMonday, query, setQuery, openEvent }) {
  const cells = Array.from({ length: 35 }, (_, index) => index - (weekStartsMonday ? 2 : 3))
  const weekdayLabels = weekStartsMonday ? [...days.slice(1), days[0]] : days
  const selectedEvents = events.filter((event) => event.day === selectedDay)
  const searchResults = query.trim() ? events.filter((event) => `${event.title} ${event.place} ${event.type}`.toLowerCase().includes(query.trim().toLowerCase())) : []
  return <>
    <header className="calendar-header"><div className="calendar-title"><h1>2026년 10월 <Icon icon={ChevronDown} className="chevron" size={17} /></h1></div><div className="header-actions"><label className="calendar-search" title="일정 검색"><Search size={18} /><input aria-label="일정 검색" value={query} onChange={(event) => setQuery(event.target.value)} /></label><button aria-label="오늘 날짜로 이동" title="오늘로 이동" onClick={() => { setQuery(''); setSelectedDay(24) }}><Icon icon={CalendarDays} /></button></div></header>
    <section className="schedule-welcome"><div><span className="welcome-eyebrow">RIIZE WITH YOU</span><h2>오늘의 설렘을<br />차곡차곡 모아요</h2><p>이번 달 놓치지 말아야 할 순간</p></div><img src={rabbitWaveSrc} alt="반갑게 손을 흔드는 토끼 캐릭터" /></section>
    <section className="calendar-board"><div className="board-label"><span>MONTH VIEW</span><span className="board-label-dot" />OCTOBER 2026</div><div className="weekdays">{weekdayLabels.map((day, index) => <span className={(!weekStartsMonday && index === 0) || (weekStartsMonday && index === 6) ? 'sunday' : (!weekStartsMonday && index === 6) || (weekStartsMonday && index === 5) ? 'saturday' : ''} key={day}>{day}</span>)}</div>
    <section className="month-grid" aria-label="2026년 10월 달력">{cells.map((value, index) => {
      const day = value < 1 ? 30 + value : value > 31 ? value - 31 : value
      const current = value >= 1 && value <= 31
      const marks = events.filter((event) => event.day === day)
      return <button key={index} className={`date-cell ${current ? '' : 'muted'} ${current && day === selectedDay ? 'selected' : ''}`} onClick={() => { if (current) openDay(day) }}><span>{day}</span><i className="dots">{marks.slice(0, 3).map((event) => <b key={event.id} style={{ background: event.color }} />)}</i></button>
    })}</section>
    {query.trim() ? <section className="calendar-search-results"><div className="agenda-heading"><strong>검색 결과</strong><span className="count-badge">{searchResults.length}</span></div>{searchResults.length ? searchResults.map((event) => <EventRow event={event} key={event.id} onClick={() => { setSelectedDay(event.day); openEvent(event) }} compact />) : <p className="empty-note">일치하는 일정이 없어요.</p>}</section> : <section className="agenda-panel"><button className="agenda-heading" onClick={() => openDay(selectedDay)}><strong>10월 {selectedDay}일 ({days[(selectedDay + 3) % 7]})</strong><span className="count-badge">{selectedEvents.length}</span><ChevronRight className="right-chevron" size={18} /></button>
      <div className="agenda-list">{selectedEvents.length ? selectedEvents.map((event) => <EventRow event={event} key={event.id} onClick={() => openEvent(event)} compact />) : <p className="empty-note">등록된 일정이 없어요.</p>}</div>
    </section>}</section>
  </>
}

function EventRow({ event, onClick, compact = false }) {
  return <button className={`event-row ${compact ? 'compact' : ''}`} onClick={onClick}><span className="event-dot" style={{ background: event.color }} /><span className="event-time">{event.time}</span><span className="event-copy"><span className="category-pill" style={{ color: event.color, background: `${event.color}22` }}>{event.type}</span><strong>{event.title}</strong><small>{event.place}</small></span><span className="event-thumb tossface" style={{ background: `${event.color}25` }}>{event.image}</span></button>
}

function DayPage({ events, day, openEvent, openAdd, setPage, setSelectedDay }) {
  const slots = [10, 12, 14, 16, 18, 20, 22]
  return <><header className="sub-header"><button onClick={() => setPage('calendar')} aria-label="뒤로"><Icon icon={ChevronLeft} /></button><strong>{formatDate(day)}</strong><button onClick={() => setPage('calendar')} aria-label="월간 달력 열기" title="월간 달력 열기"><Icon icon={CalendarDays} /></button></header><div className="week-strip">{[5, 6, 7, 8, 9, 10, 11].map((item) => <button className={item === day ? 'active' : ''} onClick={() => setSelectedDay(item)} key={item}><small>{days[(item + 3) % 7]}</small><b>{item}</b><i>{events.some((event) => event.day === item) ? '•' : ''}</i></button>)}</div>
    <section className="timeline">{slots.map((hour) => <div className="time-row" key={hour}><span>{String(hour).padStart(2, '0')}:00</span><i /></div>)}{events.map((event) => <button key={event.id} className="timeline-event" style={{ '--event-color': event.color, '--event-pale': `${event.color}20`, top: `${(Number(event.time.slice(0, 2)) - 10) * 38}px` }} onClick={() => openEvent(event)}><span className="timeline-dot" /><span className="category-pill" style={{ color: event.color, background: '#fff' }}>{event.type}</span><strong>{event.title}</strong><small>{event.place}</small><b className="tossface">{event.image}</b><span className="bell"><Icon icon={Bell} size={14} /></span></button>)}</section><button className="floating-add" onClick={openAdd} aria-label="일정 추가"><Icon icon={Plus} size={26} /></button></>
}

function DetailPage({ event, favorite, setFavorite, menuOpen, setMenuOpen, setPage, onEdit, onDuplicate, onCopyLink, onDelete }) {
  return <section className="detail-page"><header className="detail-cover" style={{ background: `linear-gradient(135deg, ${event?.color || '#8b82d8'}, #557d70)` }}><button onClick={() => setPage('calendar')} aria-label="뒤로"><Icon icon={ChevronLeft} /></button><div className="detail-menu-anchor"><button aria-label="더보기" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Icon icon={MoreHorizontal} /></button>{menuOpen && <div className="detail-popover" role="menu"><button role="menuitem" onClick={() => { setMenuOpen(false); onCopyLink() }}><Icon icon={Link2} size={16} />링크 복사</button><button role="menuitem" onClick={() => { setMenuOpen(false); onDuplicate() }}><Icon icon={Copy} size={16} />일정 복제</button><button role="menuitem" className="danger" onClick={() => { setMenuOpen(false); onDelete() }}><Icon icon={Trash2} size={16} />일정 삭제</button></div>}</div><span className="tossface">{event?.image}</span></header><article className="detail-card"><div className="detail-type"><span className="category-pill" style={{ color: event.color, background: `${event.color}22` }}>{event.type}</span><button className="star" onClick={() => setFavorite(!favorite)} aria-label={favorite ? '즐겨찾기 해제' : '즐겨찾기'}><Icon icon={Star} size={22} fill={favorite ? 'currentColor' : 'none'} /></button></div><h2>{event.title}</h2><p className="info-line"><Icon icon={CalendarCheck2} /><span>{formatDate(event.day)}<small>{event.allDay ? '하루 종일' : <><Clock3 size={13} /> {event.time} ~ {event.end} (약 2시간 30분)</>}</small></span></p><p className="info-line"><Icon icon={MapPin} /><span>{event.location || event.place}<small><button className="map-button" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location || event.place)}`, '_blank', 'noopener,noreferrer')}>지도 열기</button></small></span></p>{event.url && <p className="info-line"><Icon icon={Link2} /><a href={event.url} target="_blank" rel="noreferrer"><ExternalLink size={13} /> {event.url}</a></p>}{event.memo && <div className="memo-box"><b><FileText size={14} />　메모</b><p>{event.memo}</p></div>}<p className="related-label"><Link2 size={14} />　관련 링크</p><div className="related-links"><button onClick={() => window.open('https://www.riizeofficial.com/', '_blank', 'noopener,noreferrer')}><Globe2 size={15} />　공식 홈페이지</button><button onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(`${event.title} 티켓 예매`)}`, '_blank', 'noopener,noreferrer')}><Ticket size={15} />　티켓 예매</button></div><div className="detail-actions"><button className="edit-button" onClick={onEdit}><Pencil size={15} />　수정하기</button><button className="delete-button" onClick={onDelete} aria-label="일정 삭제"><Trash2 size={17} /></button></div></article></section>
}

function AddPage({ form, setForm, onSave, onCancel, isEditing }) {
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const dateValue = `2026-10-${String(form.day).padStart(2, '0')}`

  return <section className="add-page">
    <header className="add-header"><button onClick={onCancel}>취소</button><strong>{isEditing ? '일정 수정' : '스케줄 추가'}</strong><button className="save-button" onClick={onSave}>저장</button></header>
    <div className="category-grid">{categories.map((category) => <button key={category.id} className={form.type === category.id ? 'chosen' : ''} onClick={() => setForm((current) => ({ ...current, type: category.id, color: category.color }))}><span style={{ color: category.color, background: category.pale }}><Icon icon={category.icon} size={20} /></span>{category.id}</button>)}</div>
    <label className="input-wrap"><span><FileText size={16} /></span><input placeholder="제목을 입력하세요" value={form.title} onChange={(e) => update('title', e.target.value)} /></label>
    <label className="input-wrap textarea-wrap"><span><FileText size={16} /></span><textarea placeholder="내용을 입력하세요 (선택)" value={form.memo} onChange={(e) => update('memo', e.target.value)} /></label>
    <div className="toggle-row"><span><Clock3 size={17} /></span><b>하루 종일</b><button type="button" className={`toggle ${form.allDay ? 'on' : ''}`} role="switch" aria-checked={form.allDay} aria-label="하루 종일" onClick={() => update('allDay', !form.allDay)} /></div>
    <div className={`form-row ${form.allDay ? 'disabled' : ''}`}><b>시작</b><input type="date" value={dateValue} onChange={(e) => update('day', Number(e.target.value.slice(-2)))} /><input type="time" value={form.time} disabled={form.allDay} onChange={(e) => update('time', e.target.value)} /></div>
    <div className={`form-row ${form.allDay ? 'disabled' : ''}`}><b>종료</b><input type="date" value={dateValue} onChange={(e) => update('day', Number(e.target.value.slice(-2)))} /><input type="time" value={form.end} disabled={form.allDay} onChange={(e) => update('end', e.target.value)} /></div>
    <label className="input-wrap"><span><MapPin size={16} /></span><input placeholder="장소를 입력하세요" value={form.place} onChange={(e) => update('place', e.target.value)} /></label>
    <label className="input-wrap"><span><Link2 size={16} /></span><input placeholder="관련 링크를 입력하세요" value={form.link} onChange={(e) => update('link', e.target.value)} /></label>
    <label className="input-wrap"><span><Bell size={16} /></span><select defaultValue="10분 전"><option>알림 없음</option><option>10분 전</option><option>30분 전</option><option>1시간 전</option></select></label>
    <div className="color-row"><b>색상</b>{['#f4b5c9', '#ffd0b9', '#ffe28d', '#bce8d7', '#b9ddfa', '#d6c9fa', '#ccced6'].map((color) => <button type="button" key={color} className={form.color === color ? 'selected' : ''} aria-label={`${color} 색상 선택`} aria-pressed={form.color === color} onClick={() => update('color', color)} style={{ background: color }} />)}</div>
  </section>
}

function ListPage({ events, filter, setFilter, query, setQuery, openEvent }) {
  const tabs = ['전체', '공연', '방송', '콘텐츠', '기타']
  return <><header className="list-header"><strong>스케줄 목록</strong><label><Search size={20} /><input aria-label="검색어" value={query} onChange={(event) => setQuery(event.target.value)} /></label></header><nav className="filter-tabs">{tabs.map((tab) => <button key={tab} className={filter === tab ? 'active' : ''} onClick={() => setFilter(tab)}>{tab}</button>)}</nav><p className="list-month">2026년 10월</p><div className="list-events">{events.map((event) => <button className="list-event" key={event.id} onClick={() => openEvent(event)}><i style={{ background: event.color }} /><span className="list-date">10.{String(event.day).padStart(2, '0')} ({days[(event.day + 3) % 7]})</span><time>{event.time}</time><span className="list-copy"><b className="category-pill" style={{ color: event.color, background: `${event.color}22` }}>{event.type}</b><strong>{event.title}</strong><small>{event.place}</small></span><span className="list-thumb tossface" style={{ background: `${event.color}22` }}>{event.image}</span></button>)}</div></>
}

function ArtistsPage({ events, artists, favorites, setFavorites, showFavoritesOnly, toggleFavoriteFilter, onSelect, onGroupSchedule }) {
  const upcoming = [...events].sort((a, b) => a.day - b.day || a.time.localeCompare(b.time)).slice(0, 3)
  const visibleArtists = showFavoritesOnly ? artists.filter((artist) => favorites.includes(artist.id)) : artists
  const isGroupSaved = favorites.includes('riize')
  return <>
    <header className="screen-header"><div><span className="eyebrow-label">MY ARTISTS</span><h2>아티스트</h2></div><button className={`icon-button ${showFavoritesOnly ? 'selected' : ''}`} onClick={toggleFavoriteFilter} aria-label={showFavoritesOnly ? '전체 멤버 보기' : '즐겨찾는 멤버만 보기'} aria-pressed={showFavoritesOnly} title={showFavoritesOnly ? '전체 멤버 보기' : '즐겨찾는 멤버만 보기'}><Icon icon={showFavoritesOnly ? Star : Settings2} /></button></header>
    <section className="artist-feature">
      <img className="artist-mascot" src={rabbitCheerSrc} alt="별과 함께 응원하는 토끼 캐릭터" />
      <div className="artist-feature-top"><div className="artist-logo">RIIZE</div><button className={`favorite-chip ${isGroupSaved ? 'saved' : ''}`} onClick={() => setFavorites((items) => isGroupSaved ? items.filter((id) => id !== 'riize') : [...items, 'riize'])} aria-label="RIIZE 즐겨찾기"><Icon icon={Star} size={18} fill={isGroupSaved ? 'currentColor' : 'none'} /></button></div>
      <p className="artist-kicker">WE LOVE RIIZE</p><h3>RIIZE</h3><p className="artist-description">좋아하는 아티스트의 일정을<br />한곳에서 모아보세요.</p>
      <button className="text-link-button" onClick={() => onGroupSchedule()}>전체 일정 보기 <Icon icon={ChevronRight} size={16} /></button>
      <div className="feature-orbit" aria-hidden="true"><span /><span /><span /></div>
    </section>
    <section className="content-section"><div className="section-title-row"><h3>{showFavoritesOnly ? '즐겨찾는 멤버' : '멤버'}</h3><span>{visibleArtists.length}명</span></div>{visibleArtists.length ? <div className="artist-grid">{visibleArtists.map((artist) => <button className="artist-card" key={artist.id} onClick={() => onSelect(artist)}><span className="artist-avatar" style={{ background: artist.color }}><UserRound size={25} /></span><strong>{artist.name}</strong><small>{artist.english}</small></button>)}</div> : <p className="favorite-empty">아직 즐겨찾는 멤버가 없어요.<br />멤버 상세에서 별을 눌러 추가해보세요.</p>}</section>
    <section className="content-section upcoming-section"><div className="section-title-row"><h3>다가오는 일정</h3><button onClick={() => onGroupSchedule()}>모두 보기 <Icon icon={ChevronRight} size={14} /></button></div><div className="upcoming-card">{upcoming.map((event) => <EventRow key={event.id} event={event} onClick={() => onGroupSchedule(event)} compact />)}</div></section>
  </>
}

function ArtistDetailPage({ artist, events, onBack, onEvent, isFavorite, onFavorite }) {
  return <>
    <header className="sub-header"><button onClick={onBack} aria-label="뒤로"><Icon icon={ChevronLeft} /></button><strong>아티스트</strong><button onClick={onFavorite} aria-label="즐겨찾기"><Icon icon={Star} size={17} fill={isFavorite ? 'currentColor' : 'none'} /></button></header>
    <section className="artist-detail-hero"><div className="artist-avatar large" style={{ background: artist.color }}><UserRound size={39} /></div><span className="eyebrow-label">RIIZE MEMBER</span><h2>{artist.name}</h2><p>{artist.english}</p><span className="artist-status"><span /> 일정 알림을 모아보고 있어요</span></section>
    <section className="content-section"><div className="section-title-row"><h3>관련 일정</h3><span>{events.length}개</span></div><div className="upcoming-card">{events.length ? events.map((event) => <EventRow key={event.id} event={event} onClick={() => onEvent(event)} compact />) : <p className="empty-note">아직 등록된 일정이 없어요.</p>}</div></section>
    <a className="official-link" href="https://www.riizeofficial.com/" target="_blank" rel="noreferrer"><Globe2 size={16} /> RIIZE 공식 홈페이지 <ExternalLink size={14} /></a>
  </>
}

function MenuRow({ icon, title, description, onClick, trailing }) {
  return <button className="menu-row" onClick={onClick}><span className="menu-row-icon"><Icon icon={icon} size={18} /></span><span className="menu-row-copy"><strong>{title}</strong><small>{description}</small></span>{trailing || <Icon icon={ChevronRight} className="menu-row-chevron" size={17} />}</button>
}

function MorePage({ events, setPage, onExport }) {
  return <>
    <header className="screen-header"><div><span className="eyebrow-label">MORE FOR YOU</span><h2>더보기</h2></div><span className="version-chip">v1.0</span></header>
    <section className="more-profile-card"><span className="profile-mark"><CalendarDays size={22} /></span><div><strong>WYD RIIZE</strong><small>나만의 스케줄 보관함</small></div><span className="profile-event-count">{events.length}<small>일정</small></span></section>
    <section className="content-section menu-section"><h3>환경 설정</h3><div className="menu-card">
      <MenuRow icon={CalendarCog} title="캘린더 설정" description="시작 요일과 알림 표시를 관리해요" onClick={() => setPage('settings')} />
      <MenuRow icon={Settings2} title="카테고리 안내" description="일정 종류와 색상을 확인해요" onClick={() => setPage('categories')} />
    </div></section>
    <section className="content-section menu-section"><h3>한눈에 보기</h3><div className="menu-card"><MenuRow icon={BarChart3} title="일정 인사이트" description="월간 일정 흐름과 카테고리 분포를 봐요" onClick={() => setPage('insights')} /></div></section>
    <section className="content-section menu-section"><h3>내 데이터</h3><div className="menu-card"><MenuRow icon={Download} title="일정 내보내기" description={`일정 ${events.length}개를 JSON 파일로 저장해요`} onClick={onExport} trailing={<Icon icon={ChevronRight} className="menu-row-chevron" size={17} />} /></div></section>
    <section className="content-section menu-section"><h3>정보</h3><div className="menu-card"><MenuRow icon={CircleHelp} title="RIIZE 공식 홈페이지" description="새 창에서 공식 사이트를 열어요" onClick={() => window.open('https://www.riizeofficial.com/', '_blank', 'noopener,noreferrer')} /><div className="app-info-row"><span><Info size={17} /> 앱 정보</span><small>WYD RIIZE · 버전 1.0.0</small></div></div></section>
  </>
}

function SettingsPage({ notificationsEnabled, setNotificationsEnabled, weekStartsMonday, setWeekStartsMonday, onBack }) {
  return <>
    <header className="sub-header"><button onClick={onBack} aria-label="뒤로"><Icon icon={ChevronLeft} /></button><strong>캘린더 설정</strong><span className="header-spacer" /></header>
    <section className="settings-intro"><span className="settings-intro-icon"><Settings2 size={22} /></span><h2>내 캘린더를<br />편하게 맞춰보세요.</h2><p>설정은 이 브라우저에서 적용돼요.</p></section>
    <section className="content-section settings-section"><h3>일정 표시</h3><div className="settings-card">
      <div className="setting-row"><span className="setting-icon"><BellRing size={17} /></span><span className="setting-copy"><strong>알림 아이콘 표시</strong><small>시간표에서 알림 표시를 보여줘요</small></span><button type="button" className={`toggle ${notificationsEnabled ? 'on' : ''}`} role="switch" aria-checked={notificationsEnabled} aria-label="알림 아이콘 표시" onClick={() => setNotificationsEnabled(!notificationsEnabled)} /></div>
      <div className="setting-divider" />
      <div className="setting-row"><span className="setting-icon"><CalendarDays size={17} /></span><span className="setting-copy"><strong>한 주 시작 요일</strong><small>월요일부터 달력을 보여줘요</small></span><button type="button" className={`toggle ${weekStartsMonday ? 'on' : ''}`} role="switch" aria-checked={weekStartsMonday} aria-label="월요일부터 시작" onClick={() => setWeekStartsMonday(!weekStartsMonday)} /></div>
    </div></section>
  </>
}

function CategoriesPage({ onBack }) {
  const descriptions = { 공연: '콘서트, 팬미팅, 투어', 방송: '음악방송, 예능, 드라마', 라디오: '라디오, 인터뷰', 예능: '예능, MC, 게스트', 팬싸: '팬사인회, 대면 이벤트', 콘텐츠: '공식 콘텐츠, 유튜브, SNS', 기타: '분류되지 않은 일정' }
  return <>
    <header className="sub-header"><button onClick={onBack} aria-label="뒤로"><Icon icon={ChevronLeft} /></button><strong>카테고리 안내</strong><span className="header-spacer" /></header>
    <p className="category-intro">일정 성격에 맞는 카테고리와<br />색상을 한눈에 확인해보세요.</p>
    <div className="category-guide-list">{categories.map((category) => <article className="category-guide-card" key={category.id}><span className="category-guide-icon" style={{ color: category.color, background: category.pale }}><Icon icon={category.icon} size={20} /></span><strong>{category.id}</strong><span className="category-guide-dot" style={{ background: category.color }} /><small>{descriptions[category.id]}</small></article>)}</div>
  </>
}

function InsightsPage({ events, onBack, onEvent }) {
  const monthEvents = events.filter((event) => event.day >= 1 && event.day <= 31)
  const categoryCounts = categories.map((category) => ({ ...category, count: monthEvents.filter((event) => event.type === category.id).length })).filter((category) => category.count)
  const busiest = categoryCounts.reduce((best, category) => !best || category.count > best.count ? category : best, null)
  const weekEvents = monthEvents.filter((event) => event.day >= 5 && event.day <= 11).length
  const milestones = [...monthEvents].sort((a, b) => a.day - b.day || a.time.localeCompare(b.time))
  const today = 24
  return <>
    <header className="sub-header"><button onClick={onBack} aria-label="뒤로"><Icon icon={ChevronLeft} /></button><strong>일정 인사이트</strong><span className="header-spacer" /></header>
    <section className="insights-hero"><div><span className="eyebrow-label">YOUR OCTOBER</span><h2>좋아하는 순간을<br />놓치지 않도록.</h2><p>이번 달 일정을 한눈에 모았어요.</p></div><img src={rabbitPlannerSrc} alt="달력을 품에 안은 토끼 캐릭터" /></section>
    <div className="insight-stats"><article><span className="stat-icon mint"><CalendarDays size={16} /></span><small>이번 달 일정</small><strong>{monthEvents.length}<em>개</em></strong><span className="stat-caption">10월에 예정된 스케줄</span></article><article><span className="stat-icon lavender"><Target size={16} /></span><small>가장 많은 카테고리</small><strong className="stat-category">{busiest?.id || '없음'}</strong><span className="stat-caption">{busiest ? `${busiest.count}개의 일정` : '새 일정을 추가해보세요'}</span></article></div>
    <section className="roadmap-card"><div className="roadmap-heading"><div><span className="eyebrow-label">MONTHLY ROADMAP</span><h3>2026년 10월</h3></div><span className="roadmap-month">OCT</span></div><div className="roadmap-scale"><span>1일</span><span>8일</span><span>15일</span><span>22일</span><span>31일</span></div><div className="roadmap-lanes">{categoryCounts.length ? categoryCounts.map((category) => <div className="roadmap-lane" key={category.id}><div className="lane-label"><span style={{ background: category.color }} /><b>{category.id}</b><small>{category.count}</small></div><div className="lane-track">{[1, 8, 15, 22, 31].map((day) => <i key={day} style={{ left: `${((day - 1) / 30) * 100}%` }} />)}{monthEvents.filter((event) => event.type === category.id).map((event) => <button key={event.id} aria-label={`${event.day}일 ${event.title}`} title={`${event.day}일 · ${event.title}`} className="roadmap-point" style={{ left: `${((event.day - 1) / 30) * 100}%`, background: category.color }} onClick={() => onEvent(event)} />)}{today <= 31 && <span className="today-marker" style={{ left: `${((today - 1) / 30) * 100}%` }} />}</div></div>) : <p className="empty-note">아직 일정이 없어요.</p>}</div><div className="roadmap-legend"><span><i className="legend-point" /> 일정</span><span><i className="legend-today" /> 오늘</span><small>점에 마우스를 올리거나 눌러 일정을 확인하세요</small></div></section>
    <section className="content-section"><div className="section-title-row"><h3>다가오는 일정</h3><span><BarChart3 size={14} /> 주간 일정 {weekEvents}개</span></div><div className="insight-event-list">{milestones.slice(0, 4).map((event) => <button className="insight-event" key={event.id} onClick={() => onEvent(event)}><span className="insight-event-date" style={{ color: event.color }}>{String(event.day).padStart(2, '0')}<small>OCT</small></span><span className="insight-event-line" style={{ background: event.color }} /><span className="insight-event-copy"><b>{event.title}</b><small>{event.type} · {event.time} · {event.place}</small></span><Icon icon={ChevronRight} size={16} /></button>)}</div></section>
  </>
}

function DesktopSidebar({ page, setPage, openAdd }) {
  const mainLinks = [
    { id: 'calendar', title: '캘린더', icon: CalendarDays },
    { id: 'list', title: '스케줄 목록', icon: ListChecks },
    { id: 'artists', title: '아티스트', icon: Heart },
    { id: 'insights', title: '인사이트', icon: BarChart3 },
  ]
  const activePage = page === 'day' || page === 'detail' || page === 'add' ? 'calendar' : page === 'artist-detail' ? 'artists' : page === 'settings' || page === 'categories' ? 'more' : page
  return <aside className="desktop-sidebar">
    <button className="desktop-brand" onClick={() => setPage('calendar')}><span className="brand-mark"><span /></span><span><b>WYD</b><small>RIIZE SCHEDULE</small></span></button>
    <button className="sidebar-create" onClick={openAdd}><Plus size={17} />새 일정 만들기</button>
    <span className="sidebar-caption">MY SPACE</span>
    <nav className="sidebar-nav">{mainLinks.map((link) => <button key={link.id} className={activePage === link.id ? 'active' : ''} onClick={() => setPage(link.id)}><Icon icon={link.icon} size={18} />{link.title}{link.id === 'list' && <small>2026</small>}</button>)}</nav>
    <span className="sidebar-caption artists-caption">ARTISTS</span>
    <button className="sidebar-artist" onClick={() => setPage('artists')}><span className="sidebar-artist-dot" /><span>RIIZE</span><ChevronRight size={14} /></button>
    <button className={`sidebar-nav-link ${activePage === 'more' ? 'active' : ''}`} onClick={() => setPage('more')}><Icon icon={Ellipsis} size={18} />더보기</button>
    <div className="sidebar-note"><img src={rabbitWaveSrc} alt="" /><b>좋아하는 순간,<br />놓치지 않게.</b><small>우리의 일정을 모아봐요</small></div>
    <div className="sidebar-account"><span className="account-avatar">R</span><span><b>RIIZE fan</b><small>나만의 일정 보관함</small></span><Ellipsis size={17} /></div>
  </aside>
}

function DesktopAside({ events, page, openEvent, openAdd, setPage }) {
  const ordered = [...events].sort((a, b) => a.day - b.day || a.time.localeCompare(b.time))
  const nextEvents = ordered.slice(0, 4)
  const categorySummary = categories.map((category) => ({ ...category, count: events.filter((event) => event.type === category.id).length })).filter((item) => item.count).sort((a, b) => b.count - a.count).slice(0, 4)
  return <aside className="desktop-aside">
    <div className="aside-date"><span>2026년</span><b>10월의 기록</b><button onClick={() => setPage('calendar')} aria-label="캘린더 열기"><CalendarDays size={17} /></button></div>
    <section className="aside-progress"><div className="aside-progress-top"><span>이번 달 모아둔 순간</span><Sparkles size={16} /></div><strong>{events.length}<small>개의 일정</small></strong><div className="aside-progress-track"><i style={{ width: `${Math.min(events.length * 7, 100)}%` }} /></div><p>RIIZE와 함께할 날이 기다려져요.</p><img src={rabbitPlannerSrc} alt="" /></section>
    <div className="aside-section-heading"><h3>다가오는 일정</h3><button onClick={() => setPage('list')}>모두 보기</button></div>
    <section className="aside-upcoming">{nextEvents.map((event) => <button className="aside-event" key={event.id} onClick={() => openEvent(event)}><span className="aside-event-day" style={{ color: event.color }}>{String(event.day).padStart(2, '0')}<small>OCT</small></span><i style={{ background: event.color }} /><span><b>{event.title}</b><small>{event.time} · {event.place}</small></span></button>)}</section>
    <div className="aside-section-heading category-heading"><h3>내 일정 컬러</h3><button onClick={() => setPage('insights')}>보기</button></div>
    <section className="aside-categories">{categorySummary.map((category) => <div className="aside-category" key={category.id}><span><i style={{ background: category.color }} />{category.id}</span><b>{category.count}</b></div>)}</section>
    <button className="aside-add-link" onClick={openAdd}><Plus size={15} />새 일정 추가</button>
  </aside>
}

function BottomNav({ page, setPage }) {
  return <nav className="bottom-nav"><button className={page === 'calendar' || page === 'day' ? 'active' : ''} onClick={() => setPage('calendar')}><span><House size={20} /></span>캘린더</button><button className={page === 'list' ? 'active' : ''} onClick={() => setPage('list')}><span><ListChecks size={20} /></span>스케줄</button><button className={page === 'artists' || page === 'artist-detail' ? 'active' : ''} onClick={() => setPage('artists')}><span><Heart size={20} /></span>아티스트</button><button className={page === 'more' || page === 'settings' || page === 'categories' || page === 'insights' ? 'active' : ''} onClick={() => setPage('more')}><span><Ellipsis size={20} /></span>더보기</button></nav>
}

export default App
