import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "next-i18next";
import { HomeIcon, MenuAlt3Icon, TemplateIcon, XIcon } from "@heroicons/react/solid";

import { languages } from "@lib/options";

import { BREAKPOINTS } from "@lib/constants";
import { useLanguage } from "@hooks/useLanguage";
import { useWindowWidth } from "@hooks/useWindowWidth";

import Nav from "@components/Nav";
import NavItem from "@components/Nav/Item";
import Dropdown from "@components/Dropdown";
import Container from "@components/Container";

const Header = () => {
  const { t } = useTranslation();
  const { language, onLanguageChange } = useLanguage();

  const width = useWindowWidth();
  const isTablet = width <= BREAKPOINTS.MD;

  const [isTabletNavOpen, setIsTabletNavOpen] = useState(false);

  return (
    <div className="sticky top-0 left-0 z-20 w-full">
      <Container background="bg-white" className="flex items-center gap-4 border-b py-[11px]">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <div className="flex cursor-pointer gap-2">
                <div className="flex w-8 items-center justify-center">
                  <Image src="/static/images/logo.png" width={48} height={36} />
                </div>
                <h3>KKMNOW</h3>
              </div>
            </Link>
            <Nav isTablet={isTablet} isTabletNavOpen={isTabletNavOpen}>
              <NavItem
                title={t("nav.home")}
                link="/"
                icon={<HomeIcon className="h-5 w-5 text-black" />}
              />
              <NavItem
                title={t("nav.dashboards")}
                link="/catalogue"
                icon={<TemplateIcon className="h-5 w-5 text-black" />}
              />
              <NavItem title={t("nav.about")} link="/about" />
            </Nav>
          </div>
          <Dropdown selected={language} onChange={onLanguageChange} options={languages} />
          {isTablet &&
            (isTabletNavOpen ? (
              <XIcon className="h-5 w-5 text-black" onClick={() => setIsTabletNavOpen(false)} />
            ) : (
              <MenuAlt3Icon
                className="h-5 w-5 text-black"
                onClick={() => setIsTabletNavOpen(true)}
              />
            ))}
        </div>
      </Container>
    </div>
  );
};

export default Header;
