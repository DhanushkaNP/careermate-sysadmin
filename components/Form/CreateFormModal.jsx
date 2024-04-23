"use client";

import React, { useState } from "react";
import { Form, Modal, Alert } from "antd";
import FormTitle from "./FormTitle";
import { getErrorMessage } from "@/utils/error-util";

const CreateFormModal = ({
  open,
  onCancel,
  onCreate,
  title,
  width,
  children,
}) => {
  const [form] = Form.useForm();
  const [error, setError] = useState();

  const handlSubmit = async () => {
    form.validateFields().then(async (values) => {
      try {
        console.log(values);
        await onCreate(values);
      } catch (error) {
        console.log(error.response);
        const errorMessage = getErrorMessage(error.response);
        setError(errorMessage.message);
        return;
      }
    });
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      className="w-fit"
      width={width}
      onOk={handlSubmit}
      closeIcon={false}
    >
      <Form
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 18,
        }}
        layout="horizontal"
        form={form}
      >
        <FormTitle title={title} />
        {error && (
          <Alert
            type="error"
            message={error}
            showIcon
            closable
            className="mb-4"
          />
        )}
        {children}
      </Form>
    </Modal>
  );
};

export default CreateFormModal;
