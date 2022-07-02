import React, { useEffect, useState } from "react";
import {
  notification,
  Button,
  Table,
  Space,
  Row,
  Col,
  Modal,
  Form,
  Input,
  Typography,
  Select,
} from "antd";
import axios from "axios";
import { host } from "../../../constant";
import {
  SyncOutlined,
  AppstoreAddOutlined
} from "@ant-design/icons";
import { useLocation, useHistory } from "react-router";
const Employee = () => {
  let query = new URLSearchParams(useLocation().search);
  let history = useHistory();
  const { Option } = Select;
  const [employees, setEmployees] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogLoading, setIsDialogLoading] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [visible, setVisible] = useState(false);
  const [dialogVisible, seteDialogVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [techStacks, setTechStacks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [paginationConfig, setPaginationConfig] = useState({
    total: 0,
    onChange: (current, size) => handleChangePage(current, size),
    current: 0,
  });
  const [form] = Form.useForm();
  const { Title } = Typography;

  const getAll = (page = 1, size = 10) => {
    setIsLoading(true);
    axios
      .get(
        `${host}/api/v1/employees?page=${page - 1}&size=${size}&sort=id,desc`
      )
      .then((res) => {
        setEmployees(res.data.items || []);
        setIsLoading(false);
        setPaginationConfig({
          total: res.data.totalItems,
          onChange: (current, size) => handleChangePage(current, size),
          current: parseInt(page),
        });
      })
      .catch((error) => {
        openNotificationWithIcon(
          "error",
          "Tải danh sách thất bại",
          error.message
        );
        setIsLoading(false);
      });
  };

  const getAllTechStackActive = (page = 1, size = 30) => {
    setIsLoading(true);
    axios
      .get(
        `${host}/api/v1/tech-stacks/getAllActive?page=${
          page - 1
        }&size=${size}&sort=id,desc`
      )
      .then((res) => {
        setTechStacks(res.data.items || []);
      })
      .catch((error) => {});
  };

  const getAllProject = (page = 1, size = 30) => {
    setIsLoading(true);
    axios
      .get(`${host}/api/v1/projects?page=${page - 1}&size=${size}&sort=id,desc`)
      .then((res) => {
        setProjects(res.data.items || []);
      })
      .catch((error) => {});
  };

  const callDelete = () => {
    axios
      .delete(`${host}/api/v1/employees/delete/${selectedId}`)
      .then((res) => {
        openNotificationWithIcon("success", "Xoá thành công", "");
        getAll();
      })
      .catch((error) => {
        openNotificationWithIcon("error", "Xoá thất bại", error.message);
      });
    setVisible(false);
    setConfirmLoading(false);
  };

  const callPut = (data) => {
    setIsDialogLoading(true);
    axios
      .put(`${host}/api/v1/employees`, data)
      .then((res) => {
        openNotificationWithIcon("success", "Thành công", "");
        getAll();
        seteDialogVisible(false);
        setIsDialogLoading(false);
      })
      .catch((error) => {
        openNotificationWithIcon("error", "Thất bại", "Đã có lỗi xảy ra");
        seteDialogVisible(false);
        setIsDialogLoading(false);
      });
    form.resetFields();
  };

  const openNotificationWithIcon = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <a href="# ">{text}</a>,
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "SĐT",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Tech stack",
      dataIndex: "techStack",
      key: "techStack",
    },
    {
      title: "Dự án",
      dataIndex: "project",
      key: "project",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (text, record) => (
        <Space size="small">
          <Button
            type="primary"
            onClick={() => {
              onFill(record);
              showDialogModal();
            }}
          >
            Chỉnh sửa
          </Button>
          <Button
            onClick={() => {
              setSelectedId(record.id);
              showModal();
            }}
            type="primary"
            danger
          >
            Xoá
          </Button>
        </Space>
      ),
    },
  ];

  const handleChangePage = (current, size) => {
    history.push({
      pathname: "/employees",
      search: `?page=${current}&size=${size}`,
    });
    getAll(current, size);
  };

  const showModal = () => {
    setVisible(true);
  };

  const showDialogModal = () => {
    seteDialogVisible(true);
  };

  const handleOk = () => {
    // setModalText('The modal will be closed after two seconds');
    setConfirmLoading(true);
    callDelete();
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleDialogCancel = () => {
    seteDialogVisible(false);
    form.resetFields();
  };

  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 16,
    },
  };
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      offset: 6,
      span: 16,
    },
  };

  const onFinish = (values) => {
    values.techStack = values.techStack != null ? values.techStack.join(", ") : "";
    values.project = values.project != null ? values.project.join(", ") : "";
    callPut(values);
  };

  const onFill = (data) => {
    form.setFieldsValue({
      id: data.id,
      name: data.name,
      phone: data.phone,
      techStack: data.techStack
        .split(",")
        .filter(i=>i!="")
        .map((item) => item.trim()),
      project: data.project
        .split(",")
        .filter(i=>i!="")
        .map((item) => item.trim()),
    });
  };

  useEffect(() => {
    getAll(query.get("page") || 1, query.get("size") || 10);
    getAllTechStackActive(0, 30);
    getAllProject();
  }, []);

  return (
    <div>
      <Row justify="start">
        <Title>Nhân sự</Title>
      </Row>
      <Row justify="end" style={{ paddingBottom: "10px" }}>
        <Col>
          <Space>
            <Button type="primary" onClick={() => showDialogModal()}>
              <AppstoreAddOutlined style={{ fontSize: "16px" }} /> Thêm
            </Button>
            <Button
              type="primary"
              onClick={() =>
                getAll(query.get("page") || 1, query.get("size") || 10)
              }
              disabled={isLoading}
            >
              <SyncOutlined style={{ fontSize: "16px" }} spin={isLoading} />
              Tải lại
            </Button>
          </Space>
        </Col>
      </Row>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={employees}
        pagination={paginationConfig}
      />

      {/* Modal Delete*/}
      <Modal
        title="Thông báo xác nhận"
        visible={visible}
        onOk={handleOk}
        okButtonProps={{ danger: true }}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText="Xoá"
        cancelText="Huỷ"
      >
        <p>Bạn có muốn xoá không</p>
      </Modal>

      {/* Modal create  */}
      <Modal
        title="Chỉnh sửa"
        visible={dialogVisible}
        onCancel={handleDialogCancel}
        footer={null}
      >
        <Form
          form={form}
          name="dynamic_form_item"
          {...formItemLayout}
          onFinish={onFinish}
          initialValues={{ projec: [""], empoyee: [], techStack: [] }}
        >
          <Form.Item name="id" style={{ display: "none" }}>
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="Tên"
            rules={[{ required: true, message: "Tên không được để trống" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="SĐT">
            <Input />
          </Form.Item>
          <Form.Item name="techStack" label="Tech Stack">
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Chọn tech stack"
              optionLabelProp="label"
              showArrow="true"
            >
              {techStacks.map((item, index) => {
                return (
                  <Option key={index} value={item.name}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item name="project" label="Dự án">
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Chọn dự án"
              optionLabelProp="label"
              showArrow="true"
            >
              {projects.map((item, index) => {
                return (
                  <Option key={index} value={item.name}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item {...formItemLayoutWithOutLabel}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Employee;
