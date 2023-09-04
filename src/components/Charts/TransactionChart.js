import PropTypes from "prop-types";
import { useEffect, useState } from "react";

// third-party
import ReactApexChart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import { statisticTrans } from "store/requests/package";
import { formatMonthYear, formatShortDate } from "store/requests/user";

// constant
import { ColorPalette } from "utils/common/constant";
import { sortDataSeries } from "./RevenueChart";

// ==============================|| MONTHLY BAR CHART ||============================== //

const TransactionChart = ({ slot }) => {
  const dispatch = useDispatch();
  const { statisticTxn } = useSelector((state) => state.packages);
  useEffect(() => {
    statisticTrans(dispatch);
  }, [dispatch]);
  const [xAxisMin, setXAxisMin] = useState(null);
  const [options, setOptions] = useState({
    chart: {
      id: "bar-datetime",
      type: "bar",
      height: 300,
      zoom: {
        autoScaleYaxis: true,
      },
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "75%",
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: [ColorPalette["quaternary"]],
    xaxis: {
      xaxis: {
        type: "datetime",
        min: xAxisMin,
        max: Date.now(),
        labels: {
          formatter: function (value, timestamp) {
            const date = new Date(timestamp);
            return formatShortDate(date);
          },
          style: {
            colors: [
              ColorPalette["quinary"],
              ColorPalette["quinary"],
              ColorPalette["quinary"],
              ColorPalette["quinary"],
              ColorPalette["quinary"],
              ColorPalette["quinary"],
              ColorPalette["quinary"],
              ColorPalette["quinary"],
              ColorPalette["quinary"],
              ColorPalette["quinary"],
              ColorPalette["quinary"],
              ColorPalette["quinary"],
            ],
          },
        },
        tickAmount: 6,
      },
      tooltip: {
        x: {
          format: "dd MMM yyyy",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.3,
        inverseColors: false,
        opacityFrom: 0.9,
        opacityTo: 0.85,
        stops: [0, 100],
      },
    },
    grid: {
      show: true,
    },
    yaxis: {
      show: true,
      labels: {
        style: {
          colors: [ColorPalette["quinary"]],
        },
      },
    },
    annotations: {
      xaxis: [
        {
          x: new Date(new Date().getFullYear(), 1, 1).getTime(),
          borderColor: ColorPalette["quinary"],
          label: {
            borderColor: ColorPalette["secondary"],
            style: {
              color: "#fff",
              background: ColorPalette["secondary"],
            },
            text: new Date().getFullYear(),
          },
        },
      ],
    },
    tooltip: {
      theme: "light",
    },
  });

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      xaxis: {
        labels: {
          style: {
            colors: [
              ColorPalette["quinary"],
              ColorPalette["quinary"],
              ColorPalette["quinary"],
              ColorPalette["quinary"],
              ColorPalette["quinary"],
              ColorPalette["quinary"],
              ColorPalette["quinary"],
              ColorPalette["quinary"],
              ColorPalette["quinary"],
              ColorPalette["quinary"],
              ColorPalette["quinary"],
              ColorPalette["quinary"],
            ],
          },
        },
      },
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slot]);

  const [series, setSeries] = useState([
    {
      name: "Giao dịch",
      data: mapToMonthCount(statisticTxn),
    },
  ]);

  useEffect(() => {
    if (slot === "year") {
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
      twelveMonthsAgo.setDate(
        new Date(
          twelveMonthsAgo.getFullYear(),
          twelveMonthsAgo.getMonth(),
          0
        ).getDate() - 1
      );
      setXAxisMin(twelveMonthsAgo.getTime());
      setSeries([
        {
          name: "Giao dịch",
          data: mapToYearCount(statisticTxn),
        },
      ]);
    } else {
      const oneWeekAgo = new Date();
      oneWeekAgo.setMonth(oneWeekAgo.getMonth() - 1);
      setXAxisMin(oneWeekAgo.getTime());
      setSeries([
        {
          name: "Giao dịch",
          data: mapToMonthCount(statisticTxn),
        },
      ]);
    }
  }, [slot]);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      xaxis: {
        type: "datetime",
        min: xAxisMin,
        max: Date.now(),
        labels:
          slot === "year"
            ? {
                formatter: function (value, timestamp) {
                  const date = new Date(timestamp);
                  return formatMonthYear(date);
                },
              }
            : {
                formatter: function (value, timestamp) {
                  const date = new Date(timestamp);
                  return formatShortDate(date);
                },
              },
        tickAmount: slot === "year" ? 11 : 6,
      },
    }));
  }, [slot, xAxisMin]);

  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={"300px"}
      />
    </div>
  );
};

TransactionChart.propTypes = {
  slot: PropTypes.string,
};

export default TransactionChart;

const mapToMonthCount = (data) => {
  data = sortDataSeries(data);
  const currentDate = new Date();
  const lastYear = new Date(
    currentDate.getFullYear() - 1,
    currentDate.getMonth(),
    currentDate.getDate()
  );

  const res = [];
  let dataIndex = 0;
  let currentDatePointer = new Date(lastYear);

  while (currentDatePointer <= currentDate) {
    if (dataIndex < data.length) {
      const curDate = new Date(
        data[dataIndex]._id.year,
        data[dataIndex]._id.month - 1,
        data[dataIndex]._id.day
      );
      if (+currentDatePointer === +curDate) {
        res.push([curDate.getTime(), data[dataIndex].count]);
        dataIndex++;
      } else {
        res.push([currentDatePointer.getTime(), 0]);
      }
    } else {
      res.push([currentDatePointer.getTime(), 0]);
    }
    currentDatePointer.setDate(currentDatePointer.getDate() + 1);
  }

  return res;
};

export const mapToYearCount = (data) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const monthlyData = Array(12).fill(0);

  data.forEach((item) => {
    const yearDiff = currentYear - item._id.year;
    const monthDiff = currentMonth - item._id.month;

    if (yearDiff === 0 && monthDiff >= 0) {
      monthlyData[monthDiff] += item.count;
    }
  });
  let res = monthlyData.map((count, index) => {
    const year = currentYear + Math.floor((currentMonth - index) / 12);
    const month = (currentMonth - index + 12) % 12 || 12;
    const lastDayOfMonth =
      month === 12 ? new Date(year - 1, month, 0) : new Date(year, month, 0);
    return lastDayOfMonth < currentDate
      ? [lastDayOfMonth, count]
      : [new Date(year, month - 1, currentDate.getDate()), count];
  });
  if (res[0][0].getMonth() === 11) {
    const curDate = res[0][0].setFullYear(res[0][0].getFullYear() + 1);
    res[0][0] = curDate.getTime();
  }
  return res.reverse();
};
