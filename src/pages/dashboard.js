import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// bootstrap
import { Row, Col, Container, Button } from "react-bootstrap";

// project
import CounterWidget from "components/Widgets/CounterWidget";
import RevenueWidget from "components/Widgets/RevenueWidget";
import TransactionWidget from "components/Widgets/TransactionWidget";
import PackageWidget from "components/Widgets/PackageWidget";

// assets
import {
  faUserCheck,
  faChartSimple,
  faMoneyBillTransfer,
  faRotate,
} from "@fortawesome/free-solid-svg-icons";

// data
import {
  formatCurrency,
  formatShortDate,
  statistic,
} from "store/requests/user";
import { statisticTrans } from "store/requests/package";
import { reinitializeState } from "store/reducers/package";
import OpenIconSpeedDial from "components/SpeedDial";

import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
import AutorenewIcon from "@mui/icons-material/Autorenew";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [lastFetchTimestamp, setLastFetchTimestamp] = useState(Date.now());
  const { count, period, ratio } = useSelector((state) => state.user);
  const statisticTxn = useSelector((state) => state.packages);
  // dispatch(reinitializeState());

  const handleRefresh = () => {
    setLastFetchTimestamp(Date.now());
  };

  const actions = [
    { icon: <AutorenewIcon />, name: "Làm mới", onClick: handleRefresh },
    { icon: <PrintIcon />, name: "In" },
    { icon: <ShareIcon />, name: "Chia sẻ" },
  ];

  useEffect(() => {
    console.log("haha");
    statistic(dispatch);
    statisticTrans(dispatch);
    // const refreshInterval = setInterval(() => {
    //   setLastFetchTimestamp(Date.now());
    // }, 5 * 60 * 1000);

    // return () => {
    //   clearInterval(refreshInterval);
    // };
  }, [dispatch, lastFetchTimestamp]);
  return (
    <>
      <Container>
        <Row className="justify-content-md-center mt-0">
          <Col xs={12} className="mb-4 d-sm-block">
            <RevenueWidget
              title="Doanh thu"
              value={{
                year: formatCurrency(statisticTxn.revenueByYear),
                month: formatCurrency(statisticTxn.revenueByMonth),
              }}
              percentage={statisticTxn.ratio.revenue}
            />
          </Col>
        </Row>
        <Row className="justify-content-md-center mt-0">
          <Col xs={12} sm={6} xl={4} className="mb-4">
            <CounterWidget
              category="Người dùng"
              title={count}
              period={period}
              percentage={ratio?.portion}
              icon={faUserCheck}
              iconColor="secondary"
            />
          </Col>
          <Col xs={12} sm={6} xl={4} className="mb-4">
            <CounterWidget
              category="Doanh thu"
              title={formatCurrency(statisticTxn.totalRevenue)}
              period={{
                min: formatShortDate(statisticTxn.period.min),
                max: formatShortDate(statisticTxn.period.max),
              }}
              percentage={statisticTxn.ratio.revenue}
              icon={faChartSimple}
              iconColor="tertiary"
            />
          </Col>
          <Col xs={12} sm={6} xl={4} className="mb-4">
            <CounterWidget
              category="Giao dịch"
              title={statisticTxn.countTxn}
              period={{
                min: formatShortDate(statisticTxn.period.min),
                max: formatShortDate(statisticTxn.period.max),
              }}
              percentage={statisticTxn.ratio.monthlyTxn}
              icon={faMoneyBillTransfer}
              iconColor="quaternary"
            />
          </Col>
        </Row>
        <Row className="justify-content-md-center mt-0">
          <Col xs={12} lg={7} className="mb-4 d-sm-block">
            <TransactionWidget
              title="Giao dịch"
              value={{
                year: statisticTxn.txnByYear,
                month: statisticTxn.txnByMonth,
              }}
              percentage={statisticTxn.ratio.trans}
            />
          </Col>
          <Col xs={12} lg={5} className="mb-4 d-sm-block">
            <PackageWidget
              title="Số lượng gói đã bán"
              value={statisticTxn.countPkg}
              percentage={-7}
            />
          </Col>
        </Row>
        <OpenIconSpeedDial actions={actions} />
      </Container>
    </>
  );
};

export default Dashboard;
