const { readData, writeData } = require('../utils/fileHandler');

const createCourse = async (req, res) => {
  try {
    const { title, description, price, category, level } = req.body;
    const courses = await readData('courses.json');

    const newCourse = {
      id: Date.now().toString(),
      title,
      description,
      price: Number(price),
      category: category || 'General',
      level: level || 'All',
      instructorId: req.user.id,
      averageRating: 0,
      modules: []
    };

    courses.push(newCourse);
    await writeData('courses.json', courses);

    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCourses = async (req, res) => {
  try {
    const { category, level, search, price } = req.query;
    let courses = await readData('courses.json');

    if (category) courses = courses.filter(c => c.category === category);
    if (level) courses = courses.filter(c => c.level === level);
    if (price) courses = courses.filter(c => c.price <= Number(price));
    if (search) {
      courses = courses.filter(c => 
        c.title.toLowerCase().includes(search.toLowerCase()) || 
        c.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const courses = await readData('courses.json');
    const course = courses.find(c => c.id === req.params.id);
    if (!course) return res.status(404).json({ message: 'Kurs topilmadi' });

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addModule = async (req, res) => {
  try {
    const { title, videoLink } = req.body;
    const courses = await readData('courses.json');
    const course = courses.find(c => c.id === req.params.id);

    if (!course) return res.status(404).json({ message: 'Kurs topilmadi' });
    if (course.instructorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Sizda bu kursga modul qo‘shish ruxsati yo‘q' });
    }

    const newModule = {
      id: Date.now().toString(),
      title,
      videoLink: videoLink || '',
      file: req.file ? `/uploads/${req.file.filename}` : null
    };

    course.modules.push(newModule);
    await writeData('courses.json', courses);

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    let courses = await readData('courses.json');
    const course = courses.find(c => c.id === req.params.id);

    if (!course) return res.status(404).json({ message: 'Kurs topilmadi' });
    if (course.instructorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Sizda bu kursni o‘chirish ruxsati yo‘q' });
    }

    courses = courses.filter(c => c.id !== req.params.id);
    await writeData('courses.json', courses);

    res.json({ message: 'Kurs o‘chirildi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createCourse, getCourses, getCourseById, addModule, deleteCourse };