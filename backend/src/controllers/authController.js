const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

console.log('bcrypt version:', bcrypt.version);

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log('Registering user:', { username, email });
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'البريد الإلكتروني مستخدم بالفعل' });
        }
        console.log('Password before hashing:', password);
        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 12);
        console.log('Hashed password:', hashedPassword);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        console.log('User saved:', user);
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({
            message: 'تم إنشاء الحساب بنجاح',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({ message: 'فشل في إنشاء الحساب', error: error.message });
    }
};
//yeniiii
exports.login = async (req, res) => {
    try {
        console.log('Login request received:', req.body);
        const { email, password } = req.body;
        console.log('Login attempt for email:', email);

        const user = await User.findOne({ email }).maxTimeMS(5000);
        console.log('User query result:', user);

        if (!user) {
            console.log('User not found');
            return res.status(401).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        }

        console.log('User found:', user);
        console.log('Stored hashed password:', user.password);
        console.log('Provided password:', password);

        console.log('Comparing passwords...');
        console.log('Type of stored password:', typeof user.password);
        console.log('Type of provided password:', typeof password);
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password comparison completed.');
        console.log('Password match result:', isMatch);

        // إضافة هذا الجزء للتحقق من صحة التشفير
        const testHash = await bcrypt.hash(password, 12);
        console.log('Test hash:', testHash);
        const testMatch = await bcrypt.compare(password, testHash);
        console.log('Test match:', testMatch);

        if (!isMatch) {
            console.log('Password does not match');
            return res.status(401).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        }

        console.log('Password matches, generating token');
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Token generated:', token);

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'حدث خطأ أثناء تسجيل الدخول', error: error.message });
    }
};

