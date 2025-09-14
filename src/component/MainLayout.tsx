import { JSX, PropsWithChildren } from "react";
import HeaderLayout from "./Header";
import FooterLayout from "./Footer";

const MainLayout = async ({
  children,
}: PropsWithChildren): Promise<JSX.Element> => {
  return (
    <section className="min-h-screen w-screen bg-white flex flex-col">
      <HeaderLayout />
      {children}
      <FooterLayout />
    </section>
  );
};

export default MainLayout;
