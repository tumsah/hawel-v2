import React, { useEffect } from "react";
import { API_BASE_URL } from "../config";

function Checkout() {
  useEffect(() => {
    const createSession = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/payments/create-session`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        });

        if (!res.ok) {
          console.error("Error creating Stripe session");
          return;
        }

        const data = await res.json();

        window.location = `https://checkout.stripe.com/pay/${data.id}`;
      } catch (err) {
        console.error(err);
      }
    };

    createSession();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Redirecting to Stripe Checkout...</p>
    </div>
  );
}

export default Checkout;
