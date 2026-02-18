import { StatsCardProps } from "@/types/interface/dashboard";

const StatsCard = ({ title, value, icon }: StatsCardProps) => {
  return (
    <div className="cursor-pointer bg-teal-100/70 rounded-lg p-6 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-teal-600 uppercase tracking-wide mb-2">
            {title}
          </p>
          <p className="text-4xl font-bold text-teal-400 mb-1">{value}</p>
        </div>
        <div className="text-teal-400 p-3 bg-white rounded-full">{icon}</div>
      </div>
    </div>
  );
};

export default StatsCard;
