import React, { useEffect, useRef, useState } from 'react';

const ParallaxPage = () => {
  const featureRef = useRef(null);
  const opaqueRef = useRef(null);
  const [showOpaque, setShowOpaque] = useState(false);

  useEffect(() => {
    const featureEl = featureRef.current;
    if (!featureEl) return;

    // 1) Compute initial zoom factor (e.g. 250% → 2.5)
    const computedBgSize = window
      .getComputedStyle(featureEl)
      .getPropertyValue('background-size'); // e.g. "250%"
    const zoomFactor = parseFloat(computedBgSize) / 100; // 2.5

    // 2) Measure the element's width in px
    const featureWidth = featureEl.clientWidth; // in px

    // 3) Calculate the "size" in px that corresponds to zoomFactor × width
    const initialSizePx = zoomFactor * featureWidth;

    // 4) Detect browser for the opaque overlay logic
    const isChrome =
      /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    const isSafari =
      /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);

    if (!isChrome && !isSafari) {
      // Only show opaque overlay on non‐Chrome/Safari
      setShowOpaque(true);
    }

    // Scroll handler
    const onScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const newSize = initialSizePx - scrollTop / 3;

      // Only update if the new size is still larger than the element's width
      if (newSize > featureWidth) {
        featureEl.style.backgroundSize = `${newSize}px`;
        const blurAmount = scrollTop / 100; // same formula as original
        featureEl.style.filter = `blur(${blurAmount}px)`;
        // Fade out the feature as you scroll down
        featureEl.style.opacity = `${1 - (scrollTop / document.documentElement.scrollHeight) * 1.3}`;
      }

      // If opaque overlay exists, update its opacity
      if (opaqueRef.current) {
        const opacity = Math.min(1, scrollTop / 5000);
        opaqueRef.current.style.opacity = opacity;
      }
    };

    // Attach listener
    window.addEventListener('scroll', onScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className="bg-[#232323] text-white min-h-screen">

      {/* Feature section */}
      <div
        ref={featureRef}
        className="fixed top-0 left-0 right-0 w-full z-0 overflow-hidden"
        style={{
          paddingTop: '50%',
          backgroundImage:
            "url('https://images.unsplash.com/photo-1619410283995-43d9134e7656?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '250%',
          boxShadow:
            '0 -50px 20px -20px #232323 inset',
        }}
      >
        {showOpaque && (
          <div
            ref={opaqueRef}
            className="absolute inset-0 bg-[#d2d6f1]"
            style={{ opacity: 0 }}
          />
        )}
      </div>

      {/* Content section */}
      <div className="relative z-10 w-[90%] mx-auto pt-[45%] sm:w-[60%] sm:pt-[35%]">
        <h2 className="text-2xl font-semibold mb-4">Heading</h2>
        <p className="mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent
          libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum
          imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta.
          Mauris massa. Vestibulum lacinia arcu eget nulla.
        </p>
        <p className="mb-4">
          Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos
          himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur
          tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed
          convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus,
          iaculis vel, suscipit quis, luctus non, massa.
        </p>
        <p className="mb-8">
          Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper
          vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. Class aptent
          taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec
          ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus
          ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi
          a tellus consequat imperdiet. Vestibulum sapien. Proin quam. Etiam ultrices.
        </p>

        <h2 className="text-2xl font-semibold mt-12 mb-4">Heading</h2>
        <p className="mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent
          libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum
          imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta.
          Mauris massa. Vestibulum lacinia arcu eget nulla.
        </p>
        <p className="mb-4">
          Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos
          himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur
          tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed
          convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus,
          iaculis vel, suscipit quis, luctus non, massa.
        </p>
        <p className="mb-8">
          Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper
          vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. Class aptent
          taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec
          ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus
          ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi
          a tellus consequat imperdiet. Vestibulum sapien. Proin quam. Etiam ultrices.
        </p>
      </div>
    </div>
  );
};

export default ParallaxPage;
