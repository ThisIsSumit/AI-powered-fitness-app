import { 
    Box, 
    Button, 
    FormControl, 
    InputLabel, 
    MenuItem, 
    Select, 
    TextField,
    Alert,
    CircularProgress,
    Paper,
    Typography,
    Fade
} from '@mui/material';
import { Add as AddIcon, FitnessCenter } from '@mui/icons-material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createActivity, clearError } from '../store/activitiesSlice';

const ActivityForm = () => {
    const dispatch = useDispatch();
    const { addingActivity, error } = useSelector(state => state.activities);
    
    const [activity, setActivity] = useState({
        type: "RUNNING", 
        duration: '', 
        caloriesBurned: '',
        additionalMetrics: {}
    });

    const [formErrors, setFormErrors] = useState({});

    const validateForm = () => {
        const errors = {};
        if (!activity.duration || activity.duration <= 0) {
            errors.duration = 'Duration must be greater than 0';
        }
        if (!activity.caloriesBurned || activity.caloriesBurned <= 0) {
            errors.caloriesBurned = 'Calories must be greater than 0';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        try {
            await dispatch(createActivity({
                ...activity,
                duration: parseInt(activity.duration),
                caloriesBurned: parseInt(activity.caloriesBurned)
            })).unwrap();
            
            // Reset form on success
            setActivity({ 
                type: "RUNNING", 
                duration: '', 
                caloriesBurned: '', 
                additionalMetrics: {} 
            });
            setFormErrors({});
        } catch (error) {
            console.error('Failed to add activity:', error);
        }
    };

    const handleInputChange = (field, value) => {
        setActivity(prev => ({ ...prev, [field]: value }));
        // Clear field error when user starts typing
        if (formErrors[field]) {
            setFormErrors(prev => ({ ...prev, [field]: null }));
        }
        // Clear global error
        if (error) {
            dispatch(clearError());
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <FitnessCenter sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" component="h2">
                    Add New Activity
                </Typography>
            </Box>

            {error && (
                <Fade in={!!error}>
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
                        {error}
                    </Alert>
                </Fade>
            )}

            <Box component="form" onSubmit={handleSubmit}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Activity Type</InputLabel>
                    <Select
                        value={activity.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        disabled={addingActivity}
                    >
                        <MenuItem value="RUNNING">🏃‍♂️ Running</MenuItem>
                        <MenuItem value="WALKING">🚶‍♂️ Walking</MenuItem>
                        <MenuItem value="CYCLING">🚴‍♂️ Cycling</MenuItem>
                        <MenuItem value="SWIMMING">🏊‍♂️ Swimming</MenuItem>
                        <MenuItem value="WEIGHTLIFTING">🏋️‍♂️ Weight Lifting</MenuItem>
                        <MenuItem value="YOGA">🧘‍♀️ Yoga</MenuItem>
                    </Select>
                </FormControl>

                <TextField 
                    fullWidth
                    label="Duration (Minutes)"
                    type='number'
                    sx={{ mb: 2 }}
                    value={activity.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    error={!!formErrors.duration}
                    helperText={formErrors.duration}
                    disabled={addingActivity}
                    inputProps={{ min: 1, max: 1440 }}
                />

                <TextField 
                    fullWidth
                    label="Calories Burned"
                    type='number'
                    sx={{ mb: 3 }}
                    value={activity.caloriesBurned}
                    onChange={(e) => handleInputChange('caloriesBurned', e.target.value)}
                    error={!!formErrors.caloriesBurned}
                    helperText={formErrors.caloriesBurned}
                    disabled={addingActivity}
                    inputProps={{ min: 1, max: 5000 }}
                />

                <Button 
                    type='submit' 
                    variant='contained' 
                    size="large"
                    startIcon={addingActivity ? <CircularProgress size={20} /> : <AddIcon />}
                    disabled={addingActivity || !activity.duration || !activity.caloriesBurned}
                    sx={{ 
                        minWidth: 140,
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                    }}
                >
                    {addingActivity ? 'Adding...' : 'Add Activity'}
                </Button>
            </Box>
        </Paper>
    );
};

export default ActivityForm;