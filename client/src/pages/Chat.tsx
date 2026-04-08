import { useEffect } from 'react';
import { BottomNav } from '@/components/BottomNav';

export function Chat() {
  useEffect(() => {
    // Load JotForm embed handler
    const script = document.createElement('script');
    script.src = 'https://cdn.jotfor.ms/s/umd/8eaef1a3764/for-form-embed-handler.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.jotformEmbedHandler) {
        window.jotformEmbedHandler(
          "iframe[id='JotFormIFrame-019a6281257b78e997c9d72fc7166050b1db']",
          'https://www.jotform.com'
        );
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen">
      {/* Centered iframe */}
      <div className="flex-1 flex items-center justify-center">
        <iframe
          id="JotFormIFrame-019a6281257b78e997c9d72fc7166050b1db"
          title="Max: Dog Trainer"
          onLoad={() => window.parent.scrollTo(0, 0)}
          allowTransparency={true}
          allow="geolocation; microphone; camera; fullscreen"
          src="https://agent.jotform.com/019a6281257b78e997c9d72fc7166050b1db?embedMode=iframe&background=1&shadow=1"
          frameBorder={0}
          scrolling="no"
          style={{
            maxWidth: '100%',
            width: '100%',
            height: '80vh',
            border: 'none',
          }}
        />
      </div>

      {/* Bottom navigation */}
      <BottomNav />
    </div>
  );
}
