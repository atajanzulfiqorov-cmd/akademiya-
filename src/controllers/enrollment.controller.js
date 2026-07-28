const { readData, writeData } = require('../utils/fileHandler');

const enrollCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const studentId = req.user.id;

    const enrollments = await readData('enrollments.json');
    const transactions = await readData('transactions.json');
    const courses = await readData('courses.json');

    const course = courses.find(c => c.id === courseId);
    if (!course) return res.status(404).json({ message: 'Kurs topilmadi' });

    const isEnrolled = enrollments.some(e => e.studentId === studentId && e.courseId === courseId);
    if (isEnrolled) {
      return res.status(400).json({ message: 'Siz allaqachon ushbu kursni sotib olgansiz' });
    }

    const newEnrollment = {
      id: Date.now().toString(),
      studentId,
      courseId,
      enrolledAt: new Date().toISOString()
    };

    const newTransaction = {
      id: 'tx-' + Date.now(),
      studentId,
      courseId,
      amount: course.price,
      createdAt: new Date().toISOString()
    };

    enrollments.push(newEnrollment);
    transactions.push(newTransaction);

    await writeData('enrollments.json', enrollments);
    await writeData('transactions.json', transactions);

    res.status(201).json({ message: 'Kursga muvaffaqiyatli a’zo bo‘lindi', enrollment: newEnrollment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyCourses = async (req, res) => {
  try {
    const enrollments = await readData('enrollments.json');
    const courses = await readData('courses.json');

    const myEnrollments = enrollments.filter(e => e.studentId === req.user.id);
    const myCourses = courses.filter(c => myEnrollments.some(e => e.courseId === c.id));

    res.json(myCourses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLessonContent = async (req, res) => {
  try {
    const { id: courseId, lessonId } = req.params;
    const enrollments = await readData('enrollments.json');
    const courses = await readData('courses.json');

    const isEnrolled = enrollments.some(e => e.studentId === req.user.id && e.courseId === courseId);
    const isOwnerOrAdmin = req.user.role === 'admin' || courses.some(c => c.id === courseId && c.instructorId === req.user.id);

    if (!isEnrolled && !isOwnerOrAdmin) {
      return res.status(403).json({ message: 'Darsni ko‘rish uchun kursni sotib olishingiz kerak' });
    }

    const course = courses.find(c => c.id === courseId);
    const lesson = course?.modules.find(m => m.id === lessonId);

    if (!lesson) return res.status(404).json({ message: 'Dars topilmadi' });

    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { enrollCourse, getMyCourses, getLessonContent };