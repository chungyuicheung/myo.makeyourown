import { useEffect, useRef } from "react";
import "./Coldopen.css";

interface Props {
  step: number;
}

export default function Coldopen({ step }: Props) {
  if (step > 3) return null;

  return (
    <div className="cd-stage">
      {/* Atmospheric background images — pexels_1 (temple), pexels_2 (buddha) */}
      <div className="cd-bg-layer">
        <img
          src="/assets/01-coldopen/pexels_1.jpg"
          className={`cd-bg-img ${step >= 0 ? "cd-bg-visible" : ""}`}
          alt=""
          aria-hidden="true"
        />
        <img
          src="/assets/01-coldopen/pexels_2.jpg"
          className={`cd-bg-img ${step >= 1 ? "cd-bg-visible" : ""}`}
          alt=""
          aria-hidden="true"
        />
      </div>

      {/* Dark overlay for text legibility */}
      <div className="cd-overlay" />

      {/* Content layers — step-driven visibility */}
      <div className={`cd-content ${step === 0 ? "cd-content-active" : step < 3 ? "cd-content-past" : ""}`}>
        {/* Step 0: Hero number */}
        <div className={`cd-hero-num cd-entrance ${step >= 0 ? "cd-visible" : ""} ${step > 0 ? "cd-dim" : ""}`}>
          <span className="cd-number">260</span>
          <span className="cd-number-unit">字</span>
        </div>

        {/* Step 0-1: Supporting text */}
        <div className={`cd-line cd-entrance ${step >= 1 ? "cd-visible" : ""} ${step > 1 ? "cd-dim" : ""}`}>
          <p className="cd-body">
            全世界每天數不清的人
            <br />
            在寺廟、在佛堂、在地鐵上
            <br />
            誦讀同一段文字
          </p>
        </div>

        {/* Step 2: Full title */}
        <div className={`cd-title cd-entrance ${step >= 2 ? "cd-visible" : ""} ${step > 2 ? "cd-dim" : ""}`}>
          <p className="cd-full-title">般若波羅蜜多心經</p>
        </div>

        {/* Step 3: Question hook */}
        <div className={`cd-question cd-entrance ${step >= 3 ? "cd-visible" : ""}`}>
          <p className="cd-q-text">它是什麼？</p>
        </div>
      </div>

      {/* Decorative rule */}
      <div className={`cd-rule ${step >= 1 ? "cd-rule-visible" : ""}`} />
    </div>
  );
}