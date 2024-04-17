"use client";

import React, { useEffect } from "react";
import { RiAdminFill } from "react-icons/ri";
import { FaUniversity } from "react-icons/fa";
import { Layout, Menu, theme } from "antd";
import Link from "next/link";
import { useIsAuth } from "@/utils/Auth/auth-selectors";
import { useRouter } from "next/navigation";

const { Sider } = Layout;

const NavMenuLayout = ({ children }) => {
  const router = useRouter();
  const isAuthenticated = useIsAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/sysadmin/signin");
    }
  }, []);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <div className=" bg-dark-bg h-screen font-default">
      <div>
        <Layout hasSider className="bg-dark-bg ">
          <Sider
            theme="light"
            className=" overflow-auto h-svh fixed left-0 top-0 bottom-0 shadow-md w-1/2"
            width={240}
          >
            <div className=" align-middle text-center font-bold text-xl my-2 border-b-2">
              <h1 className=" font-inika text-dark-blue my-2">
                CareerMate Admin
              </h1>
            </div>

            <Menu
              theme="light"
              mode="inline"
              defaultSelectedKeys={["1"]}
              items={[
                {
                  key: 1,
                  icon: <RiAdminFill size={20} className=" fill-dark-blue" />,
                  label: (
                    <Link
                      href={"users"}
                      className="font-default fill-dark-blue "
                    >
                      SysAdmin users
                    </Link>
                  ),
                  style: { color: "black" },
                },
                {
                  key: 2,
                  icon: <FaUniversity size={20} className=" fill-dark-blue" />,
                  label: (
                    <Link
                      href={"universities"}
                      className="font-default fill-dark-blue"
                    >
                      Universities
                    </Link>
                  ),
                },
              ]}
            />
          </Sider>
          <Layout className="bg-dark-bg mx-4">{children}</Layout>
        </Layout>
      </div>
    </div>
  );
};

export default NavMenuLayout;
