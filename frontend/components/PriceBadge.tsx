import { Badge } from 'antd';
import { BadgeProps } from 'antd/lib/badge';

const PriceBadge = (props: BadgeProps) => {
  return (
    <Badge
      {...props}
      style={{
        backgroundColor: '#fff',
        color: 'rgba(0, 0, 0, 0.65)',
        boxShadow: '0 0 0 1px #d9d9d9 inset',
        ...props.style
      }}
    />
  );
};

export default PriceBadge;
