import { useState, useEffect } from "react";

export interface TranslationResult {
  original: string;
  translated: string;
  from: string;
  to: string;
}

export function useTranslation() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkAvailability();
  }, []);

  const checkAvailability = async () => {
    try {
      const response = await fetch("/api/translate/status");
      const data = await response.json();
      setIsAvailable(data.available);
    } catch (error) {
      console.error("Error checking translation availability:", error);
      setIsAvailable(false);
    } finally {
      setIsChecking(false);
    }
  };

  const translateText = async (
    text: string,
    from: string = "Hebrew",
    to: string = "English"
  ): Promise<string> => {
    if (!text || text.trim() === "") {
      return "";
    }

    if (!isAvailable) {
      throw new Error("Translation service not available");
    }

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, from, to }),
      });

      if (!response.ok) {
        throw new Error("Translation failed");
      }

      const data: TranslationResult = await response.json();
      return data.translated;
    } catch (error) {
      console.error("Translation error:", error);
      throw error;
    }
  };

  return {
    isAvailable,
    isChecking,
    translateText,
  };
}
