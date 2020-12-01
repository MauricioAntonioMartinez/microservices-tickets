import React from "react";
import NavLink from "next/link";
interface Props {
  currentUser: Object;
}

export default function Header({ currentUser }: Props) {
  const links = (!currentUser
    ? [
        { label: "Sign Up", href: "/auth/signup" },
        { label: "Sign In", href: "/auth/signin" },
      ]
    : [
        { label: "Orders", href: "/orders" },
        { label: "Sell ticket", href: "/tickets/new" },
        { label: "Sign Out", href: "/auth/signout" },
      ]
  ).map(({ href, label }, i) => {
    return (
      <li key={i} className="nav-item">
        <NavLink href={href}>
          <a className="nav-link">{label}</a>
        </NavLink>
      </li>
    );
  });

  return (
    <nav className="navbar navbar-light bg-light">
      <NavLink href="/">
        <a className="navbar-brand">GitTix</a>
      </NavLink>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
}
