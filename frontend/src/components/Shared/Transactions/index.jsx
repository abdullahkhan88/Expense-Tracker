import { DeleteOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, message, Modal, Popconfirm, Select, Table, Tag } from "antd";
import http from "../../../utils/http";
import useSWR, { mutate } from "swr";
import { useState } from "react";
import fetcher from "../../../utils/fetcher";

const { Item } = Form;

const Transaction = () => {

  const [transactionForm] = Form.useForm();
  const [edit, setEdit] = useState(null);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const { data: transaction, isLoading } = useSWR(
    "/api/transaction/fetch",
    fetcher
  );

  // ================= CREATE =================
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const { data } = await http.post('/api/transaction/create', values);
      message.success(data?.message);
      mutate("/api/transaction/fetch");
      transactionForm.resetFields();
      closeModal();
    } catch (err) {
      message.error(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= UPDATE =================
  const onUpdate = async (values) => {
    try {
      setLoading(true);
      const { data } = await http.put(`/api/transaction/update/${edit._id}`, values);
      message.success(data?.message);
      mutate("/api/transaction/fetch");
      closeModal();
      transactionForm.resetFields();
    } catch (err) {
      message.error(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const onDelete = async (id) => {
    try {
      setLoading(true);
      const { data } = await http.delete(`/api/transaction/delete/${id}`);
      message.success(data?.message);
      mutate("/api/transaction/fetch");
    } catch (err) {
      message.error(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const onEditTransaction = (obj) => {
    setEdit(obj);
    transactionForm.setFieldsValue(obj);
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
    setEdit(null);
    transactionForm.resetFields();
  };

  // ================= FILTERED DATA =================
  const filteredData = transaction?.data?.filter(item =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // ================= SUMMARY =================
  const totalCredit = filteredData
    ?.filter(item => item.transactionType === "cr")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalDebit = filteredData
    ?.filter(item => item.transactionType === "dr")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const balance = totalCredit - totalDebit;

  // ================= TABLE COLUMNS =================
  const columns = [
    {
      title: "Type",
      dataIndex: "transactionType",
      key: "transactionType",
      render: (text) => {
        const color = text === "cr" ? "green" : "red";
        return (
          <Tag color={color}>
            {text === "cr" ? "Credit" : "Debit"}
          </Tag>
        );
      }
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      className: "capitalize"
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount, record) => {
        const isCredit = record.transactionType === "cr";
        return (
          <span style={{
            color: isCredit ? "green" : "red",
            fontWeight: "600"
          }}>
            {isCredit ? "+ ₹" : "- ₹"} {Number(amount).toLocaleString()}
          </span>
        );
      }
    },
    {
      title: "Payment",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      className: "capitalize"
    },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
      className: "capitalize"
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) =>
        new Date(date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric"
        })
    },
    {
      title: "Action",
      key: "action",
      render: (_, obj) => (
        <div className="flex gap-1">
          <Button
            type="text"
            className="!bg-green-100 !text-green-500"
            icon={<EditOutlined />}
            onClick={() => onEditTransaction(obj)}
          />
          <Popconfirm
            title="Delete this transaction?"
            onConfirm={() => onDelete(obj._id)}
          >
            <Button
              type="text"
              className="!bg-rose-100 !text-rose-500"
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </div>
      )
    },
  ];

  return (
    <div>
      <Card
        title="Transaction List"
        extra={
          <div className="flex flex-col md:flex-row gap-3">
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              type="primary"
              onClick={() => {
                setEdit(null);
                transactionForm.resetFields();
                setModal(true);
              }}
            >
              Add Transaction
            </Button>
          </div>
        }
      >

        {/* SUMMARY */}
        <div className="flex gap-6 mb-4 font-semibold">
          <span className="text-green-600">
            Total Credit: ₹ {totalCredit || 0}
          </span>
          <span className="text-red-600">
            Total Debit: ₹ {totalDebit || 0}
          </span>
          <span>
            Balance: ₹ {balance || 0}
          </span>
        </div>

        <Table
          rowKey="_id"
          columns={columns}
          dataSource={filteredData}
          scroll={{ x: "max-content" }}
          loading={isLoading}
        />
      </Card>

      {/* MODAL */}
      <Modal
        open={modal}
        onCancel={closeModal}
        title={edit ? "Update Transaction" : "Add Transaction"}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={edit ? onUpdate : onFinish}
          form={transactionForm}
        >
          <div className="grid md:grid-cols-2 gap-x-3">
            <Item
              label="Transaction Type"
              name="transactionType"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Select type"
                options={[
                  { label: "Credit", value: "cr" },
                  { label: "Debit", value: "dr" }
                ]}
              />
            </Item>

            <Item
              label="Amount"
              name="amount"
              rules={[{ required: true }]}
            >
              <Input type="number" placeholder="Enter amount" />
            </Item>

            <Item
              label="Title"
              name="title"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter title" />
            </Item>

            <Item
              label="Payment Method"
              name="paymentMethod"
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { label: "Cash", value: "cash" },
                  { label: "Online", value: "online" }
                ]}
              />
            </Item>
          </div>

          <Item
            label="Notes"
            name="notes"
            rules={[{ required: true }]}
          >
            <Input.TextArea />
          </Item>

          <Item className="flex justify-end">
            <Button
              loading={loading}
              type="primary"
              danger={edit ? true : false}
              htmlType="submit"
              
            >
              {edit ? "Update" : "Submit"}
            </Button>
          </Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Transaction;