import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
    Box, 
    Card, 
    CardContent, 
    Divider, 
    Typography, 
    Button,
    Skeleton,
    Alert,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    Container,
    Fade
} from '@mui/material';
import { 
    ArrowBack, 
    CheckCircleOutline, 
    LightbulbOutlined, 
    SecurityOutlined,
    TrendingUpOutlined,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { fetchActivityDetail, clearCurrentActivity, removeActivity } from '../store/activitiesSlice';

const ActivityDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const { currentActivity, fetchingDetail, error } = useSelector(state => state.activities);
    const { token, isAuthenticated } = useSelector(state => state.auth);

    // Debug logging
    console.log('ActivityDetail state:', { 
        currentActivity, 
        fetchingDetail, 
        error, 
        id,
        isAuthenticated,
        hasToken: !!token 
    });

    // Additional debug for the current activity structure
    if (currentActivity) {
        console.log('Current activity structure:', {
            keys: Object.keys(currentActivity),
            hasRecommendation: !!currentActivity.recommendation,
            hasImprovements: !!currentActivity.improvements,
            hasSuggestions: !!currentActivity.suggestions,
            hasSafety: !!currentActivity.safety,
            activityType: currentActivity.activityType,
            activityId: currentActivity.activityId
        });
    }

    useEffect(() => {
        // Only fetch activity detail if we have authentication and an ID
        if (id && isAuthenticated && token) {
            console.log('Fetching activity detail for ID:', id); // Debug log
            dispatch(fetchActivityDetail(id));
        }
    }, [id, dispatch, isAuthenticated, token]);

    // Separate useEffect for cleanup to avoid clearing activity prematurely
    useEffect(() => {
        return () => {
            // Only clear when component is truly unmounting, not on re-renders
            dispatch(clearCurrentActivity());
        };
    }, [dispatch]);

    const handleGoBack = () => {
        navigate('/activities');
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this activity?')) {
            try {
                await dispatch(removeActivity(id)).unwrap();
                navigate('/activities'); // Navigate back after successful deletion
            } catch (error) {
                console.error('Failed to delete activity:', error);
            }
        }
    };

    if (fetchingDetail) {
        return (
            <Container maxWidth="md">
                <Box sx={{ mb: 2 }}>
                    <Skeleton variant="rectangular" height={40} width={120} />
                </Box>
                <Card sx={{ mb: 2 }}>
                    <CardContent>
                        <Skeleton variant="text" height={32} />
                        <Skeleton variant="text" />
                        <Skeleton variant="text" />
                        <Skeleton variant="text" />
                        <Skeleton variant="text" width="60%" />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <Skeleton variant="text" height={32} />
                        <Skeleton variant="rectangular" height={200} />
                    </CardContent>
                </Card>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md">
                <Alert severity="error" sx={{ mb: 2 }}>
                    Failed to load activity details: {error}
                </Alert>
                <Button onClick={handleGoBack} startIcon={<ArrowBack />}>
                    Back to Activities
                </Button>
            </Container>
        );
    }

    if (!currentActivity) {
        return (
            <Container maxWidth="md">
                <Alert severity="info" sx={{ mb: 2 }}>
                    Activity not found
                </Alert>
                <Button onClick={handleGoBack} startIcon={<ArrowBack />}>
                    Back to Activities
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Fade in={true}>
                <Box>
                    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton 
                            onClick={handleGoBack}
                            sx={{ 
                                backgroundColor: 'primary.main',
                                color: 'white',
                                '&:hover': { backgroundColor: 'primary.dark' }
                            }}
                        >
                            <ArrowBack />
                        </IconButton>
                        <IconButton 
                            onClick={handleDelete}
                            sx={{ 
                                backgroundColor: 'error.main',
                                color: 'white',
                                '&:hover': { backgroundColor: 'error.dark' }
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                        <Typography variant="h4" sx={{ fontWeight: 600 }}>
                            Activity Details
                        </Typography>
                    </Box>

                    <Card sx={{ mb: 3, borderRadius: 2 ,display: 'flex', flexDirection: 'column'}} elevation={3}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                                    {/* Handle both type and activityType fields */}
                                    {(currentActivity.activityType || currentActivity.type || 'Activity').charAt(0) + 
                                     (currentActivity.activityType || currentActivity.type || 'Activity').slice(1).toLowerCase()}
                                </Typography>
                                <Chip 
                                    label="Completed" 
                                    color="success" 
                                    icon={<CheckCircleOutline />}
                                />
                            </Box>
                            
                            
                              
                            <Box>
                                    <Typography color="text.secondary" variant="body2">Date</Typography>
                                    <Typography variant="h6">
                                        {new Date(currentActivity.createdAt).toLocaleDateString()}
                                    </Typography>
                                </Box>

                            </CardContent>
                        </Card>

                    {currentActivity.recommendation && (
                        <Card elevation={3} sx={{ borderRadius: 2 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                                    <TrendingUpOutlined sx={{ mr: 1, color: 'primary.main' }} />
                                    AI-Powered Fitness Analysis
                                </Typography>
                                
                                <Typography variant="h6" gutterBottom>Detailed Analysis & Recommendations</Typography>
                                <Box sx={{ backgroundColor: 'grey.50', p: 3, borderRadius: 2, mb: 3 }}>
                                    {/* Split recommendation by sections and format them */}
                                    {currentActivity.recommendation.split('\n\n').map((section, index) => (
                                        <Box key={index} sx={{ mb: index < currentActivity.recommendation.split('\n\n').length - 1 ? 2 : 0 }}>
                                            {section.includes(':') ? (
                                                <Box>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
                                                        {section.split(':')[0]}:
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                                                        {section.split(':').slice(1).join(':').trim()}
                                                    </Typography>
                                                </Box>
                                            ) : (
                                                <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                                                    {section}
                                                </Typography>
                                            )}
                                        </Box>
                                    ))}
                                </Box>
                                
                                {currentActivity.improvements && currentActivity.improvements.length > 0 && (
                                    <>
                                        <Divider sx={{ my: 3 }} />
                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                            <TrendingUpOutlined sx={{ mr: 1, color: 'warning.main' }} />
                                            Areas for Improvement
                                        </Typography>
                                        <List dense sx={{ backgroundColor: 'warning.light', borderRadius: 2, p: 1 }}>
                                            {currentActivity.improvements.map((improvement, index) => (
                                                <ListItem key={index} sx={{ mb: 1 }}>
                                                    <ListItemIcon>
                                                        <TrendingUpOutlined color="warning" fontSize="small" />
                                                    </ListItemIcon>
                                                    <ListItemText 
                                                        primary={improvement} 
                                                        primaryTypographyProps={{ variant: 'body2', lineHeight: 1.5 }}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </>
                                )}
                                
                                {currentActivity.suggestions && currentActivity.suggestions.length > 0 && (
                                    <>
                                        <Divider sx={{ my: 3 }} />
                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                            <LightbulbOutlined sx={{ mr: 1, color: 'info.main' }} />
                                            Workout Suggestions
                                        </Typography>
                                        <List dense sx={{ backgroundColor: 'info.light', borderRadius: 2, p: 1 }}>
                                            {currentActivity.suggestions.map((suggestion, index) => (
                                                <ListItem key={index} sx={{ mb: 1 }}>
                                                    <ListItemIcon>
                                                        <LightbulbOutlined color="info" fontSize="small" />
                                                    </ListItemIcon>
                                                    <ListItemText 
                                                        primary={suggestion} 
                                                        primaryTypographyProps={{ variant: 'body2', lineHeight: 1.5 }}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </>
                                )}
                                
                                {currentActivity.safety && currentActivity.safety.length > 0 && (
                                    <>
                                        <Divider sx={{ my: 3 }} />
                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                            <SecurityOutlined sx={{ mr: 1, color: 'error.main' }} />
                                            Safety Guidelines
                                        </Typography>
                                        <List dense sx={{ backgroundColor: 'error.light', borderRadius: 2, p: 1 }}>
                                            {currentActivity.safety.map((safety, index) => (
                                                <ListItem key={index} sx={{ mb: 1 }}>
                                                    <ListItemIcon>
                                                        <SecurityOutlined color="error" fontSize="small" />
                                                    </ListItemIcon>
                                                    <ListItemText 
                                                        primary={safety} 
                                                        primaryTypographyProps={{ variant: 'body2', lineHeight: 1.5 }}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </Box>
            </Fade>
        </Container>
    );
};

export default ActivityDetail;
