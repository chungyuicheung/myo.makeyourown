import "./CoreTeaching.css";

interface Props {
  step: number;
}

// Water states mapped to each step (cycles through form/emptiness)
const WATER_STATES = [
  { id: "ice",   label: "固態", desc: "形態固定", color: "#7baad4" },
  { id: "steam", label: "氣態", desc: "無形流動", color: "#aabfdc" },
];

export default function CoreTeaching({ step }: Props) {
  if (step > 5) return null;

  const waterState = step >= 1 && step <= 4 ? WATER_STATES[(step - 1) % 2] : null;

  return (
    <div className="ct-stage">
      {/* Background */}
      <img
        src="/assets/04-core-teaching/pexels.jpg"
        className={`ct-bg-img ${step >= 0 ? "ct-bg-visible" : ""}`}
        alt=""
        aria-hidden="true"
      />
      <div className="ct-overlay" />

      <div className="ct-content">

        {/* Step 0: Full four-line mantra */}
        {step === 0 && (
          <div className="ct-step ct-step-active">
            <div className="ct-mantra-block">
              <p className="ct-mantra-line ct-mantra-active">色不異空，空不異色</p>
              <p className="ct-mantra-line">色即是空，空即是色</p>
              <p className="ct-mantra-line">受想行識，亦復如是</p>
            </div>
            <p className="ct-conclusion-note" style={{ marginTop: 40 }}>
              《心經》核心四句
            </p>
          </div>
        )}

        {/* Steps 1-4: Single highlighted line + water state */}
        {step >= 1 && step <= 4 && (() => {
          const LINES = [
            "色不異空",
            "空不異色",
            "色即是空",
            "空即是色",
          ];
          const SUBS = [
            "物質現象和空性沒有分離",
            "空性和物質現象也沒有分離",
            "物質現象本身就是空性",
            "空性本身就是物質現象",
          ];
          const activeIdx = step - 1;
          const state = WATER_STATES[activeIdx % 2];

          return (
            <div className="ct-step ct-step-active">
              {/* Highlighted line */}
              <p className="ct-highlight-line">{LINES[activeIdx]}</p>
              <p className="ct-highlight-sub">{SUBS[activeIdx]}</p>

              <div className="ct-divider" />

              {/* Water states visual */}
              <div className="ct-water-states">
                {/* ICE state */}
                <div className={`ct-water-state ${state.id === "ice" ? "ct-state-active" : ""}`}>
                  <svg className="ct-state-icon ct-ice-svg" viewBox="0 0 100 100" role="img" aria-label="冰">
                    <polygon
                      points="50,8 72,35 72,65 50,92 28,65 28,35"
                      fill="none"
                      stroke="#7baad4"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                      opacity="0.9"
                    />
                    <polygon
                      points="50,20 64,40 64,60 50,80 36,60 36,40"
                      fill="none"
                      stroke="#7baad4"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                      opacity="0.6"
                    />
                    <line x1="28" y1="35" x2="72" y2="65" stroke="#7baad4" strokeWidth="1" opacity="0.3" />
                    <line x1="72" y1="35" x2="28" y2="65" stroke="#7baad4" strokeWidth="1" opacity="0.3" />
                    <circle cx="50" cy="50" r="5" fill="#7baad4" opacity="0.8" />
                  </svg>
                  <span className="ct-state-label">固態</span>
                  <span className="ct-state-desc">形態固定，冰</span>
                </div>

                {/* Arrow between states */}
                <svg width="40" height="20" viewBox="0 0 40 20" aria-hidden="true">
                  <line x1="0" y1="10" x2="30" y2="10" stroke="rgba(241,243,245,0.3)" strokeWidth="1.5" />
                  <polygon points="30,6 38,10 30,14" fill="rgba(241,243,245,0.4)" />
                </svg>

                {/* WATER (liquid) */}
                <div className={`ct-water-state ${state.id === "water" ? "ct-state-active" : ""}`}>
                  <svg className="ct-state-icon ct-water-svg" viewBox="0 0 100 100" role="img" aria-label="水">
                    <path
                      d="M50 15 C50 15, 25 45, 25 62 C25 78, 37 88, 50 88 C63 88, 75 78, 75 62 C75 45, 50 15, 50 15Z"
                      fill="none"
                      stroke="#5b8fd4"
                      strokeWidth="2.5"
                      opacity="0.9"
                    />
                    <path
                      d="M38 65 C38 65, 30 72, 50 72 C70 72, 62 65, 62 65"
                      fill="none"
                      stroke="#7baad4"
                      strokeWidth="1.5"
                      opacity="0.5"
                    />
                  </svg>
                  <span className="ct-state-label">液態</span>
                  <span className="ct-state-desc">流動適形，水</span>
                </div>

                {/* Arrow between states */}
                <svg width="40" height="20" viewBox="0 0 40 20" aria-hidden="true">
                  <line x1="0" y1="10" x2="30" y2="10" stroke="rgba(241,243,245,0.3)" strokeWidth="1.5" />
                  <polygon points="30,6 38,10 30,14" fill="rgba(241,243,245,0.4)" />
                </svg>

                {/* STEAM state */}
                <div className={`ct-water-state ${state.id === "steam" ? "ct-state-active" : ""}`}>
                  <svg className="ct-state-icon ct-steam-svg" viewBox="0 0 100 100" role="img" aria-label="氣">
                    {/* Wavy steam lines */}
                    <path
                      d="M30 80 C30 80, 20 60, 30 50 C40 40, 30 30, 30 20"
                      fill="none"
                      stroke="#aabfdc"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      opacity="0.7"
                    />
                    <path
                      d="M50 80 C50 80, 40 58, 50 46 C60 34, 50 24, 50 16"
                      fill="none"
                      stroke="#aabfdc"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      opacity="0.9"
                    />
                    <path
                      d="M70 80 C70 80, 60 58, 70 46 C80 34, 70 24, 70 16"
                      fill="none"
                      stroke="#aabfdc"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      opacity="0.7"
                    />
                    <ellipse cx="50" cy="85" rx="20" ry="6" fill="#aabfdc" opacity="0.2" />
                  </svg>
                  <span className="ct-state-label">氣態</span>
                  <span className="ct-state-desc">無形流動，氣</span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Step 5: Conclusion */}
        {step === 5 && (
          <div className="ct-step ct-step-active">
            <p className="ct-conclusion-line">受想行識，亦復如是</p>
            <div className="ct-divider" />
            <p className="ct-conclusion-note">
              感受、想法、意志、意識<br />
              與色蘊一樣，都是空性
            </p>
          </div>
        )}
      </div>
    </div>
  );
}