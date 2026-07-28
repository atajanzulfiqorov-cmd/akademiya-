const { readData } = require('../utils/fileHandler');

const getInstructorAnalytics = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const courses = await readData('courses.json');
    const enrollments = await readData('enrollments.json');
    const transactions = await readData('transactions.json');

    const myCourses = courses.filter(c => c.instructorId === instructorId);
    const myCourseIds = myCourses.map(c => c.id);

    const myEnrollments = enrollments.filter(e => myCourseIds.includes(e.courseId));
    const myTransactions = transactions.filter(t => myCourseIds.includes(t.courseId));

    const totalRevenue = myTransactions.reduce((acc, t) => acc + t.amount, 0);
    const uniqueStudents = new Set(myEnrollments.map(e => e.studentId)).size;

    res.json({
      totalCourses: myCourses.length,
      totalSales: myEnrollments.length,
      totalRevenue,
      uniqueStudents
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAdminAnalytics = async (req, res) => {
  try {
    const users = await readData('users.json');
    const courses = await readData('courses.json');
    const enrollments = await readData('enrollments.json');
    const transactions = await readData('transactions.json');

    const totalRevenue = transactions.reduce((acc, t) => acc + t.amount, 0);

    res.json({
      totalUsers: users.length,
      totalStudents: users.filter(u => u.role === 'student').length,
      totalInstructors: users.filter(u => u.role === 'instructor').length,
      totalCourses: courses.length,
      totalEnrollments: enrollments.length,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getInstructorAnalytics, getAdminAnalytics };