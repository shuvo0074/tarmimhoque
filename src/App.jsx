// App: root layout that wires refs, scroll interactions, and page chrome.
// Views: web and mobile.
import { lazy, Suspense, useRef } from "react";
import { BackToTop } from "./components/BackToTop";
import { Deck } from "./components/Deck";
// import { Dots } from "./components/Dots";
import { PhoneStage } from "./components/phone/PhoneStage";
import { ScrollHint } from "./components/ScrollHint";
// import { Topbar } from "./components/Topbar";
import { useCan3D } from "./hooks/useCan3D";
import { usePortfolioInteractions } from "./hooks/usePortfolioInteractions";

// three.js ships in its own chunk so mobile never downloads it.
const PhoneScene = lazy(() => import("./components/phone3d/PhoneScene"));

function App() {
  const deckRef = useRef(null);
  const phoneStageRef = useRef(null);
  const can3D = useCan3D();

  usePortfolioInteractions({ deckRef, phoneStageRef });

  return (
    <>
      <div className="noise"></div>
      {/* <Topbar /> */}
      {can3D && (
        <Suspense fallback={null}>
          <PhoneScene />
        </Suspense>
      )}
      <PhoneStage ref={phoneStageRef} showCssPhone={!can3D} />
      <Deck ref={deckRef} />
      <ScrollHint />
      <BackToTop />
      {/* <Dots /> */}
    </>
  );
}

export default App;
