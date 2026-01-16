import { StatsCardProps } from "@/types/interface/dashboard";

const StatsCard = ({ title, value, icon }: StatsCardProps) => {
  return (
    <div className="bg-transparent cursor-pointer border-teal-300 border rounded-lg p-6 transition-all hover:shadow-md hover:shadow-teal-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 uppercase tracking-wide mb-2">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
        </div>
        <div className="text-teal-600 p-3 bg-white rounded-lg">{icon}</div>
      </div>
    </div>
  );
};

export default StatsCard;
