export default {
    getItem: jest.fn(() => Promise.resolve(null)),  // Simule un getItem qui retourne null
    setItem: jest.fn(() => Promise.resolve()),      // Simule un setItem
    removeItem: jest.fn(() => Promise.resolve()),   // Simule un removeItem
    clear: jest.fn(() => Promise.resolve()),        // Simule un clear
  };
  