import { 
  Card, 
  CardContent, 
  Grid, 
  Typography, 
  Box,
  Skeleton,
  Alert,
  Chip,
  CardActionArea,
  Fade,
  Container
} from '@mui/material';
import { 
  DirectionsRun, 
  DirectionsWalk, 
  DirectionsBike,
  Pool,
  FitnessCenter,
  SelfImprovement,
  LocalFireDepartment,
  AccessTime 
} from '@mui/icons-material';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivities } from '../store/activitiesSlice';

const getActivityIcon = (type) => {
  const icons = {
      RUNNING: <DirectionsRun />,
      WALKING: <DirectionsWalk />,
      CYCLING: <DirectionsBike />,
      SWIMMING: <Pool />,
      WEIGHT_TRAINING: <FitnessCenter />,
      YOGA: <SelfImprovement />
  };
  return icons[type] || <FitnessCenter />;
};

const getActivityColor = (type) => {
  const colors = {
      RUNNING: '#FF6B6B',
      WALKING: '#4ECDC4',
      CYCLING: '#45B7D1',
      SWIMMING: '#96CEB4',
      WEIGHT_TRAINING: '#FFEAA7',
      YOGA: '#DDA0DD'
  };
  return colors[type] || '#95E1D3';
};
const ActivityCard = ({ activity }) => {
  const navigate = useNavigate();
  
  // Add safety check for activity prop
  if (!activity || !activity.id) {
    console.warn('ActivityCard received invalid activity:', activity);
    return null;
  }
  
  console.log('Rendering ActivityCard for activity:', activity);
  
  return (
      <Fade in={true} timeout={500}>
          <Card 
              sx={{ 
                  height: '100%',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': { 
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                      cursor: 'pointer'
                  },
                  borderLeft: `4px solid ${getActivityColor(activity.type || 'UNKNOWN')}`,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
              }}
              onClick={() => navigate(`/activities/${activity.id}`)}
              
          >
              <CardActionArea sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Box 
                              sx={{ 
                                  color: getActivityColor(activity.type || 'UNKNOWN'),
                                  mr: 1,
                                  display: 'flex'
                              }}
                          >
                              {getActivityIcon(activity.type || 'UNKNOWN')}
                          </Box>
                          <Typography variant='h6' sx={{ fontWeight: 600 }}>
                              {activity.type ? activity.type.charAt(0) + activity.type.slice(1).toLowerCase() : 'Unknown Activity'}
                          </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <AccessTime sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                  {activity.duration || 0} minutes
                              </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <LocalFireDepartment sx={{ fontSize: 16, mr: 1, color: '#FF6B6B' }} />
                              <Typography variant="body2" color="text.secondary">
                                  {activity.caloriesBurned || 0} calories
                              </Typography>
                          </Box>
                      </Box>
                      
                      {activity.createdAt && (
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                              {new Date(activity.createdAt).toLocaleDateString()}
                          </Typography>
                      )}
                  </CardContent>
              </CardActionArea>
          </Card>
      </Fade>
  );
};

ActivityCard.propTypes = {
  activity: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired,
    duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    caloriesBurned: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
  }).isRequired,
};


const ActivityList = () => {
  const dispatch = useDispatch();
  const { activities, loading, error } = useSelector(state => state.activities);
  const { token, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
      // Only fetch activities if we have a token and are authenticated
      if (isAuthenticated && token) {
        dispatch(fetchActivities());
      }
  }, [dispatch, isAuthenticated, token]);

  if (loading) {
      return (
          <Container>
              <Grid container spacing={3}>
                  {[...Array(6)].map((_, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                          <Card>
                              <CardContent>
                                  <Skeleton variant="rectangular" height={20} sx={{ mb: 1 }} />
                                  <Skeleton variant="text" />
                                  <Skeleton variant="text" />
                                  <Skeleton variant="text" width="60%" />
                              </CardContent>
                          </Card>
                      </Grid>
                  ))}
              </Grid>
          </Container>
      );
  }

  if (error) {
      return (
          <Alert severity="error" sx={{ mb: 2 }}>
              Failed to load activities: {error}
          </Alert>
      );
  }

  if (!(activities?.length)) {
      return (
          <Box sx={{ textAlign: 'center', py: 6 }}>
              <FitnessCenter sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                  No activities yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                  Add your first activity above to get started!
              </Typography>
          </Box>
      );
  }

  return (
      <Container>
          <Box sx={{ mb: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  Your Activities
              </Typography>
              <Chip 
                  label={`${(activities || []).length} activities`} 
                  color="primary" 
                  variant="outlined" 
              />
          </Box>
          
          <Grid container spacing={3}>
              {(activities || [])
                .filter(activity => activity && activity.id) // Filter out invalid activities
                .map((activity) => (
                  <Grid item xs={12} sm={6} md={4} key={activity.id}>
                      <ActivityCard activity={activity} />
                  </Grid>
              ))}
          </Grid>
      </Container>
  );
};

export default ActivityList;