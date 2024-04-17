"use client";

import React, { useEffect, useState } from "react";
import { Input } from "antd";
import { Table, Button, Modal, Form, Alert } from "antd";
import api from "@/utils/api";
import { useUserToken } from "@/utils/Auth/auth-selectors";
import { AiOutlinePlus } from "react-icons/ai";
import FormTitle from "@/components/Form/FormTitle";
import { getErrorMessage } from "@/utils/error-util";
import { render } from "react-dom";

const { Search } = Input;

const SysAdminUsers = () => {
  const [sysAdminUsers, setSysAdminUsers] = useState([]);
  const token = useUserToken();
  const [sysAdminCreateForm] = Form.useForm();

  const [isSysAdminCreateModelOpen, setSysAdminCreateModelOpen] =
    useState(false);
  const [userDeleteModalDetails, setUserDeleteModalDetails] = useState({
    isOpen: false,
    userId: null,
  });
  const [createSysAdminError, setCreateSysAdminError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("SysAdmin/Users", null, token);
        console.log(response);
        setSysAdminUsers(response.items);
      } catch (error) {
        throw error;
      }
    };
    fetchData();
  }, []);

  const columns = [
    {
      title: "Full name",
      dataIndex: "name",
      width: 200,
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 240,
    },
    {
      title: "Created",
      dataIndex: "created",
    },
    {
      title: "",
      render: ({ key }) => (
        <div className=" flex justify-end gap-3 pe-4">
          <Button type="primary bg-light-blue">Edit</Button>
          <Button
            danger
            onClick={() => {
              console.log(`Id: ${key}`);
              setUserDeleteModalDetails({ isOpen: true, userId: key });
            }}
          >
            Delete
          </Button>
        </div>
      ),
      width: 300,
    },
  ];

  const createSysAdmin = () => {
    sysAdminCreateForm.validateFields().then(async (values) => {
      try {
        await api.post("sysadmin/create", { ...values }, token);

        const usersListResponse = await api.get("SysAdmin/Users", null, token);
        setSysAdminCreateModelOpen(false);
        setSysAdminUsers(usersListResponse.items);
      } catch (error) {
        const errorMessage = getErrorMessage(error.response);
        setCreateSysAdminError(errorMessage.message);
        return;
      }
      sysAdminCreateForm.resetFields();
    });
  };

  const deleteSysAdmin = async () => {
    try {
      await api.delete(`sysadmin/${userDeleteModalDetails.userId}`, token);
      const usersListResponse = await api.get("SysAdmin/Users", null, token);
      setSysAdminUsers(usersListResponse.items);
      setUserDeleteModalDetails({ isOpen: false, userId: null });
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className=" mt-10">
      {/* Create user modal */}
      <Modal
        open={isSysAdminCreateModelOpen}
        onCancel={() => setSysAdminCreateModelOpen(false)}
        className=" w-fit"
        width={460}
        onOk={createSysAdmin}
      >
        <Form
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 18,
          }}
          layout="horizontal"
          form={sysAdminCreateForm}
        >
          <FormTitle title={"Create SysAdmin User"} />

          {createSysAdminError && (
            <Alert
              type="error"
              message={createSysAdminError}
              showIcon
              closable
              className="mb-4"
            />
          )}

          <Form.Item
            label={
              <span className="font-default text-dark-dark-blue font-bold">
                First Name
              </span>
            }
            name={"FirstName"}
            rules={[
              { required: true, message: "Please input your first name!" },
            ]}
          >
            <Input className="font-default font-normal text-dark-dark-blue" />
          </Form.Item>

          <Form.Item
            label={
              <span className="font-default text-dark-dark-blue font-bold">
                Last Name
              </span>
            }
            name={"LastName"}
            rules={[
              { required: true, message: "Please input your last name!" },
            ]}
          >
            <Input className="font-default font-normal text-dark-dark-blue" />
          </Form.Item>

          <Form.Item
            label={
              <span className="font-default text-dark-dark-blue font-bold">
                Email
              </span>
            }
            name={"Email"}
            rules={[
              { required: true, message: "Please input your E-mail!" },
              { type: "email", message: "The input is not valid E-mail!" },
            ]}
          >
            <Input
              className="font-default font-normal text-dark-dark-blue"
              autoComplete="off"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="font-default text-dark-dark-blue font-bold">
                Password
              </span>
            }
            name={"Password"}
            rules={[
              { required: true, message: "Please input valid Password!" },
              {
                validator: (_, value) => {
                  if (value && (value.length < 8 || value.length > 8)) {
                    return Promise.reject(
                      "Password must be exactly 8 characters!"
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input.Password
              className="font-default font-normal text-dark-dark-blue"
              autoComplete="off"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete user modal */}
      <Modal
        open={userDeleteModalDetails.isOpen}
        width={460}
        closeIcon={false}
        onCancel={() =>
          setUserDeleteModalDetails({ isOpen: false, userId: null })
        }
        footer={[
          <Button
            key="delete"
            danger
            onClick={() => {
              deleteSysAdmin();
            }}
          >
            Delete
          </Button>,
          <Button
            key="cancel"
            onClick={() =>
              setUserDeleteModalDetails({ isOpen: false, userId: null })
            }
          >
            Cancel
          </Button>,
        ]}
      >
        <h6 className=" font-default text-lg font-semibold">
          Do you want to delete the user?
        </h6>
      </Modal>

      <div className="flex justify-between">
        <Search
          placeholder={"Search by email or name"}
          enterButton
          className=" w-1/4 shadow-sm flex-initial"
          size="large"
          style={{ borderRadius: "0px !important" }}
        />
        <Button
          type="primary"
          size="large"
          className=" flex-initial flex gap-2 bg-light-blue"
          onClick={() => setSysAdminCreateModelOpen(true)}
        >
          <span>Create new User</span>
          <AiOutlinePlus className=" align-bottom h-full" size={22} />
        </Button>
      </div>
      {/* <div className="my-2 h-6 bg-white shadow-md flex font-default font-semibold">
        <div className="mx-4 w-1/6">
          <h4>Full Name</h4>
        </div>
        <div className="mx-4 w-1/6">
          <h4>Email</h4>
        </div>
        <div className="mx-4">
          <h4>Date Created</h4>
        </div>
      </div> */}
      <div className="mt-4 font-default">
        <Table
          columns={columns}
          dataSource={sysAdminUsers.map((s) => {
            return {
              key: s.id,
              name: `${s.firstName} ${s.lastName}`,
              email: s.email,
              created: new Date(s.dateCreated).toLocaleString(),
            };
          })}
          size="middle"
          className="font-default text-md"
        />
      </div>
    </div>
  );
};

export default SysAdminUsers;
