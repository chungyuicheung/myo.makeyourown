import "./Liberation.css";

interface Props {
  step: number;
}

export default function Liberation({ step }: Props) {
  if (step > 4) return null;

  return (
    <div className="li-stage">
      <img
        src="/assets/06-liberation/pexels.jpg"
        className={`li-bg-img ${step >= 0 ? "li-bg-visible" : ""}`}
        alt=""
        aria-hidden="true"
      />
      <div className="li-overlay" />

      <div className="li-content">

        {/* Step 0: 心無罣礙 */}
        {step === 0 && (
          <div className="li-step li-step-active">
            <p className="li-step-label">解脫之道</p>
            <p className="li-hero-text">心無罣礙</p>
            <p className="li-hero-sub">當你看清了五蘊皆空</p>
          </div>
        )}

        {/* Step 1: 無罣礙 → 無恐怖 → 遠離顛倒夢想 */}
        {step === 1 && (
          <div className="li-step li-step-active">
            <p className="li-step-label">《心經》原文</p>
            <div className="li-chain">
              <div className="li-chain-item">
                <span className="li-chain-zh">心無罣礙</span>
                <span className="li-chain-en">no obstruction</span>
              </div>
              <span className="li-chain-arrow">→</span>
              <div className="li-chain-item">
                <span className="li-chain-zh">無有恐怖</span>
                <span className="li-chain-en">no fear</span>
              </div>
              <span className="li-chain-arrow">→</span>
              <div className="li-chain-item">
                <span className="li-chain-zh">遠離顛倒夢想</span>
                <span className="li-chain-en">free from illusions</span>
              </div>
            </div>
            <p className="li-chain-note">看清真相，執著消散</p>
          </div>
        )}

        {/* Step 2: 究竟涅槃 */}
        {step === 2 && (
          <div className="li-step li-step-active">
            <p className="li-step-label">解脫的結果</p>
            <p className="li-nirvana">究竟涅槃</p>
            <p className="li-nirvana-sub">所有痛苦的徹底止息</p>
          </div>
        )}

        {/* Step 3: 三世諸佛，皆依般若 */}
        {step === 3 && (
          <div className="li-step li-step-active">
            <p className="li-step-label">三世諸佛</p>
            <div className="li-trios">
              <div className="li-trio">
                <p className="li-trio-era">過去</p>
                <p className="li-trio-name">燃燈佛</p>
                <p className="li-trio-note">過去無數劫</p>
              </div>
              <span className="li-trio-divider">·</span>
              <div className="li-trio">
                <p className="li-trio-era">現在</p>
                <p className="li-trio-name">釋迦牟尼</p>
                <p className="li-trio-note">娑婆世界</p>
              </div>
              <span className="li-trio-divider">·</span>
              <div className="li-trio">
                <p className="li-trio-era">未來</p>
                <p className="li-trio-name">彌勒佛</p>
                <p className="li-trio-note">龍華三會</p>
              </div>
            </div>
            <p className="li-chain-note" style={{ marginTop: 8 }}>
              三世諸佛，依般若波羅蜜多故<br />得阿耨多羅三藐三菩提
            </p>
          </div>
        )}

        {/* Step 4: 路徑總結 */}
        {step === 4 && (
          <div className="li-step li-step-active">
            <p className="li-step-label">解脫路徑</p>
            <div className="li-path">
              <div className="li-path-item">
                <span className="li-path-zh">看清</span>
                <span className="li-path-en">see through</span>
              </div>
              <span className="li-path-arrow">→</span>
              <div className="li-path-item">
                <span className="li-path-zh">不執著</span>
                <span className="li-path-en">let go</span>
              </div>
              <span className="li-path-arrow">→</span>
              <div className="li-path-item">
                <span className="li-path-zh">苦滅</span>
                <span className="li-path-en">suffering eases</span>
              </div>
            </div>
            <p className="li-path-note">不是逃避這個世界<br />是看懂它</p>
          </div>
        )}
      </div>
    </div>
  );
}