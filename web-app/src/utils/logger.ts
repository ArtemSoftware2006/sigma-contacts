export const info = (...message: any) => {
    const isLogging = process.env.REACT_APP_IS_LOGGING === "true"; // "true" → true
    
    if (isLogging) {
      console.log(...message);
    }
  };