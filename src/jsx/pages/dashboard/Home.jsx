import React, { useContext, useEffect, useState } from "react";
import ApexCharts from "apexcharts";
import { Link } from "react-router-dom";
import { SelectPicker } from "rsuite";
import Select from "react-select";
import { Modal } from "react-bootstrap";

import { IMAGES, SVGICON } from "../../constant/theme";
import MainBalanceCard from "../../elements/dashboard/MainBalanceCard";
import DropdownBlog from "../../elements/DropdownBlog";
import ProjectAreaChart from "../../elements/dashboard/ProjectAreaChart";
import LastestTransaction from "../../elements/dashboard/LastestTransaction";
import PieChartApex from "../../elements/dashboard/PieChartApex";
import CalendarBlog from "../FileManager/CalendarBlog";
import WeeklySummarChart from "../../elements/dashboard/WeeklySummarChart";
import BarWeeklySummary from "../../elements/dashboard/BarWeeklySummary";
import InvoiceChart from "../../elements/dashboard/InvoiceChart";
import { ThemeContext } from "../../../context/ThemeContext";

const options = [
  { value: "1", label: "Select Menu" },
  { value: "2", label: "Bank Card" },
  { value: "3", label: "Online" },
  { value: "4", label: "Cash On Time" },
];

const ChartData = [
  { label: "This Month", value: "This Month" },
  { label: "Week", value: "Weeks" },
  { label: "Today", value: "Today" },
];

const PieController = [
  { color: "#D7D7D7" },
  { color: "#9568ff" },
  { color: "#2696FD" },
  { color: "#252289" },
];

const weeklyData = [
  { color: "#FF9F00", title: "Income", percent: "30" },
  { color: "#FD5353", title: "Expense", percent: "46" },
  { color: "#d5dfe7", title: "Unknown", percent: "10" },
];

const contactGroup = [
  {
    image: IMAGES.invoiceimg1,
    title: "Dedi Cahyadi",
    postion: "Manager",
    price: "776",
  },
  {
    image: IMAGES.invoiceimg2,
    title: "Evans Belly",
    postion: "Programmer",
    price: "770",
  },
  {
    image: IMAGES.invoiceimg3,
    title: "Cahyadi Jem",
    postion: "Graphic Designer",
    price: "650",
  },
  {
    image: IMAGES.invoiceimg4,
    title: "Evans John",
    postion: "Software Engineer",
    price: "450",
  },
  {
    image: IMAGES.invoiceimg3,
    title: "Brian Brandon",
    postion: "Developer",
    price: "470",
  },
  {
    image: IMAGES.invoiceimg2,
    title: "Bella Brownlee",
    postion: "Tester",
    price: "630",
  },
  {
    image: IMAGES.invoiceimg4,
    title: "Evans Tika",
    postion: "Team Leader",
    price: "399",
  },
];

