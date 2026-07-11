// App: root layout that wires refs, scroll interactions, and page chrome.
// Views: web and mobile.
import { useRef } from "react";
import { BackToTop } from "./components/BackToTop";
import { Deck } from "./components/Deck";
// import { Dots } from "./components/Dots";
import { PhoneStage } from "./components/phone/PhoneStage";
import { ScrollHint } from "./components/ScrollHint";
// import { Topbar } from "./components/Topbar";
import { usePortfolioInteractions } from "./hooks/usePortfolioInteractions";

function App() {
  const deckRef = useRef(null);
  const phoneStageRef = useRef(null);

  usePortfolioInteractions({ deckRef, phoneStageRef });

  return (
    <>
      <div className="noise"></div>
      {/* <Topbar /> */}
      <PhoneStage ref={phoneStageRef} />
      <Deck ref={deckRef} />
      <ScrollHint />
      <BackToTop />
      {/* <Dots /> */}
    </>
  );
}

export default App;
