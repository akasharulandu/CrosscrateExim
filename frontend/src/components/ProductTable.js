import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Popconfirm, Table, Typography, Upload, Button, Modal, message } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios'; // make sure axios is installed: npm install axios

const { TextArea } = Input;

const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
  let inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  if (dataIndex === 'image') {
    inputNode = (
      <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
        <Button icon={<UploadOutlined />}>Upload</Button>
      </Upload>
    );
  }
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          valuePropName={dataIndex === 'image' ? 'fileList' : 'value'}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const ProductTable = () => {
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const isEditing = (record) => record.key === editingKey;

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      const products = res.data.map((item) => ({
        ...item,
        key: item._id,
      }));
      setData(products);
    } catch (error) {
      console.error(error);
    }
  };

  const edit = (record) => {
    form.setFieldsValue({ ...record, image: [] });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const item = data.find((item) => item.key === key);

      const formData = new FormData();
      formData.append('title', row.title);
      formData.append('description', row.description);
      formData.append('price', row.price);

      if (row.image && row.image[0]) {
        formData.append('image', row.image[0].originFileObj);
      }

      await axios.patch(`http://localhost:5000/api/products/${item._id}`, formData);

      message.success('Product updated successfully!');
      fetchProducts();
      setEditingKey('');
    } catch (errInfo) {
      console.error('Save Failed:', errInfo);
    }
  };

  const deleteProduct = async (key) => {
    try {
      const item = data.find((item) => item.key === key);
      await axios.delete(`http://localhost:5000/api/products/${item._id}`);
      message.success('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      title: 'Product Image',
      dataIndex: 'imageUrl',
      width: '20%',
      render: (imageUrl) => imageUrl ? <img src={imageUrl} alt="product" style={{ width: '100px' }} /> : 'No Image',
      editable: false,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      width: '20%',
      editable: true,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: '30%',
      editable: true,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      width: '10%',
      editable: true,
    },
    {
      title: 'Delete',
      dataIndex: 'delete',
      render: (_, record) => (
        <Popconfirm title="Sure to delete?" onConfirm={() => deleteProduct(record.key)}>
          <Button className="btn btn-danger text-white d-flex justify-content-center align-items-center">Delete</Button>
        </Popconfirm>
      ),
    },
    {
      title: 'Edit',
      dataIndex: 'edit',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)} >
          <Button 
  className="btn btn-primary text-white d-flex justify-content-center align-items-center" >
  Edit
</Button>

        </Typography.Link>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'price' ? 'number' : (col.dataIndex === 'image' ? 'upload' : 'text'),
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const handleAddProduct = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await addForm.validateFields();
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('price', values.price);
      formData.append('image', values.image[0].originFileObj);

      await axios.post('http://localhost:5000/api/products', formData);

      message.success('New product added!');
      setIsModalVisible(false);
      addForm.resetFields();
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    addForm.resetFields();
  };

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAddProduct}
        style={{ marginBottom: 16 }}
      >
        Add Product
      </Button>

      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>

      <Modal
        title="Add New Product"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Add"
      >
        <Form form={addForm} layout="vertical">
          <Form.Item
            name="image"
            label="Product Image"
            valuePropName="fileList"
            getValueFromEvent={(e) => e.fileList}
            rules={[{ required: true, message: 'Please upload an image!' }]}
          >
            <Upload
              listType="picture"
              maxCount={1}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="title"
            label="Product Title"
            rules={[{ required: true, message: 'Please enter title!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Product Description"
            rules={[{ required: true, message: 'Please enter description!' }]}
          >
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="price"
            label="Product Price"
            rules={[{ required: true, message: 'Please enter price!' }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ProductTable;
