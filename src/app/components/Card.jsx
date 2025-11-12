import Link from "next/link";

export default function Card({ data }) {
  const treatments = data.typical_treatments?.slice(0,3).join(", ");
  return (
    <article className="bg-white/6 backdrop-blur-md border border-white/6 p-4 rounded-xl shadow transition hover:shadow-lg hover:translate-y-[-4px] duration-200">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white/90 truncate">{data.symptom}</h3>
          <p className="text-xs text-gray-300 mt-1">Since {data.since_days ?? "—"} days</p>
        </div>
        <div className={`px-2 py-1 text-xs rounded-full ${data.severity === 'Severe' ? 'bg-red-600 text-white' : data.severity === 'Moderate' ? 'bg-yellow-600 text-black' : 'bg-green-600 text-white'}`}>
          {data.severity}
        </div>
      </div>

      <p className="text-sm text-gray-200 mt-3 line-clamp-2">{treatments || "No typical treatment listed"}</p>
      <p className="text-xs text-gray-400 mt-2 italic">{data.notes}</p>

      <div className="mt-3 flex items-center gap-2">
      
        <span className="text-xs text-gray-500">•</span>
        
      </div>
    </article>
  );
}
