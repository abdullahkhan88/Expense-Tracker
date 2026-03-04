import { SearchOutlined } from "@ant-design/icons";
import { Card, Input, message, Switch, Table, Tag, } from "antd";
import http from "../../../utils/http";
import useSWR, { mutate } from "swr";
import { useState, useEffect } from "react";
import fetcher from "../../../utils/fetcher";
import { Spin } from "antd";



const Users = () => {


  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const { data: users, isLoading } = useSWR(
    "/api/user/get",
    fetcher
  );

  // ================= STATUS DATA =================
  const onStatus = async (record) => {
    try {
      setLoading(true)
      await http.put(`/api/user/status/${record._id}`, { status: !record.status });
      message.success('status updated successfully');
      mutate('/api/user/get');
    } catch (error) {
      message.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  // ================= FILTERED DATA =================
  const filteredData = users?.data?.filter(item =>
    Object.values(item || {})
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );



  // search pe loading dekhane ke liye
  useEffect(() => {
    if (!search) {
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);

    const timer = setTimeout(() => {
      setSearchLoading(false);
    }, 400); // 400ms smooth UX

    return () => clearTimeout(timer);
  }, [search]);


  // ================= TABLE COLUMNS =================
  const columns = [
    {
      title: "Fullname",
      dataIndex: "fullname",
      key: "fullname",
      className: "capitalize"
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      className: "capitalize"
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
      className: "capitalize"
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      className: "capitalize",
      render: (status, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          
          <Switch
            checked={status}
            onChange={() => onStatus(record)}
            loading={loading}
            size="small"
            style={{
            backgroundColor: status ? "green" : "red"
  }}
          />
          <Tag color={status ? "green" : "red"}>
            {status ? "Active" : "Inactive"}
          </Tag>
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
              suffix={searchLoading && <Spin size="small" />}
            />
          </div>
        }
      >
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={filteredData}
          scroll={{ x: "max-content" }}
          loading={isLoading}
        />
      </Card>
    </div>
  );
};

export default Users;