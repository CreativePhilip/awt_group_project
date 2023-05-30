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
import useDateSelector from "../hooks/useDateSelector";
import SecondaryButton from "./SecondaryButton";
import { date } from "yup";

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

function getGraphData(labels: Array<string>, values: Array<number>) {
  return {
    labels,
    datasets: [
      {
        label: "Hours spend on meetings",
        data: values,
        backgroundColor: "rgba(255, 158, 99, 1)",
      },
    ],
  };
}

export default function MeetingsDurationGraph() {
  const timelineOptions = [
    { value: "week", label: "Weekly" },
    { value: "month", label: "Monthly" },
    { value: "year", label: "Yearly" },
  ];

  const [userId, setUserId] = useState<number>(1);
  const dateNow = new Date(Date.now());
  const dateSelector = useDateSelector(userId, {
    day: dateNow.getDate(),
    month: dateNow.getMonth() + 1,
    year: dateNow.getFullYear(),
  });
  const modifiers = dateSelector.modifiers;
  const dateOptions = dateSelector.options;
  const graphData = dateSelector.graphData;

  return (
    <div className="grid justify-items-center items-start">
      <SelectOption
        options={timelineOptions}
        onChange={modifiers.setSelectedPeriod}
        containerStyle="justify-self-end"
      />
      <div className="flex justify-between w-screen">
        <SecondaryButton
          onClick={modifiers.goToPrevious}
          text={dateOptions.previousOption.label}
        />
        <div>{graphData.periodTitle}</div>
        <SecondaryButton
          onClick={modifiers.goToNext}
          text={dateOptions.nextOption.label}
        />
      </div>
      <Bar
        options={options}
        data={getGraphData(graphData.labels, graphData.values)}
      />
    </div>
  );
}