export function CommandPage() {
  const [makePayment, setMakePayment] = useState(false);
  const [withdrowModal, setWithdrowModal] = useState(false);

  const projectSeries = (value) => {
    ApexCharts.exec("assetDistribution2", "toggleSeries", value);
  };
  const [refreshToggle, setRefreshToggle] = useState(false);
  const [datas, setDatas] = useState(contactGroup);
  const hendelClick = () => {
    setRefreshToggle(true);
    setTimeout(() => {
      setDatas([
        ...datas,
        datas[Math.floor(Math.random() * Math.floor(datas.length - 1))],
      ]);
      setRefreshToggle(false);
    }, 1000);
  };
  const [cardModal, setCardModal] = useState(false);
  const [invoiceModal, setInvoiceModal] = useState(false);

  return (
    <>
      <div className="row">
        <div className="col-xl-12">
          <div className="payment-bx">
            <div className="d-flex justify-content-between flex-wrap">
              <div className="payment-content">
                <h1 className="font-w500 mb-2">Good morning, Dude </h1>
                <p className="dz-para">
                  Market has been growing in volume at rate of 2.3%
                </p>
              </div>
              <div className="mb-4 mb-xl-0">
                <button
                  type="button"
                  className="btn btn-primary me-3"
                  onClick={() => setMakePayment(true)}
                >
                  Make a payment
                </button>
                <button
                  type="button"
                  className="btn btn-white"
                  onClick={() => setWithdrowModal(true)}
                >
                  Withdraw
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col-xl-4">
                <div className="card  dz-wallet overflow-hidden">
                  <div className="boxs">
                    <span className="box one"></span>
                    <span className="box two"></span>
                    <span className="box three"></span>
                    <span className="box four"></span>
                  </div>
                  <div className="card-header border-0 pb-3 pb-sm-0 pe-4">
                    <div className="wallet-icon">
                      <svg
                        width="62"
                        height="39"
                        viewBox="0 0 62 39"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="42.7722"
                          cy="19.2278"
                          r="19.2278"
                          fill="white"
                          fillOpacity="0.2"
                        />
                        <circle
                          cx="19.2278"
                          cy="19.2278"
                          r="19.2278"
                          fill="white"
                          fillOpacity="0.2"
                        />
                      </svg>
                    </div>
                    <button type="button" className="modal-btn">
                      <span
                        className="dz-wallet icon-box icon-box-lg m-auto mb-1 d-block"
                        onClick={() => setCardModal(true)}
                      >
                        {SVGICON.transferSvg}
                      </span>
                      <span>Transfer </span>
                    </button>
                  </div>
                  <div className="card-body py-3 pt-1 d-flex align-items-center justify-content-between flex-wrap pe-3">
                    <div className="wallet-info">
                      <span className="fs-14 font-w400 d-block">
                        Wallet Balance
                      </span>
                      <h2 className="font-w600 mb-0">$824,571.93</h2>
                      <span>+0,8% than last week</span>
                    </div>
                    <button
                      type="button"
                      className="modal-btn"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal4"
                    >
                      <span
                        className="dz-wallet icon-box icon-box-lg ms-3 mb-1 d-block"
                        onClick={() => setInvoiceModal(true)}
                      >
                        {SVGICON.invoiceSvg}
                      </span>
                      <span>Send Invoices</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-xl-8">
                <MainBalanceCard />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-8">
              <div className="card crypto-chart h-auto">
                <div className="card-header pb-0 border-0 flex-wrap">
                  <div>
                    <div className="chart-title mb-3">
                      <h2 className="heading">Project Statistic</h2>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <div className="round weekly" id="dzOldSeries">
                        <div>
                          <input
                            type="checkbox"
                            id="checkbox1"
                            name="radio"
                            value="weekly"
                            onClick={() => projectSeries("Persent")}
                          />
                          <label
                            htmlFor="checkbox1"
                            className="checkmark"
                          ></label>
                        </div>
                        <div>
                          <span>This Month</span>
                          <h4 className="mb-0">1.982</h4>
                        </div>
                      </div>
                      <div className="round" id="dzNewSeries">
                        <div>
                          <input
                            type="checkbox"
                            id="checkbox"
                            name="radio"
                            value="monthly"
                            onClick={() => projectSeries("Visitors")}
                          />
                          <label
                            htmlFor="checkbox"
                            className="checkmark"
                          ></label>
                        </div>
                        <div>
                          <span>This Week</span>
                          <h4 className="mb-0">1.345</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-static">
                    <div className="d-flex align-items-center mb-3 ">
                      <SelectPicker
                        className="select-data me-sm-4 me-2"
                        data={ChartData}
                        searchable={false}
                        placeholder="This Month"
                      />
                      <DropdownBlog />
                    </div>
                    <div className="progress-content">
                      <div className="d-flex justify-content-between">
                        <h6>Total</h6>
                        <span className="pull-end">3.982</span>
                      </div>
                      <div className="progress mt-2">
                        <div
                          className="progress-bar bg-primary"
                          style={{ width: "60%", height: "100%" }}
                        >
                          <span className="sr-only">60% Complete</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body pt-2 custome-tooltip pb-0">
                  <ProjectAreaChart />
                </div>
              </div>
              <LastestTransaction />
              <div className="row">
                <div className="col-xl-6">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <h4 className="fs-20 font-w600 mb-0">Pie Chart</h4>
                        <DropdownBlog />
                      </div>
                      <div id="pieChart1">
                        <PieChartApex />
                      </div>
                      <div className="chart-labels">
                        <ul className="d-flex align-items-baseline justify-content-between mt-3">
                          {PieController.map((item, ind) => (
                            <li key={ind}>
                              <svg
                                className="me-2"
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  width="14"
                                  height="14"
                                  rx="7"
                                  fill={item.color}
                                />
                              </svg>
                              <span className="font-w300">Grey</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-6">
                  <div className="card bg-primary">
                    <div className="card-body dz-date-picker">
                      <div className="dz-calender small-cal-blog">
                        <CalendarBlog />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4">
              <div className="card h-auto">
                <div className="card-header border-0 pb-1 ">
                  <div>
                    <h4 className="mb-0 fs-20 font-w600">Weekly Summary</h4>
                  </div>
                </div>
                <div className="card-body pb-0 pt-3 px-3 d-flex align-items-center flex-wrap">
                  <div id="pieChart2">
                    <WeeklySummarChart />
                  </div>
                  <div className="weeklydata">
                    {weeklyData.map((item, i) => (
                      <div className=" d-flex align-items-center mb-2" key={i}>
                        <svg
                          className="me-2"
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="0.000488281"
                            width="14"
                            height="14"
                            rx="3"
                            fill={item.color}
                          />
                        </svg>
                        <h6 className="mb-0 fs-14 font-w400">{item.title}</h6>
                        <span className="text-primary font-w700 ms-auto">
                          {item.percent}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="card-body pt-0 pb-0 px-3">
                  <div id="columnChart1" className="chartjs">
                    <BarWeeklySummary />
                  </div>
                </div>
              </div>
              <div className="card h-auto">
                <div className="card-body">
                  <h4 className="fs-20 mb-0 mt-0">Invoices Sent</h4>
                  <span>Lorem ipsum dolor sit amet, consectetur</span>
                  <div id="radialchart">
                    <InvoiceChart />
                  </div>
                  <h5 className="mb-0 fs-18 font-w500 text-center">
                    On Progress{" "}
                    <span className="text-primary fs-18 font-w500s">70%</span>
                  </h5>
                </div>
              </div>
              <div className="card contacts h-auto">
                <div className="card-header border-0 pb-0">
                  <div>
                    <h2 className="heading mb-0">Invoices Sent</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur</p>
                  </div>
                </div>
                <div className="card-body loadmore-content  recent-activity-wrapper py-0 dz-scroll">
                  {datas &&
                    datas.map((item, ind) => (
                      <div
                        className="d-flex align-items-center student"
                        key={ind}
                      >
                        <span className="dz-media">
                          <img
                            src={item.image}
                            className=" avtar avtar-lg"
                            alt=""
                          />
                        </span>
                        <div className="user-info">
                          <h6 className="name">
                            <Link to="/app-profile">{item.title}</Link>
                          </h6>
                          <span className="fs-14 font-w400 text-wrap">
                            {item.postion}
                          </span>
                        </div>
                        <span className="text-primary ms-auto invoice-price">
                          ${item.price}
                        </span>
                      </div>
                    ))}
                </div>
                <div className="card-footer border-0 pt-3 px-3 px-sm-4">
                  <Link
                    to="#"
                    className="btn btn-block btn-primary dz-load-more"
                    onClick={() => hendelClick()}
                  >
                    {refreshToggle && <i className="fa fa-refresh" />} VIEW MORE
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        id="exampleModal1"
        show={makePayment}
        onHide={setMakePayment}
        centered
      >
        <div className="modal-header">
          <h5 className="modal-title">Make Payment</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setMakePayment(false)}
          ></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Seller Mobile Number</label>
            <input
              type="number"
              className="form-control mb-3"
              id="exampleInputEmail1"
              placeholder="Number"
            />
            <label className="form-label">product Name</label>
            <input
              type="email"
              className="form-control mb-3"
              id="exampleInputEmail2"
              placeholder=" Name"
            />
            <label className="form-label">Amount</label>
            <input
              type="number"
              className="form-control mb-3"
              id="exampleInputEmail3"
              placeholder="Amount"
            />
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-danger light"
            onClick={() => setMakePayment(false)}
          >
            Close
          </button>
          <button type="button" className="btn btn-primary">
            Save changes
          </button>
        </div>
      </Modal>
      <Modal centered show={withdrowModal} onHide={setWithdrowModal}>
        <div className="modal-header">
          <h5 className="modal-title">Make Payment</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setWithdrowModal(false)}
          ></button>
        </div>
        <div className="modal-body">
          <label className="form-label">Payment method</label>
          <div>
            <Select
              options={options}
              isSearchable={false}
              className="custom-react-select mb-3 mb-xxl-0"
            />
          </div>
          <label className="form-label">Amount</label>
          <input
            type="email"
            className="form-control mb-3"
            id="exampleInputEmail4"
            placeholder="Rupee"
          />
          <label className="form-label">Card Holder Name</label>
          <input
            type="email"
            className="form-control mb-3"
            id="exampleInputEmail5"
            placeholder="Amount"
          />
          <label className="form-label">Card Name</label>
          <input
            type="email"
            className="form-control mb-3"
            id="exampleInputEmail6"
            placeholder="Amount"
          />
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-danger light"
            onClick={() => setWithdrowModal(false)}
          >
            Close
          </button>
          <button type="button" className="btn btn-primary">
            Save changes
          </button>
        </div>
      </Modal>
      <Modal centered show={cardModal} onHide={setCardModal}>
        <div className="modal-header ">
          <h5 className="modal-title">Enter Debit or Credit card Details</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setCardModal(false)}
          ></button>
        </div>
        <div className="modal-body">
          <label className="form-label">Card Number</label>
          <input
            type="number"
            className="form-control mb-3"
            id="exampleInputEmail7"
            placeholder="card no."
          />
          <label className="form-label">Expiry/Validity</label>
          <input
            type="number"
            className="form-control mb-3"
            id="exampleInputEmail8"
            placeholder="Year/Month"
          />
          <label className="form-label">CVV</label>
          <input
            type="number"
            className="form-control mb-3"
            id="exampleInputEmail9"
            placeholder="123"
          />
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-danger light"
            onClick={() => setCardModal(false)}
          >
            Close
          </button>
          <button type="button" className="btn btn-primary">
            Save changes
          </button>
        </div>
      </Modal>
      <Modal centered show={invoiceModal} onHide={setInvoiceModal}>
        <div className="modal-header ">
          <h5 className="modal-title">Send invoice</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setInvoiceModal(false)}
          ></button>
        </div>
        <div className="modal-body">
          <label className="form-label">Send email to</label>
          <input
            type="email"
            className="form-control mb-3"
            id="exampleInputEmail10"
            placeholder="Art Vandelay<art@vandelay.com"
          />
          <label className="form-label">Subject</label>
          <input
            type="number"
            className="form-control mb-3"
            id="exampleInputEmail11"
            placeholder="invoice Vi-001 from America"
          />
          <div className="mb-3">
            <label htmlFor="exampleFormControlTextarea1" className="form-label">
              Body
            </label>
            <textarea
              className="form-control"
              id="exampleFormControlTextarea1"
              rows="3"
              defaultValue={"message"}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-danger light"
            onClick={() => setInvoiceModal(false)}
          >
            Close
          </button>
          <button type="button" className="btn btn-primary">
            Save changes
          </button>
        </div>
      </Modal>
    </>
  );
}

const Home = () => {
  const {
    changeBackground,
    chnageSidebarColor,
    setHeaderIcon,
    changeNavigationHader,
  } = useContext(ThemeContext);
  useEffect(() => {
    changeBackground({ value: "light", label: "Light" });
    changeNavigationHader("color_2");
    chnageSidebarColor("color_2");
    setHeaderIcon(true);
  }, []);
  return (
    <>
      <CommandPage />
    </>
  );
};

export default Home;
