export default function MyHomeSections() {
  return (
    <>
      {/* ============================================================
           SECTION 3 — MY HOME. MY EXHALE.
           ============================================================ */}
      <section className="mhex-section" id="exhale" aria-label="My Home. My Exhale.">
        <span className="peripheral peripheral-left">ABOVE THE CITY</span>
        <span className="peripheral peri-r1">STILLNESS / 04</span>
        <span className="peripheral peri-r2">ALTITUDE / 673M</span>
        <span className="peripheral peri-r3">PRIVATE</span>

        <div className="mhex-inner">
          <div className="mhex-eyebrow">
            THE SKYE<br />PRIVATE RESIDENCES &nbsp;/&nbsp; KASHMIR KUNNU
          </div>

          <div className="mhex-headline">
            <h2>
              <span className="line1">MY HOME.</span>
              <span className="line2">MY EXHALE.</span>
            </h2>
          </div>

          <div className="mhex-divider"></div>

          <div className="mhex-image-wrap">
            <picture>
              <source
                media="(min-width: 768px)"
                srcSet="https://res.cloudinary.com/pcodbmuo/image/upload/v1785878781/pool_qji0sb.webp"
              />
              <img
                src="https://res.cloudinary.com/pcodbmuo/image/upload/v1785878782/pool-0_oeucib.webp"
                alt="The pool above Kozhikode — The Skye, Kashmir Kunnu"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </picture>
          </div>

          <div className="mhex-body">
            <p>
              The city people call traffic,<br />
              you call sunset.
            </p>
            <p>
              Because by the time the lights come on in Kozhikode,<br />
              you’re already in the pool — watching them from above.
            </p>
            <p>Luxury was never about having more.</p>
          </div>

          <div className="mhex-closing">
            <p>It was always about this — the feeling of having arrived.</p>
          </div>
        </div>
      </section>

      {/* ============================================================
           SECTION 4 — MY HOME. MY MOMENTUM.
           ============================================================ */}
      <section className="mh-section" id="momentum" aria-label="My Home. My Momentum.">
        <span className="peripheral peripheral-left">ABOVE THE CITY</span>
        <span className="peripheral peri-r1">PEACE / 01</span>
        <span className="peripheral peri-r2">ALTITUDE / 673M</span>
        <span className="peripheral peri-r3">PRIVATE</span>

        <div className="mh-inner">
          <div className="mh-eyebrow">
            THE SKYE<br />PRIVATE RESIDENCES &nbsp;/&nbsp; KASHMIR KUNNU
          </div>

          <div className="mh-headline">
            <h2>
              <span className="line1">MY HOME.</span>
              <span className="line2">MY MOMENTUM.</span>
            </h2>
          </div>

          <div className="mh-divider"></div>

          <div className="mh-image-wrap">
            <picture>
              <source
                media="(min-width: 768px)"
                srcSet="https://res.cloudinary.com/pcodbmuo/image/upload/v1785878774/cycle_iekl2v.webp"
              />
              <img
                src="https://res.cloudinary.com/pcodbmuo/image/upload/v1785878774/cycle-v_lcwfb0.webp"
                alt="Cycling through the mist of Kashmir Kunnu"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </picture>
          </div>

          <div className="mh-body">
            <p>The mist is still sitting on Kashmir Kunnu.</p>
            <p>You clip into your cycle and disappear into it.</p>
            <p>
              By 9, you’re back in Kozhikode —<br />
              clear-headed, unhurried, ahead.
            </p>
            <p>Most people commute to find energy.</p>
          </div>

          <div className="mh-closing">
            <p>You wake up inside it.</p>
          </div>
        </div>
      </section>

      {/* ============================================================
           SECTION 5 — MY HOME. MY EDGE.
           ============================================================ */}
      <section className="mhe-section" id="edge" aria-label="My Home. My Edge.">
        <span className="peripheral peripheral-left">ABOVE THE CITY</span>
        <span className="peripheral peri-r1">CLARITY / 02</span>
        <span className="peripheral peri-r2">ALTITUDE / 673M</span>
        <span className="peripheral peri-r3">PRIVATE</span>

        <div className="mhe-inner">
          <div className="mhe-eyebrow">
            THE SKYE<br />PRIVATE RESIDENCES &nbsp;/&nbsp; KASHMIR KUNNU
          </div>

          <div className="mhe-headline">
            <h2>
              <span className="line1">MY HOME.</span>
              <span className="line2">MY EDGE.</span>
            </h2>
          </div>

          <div className="mhe-divider"></div>

          <div className="mhe-image-wrap">
            <picture>
              <source
                media="(min-width: 768px)"
                srcSet="https://res.cloudinary.com/pcodbmuo/image/upload/v1785927540/ChatGPT_Image_Aug_5_2026_04_28_12_PM_bkq3mo.webp"
              />
              <img
                src="https://res.cloudinary.com/pcodbmuo/image/upload/v1785878775/int-0_uvfdtx.webp"
                alt="The view from above — The Skye, Kashmir Kunnu"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </picture>
          </div>

          <div className="mhe-body">
            <p>Your boardroom call ends.</p>
            <p>You walk to the window.</p>
            <p>
              Below — the whole city,<br />
              still running its race.
            </p>
            <p>
              Up here, your next decision is already forming —<br />
              quietly, sharply.
            </p>
            <p>The hill doesn’t just give you a view.</p>
          </div>

          <div className="mhe-closing">
            <p>It gives you perspective no office ever could.</p>
          </div>
        </div>
      </section>
    </>
  );
}
