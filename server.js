const express = require('express');
const redis = require('redis');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const Papa = require('papaparse');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Connect to Redis
const client = redis.createClient({
  url: 'redis://@127.0.0.1:6379'  // Default Redis connection
});

client.connect()
  .then(() => console.log('Connected to Redis'))
  .catch(err => console.error('Redis connection error:', err));

// CRUD Operations
// Route to save resident data
app.post('/residents', async (req, res) => {
  const { id, last_name, first_name, middle_initial, birthday, age, sex, status, purok, occupation, annual_income, contact_number, religion, nationality, housing } = req.body;

  // Validate input fields
  if (!id || !last_name || !first_name || !middle_initial || !birthday || !age || !sex || !status || !purok || !occupation || !annual_income || !contact_number || !religion || !nationality || !housing ) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Set resident data in Redis (using object syntax for Redis v4 and above)
    const residentData = { last_name, first_name, middle_initial, birthday, age, sex, status, purok, occupation, annual_income, contact_number, religion, nationality, housing };

    // Save resident data in Redis hash
    await client.hSet(`resident:${id}`, 'first_name', residentData.first_name);
    await client.hSet(`resident:${id}`, 'last_name', residentData.last_name);
    await client.hSet(`resident:${id}`, 'middle_initial', residentData.middle_initial);
    await client.hSet(`resident:${id}`, 'birthday', residentData.birthday);
    await client.hSet(`resident:${id}`, 'age', residentData.age);
    await client.hSet(`resident:${id}`, 'sex', residentData.sex);
    await client.hSet(`resident:${id}`, 'status', residentData.status);
    await client.hSet(`resident:${id}`, 'purok', residentData.purok);
    await client.hSet(`resident:${id}`, 'occupation', residentData.occupation);
    await client.hSet(`resident:${id}`, 'annual_income', residentData.annual_income);
    await client.hSet(`resident:${id}`, 'contact_number', residentData.contact_number);
    await client.hSet(`resident:${id}`, 'religion', residentData.religion);
    await client.hSet(`resident:${id}`, 'nationality', residentData.nationality);
    await client.hSet(`resident:${id}`, 'housing', residentData.housing);

    // Respond with success message
    res.status(201).json({ message: 'Resident saved successfully' });
  } catch (error) {
    console.error('Error saving resident:', error);
    res.status(500).json({ message: 'Failed to save resident' });
  }
});

// Import residents from CSV file
app.post('/residents/import', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Parse the CSV file
  const filePath = path.join(__dirname, req.file.path);
  const file = fs.createReadStream(filePath);

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: async (results) => {
      try {
        // Process each resident from the CSV file
        for (let resident of results.data) {
          const { id, last_name, first_name, middle_initial, birthday, age, sex, status, purok, occupation, annual_income, contact_number, religion, nationality, housing } = resident;

          // Check if all fields are provided
          if (!id || !last_name || !first_name || !middle_initial || !birthday || !age || !sex || !status || !purok || !occupation || !annual_income || !contact_number || !religion || !nationality || !housing) {
            continue;  // Skip incomplete records
          }

          // Save resident to Redis
          await client.hSet(`resident:${id}`, 'last_name', last_name);
          await client.hSet(`resident:${id}`, 'first_name', first_name);
          await client.hSet(`resident:${id}`, 'middle_initial', middle_initial);
          await client.hSet(`resident:${id}`, 'birthday', birthday);
          await client.hSet(`resident:${id}`, 'age', age);
          await client.hSet(`resident:${id}`, 'sex', sex);
          await client.hSet(`resident:${id}`, 'status', status);
          await client.hSet(`resident:${id}`, 'purok', purok);
          await client.hSet(`resident:${id}`, 'occupation', occupation);
          await client.hSet(`resident:${id}`, 'annual_income', annual_income);
          await client.hSet(`resident:${id}`, 'contact_number', contact_number);
          await client.hSet(`resident:${id}`, 'religion', religion);
          await client.hSet(`resident:${id}`, 'nationality', nationality);
          await client.hSet(`resident:${id}`, 'housing', housing);
        }

        // Respond with success message
        res.status(200).json({ message: 'residents imported successfully' });
      } catch (error) {
        console.error('Error importing residents:', error);
        res.status(500).json({ message: 'Failed to import residents' });
      } finally {
        // Clean up the uploaded file
        fs.unlinkSync(filePath);
      }
    },
  });
});


// Read (R)
app.get('/residents/:id', async (req, res) => {
  const id = req.params.id;
  const resident = await client.hGetAll(`resident:${id}`);
  if (Object.keys(resident).length === 0) {
    return res.status(404).json({ message: 'Resident not found' });
  }
  res.json(resident);
});

// Read all residents
app.get('/residents', async (req, res) => {
  const keys = await client.keys('resident:*');
  const residents = await Promise.all(keys.map(async (key) => {
    return { id: key.split(':')[1], ...(await client.hGetAll(key)) };
  }));
  res.json(residents);
});

// Update (U)
app.put('/residents/:id', async (req, res) => {
  const id = req.params.id;
  const { last_name, first_name, middle_initial, birthday, age, sex, status, purok, occupation, annual_income, contact_number, religion, nationality, housing } = req.body;

  if (!last_name && !first_name && !middle_initial && !birthday && !age && !sex && !status && !purok && !occupation && !annual_income && !contact_number && !religion&& !nationality && !housing ) {
    return res.status(400).json({ message: 'At least one field is required to update' });
  }

  try {
    const existingResident = await client.hGetAll(`resident:${id}`);
    if (Object.keys(existingResident).length === 0) {
      return res.status(404).json({ message: 'Resident not found' });
    }

    // Update resident data in Redis
    if (last_name) await client.hSet(`resident:${id}`, 'last_name', last_name);
    if (first_name) await client.hSet(`resident:${id}`, 'first_name', first_name);
    if (middle_initial) await client.hSet(`resident:${id}`, 'middle_initial', middle_initial);
    if (birthday) await client.hSet(`resident:${id}`, 'birthday', birthday);
    if (age) await client.hSet(`resident:${id}`, 'age', age);
    if (sex) await client.hSet(`resident:${id}`, 'sex', sex);
    if (status) await client.hSet(`resident:${id}`, 'status', status);
    if (purok) await client.hSet(`resident:${id}`, 'purok', purok);
    if (occupation) await client.hSet(`resident:${id}`, 'occupation', occupation);
    if (annual_income) await client.hSet(`resident:${id}`, 'annual_income', annual_income);
    if (contact_number) await client.hSet(`resident:${id}`, 'contact_number', contact_number);
    if (religion) await client.hSet(`resident:${id}`, 'religion', religion);
    if (nationality) await client.hSet(`resident:${id}`, 'nationality', nationality);
    if (housing) await client.hSet(`resident:${id}`, 'housing', housing);


    res.status(200).json({ message: 'Resident updated successfully' });
  } catch (error) {
    console.error('Error updating resident:', error);
    res.status(500).json({ message: 'Failed to update resident' });
  }
});

// Delete (D)
app.delete('/residents/:id', async (req, res) => {
  const id = req.params.id;
  await client.del(`resident:${id}`);
  res.status(200).json({ message: 'Resident deleted successfully' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
