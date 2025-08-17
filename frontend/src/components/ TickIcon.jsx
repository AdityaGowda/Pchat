export default function TickIcon({ status = "sent" }) {
  /**
   * status: "sent" | "delivered" | "read"
   */

  switch (status) {
    case "sent":
      // Circle only
      return (
        <span className="w-3 h-3 border-2 border-blue-400 rounded-full inline-block ml-1 mt-2" />
      );

    case "delivered":
      // Circle filled
      return (
        <span className="w-3 h-3 bg-blue-400 text-blue-500 rounded-full inline-block ml-1" />
      );

    case "read":
      // Filled tick
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="w-4 h-4 text-blue-500 inline-block ml-1"
        >
          <path
            fillRule="evenodd"
            d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm3.844-8.791a.75.75 0 0 0-1.188-.918l-3.7 4.79-1.649-1.833a.75.75 0 1 0-1.114 1.004l2.25 2.5a.75.75 0 0 0 1.15-.043l4.25-5.5Z"
            clipRule="evenodd"
          />
        </svg>
      );

    default:
      return null;
  }
}
