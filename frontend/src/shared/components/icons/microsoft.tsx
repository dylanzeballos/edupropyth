import type { SVGProps } from "react";

const Microsoft = (props: SVGProps<SVGSVGElement>) => (
  <svg 
    {...props} 
    viewBox="0 0 24 24" 
    className={`w-5 h-5 ${props.className || ''}`}
  >
    <path fill="#F1511B" d="M11.4 11.4H0V0h11.4v11.4z" />
    <path fill="#80CC28" d="M24 11.4H12.6V0H24v11.4z" />
    <path fill="#00ADEF" d="M11.4 24H0V12.6h11.4V24z" />
    <path fill="#FBBC09" d="M24 24H12.6V12.6H24V24z" />
  </svg>
);

export { Microsoft };
