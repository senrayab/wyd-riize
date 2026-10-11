const features = [
  { number: '01', title: '빠른 시작', text: '가벼운 구성으로 바로 개발을 시작할 수 있어요.' },
  { number: '02', title: '반응형 화면', text: '모바일부터 데스크톱까지 자연스럽게 맞춰져요.' },
  { number: '03', title: '간편한 배포', text: 'Cloudflare Pages에서 정적 사이트로 배포할 수 있어요.' },
]

export default function App() {
  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="WYD Studio 홈">
          <span className="brand-mark">w.</span>
          <span>WYD Studio</span>
        </a>
        <span className="topbar-note"><span className="live-dot" /> 배포 테스트 페이지</span>
      </header>

      <section className="hero" id="home">
        <div className="hero-copy">
          <p className="eyebrow">A SMALL START, A BIG IDEA</p>
          <h1>아이디어를<br /><span>가볍게 시작해요.</span></h1>
          <p className="intro">React와 Vite로 만든 첫 화면입니다.<br className="desktop-break" /> 이 페이지가 보인다면 배포가 잘 연결된 거예요.</p>
          <a className="primary-link" href="#features">프로젝트 살펴보기 <span aria-hidden="true">↘</span></a>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="sun" />
          <div className="spark spark-one">✳</div>
          <div className="spark spark-two">✦</div>
          <div className="art-label">READY<br />TO BUILD</div>
        </div>
      </section>

      <section className="features" id="features" aria-labelledby="features-title">
        <div className="section-heading">
          <div><p className="eyebrow">THE FOUNDATION</p><h2 id="features-title">필요한 건 이미 준비됐어요.</h2></div>
          <p className="section-caption">작게 시작하고, 원하는 방향으로<br className="desktop-break" /> 자유롭게 확장해 보세요.</p>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.number}>
              <span className="feature-number">{feature.number}</span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <footer><span>WYD Studio</span><span>Made for the next idea <span aria-hidden="true">✳</span></span></footer>
    </main>
  )
}