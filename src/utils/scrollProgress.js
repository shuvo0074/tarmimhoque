// Scroll progress store: eased stage progress shared with the 3D scene.
// Written by usePortfolioInteractions on scroll, read by the render loop (no React re-renders).
// Views: web only.
export const scrollProgress = {
  heroAbout: 0,
  aboutExperience: 0,
  experienceProjects: 0,
  sceneHidden: false,
};

const sceneHiddenListeners = new Set();

// The 3D scene stops rendering once it has faded out behind the project phones.
export function setSceneHidden(hidden) {
  if (scrollProgress.sceneHidden === hidden) return;
  scrollProgress.sceneHidden = hidden;
  sceneHiddenListeners.forEach((listener) => listener(hidden));
}

export function subscribeSceneHidden(listener) {
  sceneHiddenListeners.add(listener);
  return () => sceneHiddenListeners.delete(listener);
}
