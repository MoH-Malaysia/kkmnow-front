import { FunctionComponent } from "react";

type NavProps = {
  isTablet: boolean;
  isTabletNavOpen: boolean;
  children: React.ReactNode;
};

const Nav: FunctionComponent<NavProps> = ({ isTablet, isTabletNavOpen, children }) => {
  if (isTablet) {
    if (isTabletNavOpen)
      return (
        <div className="fixed top-[57px] left-0 flex w-full flex-col gap-0 bg-white py-1 px-0 shadow-lg md:gap-1 md:p-1">
          {children}
        </div>
      );
    else return null;
  } else return <div className="flex gap-2">{children}</div>;
};

export default Nav;
