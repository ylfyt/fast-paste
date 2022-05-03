import { FC } from "react";

interface ContainerProps {
  children: React.ReactNode;
}

const Container: FC<ContainerProps> = ({ children }) => {
  return <div className="w-3/4 min-h-screen flex justify-center">{children}</div>;
};

export default Container;
