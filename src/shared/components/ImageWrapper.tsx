import { Box } from "@mui/material" 
import { ImageProps } from "@shared/types/ImageProps" 
const ImageWrapper = ({
  src,
  alt = "",
  styleBox = {},
  styleImg = {},
  onClick = () => {},
  loading = "lazy",
}: ImageProps) => {
  const defaultPath = "/images/" 
  return (
    <Box sx={styleBox}>
      <img
        src={`${defaultPath}${src}`}
        alt={alt}
        loading={loading}
        style={styleImg}
        onClick={onClick}
        // onError={(e) => {
        //   e.currentTarget.src = `${defaultPath}default-image.png` 
        // }}
      />
    </Box>
  ) 
} 

export default ImageWrapper 
