export default function SearchBar({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      className={className}
    >
      <g fill="none" stroke="currentColor">
        <circle cx="11" cy="11" r="5.5"></circle>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m15 15l4 4"
        ></path>
      </g>
    </svg>
  )
}
