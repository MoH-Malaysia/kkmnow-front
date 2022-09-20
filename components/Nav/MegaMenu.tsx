import Link from "next/link";
import { Fragment, useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";

import Container from "@components/Container";

type MegaMenuProps = {
  icon?: JSX.Element;
  title: string;
  items: {
    title: string;
    list: { title: string; link: string }[];
  }[];
};

const MegaMenu: React.FC<MegaMenuProps> = ({ icon, title, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full">
      <Popover
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="relative"
      >
        <>
          <Popover.Button className="flex items-center gap-2 rounded-md bg-white px-2 py-[6px] text-sm font-medium hover:cursor-pointer hover:bg-washed">
            {icon}
            {title}
            <ChevronDownIcon
              className={`h-4 w-4 transition duration-150 ease-in-out group-hover:text-opacity-80`}
              aria-hidden="true"
            />
          </Popover.Button>
          <Transition
            show={isOpen}
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="fixed left-0 z-10 mt-3 w-screen">
              <div className="overflow-hidden border bg-white shadow-lg">
                <Container className="relative grid gap-6 py-6 md:grid-cols-4">
                  {items.map(item => (
                    <div className="text-sm">
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
              </div>
            </Popover.Panel>
          </Transition>
        </>
      </Popover>
    </div>
  );
};

export default MegaMenu;
