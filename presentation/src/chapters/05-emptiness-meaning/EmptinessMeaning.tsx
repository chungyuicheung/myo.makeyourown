import "./EmptinessMeaning.css";

interface Props {
  step: number;
}

export default function EmptinessMeaning({ step }: Props) {
  if (step > 4) return null;

  return (
    <div className="em-stage">
      {/* Background */}
      <img
        src="/assets/05-emptiness-meaning/pexels.jpg"
        className={`em-bg-img ${step >= 0 ? "em-bg-visible" : ""}`}
        alt=""
        aria-hidden="true"
      />
      <div className="em-overlay" />

      <div className="em-content">

        {/* Step 0: Opening question */}
        {step === 0 && (
          <div className="em-step em-step-active">
            <p className="em-question-mark">?</p>
            <p className="em-main-q">什麼是「空」？</p>
            <p className="em-sub-q">空 ≠ 無，空是什麼意思？</p>
          </div>
        )}

        {/* Step 1: 緣起 — flow diagram */}
        {step === 1 && (
          <div className="em-step em-step-active">
            <p className="em-step-label">緣起</p>
            <div className="em-flow-diagram">
              {/* 因 node */}
              <div className="em-node em-node-cause">
                <span className="em-node-zh">因</span>
                <span className="em-node-en">cause</span>
              </div>
              {/* plus sign */}
              <span className="em-plus">+</span>
              {/* 緣 node */}
              <div className="em-node em-node-condition">
                <span className="em-node-zh">緣</span>
                <span className="em-node-en">condition</span>
              </div>
              {/* arrow */}
              <div className="em-arrow-group">
                <div className="em-arrow-line" />
                <div className="em-arrow-head" />
              </div>
              {/* 法 node */}
              <div className="em-node em-node-result">
                <span className="em-node-zh">法</span>
                <span className="em-node-en">phenomenon</span>
              </div>
            </div>
            <p className="em-flow-note">
              條件聚合，事物才能存在<br />
              沒有一樣東西憑自己能存在
            </p>
          </div>
        )}

        {/* Step 2: 性空 — no-self */}
        {step === 2 && (
          <div className="em-step em-step-active">
            <p className="em-step-label">性空</p>
            <div className="em-empty-diagram">
              <div className="em-entity-block">
                <span className="em-entity-text">任何法</span>
              </div>
              <div className="em-arrow-down">
                <span className="em-arrow-line-v" />
                <span className="em-arrow-head-v" />
              </div>
              <p className="em-empty-result">無自性</p>
            </div>
            <p className="em-empty-note">
              因為依因待緣而立<br />
              所以沒有獨立、永恆、固定的本質
            </p>
          </div>
        )}

        {/* Step 3: 龍樹引言 */}
        {step === 3 && (
          <div className="em-step em-step-active">
            <p className="em-step-label">龍樹菩薩 · 中論</p>
            <blockquote className="em-quote">
              未曾有一法<br />
              不從因緣生<br />
              <em>是故一切法</em><br />
              <em>無不是空者</em>
            </blockquote>
          </div>
        )}

        {/* Step 4: 雙重否定結論 */}
        {step === 4 && (
          <div className="em-step em-step-active">
            <p className="em-step-label">《心經》的立場</p>
            <div className="em-dual-neg">
              <div className="em-neg-item em-neg-left">
                <span className="em-neg-symbol">✗</span>
                <p className="em-neg-text">實體論</p>
                <p className="em-neg-sub">「有」一個固定不變的自性</p>
              </div>
              <div className="em-neg-vs">亦非</div>
              <div className="em-neg-item em-neg-right">
                <span className="em-neg-symbol">✗</span>
                <p className="em-neg-text">虛無論</p>
                <p className="em-neg-sub">「什麼都沒有」</p>
              </div>
            </div>
            <div className="em-divider" />
            <p className="em-conclusion">
              空性不在現象之外<br />
              也不是否定現象的存在
            </p>
          </div>
        )}
      </div>
    </div>
  );
}