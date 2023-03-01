const express = require('express')
const bodyParser = require('body-parser');
const fs = require('fs')
const app = express()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const hospitals = JSON.parse(fs.readFileSync('hospitals.json'))

// GET all hospitals
app.get('/hospitals', (req, res) => {
  res.json(hospitals)
})

// GET a specific hospital
app.get('/hospitals/:name', (req, res) => {
  const hospital = hospitals.find(hospital => hospital.name === req.params.name)
  if (!hospital) return res.status(404).send('Hospital not found')
  res.json(hospital)
})

// POST a new hospital
app.post('/hospitals', (req, res) => {
  const newHospital = {
    name: req.body.name,
    patientCount: req.body.patientCount,
    location: req.body.location
  }
  hospitals.push(newHospital)
  fs.writeFileSync('hospitals.json', JSON.stringify(hospitals, null, 2))
  res.json(newHospital)
})

// PUT (update) an existing hospital
app.put('/hospitals/:name', (req, res) => {
  const hospital = hospitals.find(hospital => hospital.name === req.params.name)
  if (!hospital) return res.status(404).send('Hospital not found')
  hospital.patientCount = req.body.patientCount
  hospital.location = req.body.location
  fs.writeFileSync('hospitals.json', JSON.stringify(hospitals, null, 2))
  res.json(hospital)
})

// DELETE an existing hospital
app.delete('/hospitals/:name', (req, res) => {
  const index = hospitals.findIndex(hospital => hospital.name === req.params.name)
  if (index === -1) return res.status(404).send('Hospital not found')
  hospitals.splice(index, 1)
  fs.writeFileSync('hospitals.json', JSON.stringify(hospitals, null, 2))
  res.send('Hospital deleted')
})

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000')
})
