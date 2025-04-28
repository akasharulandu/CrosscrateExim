import React, { useState, useEffect } from 'react';
import { Table, Modal, Button, Form, Input, Upload, message, Spin } from 'antd';
import { PlusOutlined, UploadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const { TextArea } = Input;

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [dimensions, setDimensions] = useState([]);
  const [dimensionInput, setDimensionInput] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/products');
      const updatedProducts = response.data.map(product => ({
        ...product,
        image: product.imageUrl, // Map imageUrl to image
      }));
      setProducts(updatedProducts);
    } catch (error) {
      console.error(error);
      message.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    form.resetFields();
    setDimensions([]);
    setFileList([]);
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleEditProduct = (record) => {
    form.setFieldsValue(record);
    setDimensions(record.dimensions || []);
    setFileList(record.image ? [{ uid: '-1', name: 'image.png', status: 'done', url: record.image }] : []);
    setEditingProduct(record);
    setModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this product?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          await axios.delete(`/api/products/${id}`);
          message.success('Product deleted successfully');
          fetchProducts();
        } catch (error) {
          console.error(error);
          message.error('Failed to delete product');
        }
      },
    });
  };

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();

      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('dimensions', JSON.stringify(dimensions));
      if (fileList[0]?.originFileObj) {
        formData.append('photo', fileList[0].originFileObj); // <-- Correct field name is 'photo'
      }

      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct._id}`, formData);
        message.success('Product updated successfully');
      } else {
        await axios.post('/api/products/upload', formData); // <-- Correct endpoint
        message.success('Product added successfully');
      }

      setModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error(error);
      message.error('Failed to save product');
    }
  };

  const handleDimensionAdd = () => {
    if (dimensionInput.trim() !== '') {
      setDimensions([...dimensions, dimensionInput.trim()]);
      setDimensionInput('');
    } else {
      message.warning('Dimension cannot be empty');
    }
  };

  const handleDimensionRemove = (index) => {
    const updatedDimensions = [...dimensions];
    updatedDimensions.splice(index, 1);
    setDimensions(updatedDimensions);
  };

  const uploadProps = {
    onRemove: () => setFileList([]),
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    fileList,
    listType: 'picture',
    maxCount: 1,
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (text) =>
        text ? <img src={text} alt="product" style={{ width: 80, height: 80, objectFit: 'cover' }} /> : 'No Image',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text) => <span>{text.length > 50 ? text.substring(0, 50) + '...' : text}</span>,
    },
    {
      title: 'Dimensions',
      dataIndex: 'dimensions',
      key: 'dimensions',
      render: (dims) => (
        <ul style={{ paddingLeft: '20px' }}>
          {dims?.map((dim, index) => (
            <li key={index}>{dim}</li>
          ))}
        </ul>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            style={{ marginRight: 8 }}
            onClick={() => handleEditProduct(record)}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteProduct(record._id)}
          />
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: '16px' }}
        onClick={handleAddProduct}
      >
        Add Product
      </Button>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table columns={columns} dataSource={products} rowKey="_id" />
      )}

      <Modal
        open={modalOpen}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        okText={editingProduct ? 'Update' : 'Add'}
        cancelText="Cancel"
        onCancel={() => setModalOpen(false)}
        onOk={handleFormSubmit}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: 'Please enter product name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item label="Dimensions">
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <Input
                placeholder="Enter dimension"
                value={dimensionInput}
                onChange={(e) => setDimensionInput(e.target.value)}
              />
              <Button type="primary" onClick={handleDimensionAdd}>
                Add
              </Button>
            </div>
            <ul>
              {dimensions.map((dim, index) => (
                <li key={index}>
                  {dim}{' '}
                  <Button
                    size="small"
                    type="text"
                    danger
                    onClick={() => handleDimensionRemove(index)}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </Form.Item>

          <Form.Item label="Product Image">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductTable;
