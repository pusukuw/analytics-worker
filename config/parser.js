const { parse } = require('csv-parse');

const parser = async (filePath) => {
  const data = [];

  const parser = await parse(filePath, {
    from: 'file',
    trim: true,
    skip_empty_lines: true,
    columns: true,
  });

  parser.on('readable', (record) => {
    let chunk;
    while ((chunk = parser.read()) !== null) {
      data.push(chunk);
    }
  });

  try {
    await new Promise((resolve, reject) => {
      parser.on('end', resolve);
      parser.on('error', reject);
    });
  } catch (error) {
    console.error(`Error parsing CSV file: ${error.message}`);
    throw error;
  }

  return data;
};

module.exports = parser;