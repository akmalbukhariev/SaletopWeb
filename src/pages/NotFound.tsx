import { Typography, Button } from '@mui/material'
import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <div className="text-center space-y-4">
      <Typography variant="h5">Page not found</Typography>
      <Button variant="outlined" component={Link} to="/">Go Home</Button>
    </div>
  )
}
