
'use client';

interface Props {
  name: string;
  id: number;
}

export default function SpecialtyCard({ name, id,  }: Props) {
  return (
    <div
      
      className="bg-white p-6 rounded-xl shadow hover:shadow-lg cursor-pointer transition"
    >
      <h2 className="text-xl font-semibold text-blue-700">{name}</h2>
    </div>
  );
}
