import PropTypes from "prop-types";
import { useState, useEffect } from "react";

// third-party
import ReactApexChart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import { statisticTrans } from "store/requests/package";
import { formatMonthYear, formatShortDate } from "store/requests/user";

// constant
import { ColorPalette } from "utils/common/constant";
const line = "#fcddb3";
// ==============================|| INCOME AREA CHART ||============================== //

const RevenueChart = ({ slot }) => {
  const dispatch = useDispatch();
  const { statisticTxn } = useSelector((state) => state.packages);
  useEffect(() => {
    statisticTrans(dispatch);
  }, [dispatch]);
  const [xAxisMin, setXAxisMin] = useState(null);
  const [options, setOptions] = useState({
    chart: {
      id: "area-datetime",
      type: "area",
      height: 300,
      zoom: {
        autoScaleYaxis: true,
      },
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    colors: [ColorPalette["primary"]],
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
    plotOptions: {
      bar: { borderRadius: 4 },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.5,
        inverseColors: false,
        opacityFrom: 0.85,
        opacityTo: 0.8,
        stops: [0, 100],
      },
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy",
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: [ColorPalette["quinary"]],
        },
      },
    },
    grid: {
      borderColor: line,
    },
    annotations: {
      xaxis: [
        {
          x: new Date(new Date().getFullYear(), 1, 1).getTime(),
          borderColor: ColorPalette["primary"],
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
    selection: slot,
  });
  const [series, setSeries] = useState([
    {
      name: "VND",
      data: mapToMonthTotal(statisticTxn),
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
          name: "VND",
          data: statisticTxn ? mapToYearTotal(statisticTxn) : [],
        },
      ]);
    } else {
      const oneWeekAgo = new Date();
      oneWeekAgo.setMonth(oneWeekAgo.getMonth() - 1);
      setXAxisMin(oneWeekAgo.getTime());
      setSeries([
        {
          name: "VND",
          data: statisticTxn ? mapToMonthTotal(statisticTxn) : [],
        },
      ]);
    }
  }, [slot, statisticTxn]);

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
    <ReactApexChart options={options} series={series} type="bar" height={300} />
  );
};

RevenueChart.propTypes = {
  slot: PropTypes.string,
};

export default RevenueChart;

export const sortDataSeries = (data) => {
  return [...data].sort((a, b) => {
    const dateA = new Date(a._id?.year, a._id?.month - 1, a._id?.day);
    const dateB = new Date(b._id?.year, b._id?.month - 1, b._id?.day);
    return dateA - dateB;
  });
};

const mapToMonthTotal = (data) => {
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
        res.push([curDate.getTime(), data[dataIndex].total]);
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

export const mapToYearTotal = (data) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const monthlyData = Array(12).fill(0);

  data.forEach((item) => {
    const yearDiff = currentYear - item._id.year;
    const monthDiff = currentMonth - item._id.month;

    if (yearDiff === 0 && monthDiff >= 0) {
      monthlyData[monthDiff] += item.total;
    }
  });
  let res = monthlyData.map((total, index) => {
    const year = currentYear + Math.floor((currentMonth - index) / 12);
    const month = (currentMonth - index + 12) % 12 || 12;
    const lastDayOfMonth =
      month === 12 ? new Date(year - 1, month, 0) : new Date(year, month, 0);
    return lastDayOfMonth < currentDate
      ? [lastDayOfMonth, total]
      : [new Date(year, month - 1, currentDate.getDate()), total];
  });
  if (res[0][0].getMonth() === 11) {
    const curDate = res[0][0].setFullYear(res[0][0].getFullYear() + 1);
    res[0][0] = curDate.getTime();
  }
  return res.reverse();
};
