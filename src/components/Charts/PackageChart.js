import PropTypes from "prop-types";
import { useEffect, useState } from "react";

// third-party
import ReactApexChart from "react-apexcharts";

// material-ui
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

// constant
import { useDispatch, useSelector } from "react-redux";
import { getAllPackages, statisticTrans } from "store/requests/package";
import ColorScheme from "color-scheme";

// chart options
const pieChartOptions = {
  chart: {
    width: "auto",
    type: "donut",
  },
  dataLabels: {
    enabled: true,
  },
  legend: { position: "bottom" },
  plotOptions: {
    pie: {
      donut: {
        size: 60,
        labels: {
          show: true,
          total: {
            show: true,
            label: "Tất cả",
          },
        },
      },
    },
  },
};

const mapSeries = (allArr, someArr) => {
  const result = allArr.map((elem) => {
    const cur = someArr.find((item) => {
      if (elem._id === item._id._id) return true;
      return false;
    });
    return cur ? cur.totalQuantity : 0;
  });

  return result;
};

const mapLabels = (allArr) => {
  const result = allArr.map((elem) => {
    return elem.name;
  });

  return result;
};

// ==============================|| MONTHLY BAR CHART ||============================== //

const PackageChart = ({ slot }) => {
  const dispatch = useDispatch();
  const { pkgByYear, pkgByMonth, packages } = useSelector(
    (state) => state.packages
  );
  const [options, setOptions] = useState(pieChartOptions);
  const [height, setHeight] = useState("300px");
  const [listYear, setListYear] = useState(mapSeries(packages, pkgByYear));
  const [listMonth, setListMonth] = useState(mapSeries(packages, pkgByMonth));
  const [labels, setLabels] = useState(mapLabels(packages));
  const [series, setSeries] = useState(listYear);
  var scheme = new ColorScheme();
  scheme.from_hex("ff8886").from_hue(1).scheme("tetrade").variation("pastel"); // Use the 'soft' color variation

  var colors = scheme.colors();
  colors = colors.map((color) => {
    return `#${color}`;
  });

  useEffect(() => {
    getAllPackages(dispatch);
    statisticTrans(dispatch);
  }, [dispatch]);

  useEffect(() => {
    setListYear(mapSeries(packages, pkgByYear));
  }, [packages, pkgByYear]);

  useEffect(() => {
    setListMonth(mapSeries(packages, pkgByMonth));
  }, [packages, pkgByMonth]);

  useEffect(() => {
    setLabels(mapLabels(packages));
  }, [packages]);

  useEffect(() => {
    setSeries(slot === "year" ? listYear : listMonth);
  }, [slot]);

  const theme = useTheme();
  const matchDownLg = useMediaQuery(theme.breakpoints.down("lg"));

  useEffect(() => {
    setHeight(matchDownLg ? "100%" : "300px");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchDownLg]);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      labels: labels,
      colors: colors,
      markers: {
        colors: ["#007bff", "#28a745", "#dc3545"],
      },
    }));
  }, [slot]);

  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={series}
        type="donut"
        height={height}
      />
    </div>
  );
};

PackageChart.propTypes = {
  slot: PropTypes.string,
};

export default PackageChart;
