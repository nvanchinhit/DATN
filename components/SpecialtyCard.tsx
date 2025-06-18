interface Props {
  name: string;
}

export default function SpecialtyCard({ name }: Props) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition transform hover:scale-105 text-center border border-blue-100">
      <h3 className="text-lg font-semibold text-blue-800">{name}</h3>
    </div>
  );
}
