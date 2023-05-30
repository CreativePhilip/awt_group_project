import { useEffect, useState } from "react";
import { getMonthlyData, getWeeklyData, getYearlyData } from "../api/graphs";

interface DateObject {
  year: number;
  month: number;
  day: number;
}

interface DataObject {
  year: object;
  month: object;
  week: object;
}

interface Option {
  label: string;
  value: number | Date;
}

const weekInSeconds = 5 * 24 * 60 * 60 * 1000;

export default function useDateSelector(
  userId: number,
  initialDate: DateObject
) {
  const [selectedPeriod, setSelectedPeriod] = useState<any>("week");
  const [date, setDate] = useState<DateObject>(initialDate);
  const [periodTitle, setPeriodTitle] = useState<string>("");

  const [labels, setLabels] = useState<Array<string>>([]);
  const [values, setValues] = useState<Array<number>>([]);

  const getData = async () => {
    const weeklyResponse = await getWeeklyData(
      `${date.day}.${date.month}.${date.year}`,
      userId
    );
    const monthlyResponse = await getMonthlyData(date.month, date.year, userId);
    const yearlyResponse = await getYearlyData(date.year, userId);

    const responseData: DataObject = {
      week: weeklyResponse?.data ?? {},
      month: monthlyResponse?.data ?? {},
      year: yearlyResponse?.data ?? {},
    };

    updateLabels(responseData);
  };

  const updateLabels = (responseData: DataObject) => {
    const selectedData = responseData[selectedPeriod as keyof DataObject];
    if (selectedData != undefined) {
      setLabels(Object.keys(selectedData) ?? {});
      setValues(Object.values(selectedData) ?? {});
    }
  };

  const updateDate = (v: number, key: string) => {
    setDate({
      ...date,
      [key]: v,
    });
  };

  function nextWeek() {
    const currentDate = new Date(date.year, date.month - 1, date.day);
    return new Date(currentDate.getTime() + weekInSeconds);
  }

  function previousWeek() {
    const currentDate = new Date(date.year, date.month - 1, date.day);
    return new Date(currentDate.getTime() - weekInSeconds);
  }

  const weekAsString = (week: Date) => {
    const nextDate = week;
    const nextDay = nextDate.getDate();
    const nextMonth = nextDate.toLocaleString("en-US", { month: "long" });
    const nextYear = nextDate.getFullYear();
    return `${nextDay} ${nextMonth} ${nextYear}`;
  };

  const updatePeriodTitle = () => {
    if (selectedPeriod == "year") {
      setPeriodTitle(String(date.year));
      return;
    }
    const dateObj = new Date();
    dateObj.setMonth(date.month - 1);
    const monthName = dateObj.toLocaleString("en-US", { month: "long" });
    if (selectedPeriod == "month") {
      setPeriodTitle(`${monthName} ${date.year}`);
      return;
    }
    if (selectedPeriod == "week") {
      setPeriodTitle(
        `${date.day} ${monthName} ${date.year} - ${weekAsString(nextWeek())}`
      );
    }
  };

  function next(): Option {
    if (selectedPeriod == "year") {
      return {
        label: String(date.year + 1),
        value: date.year + 1,
      };
    }
    if (selectedPeriod == "month") {
      const currentDate = new Date(date.year, date.month, date.day);
      return {
        label: `${currentDate.toLocaleString("en-US", { month: "long" })} ${
          date.year
        }`,
        value: currentDate.getMonth() + 1,
      };
    }
    if (selectedPeriod == "week") {
      const nextWeekDate = nextWeek();
      return {
        label: weekAsString(nextWeekDate),
        value: nextWeekDate,
      };
    }

    return {
      label: "",
      value: -1,
    };
  }

  const nextOption: Option = next();

  function goToNext() {
    if (selectedPeriod == "year") {
      setDate({ ...date, year: nextOption.value as number });
      return;
    }
    if (selectedPeriod == "month") {
      setDate({ ...date, month: nextOption.value as number });
    }
    if (selectedPeriod == "week") {
      const nextDate = nextOption.value as Date;
      setDate({
        day: nextDate.getDate(),
        month: nextDate.getMonth() + 1,
        year: nextDate.getFullYear(),
      });
    }
  }

  function previous(): Option {
    if (selectedPeriod == "year") {
      return {
        label: String(date.year - 1),
        value: date.year - 1,
      };
    }
    if (selectedPeriod == "month") {
      const currentDate = new Date(date.year, date.month - 2, date.day);
      return {
        label: `${currentDate.toLocaleString("en-US", { month: "long" })} ${
          date.year
        }`,
        value: currentDate.getMonth(),
      };
    }
    if (selectedPeriod == "week") {
      const previousWeekDate = previousWeek();
      return {
        label: weekAsString(previousWeekDate),
        value: previousWeekDate,
      };
    }

    return {
      label: "",
      value: -1,
    };
  }

  const previousOption: Option = previous();

  function goToPrevious() {
    if (selectedPeriod == "year") {
      setDate({ ...date, year: previousOption.value as number });
      return;
    }
    if (selectedPeriod == "month") {
      setDate({ ...date, month: previousOption.value as number });
      return;
    }
    if (selectedPeriod == "week") {
      const previousDate = previousOption.value as Date;
      console.log(previousDate);
      setDate({
        day: previousDate.getDate(),
        month: previousDate.getMonth() + 1,
        year: previousDate.getFullYear(),
      });
    }
  }

  useEffect(() => {
    getData();
    updatePeriodTitle();
    console.log("date in useEffect", date);
  }, [selectedPeriod, date]);

  return {
    graphData: {
      labels: labels,
      values: values,
      periodTitle: periodTitle,
    },
    options: {
      nextOption: nextOption,
      previousOption: previousOption,
    },
    modifiers: {
      setSelectedPeriod: setSelectedPeriod,
      goToPrevious: goToPrevious,
      goToNext: goToNext,
    },
  };
}
