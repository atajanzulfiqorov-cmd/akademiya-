const fs = require('fs/promises');
const path = require('path');

const readData = async (fileName) => {
  try {
    const filePath = path.join(__dirname, `../../data/${fileName}`);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (error) {
    if (error.code === 'ENOENT') {
      await writeData(fileName, []);
      return [];
    }
    throw error;
  }
};

const writeData = async (fileName, data) => {
  const filePath = path.join(__dirname, `../../data/${fileName}`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

module.exports = { readData, writeData };