export default function Fees(){
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Fees</h1>
      <ul className="list-disc pl-6">
        <li>Transfer fee: 2.5% (capped at $25)</li>
        <li>FX fee: 2.5%</li>
        <li>Transparent totals before you pay</li>
      </ul>
    </main>
  );
}
