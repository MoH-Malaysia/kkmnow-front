import { FunctionComponent, ReactElement, ReactNode } from "react";

interface SectionProps {
  className?: string;
  title?: string | ReactElement;
  description?: string | ReactElement;
  children?: ReactNode;
  date?: "current" | null | string;
}

const Section: FunctionComponent<SectionProps> = ({
  title,
  className = "border-b py-12",
  description,
  children,
  date = "current",
}) => {
  return (
    <section className={className}>
      <div>
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          {title && typeof title === "string" ? <h4>{title}</h4> : title}
          {date && date === "current" ? (
            <span className="text-dim">Data as of {new Date().toDateString()}</span>
          ) : (
            date
          )}
        </div>
        {description && typeof description === "string" ? <p>{description}</p> : description}
      </div>
      {children}
    </section>
  );
};

export default Section;
