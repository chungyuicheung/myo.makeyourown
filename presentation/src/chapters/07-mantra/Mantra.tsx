import "./Mantra.css";

interface Props {
  step: number;
}

export default function Mantra({ step }: Props) {
  if (step > 4) return null;

  return (
    <div className="ma-stage">
      <img
        src="/assets/07-mantra/pexels.jpg"
        className={`ma-bg-img ${step >= 0 ? "ma-bg-visible" : ""}`}
        alt=""
        aria-hidden="true"
      />
      <div className="ma-overlay" />

      <div className="ma-content">

        {/* Step 0: Mantra in Chinese */}
        {step === 0 && (
          <div className="ma-step ma-step-active">
            <p className="ma-mantra-cn">揭諦揭諦</p>
            <p className="ma-mantra-cn">波羅揭諦</p>
            <p className="ma-mantra-cn">波羅僧揭諦</p>
            <p className="ma-mantra-cn">菩提薩婆訶</p>
            <div className="ma-divider" />
            <p className="ma-mantra-sanskrit">Gate gate pārasaṃgate bodhi svāhā</p>
          </div>
        )}

        {/* Step 1: Translation */}
        {step === 1 && (
          <div className="ma-step ma-step-active">
            <p className="ma-translation">去罷！</p>
            <p className="ma-translation">去彼岸！</p>
            <p className="ma-translation-sub">眾人一起去彼岸！覺悟成就罷！</p>
          </div>
        )}

        {/* Step 2: Action call */}
        {step === 2 && (
          <div className="ma-step ma-step-active">
            <p className="ma-call">這不是神秘咒語</p>
            <p className="ma-call-note">這是一個行動的呼籲</p>
          </div>
        )}

        {/* Step 3: Bilingual */}
        {step === 3 && (
          <div className="ma-step ma-step-active">
            <p className="ma-step-label" style={{ fontSize: 14, fontFamily: "var(--font-body, IBM Plex Sans, sans-serif)", color: "rgba(241,243,245,0.36)", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 28 }}>
              Sanskrit
            </p>
            <p className="ma-sanskrit-line">Gate gate</p>
            <p className="ma-sanskrit-line">pārasaṃgate</p>
            <p className="ma-sanskrit-line">bodhi svāhā</p>
            <div className="ma-divider" />
            <p className="ma-english-line">Gone, gone,</p>
            <p className="ma-english-line">gone to the other shore,</p>
            <p className="ma-english-line">awakening accomplished.</p>
          </div>
        )}

        {/* Step 4: Final declaration */}
        {step === 4 && (
          <div className="ma-step ma-step-active">
            <p className="ma-declaration">能除一切苦</p>
            <p className="ma-declaration-note">真實不虛</p>
          </div>
        )}
      </div>
    </div>
  );
}