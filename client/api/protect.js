export default function handler(req, res) {
  const auth = req.headers.authorization;

  const expected = "Basic " + Buffer.from("tester:tuesday2025").toString("base64");

  if (!auth || auth !== expected) {
    res.setHeader("WWW-Authenticate", "Basic realm=\"Protected\"");
    res.status(401).end("Access denied");
    return;
  }

  res.status(200).end();
}

