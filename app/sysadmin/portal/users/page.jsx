"use client";

import React, { useEffect, useState } from "react";
import { Input } from "antd";
import { Table, Button, Modal, Form, Alert } from "antd";
import api from "@/utils/api";
import { useUserToken } from "@/utils/Auth/auth-selectors";
import { AiOutlinePlus } from "react-icons/ai";
import FormTitle from "@/components/Form/FormTitle";
import { getErrorMessage } from "@/utils/error-util";

const { Search } = Input;

const SysAdminUsers = () => {
  const columns = [
    {
      title: "Full name",
      dataIndex: "name",
      width: "16%",
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "18%",
    },
    {
      title: "Created",
      dataIndex: "created",
    },
    {
      title: "",
      render: ({ key }) => (
        <div className=" flex justify-end gap-3 pe-4">
          <Button
            type="primary"
            onClick={() => {
              editOnClickHandler(key);
              setUserEditModalDetails({ isOpen: true, userId: key });
            }}
          >
            Edit
          </Button>
          <Button
            danger
            onClick={() => {
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

  const [sysAdminUsers, setSysAdminUsers] = useState([]);
  const token = useUserToken();
  const [sysAdminCreateForm] = Form.useForm();
  const [sysAdminUpdateForm] = Form.useForm();
  const [tableLoading, setTableLoading] = useState(false);
  const [userSearchKeyWord, setUserSearchKeyWord] = useState("");
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      total: 10,
    },
  });

  const [isSysAdminCreateModelOpen, setSysAdminCreateModelOpen] =
    useState(false);
  const [userDeleteModalDetails, setUserDeleteModalDetails] = useState({
    isOpen: false,
    userId: null,
  });
  const [userEditModalDetails, setUserEditModalDetails] = useState({
    isOpen: false,
    userId: null,
  });
  const [createSysAdminError, setCreateSysAdminError] = useState(null);
  const [UpdateSysAdminError, setUpdateSysAdminError] = useState(null);

  const fetchData = async () => {
    try {
      let offset =
        (tableParams.pagination.current - 1) * tableParams.pagination.pageSize;
      setTableLoading(true);
      await api
        .get(
          "SysAdmin/Users",
          {
            limit: tableParams.pagination.pageSize,
            offset: offset,
            search: userSearchKeyWord,
          },
          token
        )
        .then((response) => {
          setSysAdminUsers(response.items);
          setTableLoading(false);
          setTableParams({
            ...tableParams,
            pagination: {
              ...tableParams.pagination,
              total: response.meta.count,
            },
          });
        });
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(tableParams), userSearchKeyWord]);

  const handleTableChange = (pagination, filters) => {
    setTableParams({
      pagination: {
        ...pagination,
      },
      filters,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

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

  const updateSysAdmin = async () => {
    sysAdminUpdateForm.validateFields().then(async (values) => {
      try {
        await api.put(
          `sysadmin/${userEditModalDetails.userId}`,
          { ...values },
          token
        );
        const usersListResponse = await api.get("SysAdmin/Users", null, token);
        setSysAdminUsers(usersListResponse.items);
        setUserEditModalDetails({ isOpen: false, userId: null });
      } catch (error) {
        const errorMessage = getErrorMessage(error.response);
        setUpdateSysAdminError(errorMessage);
        return;
      }
    });
  };

  const editOnClickHandler = async (id) => {
    try {
      const response = await api.get(`/sysadmin/${id}`, null, token);
      sysAdminUpdateForm.setFieldsValue({
        userId: response.id,
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
      });
      setUserEditModalDetails({ isOpen: true, userId: response.id });
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

      {/* Edit user modal */}
      <Modal
        open={userEditModalDetails.isOpen}
        width={"35%"}
        closeIcon={false}
        onCancel={() => {
          setUserEditModalDetails({ isOpen: false, userId: null });
        }}
        footer={[
          <Button
            key="delete"
            type="primary"
            onClick={() => {
              updateSysAdmin();
            }}
          >
            Update
          </Button>,
          <Button
            key="cancel"
            onClick={() =>
              setUserEditModalDetails({ isOpen: false, userId: null })
            }
          >
            Cancel
          </Button>,
        ]}
      >
        <Form
          labelCol={{
            span: 7,
          }}
          wrapperCol={{
            span: 18,
          }}
          layout="horizontal"
          form={sysAdminUpdateForm}
        >
          <FormTitle title={"Update SysAdmin User"} />

          {UpdateSysAdminError && (
            <Alert
              type="error"
              message={UpdateSysAdminError}
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
            name={"firstName"}
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
            name={"lastName"}
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
            name={"email"}
            rules={[
              { required: true, message: "Please input your E-mail!" },
              { type: "email", message: "The input is not valid E-mail!" },
            ]}
          >
            <Input
              className="font-default font-normal text-dark-dark-blue"
              autoComplete="new-email"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="font-default text-dark-dark-blue font-bold">
                New Password
              </span>
            }
            name={"newPassword"}
            rules={[
              {
                validator: (_, value) => {
                  if (value && value.length < 8) {
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
              autoComplete="new-password"
              placeholder="Password"
            />
          </Form.Item>
        </Form>
      </Modal>

      <div className="flex justify-between">
        <Search
          placeholder={"Search by email or name"}
          enterButton
          className=" w-1/4 shadow-sm flex-initial"
          size="large"
          style={{ borderRadius: "0px !important" }}
          onSearch={(value) => setUserSearchKeyWord(value)}
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
          loading={tableLoading}
          pagination={tableParams.pagination}
          onChange={handleTableChange}
        />
      </div>
    </div>
  );
};

export default SysAdminUsers;
