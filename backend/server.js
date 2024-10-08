const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./src/Routes/authRoutes');
const taskRoutes = require('./src/Routes/taskRoutes');
const connectDB = require('./src/config/db');
const morgan = require('morgan');
const bcrypt = require('bcrypt');

dotenv.config();
console.log('JWT_SECRET:', process.env.JWT_SECRET);

const app = express();

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log('Request headers:', JSON.stringify(req.headers, null, 2));
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    next();
});

// الوسائط
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

connectDB().then(() => {
    console.log('تم الاتصال بقاعدة البيانات بنجاح');
}).catch((err) => {
    console.error('فشل الاتصال بقاعدة البيانات:', err);
});

// المسارات
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // التحقق من قوة كلمة المرور
        if (password.length < 8) {
            return res.status(400).json({ message: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل' });
        }

        // يمكنك إضافة المزيد من الشروط هنا، مثل التحقق من وجود أحرف كبيرة وصغيرة وأرقام

        // باقي الكود لإنشاء الحساب
        // ...
    } catch (error) {
        console.error('خطأ في التسجيل:', error);
        res.status(500).json({ message: 'حدث خطأ أثناء إنشاء الحساب' });
    }
});

// حذف مهمة
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: 'المهمة غير موجودة' });
        res.json({ message: 'تم حذف المهمة بنجاح' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'خطأ في الخادم' });
    }
});

// تعديل مهمة
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (!task) return res.status(404).json({ message: 'المهمة غير موجودة' });
        res.json(task);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'خطأ في الخادم' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`الخادم يعمل على المنفذ ${PORT}`));
