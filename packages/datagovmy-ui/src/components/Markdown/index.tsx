import { FunctionComponent } from "react";
import ReactMarkdown, { Options } from "react-markdown";

interface MarkdownProps extends Options {
  className?: string;
}

const Markdown: FunctionComponent<MarkdownProps> = ({ className = "markdown", ...props }) => {
  return (
    <div className={className}>
      <ReactMarkdown {...props} />
    </div>
  );
};

export default Markdown;
