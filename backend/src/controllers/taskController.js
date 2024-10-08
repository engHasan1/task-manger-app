const Task = require('../Models/Task');

exports.createTask = async (req, res) => {
    try {
        console.log('Received task data:', req.body);
        console.log('User ID from request:', req.user.userId);

        const { title, description, status } = req.body;
        const task = new Task({
            title,
            description,
            status: status || 'scheduled',
            userId: req.user.userId
        });
        console.log('Created task object:', task);

        const savedTask = await task.save();
        console.log('Task saved:', savedTask);
        res.status(201).json(savedTask);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(400).json({ message: 'فشل في إنشاء المهمة', error: error.message });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.userId });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'فشل في استرجاع المهام', error: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.userId },
            req.body,
            { new: true }
        );
        if (!task) return res.status(404).json({ message: 'المهمة غير موجودة' });
        res.json(task);
    } catch (error) {
        res.status(400).json({ message: 'فشل في تحديث المهمة', error: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
        if (!task) return res.status(404).json({ message: 'المهمة غير موجودة' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'فشل في حذف المهمة', error: error.message });
    }
};
