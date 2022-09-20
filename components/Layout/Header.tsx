import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "next-i18next";
import { HomeIcon, MenuAlt3Icon, NewspaperIcon, TemplateIcon, XIcon } from "@heroicons/react/solid";

import { languages } from "@lib/options";

import { BREAKPOINTS } from "@lib/constants";
import { DASHBOARD_ROUTES } from "@lib/routes";
import { useLanguage } from "@hooks/useLanguage";
import { useWindowWidth } from "@hooks/useWindowWidth";

import Nav from "@components/Nav";
import NavItem from "@components/Nav/Item";
import Dropdown from "@components/Dropdown";
import Container from "@components/Container";
import MegaMenu from "@components/Nav/MegaMenu";

const Header = () => {
  const { t } = useTranslation();
  const { language, onLanguageChange } = useLanguage();

  const width = useWindowWidth();
  const isTablet = width <= BREAKPOINTS.MD;

  const [isTabletNavOpen, setIsTabletNavOpen] = useState(false);

  // TODO: build items from API
  const megaMenuItems = [
    {
      title: t("nav.megamenu.categories.infectious_diseases"),
      list: [
        { title: t("nav.megamenu.dashboards.covid_19"), link: "/" },
        { title: t("nav.megamenu.dashboards.covid_19_vax"), link: "/" },
      ],
    },
    {
      title: t("nav.megamenu.categories.healthcare_resources"),
      list: [{ title: t("nav.megamenu.dashboards.healthcare_facilities"), link: "/" }],
    },
    {
      title: t("nav.megamenu.categories.healthcare_programs"),
      list: [
        {
          title: t("nav.megamenu.dashboards.blood_donation"),
          link: DASHBOARD_ROUTES.BLOOD_DONATION,
        },
        { title: t("nav.megamenu.dashboards.organ_donation"), link: "/" },
        { title: t("nav.megamenu.dashboards.peka_b40"), link: "/" },
      ],
    },
    {
      title: t("nav.megamenu.categories.misc"),
      list: [
        { title: t("nav.megamenu.dashboards.covidnow_data"), link: DASHBOARD_ROUTES.COVIDNOW },
      ],
    },
  ];

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
              {/* DASHBOARD MEGA MENU */}
              <MegaMenu
                title={t("nav.dashboards")}
                icon={<TemplateIcon className="h-5 w-5 text-black" />}
              >
                <Container className="relative grid gap-4 py-3 md:grid-cols-4 md:gap-6 md:py-6">
                  {megaMenuItems.map((item, index) => (
                    <div key={index} className="text-sm">
                      <p className="mb-2 font-bold">{item.title}</p>
                      <ul className="flex flex-col gap-2">
                        {item.list.map(li => (
                          <Link href={li.link}>
                            <li className="text-footer-link">{li.title}</li>
                          </Link>
                        ))}
                      </ul>
                    </div>
                  ))}
                </Container>
              </MegaMenu>
              <NavItem
                title={t("nav.about")}
                link="/about"
                icon={<NewspaperIcon className="h-5 w-5 text-black" />}
              />
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
