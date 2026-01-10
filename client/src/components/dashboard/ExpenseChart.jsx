import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export const ExpenseChart = ({ data = [], centerLabel, centerValue }) => {
  return (
    <div className="h-64 w-full relative min-h-[256px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={100}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              borderRadius: "12px",
              border: "none",
              color: "#f3f4f6",
            }}
            itemStyle={{ color: "#f3f4f6" }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Center Label */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          {centerLabel}
        </p>
        <p className="text-2xl font-bold text-gray-900">{centerValue}</p>
      </div>
    </div>
  );
};
