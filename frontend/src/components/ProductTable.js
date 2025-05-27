import React, { useState, useEffect } from 'react';
import { Table, Modal, Button, Form, Input, Upload, message, Spin, Checkbox } from 'antd';
import { PlusOutlined, UploadOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';

const { TextArea } = Input;

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();
  const [photo, setPhoto] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [dimensions, setDimensions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(4); // show only 4 products per page


  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
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
    setFileList(
      record.imageUrl
        ? [{
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: record.imageUrl
          }]
        : []
    );
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
          await axios.delete(`/api/products/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
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
      formData.append('price', values.price);
      formData.append('description', values.description);
      formData.append('dimensions', JSON.stringify(dimensions));
      if (photo) formData.append("photo", photo);
      

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('photo', fileList[0].originFileObj);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          // 'Content-Type': 'multipart/form-data',
        },
      };

      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct._id}`, formData, config);
        message.success('Product updated successfully');
      } else {
        await axios.post('/api/products/upload', formData, config);
        message.success('Product added successfully');
      }

      setModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error(error);
      message.error('Failed to save product');
    }
  };

  const handleDimensionChange = (index, field, value) => {
    const updated = [...dimensions];
    updated[index][field] = value;
    setDimensions(updated);
  };

  const handleAddDimensionRow = () => {
    setDimensions([
      ...dimensions,
      {
        ref: '',
        grade: '',
        length: '',
        width: '',
        height: '',
        recommendedFor: '',
        extraOptions: '',
      },
    ]);
  };

  const handleRemoveDimensionRow = (index) => {
    const updated = [...dimensions];
    updated.splice(index, 1);
    setDimensions(updated);
  };

  const uploadProps = {
    listType: 'picture-card',
    maxCount: 1,
    fileList,
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    onRemove: () => {
      setFileList([]);
    },
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (text) =>
        text ? <img src={text} alt="product" style={{ width: 80, height: 80, objectFit: 'cover' }} /> : 'No Image',
    },

    {/* Column title "Name" and filter functionality */},

    {
  title: 'Name',
  dataIndex: 'name',
  key: 'name',
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
    const uniqueNames = Array.from(new Set(products.map(p => p.name)));
    const [searchText, setSearchText] = React.useState('');

    const filteredNames = uniqueNames.filter(name =>
      name.toLowerCase().includes(searchText.toLowerCase())
    );

    const onCheckboxChange = (e, name) => {
      const checked = e.target.checked;
      if (checked) {
        setSelectedKeys([...selectedKeys, name]);
      } else {
        setSelectedKeys(selectedKeys.filter(k => k !== name));
      }
    };

    const onSelectAllChange = (e) => {
      const checked = e.target.checked;
      if (checked) {
        const allFiltered = filteredNames;
        setSelectedKeys(Array.from(new Set([...selectedKeys, ...allFiltered])));
      } else {
        setSelectedKeys(selectedKeys.filter(k => !filteredNames.includes(k)));
      }
    };

    const allSelected = filteredNames.every(name => selectedKeys.includes(name));
    const someSelected = filteredNames.some(name => selectedKeys.includes(name));

    return (
      <div style={{ padding: 8 }}>
        <Input
          placeholder="Search Name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Checkbox
          indeterminate={!allSelected && someSelected}
          checked={allSelected}
          onChange={onSelectAllChange}
          style={{ marginBottom: 8 }}
        >
          Select All
        </Checkbox>
        <div style={{ maxHeight: 200, overflowY: 'auto' }}>
          {filteredNames.map(name => (
            <div key={name}>
              <Checkbox
                checked={selectedKeys.includes(name)}
                onChange={(e) => onCheckboxChange(e, name)}
              >
                {name}
              </Checkbox>
            </div>
          ))}
        </div>
        <Button
          type="primary"
          onClick={() => confirm()}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Apply
        </Button>
         <Button
  onClick={() => {
    setSelectedKeys([]);        // Clear selected filter values
    setSearchText('');          // Clear search input
  }}
  size="small"
  style={{ width: 90 }}
>
  Reset
</Button>

      </div>
    );
  },
  filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
  onFilter: (value, record) => record.name === value,
},


    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
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
            <li key={index}>{`${dim.ref} | ${dim.grade} | ${dim.length}x${dim.width}x${dim.height}`}</li>
          ))}
        </ul>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button icon={<EditOutlined />} style={{ marginRight: 8 }} onClick={() => handleEditProduct(record)} />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDeleteProduct(record._id)} />
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: '16px' }} onClick={handleAddProduct}>
        Add Product
      </Button>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table columns={columns} dataSource={products} rowKey="_id" pagination={{
    current: currentPage,
    pageSize: pageSize,
    onChange: (page) => setCurrentPage(page),
  }} />

      )}

      <Modal
        open={modalOpen}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        okText={editingProduct ? 'Update' : 'Add'}
        cancelText="Cancel"
        onCancel={() => setModalOpen(false)}
        onOk={handleFormSubmit}
        destroyOnClose
        width={1000}
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
            name="price"
            label="Product Price"
            rules={[{ required: true, message: 'Please enter product price' }]}
          >
            <Input type="number" placeholder="Enter price" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item><input
          type="file"
          className="form-control mb-2"
          onChange={(e) => setPhoto(e.target.files[0])}
        /></Form.Item>

          <Form.Item label="Dimensions">
            <Button type="dashed" onClick={handleAddDimensionRow} block icon={<PlusOutlined />}>
              Add Dimension Row
            </Button>
            <Table
              dataSource={dimensions}
              pagination={false}
              rowKey={(record, index) => index}
              style={{ marginTop: 16 }}
              size="small"
            >
              <Table.Column title="Ref" dataIndex="ref" render={(text, _, index) => (
                <Input value={text} onChange={(e) => handleDimensionChange(index, 'ref', e.target.value)} />
              )} />
              <Table.Column title="Grade" dataIndex="grade" render={(text, _, index) => (
                <Input value={text} onChange={(e) => handleDimensionChange(index, 'grade', e.target.value)} />
              )} />
              <Table.Column title="Length" dataIndex="length" render={(text, _, index) => (
                <Input value={text} onChange={(e) => handleDimensionChange(index, 'length', e.target.value)} />
              )} />
              <Table.Column title="Width" dataIndex="width" render={(text, _, index) => (
                <Input value={text} onChange={(e) => handleDimensionChange(index, 'width', e.target.value)} />
              )} />
              <Table.Column title="Height" dataIndex="height" render={(text, _, index) => (
                <Input value={text} onChange={(e) => handleDimensionChange(index, 'height', e.target.value)} />
              )} />
              <Table.Column title="Action" render={(_, __, index) => (
                <Button danger onClick={() => handleRemoveDimensionRow(index)}>Remove</Button>
              )} />
            </Table>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductTable;
