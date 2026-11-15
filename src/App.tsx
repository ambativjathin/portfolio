import { lazy, Suspense, useState, useEffect } from "react";
import "./App.css";

const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer = lazy(() => import("./components/MainContainer"));
const ResumePage = lazy(() => import("./components/ResumePage"));
import { LoadingProvider } from "./context/LoadingProvider";

const App = () => {
  const [isResume, setIsResume] = useState(() => {
    return (
      window.location.pathname.toLowerCase().includes("resume") ||
      window.location.hash.toLowerCase().includes("resume")
    );
  });

  useEffect(() => {
    const handleLocationCheck = () => {
      setIsResume(
        window.location.pathname.toLowerCase().includes("resume") ||
        window.location.hash.toLowerCase().includes("resume")
      );
    };

    window.addEventListener("popstate", handleLocationCheck);
    window.addEventListener("hashchange", handleLocationCheck);

    return () => {
      window.removeEventListener("popstate", handleLocationCheck);
      window.removeEventListener("hashchange", handleLocationCheck);
    };
  }, []);

  if (isResume) {
    return (
      <Suspense
        fallback={
          <div
            style={{
              color: "#fff",
              padding: "50px",
              textAlign: "center",
              fontFamily: "sans-serif",
            }}
          >
            Loading Resume...
          </div>
        }
      >
        <ResumePage />
      </Suspense>
    );
  }

  return (
    <>
      <LoadingProvider>
        <Suspense>
          <MainContainer>
            <Suspense>
              <CharacterModel />
            </Suspense>
          </MainContainer>
        </Suspense>
      </LoadingProvider>
    </>
  );
};

export default App;
