import { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Paper,
  CssBaseline
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/system';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#4a148c',  // Deep purple
    },
    secondary: {
      main: '#ff6f00',  // Amber
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      'Poppins',
      'Roboto',
      'Arial',
      'sans-serif'
    ].join(','),
    h3: {
      fontWeight: 600,
      letterSpacing: '0.5px',
    },
  },
});

// Styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  background: 'linear-gradient(145deg, #ffffff, #f7f7f7)',
  border: '1px solid rgba(0,0,0,0.05)',
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #4a148c 30%, #7c43bd 90%)',
  color: 'white',
  height: '50px',
  fontSize: '1rem',
  fontWeight: 600,
  letterSpacing: '0.5px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 12px rgba(74, 20, 140, 0.3)',
  },
}));

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post("http://localhost:8080/api/email/generate", {
        emailContent,
        tone
      });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (error) {
      setError('Failed to generate reply. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <StyledContainer maxWidth="md">
        <StyledPaper elevation={3}>
          <Box textAlign="center" mb={4}>
            <Typography variant='h3' component="h1" gutterBottom sx={{ 
              background: 'linear-gradient(45deg, #4a148c, #7c43bd)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700
            }}>
              Email Reply Generator
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              AI-powered email responses tailored to your needs
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={6}
              variant="outlined"
              label="Original Email Content"
              value={emailContent || ''}
              onChange={(e) => setEmailContent(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                style: {
                  borderRadius: '12px',
                  fontSize: '1rem'
                }
              }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Tone (Optional)</InputLabel>
              <Select
                value={tone || ''}
                label="Tone (Optional)"
                onChange={(e) => setTone(e.target.value)}
                sx={{
                  borderRadius: '12px',
                }}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="professional">Professional</MenuItem>
                <MenuItem value="friendly">Friendly</MenuItem>
                <MenuItem value="casual">Casual</MenuItem>
              </Select>
            </FormControl>

            <GradientButton
              onClick={handleSubmit}
              disabled={!emailContent || loading}
              fullWidth
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Generate Reply"}
            </GradientButton>
          </Box>

          {error && (
            <Box textAlign="center" my={2}>
              <Typography color="error" sx={{ 
                padding: '10px',
                background: '#ffeeee',
                borderRadius: '8px',
                fontWeight: 500
              }}>
                {error}
              </Typography>
            </Box>
          )}

          {generatedReply && (
            <Box sx={{ mt: 4, animation: 'fadeIn 0.5s ease' }}>
              <Typography variant='h6' gutterBottom sx={{ fontWeight: 600, color: '#4a148c' }}>
                Generated Reply:
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={6}
                variant="outlined"
                value={generatedReply || ''}
                inputProps={{ readOnly: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    background: '#f9f9f9',
                  }
                }}
              />
              <Button
                variant='contained'
                sx={{ 
                  mt: 2,
                  background: 'linear-gradient(45deg, #ff6f00 30%, #ff9d3f 90%)',
                  color: 'white',
                  fontWeight: 600
                }}
                onClick={() => navigator.clipboard.writeText(generatedReply)}
              >
                Copy to Clipboard
              </Button>
            </Box>
          )}
        </StyledPaper>
        
        <Box mt={4} textAlign="center">
          <Typography variant="body2" color="textSecondary">
            Powered by AI • Secure and private
          </Typography>
        </Box>
      </StyledContainer>
    </ThemeProvider>
  );
}

export default App;
