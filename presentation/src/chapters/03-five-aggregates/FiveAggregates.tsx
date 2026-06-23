import "./FiveAggregates.css";

interface Props {
  step: number;
}

const AGGREGATES = [
  { zh: "色", en: "rūpa", sub: "form", detail: "眼睛能看到的物質世界", color: "#5b8fd4" },
  { zh: "受", en: "vedanā", sub: "sensation", detail: "冷熱、疼痛、快樂、悲傷", color: "#7baad4" },
  { zh: "想", en: "saṃjñā", sub: "perception", detail: "頭腦裏不停運轉的念頭", color: "#4a7fc4" },
  { zh: "行", en: "saṃskāra", sub: "volition", detail: "意志、決策、行動的驅使力", color: "#3d6fb4" },
  { zh: "識", en: "vijñāna", sub: "consciousness", detail: "知曉「我在」的意識", color: "#1e3a8a" },
];

export default function FiveAggregates({ step }: Props) {
  if (step > 5) return null;

  return (
    <div className="fa-stage">
      {/* Background — mandala/maturation image */}
      <div className="fa-bg-layer">
        <img
          src="/assets/03-five-aggregates/pixabay_2.jpg"
          className={`fa-bg-img ${step >= 2 ? "fa-bg-visible" : ""}`}
          alt=""
          aria-hidden="true"
        />
        <img
          src="/assets/03-five-aggregates/pexels_1.jpg"
          className={`fa-bg-img ${step >= 4 ? "fa-bg-visible" : ""}`}
          alt=""
          aria-hidden="true"
        />
      </div>
      <div className="fa-overlay" />

      <div className="fa-content">

        {/* Step 0: Opening verse */}
        {step === 0 && (
          <div className="fa-step fa-step-active">
            <p className="fa-verse-label">經文原文</p>
            <blockquote className="fa-verse">
              觀自在菩薩<br />
              行深般若波羅蜜多時<br />
              <em>照見五蘊皆空</em><br />
              度一切苦厄
            </blockquote>
            <p className="fa-verse-note">——《般若波羅蜜多心經》</p>
          </div>
        )}

        {/* Step 1-4: Single aggregate reveal */}
        {step >= 1 && step <= 4 && (() => {
          const agg = AGGREGATES[step - 1];
          return (
            <div className="fa-step fa-step-active">
              {/* Mandala SVG rings */}
              <div className="fa-mandala">
                <svg viewBox="0 0 320 320" className="fa-svg" role="img" aria-label={`五蘊：${agg.zh}`}>
                  {AGGREGATES.slice(0, step).map((a, i) => {
                    const r = 155 - i * 27;
                    const isNew = i === step - 1;
                    return (
                      <circle
                        key={a.zh}
                        cx="160" cy="160" r={r}
                        fill="none"
                        stroke={a.color}
                        strokeWidth={isNew ? "5" : "2"}
                        opacity={isNew ? 1 : 0.3}
                        className={isNew ? "fa-ring-enter" : "fa-ring-dim"}
                        strokeDasharray={isNew ? "none" : "6 4"}
                      />
                    );
                  })}
                  {/* Center label */}
                  <text
                    x="160" y="148"
                    textAnchor="middle"
                    fontSize="72"
                    fontWeight="900"
                    fontFamily="var(--font-display-cn, serif)"
                    fill="#f1f3f5"
                  >
                    {agg.zh}
                  </text>
                  <text
                    x="160" y="190"
                    textAnchor="middle"
                    fontSize="18"
                    fontStyle="italic"
                    fontFamily="var(--font-display-en, serif)"
                    fill="rgba(241,243,245,0.7)"
                  >
                    {agg.en}
                  </text>
                </svg>
              </div>

              {/* Text below mandala */}
              <div className="fa-text-block">
                <p className="fa-sub">{agg.sub}</p>
                <p className="fa-detail">{agg.detail}</p>
              </div>
            </div>
          );
        })()}

        {/* Step 5: All five aggregates shown together */}
        {step === 5 && (
          <div className="fa-step fa-step-active">
            <div className="fa-all-rings">
              <svg viewBox="0 0 340 340" className="fa-svg fa-svg-large" role="img" aria-label="五蘊全部">
                {AGGREGATES.map((a, i) => {
                  const r = 165 - i * 30;
                  const delay = i * 0.15;
                  return (
                    <g key={a.zh} className="fa-ring-group" style={{ animationDelay: `${delay}s` }}>
                      <circle
                        cx="170" cy="170" r={r}
                        fill="none"
                        stroke={a.color}
                        strokeWidth="2.5"
                        opacity="0.85"
                        strokeDasharray="none"
                      />
                      <text
                        x="170" y={165 - i * 30 + 6}
                        textAnchor="middle"
                        fontSize="16"
                        fontWeight="700"
                        fontFamily="var(--font-display-cn, serif)"
                        fill={a.color}
                      >
                        {a.zh}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            <div className="fa-text-block">
              <p className="fa-all-label">這五樣加起來</p>
              <p className="fa-all-main">就是你 · 是我</p>
              <p className="fa-all-sub">是每一個人對「自我」的全部認知</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}