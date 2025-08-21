// src/utils/consent.js

export async function sendConsent(consentData) {
  try {
    const response = await fetch("http://localhost:5000/api/consent", { // Change URL if needed
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(consentData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Consent API Error:", error);
    throw error;
  }
}
