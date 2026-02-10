import "@testing-library/jest-dom";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: () => {},
});

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(window, "ResizeObserver", {
  writable: true,
  value: ResizeObserverMock,
});

Object.defineProperty(globalThis, "ResizeObserver", {
  writable: true,
  value: ResizeObserverMock,
});

Object.defineProperty(navigator, "geolocation", {
  writable: true,
  value: {
    getCurrentPosition: (_success: PositionCallback, error?: PositionErrorCallback) => {
      if (error) {
        error({ code: 1, message: "Geolocation unavailable", PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 } as PositionError);
      }
    },
  },
});
