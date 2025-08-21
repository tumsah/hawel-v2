// checkPassword.js
const bcrypt = require("bcryptjs");

(async () => {
  const plain = "A9x!eP$4zQ2m";
  const hash = "$2b$10$MTbkMoOx7Pxo41K55IUVHe6M4/XV3tGnOykOfLPKGJTwlOWwT.PwG";

  const isMatch = await bcrypt.compare(plain, hash);
  console.log("Password match?", isMatch);
})();
