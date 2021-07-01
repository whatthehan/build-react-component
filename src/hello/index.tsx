import { FC } from 'react';
// import { Button } from 'antd';
import './style.less';

interface HelloProps {
  text: string;
}

const Hello: FC<HelloProps> = ({ text }) => {
  return <h1 className="hello">{/*<Button type="primary">{text}</Button>*/}</h1>;
};

export default Hello;
