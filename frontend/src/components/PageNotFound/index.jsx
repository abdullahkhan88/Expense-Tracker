import React from 'react';
import { Result } from 'antd';
import { Link } from 'react-router-dom';
const PageNotFound = () => (
  <Result
    status="403"
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={<Link to="/">Back Home</Link>}
  />
);
export default PageNotFound;