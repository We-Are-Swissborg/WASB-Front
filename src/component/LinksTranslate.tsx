interface Link {
  href: string,
  title: string,
  children?: string
}

export const LinkText = (props: Link) => {
  return (
      <a href={props.href || '#'} className="text-secondary" target="_blank" title={props.title || ''}>
          {props.children}
      </a>
  );
};