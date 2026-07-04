// App: root layout that wires refs, scroll interactions, and page chrome.
// Views: web and mobile.
import { useRef } from "react";
import { Deck } from "./components/Deck";
import { Dots } from "./components/Dots";
import { PhoneStage } from "./components/phone/PhoneStage";
import { Topbar } from "./components/Topbar";
import { usePortfolioInteractions } from "./hooks/usePortfolioInteractions";

function App() {
  const deckRef = useRef(null);
  const phoneStageRef = useRef(null);

  usePortfolioInteractions({ deckRef, phoneStageRef });

  return (
    <>
      <div className="noise"></div>
      <Topbar />
      <PhoneStage ref={phoneStageRef} />
      <Deck ref={deckRef} />
      <Dots />
    </>
  );
}

export default App;
