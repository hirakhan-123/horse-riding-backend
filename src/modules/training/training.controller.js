const trainingService = require('./training.service');

exports.createTraining = async (req, res) => {
    try {
        console.log('Request Body:', req.body)
        const training = await trainingService.createTraining(req.body);
        res.status(201).json(training);
    } catch (error) {
        res.status(400).json({ message: 'Error creating training session', error: error.message });
    }
};

exports.getAllTrainings = async (req, res) => {
    try {
        const trainings = await trainingService.getAllTrainings();
        res.status(200).json(trainings);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching training sessions', error: error.message });
    }
};

exports.getTrainingById = async (req, res) => {
    try {
        const training = await trainingService.getTrainingById(req.params.id);
        if (!training) {
            return res.status(404).json({ message: 'Training session not found' });
        }
        res.status(200).json(training);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching training session', error: error.message });
    }
};

exports.updateTraining = async (req, res) => {
    try {
        const training = await trainingService.updateTraining(req.params.id, req.body);
        if (!training) {
            return res.status(404).json({ message: 'Training session not found' });
        }
        res.status(200).json(training);
    } catch (error) {
        res.status(400).json({ message: 'Error updating training session', error: error.message });
    }
};

exports.deleteTraining = async (req, res) => {
    try {
        const training = await trainingService.deleteTraining(req.params.id);
        if (!training) {
            return res.status(404).json({ message: 'Training session not found' });
        }
        res.status(200).json({ message: 'Training session deleted' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting training session', error: error.message });
    }
};

exports.bookTraining = async (req, res) => {
    try {
        if (!req.user || !req.user.id || !req.user.name) {
            throw new Error('Invalid user data. Cannot book training.');
        }

        const rider = {
            riderId: req.user.id,
            riderName: req.user.name,
        };
        const updatedTraining = await trainingService.bookTraining(req.params.id, rider);
        res.status(200).json(updatedTraining);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
