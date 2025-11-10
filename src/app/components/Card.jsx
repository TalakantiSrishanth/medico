export default function Card({ data }) {
  return (
    <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl shadow hover:shadow-lg transition">
      <h2 className="text-xl font-semibold text-blue-200">{data.symptom}</h2>
      <p className="text-sm text-gray-200">Severity: {data.severity}</p>
      <p className="text-gray-300 mt-1">
        <strong>Treatment:</strong> {data.typical_treatments.join(", ")}
      </p>
      <p className="text-gray-400 text-xs mt-2 italic">{data.notes}</p>
    </div>
  );
}
