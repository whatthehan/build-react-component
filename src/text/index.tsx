import { FC } from 'react';

interface TextProps {
  color: string;
}

const Text: FC<TextProps> = ({ color, children }) => {
  return <span style={{ color }}>{children}</span>;
};

export default Text;
