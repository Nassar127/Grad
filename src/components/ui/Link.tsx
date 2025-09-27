import { Link as RouterLink, LinkProps } from 'react-router-dom';

export const Link: React.FC<LinkProps> = (props) => {
  const isExternal = typeof props.to === 'string' && props.to.startsWith('http');

  if (isExternal) {
    return <a href={props.to as string} target="_blank" rel="noopener noreferrer" {...props}>{props.children}</a>;
  }

  return <RouterLink {...props} />;
};