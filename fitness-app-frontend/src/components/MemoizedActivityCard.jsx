import React, { memo } from 'react';
import { Card, CardContent, Typography, Box, CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ActivityCard = memo(({ activity }) => {
  const navigate = useNavigate();
  
  const handleClick = React.useCallback(() => {
    navigate(`/activities/${activity.id}`);
  }, [navigate, activity.id]);
  
  return (
    <Card onClick={handleClick}>
      <CardActionArea>
        <CardContent>
          <Typography variant='h6'>{activity.type}</Typography>
          <Typography>Duration: {activity.duration}</Typography>
          <Typography>Calories: {activity.caloriesBurned}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
});

ActivityCard.displayName = 'ActivityCard';

export default ActivityCard;