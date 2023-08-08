import { FC, ReactNode } from "react";

type PortletProps = {
  header: string | ReactNode;
  subHeader: string;
  children: ReactNode;
  className: string | undefined;
};
const Portlet: FC = ({
  className,
  header,
  subHeader,
  children,
}: PortletProps) => {
  return (
    <div className={className}>
      <h2 className="text-xl font-extrabold"> {header}</h2>
      <h4 className="text-large text-slate-700">{subHeader}</h4>
      <div className="grid grid-cols-2 gap-4 ">{children}</div>
    </div>
  );
};
export default Portlet;
