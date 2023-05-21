import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import SelectOption from "./Select";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
};

const labels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
];

const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: labels.map(() => 29),
      backgroundColor: "rgba(255, 158, 99, 1)",
    },
  ],
};

export default function MeetingsDurationGraph() {
  const [selectedPeriod, setSelectedPeriod] = useState<any>();

  useEffect(() => {

  }, [selectedPeriod]);

  return (
    <div className="grid justify-items-center items-start">
      <SelectOption 
        options={[
          { value: "week", label: "Weekly" },
          { value: "month", label: "Monthly" },
          { value: "year", label: "Yearly" },
        ]}
        selected="Select time period"
        onChange={setSelectedPeriod}
        containerStyle="justify-self-end"
      />
      <Bar options={options} data={data} />
    </div>
  );
}
