export type ImageProps ={
   id?: string;
   src: string;
   alt?: string;
   styleBox?: React.CSSProperties;
   styleImg?: React.CSSProperties;
   onClick?: (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => void;
   loading?: 'lazy' | 'eager';
}