const { readData, writeData } = require('../utils/fileHandler');

const addReview = async (req, res) => {
  try {
    const courseId = req.params.id;
    const studentId = req.user.id;
    const { rating, comment } = req.body;

    const enrollments = await readData('enrollments.json');
    const isEnrolled = enrollments.some(e => e.studentId === studentId && e.courseId === courseId);

    if (!isEnrolled) {
      return res.status(403).json({ message: 'Faqat kursni sotib olgan talabalar sharh qoldira oladi' });
    }

    const reviews = await readData('reviews.json');
    const newReview = {
      id: Date.now().toString(),
      courseId,
      studentId,
      rating: Number(rating),
      comment,
      createdAt: new Date().toISOString()
    };

    reviews.push(newReview);
    await writeData('reviews.json', reviews);

    // averageRating qayta hisoblash
    const courseReviews = reviews.filter(r => r.courseId === courseId);
    const avgRating = courseReviews.reduce((acc, r) => acc + r.rating, 0) / courseReviews.length;

    const courses = await readData('courses.json');
    const courseIndex = courses.findIndex(c => c.id === courseId);
    if (courseIndex !== -1) {
      courses[courseIndex].averageRating = Number(avgRating.toFixed(1));
      await writeData('courses.json', courses);
    }

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReviews = async (req, res) => {
  try {
    const reviews = await readData('reviews.json');
    const courseReviews = reviews.filter(r => r.courseId === req.params.id);
    res.json(courseReviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addReview, getReviews };