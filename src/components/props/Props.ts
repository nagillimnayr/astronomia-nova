export type ClassNameProp = {
  className?: string;
};
export type CommonProps = ClassNameProp & {
  children?: React.ReactNode;
};

export type LinkProps = CommonProps & {
  href: string;
};
