import "./TitleMeaning.css";

interface Props {
  step: number;
}

export default function TitleMeaning({ step }: Props) {
  if (step > 4) return null;

  return (
    <div className="tm-stage">
      {/* Background images — fade in based on step */}
      <div className="tm-bg-layer">
        <img
          src="/assets/02-title-meaning/pexels_1.jpg"
          className={`tm-bg-img ${step >= 1 && step < 3 ? "tm-bg-active" : ""}`}
          alt=""
          aria-hidden="true"
        />
        <img
          src="/assets/02-title-meaning/pexels_2.jpg"
          className={`tm-bg-img ${step >= 3 ? "tm-bg-active" : ""}`}
          alt=""
          aria-hidden="true"
        />
      </div>

      {/* Dark gradient overlay */}
      <div className="tm-overlay" />

      {/* Step 0: Opening */}
      <div className={`tm-step ${step === 0 ? "tm-step-active" : "tm-step-gone"}`}>
        <p className="tm-chapter-label">Chapter 2</p>
        <h1 className="tm-main-title">名字的含義</h1>
        <p className="tm-subtitle">《般若波羅蜜多心經》</p>
      </div>

      {/* Step 1: 般若 */}
      <div className={`tm-step ${step === 1 ? "tm-step-active" : "tm-step-gone"}`}>
        <div className="tm-term-wrap">
          <span className="tm-term">般若</span>
          <span className="tm-term-en">prajñā</span>
        </div>
        <p className="tm-pinyin">bōrě</p>
        <div className="tm-divider" />
        <p className="tm-meaning">
          能照見諸法實相的<br />
          終極智慧
        </p>
        <p className="tm-detail">
          不是考試高分那種聰明，是徹底理解世界運作方式的能力
        </p>
      </div>

      {/* Step 2: 波羅蜜多 */}
      <div className={`tm-step ${step === 2 ? "tm-step-active" : "tm-step-gone"}`}>
        <div className="tm-term-wrap">
          <span className="tm-term">波羅蜜多</span>
          <span className="tm-term-en">pāramitā</span>
        </div>
        <p className="tm-pinyin">bōluómìduō</p>
        <div className="tm-divider" />
        <p className="tm-meaning">
          到彼岸
        </p>
        <p className="tm-detail">
          從此岸的迷惑與痛苦，渡到解脫的彼岸去
        </p>
        <div className="tm-shore-visual">
          <span className="tm-shore tm-shore-left">此岸</span>
          <span className="tm-shore-arrow">→</span>
          <span className="tm-shore tm-shore-right">彼岸</span>
        </div>
      </div>

      {/* Step 3: 心 */}
      <div className={`tm-step ${step === 3 ? "tm-step-active" : "tm-step-gone"}`}>
        <div className="tm-term-wrap">
          <span className="tm-term">心</span>
          <span className="tm-term-en">hṛdaya</span>
        </div>
        <p className="tm-pinyin">xīn</p>
        <div className="tm-divider" />
        <p className="tm-meaning">
          核心 · 精髓 · 靈魂
        </p>
        <p className="tm-detail">
          這部經是整部《大般若經》的靈魂所在
        </p>
      </div>

      {/* Step 4: 經 */}
      <div className={`tm-step ${step === 4 ? "tm-step-active" : "tm-step-gone"}`}>
        <div className="tm-term-wrap">
          <span className="tm-term">經</span>
          <span className="tm-term-en">sūtra</span>
        </div>
        <p className="tm-pinyin">jīng</p>
        <div className="tm-divider" />
        <p className="tm-meaning">
          恒常不變的路徑
        </p>
        <p className="tm-detail">
          上契諸佛之理，下契眾生之機
        </p>
      </div>
    </div>
  );
}