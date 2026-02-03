/**=================================================================================
 * Renders a status badge with appropriate styling
 * @param isActive - Boolean indicating if the status is active/published/approved
 * @param activeLabel - Label to show when active (default: "Active")
 * @param inactiveLabel - Label to show when inactive (default: "Inactive")
 * @returns JSX element with styled badge
 =================================================================================*/
export const renderStatusBadge = (
  isActive: boolean,
  activeLabel: string = "Active",
  inactiveLabel: string = "Inactive"
) => {
  return (
    <span
      className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-lg  ${
        isActive
          ? "bg-green-100 text-green-700 -green-300"
          : "bg-gray-100 text-gray-700 -gray-300"
      }`}
    >
      {isActive ? activeLabel : inactiveLabel}
    </span>
  );
};

/**===================================
 * Renders a published status badge
 ===================================*/
export const renderPublishedBadge = (isPublished: boolean) => {
  return renderStatusBadge(isPublished, "Published", "Draft");
};

/**====================================
 * Renders an approved status badge
 ====================================*/
export const renderApprovedBadge = (isApproved: boolean) => {
  return renderStatusBadge(isApproved, "Approved", "Pending");
};

/**===================================
 * Renders a type/category badge
 ===================================*/
export const renderTypeBadge = (type: string) => {
  return (
    <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded  bg-blue-100 text-blue-700 -blue-300">
      {type}
    </span>
  );
};

/**============================================
 * Renders a contact submission status badge
 ============================================*/
export const renderContactStatusBadge = (status: string) => {
  const colors = {
    Unread: "bg-yellow-100 text-yellow-700 -yellow-300",
    Read: "bg-blue-100 text-blue-700 -blue-300",
    Resolved: "bg-green-100 text-green-700 -green-300",
  };

  return (
    <span
      className={`inline-flex px-2.5 py-1 text-xs font-medium rounded  ${
        colors[status as keyof typeof colors]
      }`}
    >
      {status}
    </span>
  );
};
