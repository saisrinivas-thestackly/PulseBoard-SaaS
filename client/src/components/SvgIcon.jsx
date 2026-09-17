export function SvgIcon({ name, size = 18 }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.7',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true
  }

  const paths = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    chart: (
      <>
        <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
        <path d="M8 16v-4M12 16V8M16 16v-6" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c.7-3.3 3.2-5 7-5s6.3 1.7 7 5" />
      </>
    ),
    bolt: <path d="m13 2-8 11h6l-1 9 8-12h-6z" />,
    pie: (
      <>
        <path d="M12 3v9h9" />
        <path d="M20.5 15A9 9 0 1 1 9 3.5" />
      </>
    ),
    gear: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-2.6V20a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H6v-2.6h.4a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V5h2.6v.4a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2V14h-.2a1.7 1.7 0 0 0-1.6 1Z" />
      </>
    ),
    plug: (
      <>
        <path d="M8 12h8" />
        <path d="M10 7v5M14 7v5" />
        <path d="M5 11v1a7 7 0 0 0 14 0v-1" />
        <path d="M12 19v3" />
      </>
    ),
    chat: (
      <>
        <path d="M5 5h14v10H9l-4 4z" />
        <path d="M8 9h8M8 12h5" />
      </>
    ),
    search: (
      <>
        <circle cx="10.8" cy="10.8" r="6.3" />
        <path d="m16 16 4.5 4.5" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
      </>
    ),
    moon: <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z" />,
    bell: (
      <>
        <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    bot: (
      <>
        <rect x="4" y="7" width="16" height="13" rx="4" />
        <path d="M12 3v4M8 12h.01M16 12h.01M9 16h6" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
    plus: (
      <>
        <path d="M12 5v14M5 12h14" />
      </>
    ),
    edit: (
      <>
        <path d="M4 20h4L19 9l-4-4L4 16z" />
        <path d="m13.5 6.5 4 4" />
      </>
    ),
    trash: (
      <>
        <path d="M4 7h16M10 11v6M14 11v6" />
        <path d="M9 7V4h6v3M6 7l1 13h10l1-13" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    ),
  }

  return <svg {...common}>{paths[name]}</svg>
}
