import { UserGroupIcon } from "@heroicons/react/solid";

import Hero from "@components/Hero";
import Container from "@components/Container";

// TODO: move object to translation file and update dummy data
const about = {
  title: "Meet the team behind AKSARA",
  description:
    "Investing into good and kind people pays for itself tenfold. Here at DOSM, we know that the brilliant minds below are are our greatest asset.",
  web_devs: "web developers",
  data_scientists: "data scientists",
  partners: "partners",
  strategic_partners: "Strategic Partners",
  data: {
    title: "Data Team",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
    team: {
      name: "Low Kai-Hsin (Chris)",
      title: "Frontend Engineer",
      quote:
        "Beware Man, for he is the Devil's pawn. Alone among God's primates, he kills for sport or lust or greed.",
      linkedin: "https://www.linkedin.com/in/itschrislow/",
    },
  },
  dev: {
    title: "Web Development Team",
    description: "My name is Ozymandias, king of kings; Look on my works, ye Mighty, and despair!",
    team: {
      name: "Low Kai-Hsin (Chris)",
      title: "Frontend Engineer",
      quote:
        "Beware Man, for he is the Devil's pawn. Alone among God's primates, he kills for sport or lust or greed.",
      linkedin: "https://www.linkedin.com/in/itschrislow/",
    },
  },
};

const About = () => {
  return (
    <div>
      <Hero background="hero-light-1" className="text-center">
        <div className="mb-3 flex flex-col gap-2">
          <h1>👋</h1>
          <h3>{about.title}</h3>
          <p className="text-center text-dim">{about.description}</p>
        </div>
        {/* TEAM STATS */}
        <div className="flex w-full justify-center gap-4">
          <TeamStats arrLen={7} text={about.web_devs} />
          <TeamStats arrLen={10} text={about.data_scientists} />
          <TeamStats arrLen={35} text={about.partners} />
        </div>
      </Hero>
      <div className="divide-y">
        {/* ENGINEERING TEAM */}
        <Section title={about.dev.title} desc={about.dev.description}>
          <Team teamArr={Array(7).fill(about.dev.team)} />
        </Section>
        {/* DATA TEAM */}
        <Section title={about.data.title} desc={about.data.description}>
          <Team teamArr={Array(7).fill(about.data.team)} />
        </Section>
        {/* STRATEGIC PARTNERS */}
        <Section title={about.strategic_partners}>
          <></>
        </Section>
      </div>
    </div>
  );
};

const TeamStats: React.FC<{
  arrLen: number;
  text: string;
}> = ({ arrLen, text }) => {
  return (
    <div className="flex items-center gap-2 text-dim">
      <UserGroupIcon className="h-4 w-4" />
      <p className="font-bold">
        {arrLen} {text}
      </p>
    </div>
  );
};

const Section: React.FC<{
  title: string;
  desc?: string;
  children: React.ReactNode;
}> = ({ title, desc, children }) => {
  return (
    <Container className="py-12 text-center">
      <div className="mb-12 flex flex-col gap-2">
        <h4>{title}</h4>
        {desc && <p className="text-dim">{desc}</p>}
      </div>
      {children}
    </Container>
  );
};

const Team: React.FC<{
  teamArr: TeamProfileProps[];
}> = ({ teamArr }) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-12">
      {teamArr?.map(profile => (
        <TeamProfile {...profile} />
      ))}
    </div>
  );
};

type TeamProfileProps = {
  imgLink: string;
  name: string;
  title: string;
  quote: string;
  linkedin: string;
};

const TeamProfile: React.FC<TeamProfileProps> = ({ imgLink, name, title, quote, linkedin }) => {
  return (
    <div className="flex w-[250px] flex-col items-center">
      <div className="mb-4 h-[120px] w-[120px] rounded-full bg-gray-100"></div>
      <p className="mb-1 font-medium">{name}</p>
      <p className="mb-4 text-sm font-medium text-dim">{title}</p>
      <p className="mb-4 text-sm text-dim">{quote}</p>
      {/* LINKEDIN ICON */}
      <a href={linkedin} target="_blank">
        <svg
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill="#94A3B8"
          className="h-4 w-5"
        >
          <title>LinkedIn</title>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </a>
    </div>
  );
};

export default About;
