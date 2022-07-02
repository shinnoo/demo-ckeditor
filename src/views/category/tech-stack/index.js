import React, { useEffect, useState } from 'react';
import { notification, Button, Table, Tag, Space, Row, Col, Modal, Form, Input, Switch, Typography } from 'antd';
import axios from 'axios';
import { host } from '../../../constant';
import { SyncOutlined, AppstoreAddOutlined, } from '@ant-design/icons';
import { useLocation, useHistory } from 'react-router';
const TechStack = () => {
  let query = new URLSearchParams(useLocation().search);
  let history = useHistory();
  const [projecTypes, setTechStacks] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogLoading, setIsDialogLoading] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [visible, setVisible] = useState(false);
  const [dialogVisible, seteDialogVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [paginationConfig, setPaginationConfig] = useState({
    total: 0,
    onChange: (current, size) => handleChangePage(current, size),
    current: 0
  });
  const [form] = Form.useForm();
  const { Title } = Typography;


  const getAll = (page = 1, size = 10) => {
    setIsLoading(true);
    axios.get(`${host}/api/v1/tech-stacks?page=${page - 1}&size=${size}&sort=id,desc`)
      .then(res => {
        setTechStacks(res.data.items || []);
        setIsLoading(false);
        setPaginationConfig({
          total: res.data.totalItems,
          onChange: (current, size) => handleChangePage(current, size),
          current: parseInt(page)
        })
      })
      .catch(error => {
        openNotificationWithIcon('error', 'Tải danh sách thất bại', error.message)
        setIsLoading(false);
      });
  }

  const callDelete = () => {
    axios.delete(`${host}/api/v1/tech-stacks/delete/${selectedId}`)
      .then(res => {
        openNotificationWithIcon('success', 'Xoá thành công', '')
        getAll()
      })
      .catch(error => {
        openNotificationWithIcon('error', 'Xoá thất bại', error.message)
      });
    setVisible(false);
    setConfirmLoading(false);
  }

  const callPut = (data) => {
    setIsDialogLoading(true)
    axios.put(`${host}/api/v1/tech-stacks`, data)
      .then(res => {
        openNotificationWithIcon('success', 'Thành công', '')
        getAll()
        seteDialogVisible(false);
        setIsDialogLoading(false)
      })
      .catch(error => {
        openNotificationWithIcon('error', 'Thất bại', 'Đã có lỗi xảy ra')
        seteDialogVisible(false)
        setIsDialogLoading(false)
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
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: text => <a href="# ">{text}</a>,
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: text => (
        <Tag color={text === true ? 'success' : 'red'} key={text === true ? 'ACTIVE' : 'INACTIVE'}>
          {text === true ? 'ACTIVE' : 'INACTIVE'}
        </Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (text, record) => (
        <Space size="small">
          <Button type="primary" onClick={() => {
            onFill(record);
            showDialogModal();
          }}>Chỉnh sửa</Button>
          <Button onClick={() => {
            setSelectedId(record.id);
            showModal();
          }} type="primary" danger >Xoá</Button>
        </Space>
      ),
    },
  ];


  const handleChangePage = (current, size) => {
    history.push({
      pathname: '/tech-stacks',
      search: `?page=${current}&size=${size}`
    })
    getAll(current, size)
  }

  const showModal = () => {
    setVisible(true);
  };

  const showDialogModal = () => {
    seteDialogVisible(true);
  }

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
  }

  const layout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 16,
    },
  };
  const tailLayout = {
    wrapperCol: {
      offset: 11,
      span: 11,
    },
  };

  const onFinish = (values) => {
    callPut(values);
  };

  const onFill = (data) => {
    form.setFieldsValue({
      id: data.id,
      name: data.name,
      description: data.description,
      status: data.status
    });
  };

  useEffect(() => {
    getAll(query.get('page') || 1, query.get('size') || 10);
  }, []);

  return (
    <div>
      <Row justify="start">
        <Title>Tech stack</Title>
      </Row>
      <Row justify="end" style={{ paddingBottom: "10px" }}>
        <Col>
          <Space>
            <Button type="primary" onClick={() => showDialogModal()}><AppstoreAddOutlined style={{ fontSize: "16px" }} /> Thêm</Button>
            <Button type="primary" onClick={() => getAll(query.get('page') || 1, query.get('size') || 10)} disabled={isLoading} ><SyncOutlined style={{ fontSize: "16px" }} spin={isLoading} />Tải lại</Button>
          </Space>
        </Col>
      </Row>
      <Table rowKey="id" columns={columns} dataSource={projecTypes} pagination={paginationConfig} />

      {/* Modal Delete*/}
      <Modal
        title="Thông báo xác nhận"
        visible={visible}
        onOk={handleOk}
        okButtonProps={{ danger: true }}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText="Xoá"
        cancelText="Huỷ">
        <p>Bạn có muốn xoá không</p>
      </Modal>

      {/* Modal create  */}
      <Modal
        title="Chỉnh sửa"
        visible={dialogVisible}
        onCancel={handleDialogCancel}
        footer={null}
      >
        <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
          <Form.Item name="id" style={{ display: "none" }}>
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="Tên"
            rules={[{ required: true, message: "Tên không được để trống" },]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" loading={isDialogLoading}>
              Lưu
            </Button>
          </Form.Item>
        </Form>

      </Modal>
    </div>


  )
}

export default TechStack;