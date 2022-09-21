import { FunctionComponent } from "react";

import Header from "./Header";
import Footer from "./Footer";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: FunctionComponent<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <div className="pt-14">{children}</div>
      <Footer />
    </>
  );
};

export default Layout;
