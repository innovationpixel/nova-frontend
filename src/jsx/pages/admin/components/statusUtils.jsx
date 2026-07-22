export const getStatusSeverity = (status) => {
  switch (status) {
    case "Approved":
    case "Active":
    case "Success":
    case "Joined":
    case "Accepted":
      return "success";
    case "Pending":
      return "warning";
    case "Rejected":
    case "Failed":
      return "danger";
    case "Submitted":
      return "info";
    case "processing":
     return "warning";
    case "Shipped":
     return "info";
     case "Delivered":
     return "success";
    default:
      return "secondary";
  }
};

export const getStatusBadgeClass = (status) => {
  switch (status) {
    case "Approved":
    case "Active":
    case "Success":
    case "Joined":
      return "badge badge-rounded badge-success";
    case "Pending":
      return "badge badge-rounded badge-warning";
    case "Rejected":
    case "Failed":
      return "badge badge-rounded badge-danger";
    case "Submitted":
      return "badge badge-rounded badge-info";
    default:
      return "badge badge-rounded badge-secondary";
  }
};
