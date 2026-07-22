import { SVGICON } from "../../constant/theme";

export const MenuList = [
  {
    title: "Dashboard",
    classsChange: "mm-collapse",
    iconStyle: SVGICON.dashboard,
    to: "/",
  },
  {
    title: "KYC",
    classsChange: "mm-collapse",
    iconStyle: SVGICON.FormIconSvg,
    to: "/kyc",
    // content: [
    //   {
    //     title: "All KYC",
    //     to: "/kyc",
    //   },
    //   {
    //     title: "Submitted KYC",
    //     to: "/kyc-submitted",
    //   },
    //   {
    //     title: "Pending KYC",
    //     to: "/kyc-pending",
    //   },
    //   {
    //     title: "Approved KYC",
    //     to: "/kyc-approved",
    //   },
    //   {
    //     title: "Rejected KYC",
    //     to: "/kyc-rejected",
    //   },
    // ],
  },
  {
    title: "Cards",
    classsChange: "mm-collapse",
    iconStyle: SVGICON.BillsSvg,
     content: [
      {
        title: "Manage Cards",
        to: "/cards",
      },
      {
        title: "Card Orders",
        to: "/card-orders",
      }
  ]
  },
  // {
  //   title: "Subscribers",
  //   classsChange: "mm-collapse",
  //   iconStyle: SVGICON.PatientUser,
  //   to: "/subscribers",
  // },
  // {
  //   title: "Transactions",
  //   classsChange: "mm-collapse",
  //   iconStyle: SVGICON.DollerSvg,
  //   to: "/transactions",
  // },
  {
    title: "Invites",
    classsChange: "mm-collapse",
    iconStyle: SVGICON.MessageSvgIcon,
    to: "/invites",
  },
  {
    title: "Profile",
    classsChange: "mm-collapse",
    iconStyle: SVGICON.ProfileSvg,
    to: "/profile",
  },
];
