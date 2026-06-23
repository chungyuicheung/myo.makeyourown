import "./Closing.css";

interface Props {
  step: number;
}

export default function Closing({ step }: Props) {
  if (step > 3) return null;

  return (
    <div className="cl-stage">
      <img
        src="/assets/08-closing/pexels.jpg"
        className={`cl-bg-img ${step >= 0 ? "cl-bg-visible" : ""}`}
        alt=""
        aria-hidden="true"
      />
      <div className="cl-overlay" />

      <div className="cl-content">

        {/* Step 0: 近兩千年 */}
        {step === 0 && (
          <div className="cl-step cl-step-active">
            <div style={{ display: "flex", alignItems: "baseline", gap: 16, justifyContent: "center", marginBottom: 16 }}>
              <span className="cl-big-num">2000</span>
              <span className="cl-year-unit">年</span>
            </div>
            <p className="cl-history">
              《心經》流傳近兩千年
            </p>
            <p className="cl-history" style={{ marginTop: 12, opacity: 0.6 }}>
              東亞漢傳佛教寺廟每日誦讀
            </p>
          </div>
        )}

        {/* Step 1: 玄奘大師 */}
        {step === 1 && (
          <div className="cl-step cl-step-active">
            <div className="cl-master">
              <p className="cl-master-title">公元七世紀</p>
              <p className="cl-master-name">玄奘大師</p>
              <p className="cl-master-era">西行取經 · 七譯之一</p>
            </div>
            <div className="cl-divider" />
            <p className="cl-master-note">今日你我仍在讀</p>
          </div>
        )}

        {/* Step 2: 沙漠 vs 地鐵 */}
        {step === 2 && (
          <div className="cl-step cl-step-active">
            <p className="cl-step-label" style={{ fontSize: 14, fontFamily: "var(--font-body, IBM Plex Sans, sans-serif)", color: "rgba(241,243,245,0.36)", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 28 }}>
              同一段文字 · 相隔千年
            </p>
            <div className="cl-vs-container">
              <div className="cl-vs-item">
                <span className="cl-vs-zh">沙漠旅人</span>
                <span className="cl-vs-en">The pilgrim</span>
              </div>
              <span className="cl-vs-sep">↔</span>
              <div className="cl-vs-item">
                <span className="cl-vs-zh">地鐵行者</span>
                <span className="cl-vs-en">You</span>
              </div>
            </div>
            <p className="cl-vs-note">相隔千四百年，讀的是同一段文字</p>
          </div>
        )}

        {/* Step 3: 最終句 */}
        {step === 3 && (
          <div className="cl-step cl-step-active">
            <p className="cl-final">能除一切苦</p>
            <p className="cl-final-note">真實不虛</p>
          </div>
        )}
      </div>
    </div>
  );
}