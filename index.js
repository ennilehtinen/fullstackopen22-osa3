const { response } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

morgan.token('body', function (req, res) {
  return JSON.stringify(req.body)
})

const app = express()

app.use(cors())
app.use(express.json())
app.use(
  morgan(function (tokens, req, res) {
    let response = [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms'
    ]

    if (req.method === 'POST') {
      response.push(tokens.body(req, res))
    }
    return response.join(' ')
  })
)

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-1234567'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '040-1234568'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '040-1234569'
  }
]

app.get('/info', (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
  )
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.post('/api/persons', (req, res) => {
  const newPerson = req.body
  if (!newPerson.name) {
    return res.status(400).json({
      error: 'name missing'
    })
  }
  if (!newPerson.number) {
    return res.status(400).json({
      error: 'number missing'
    })
  }
  if (persons.find(person => person.name === newPerson.name)) {
    return res.status(400).json({
      error: 'duplicate contact'
    })
  }
  newPerson.id = Math.ceil(Math.random() * 1000000)
  persons.push(newPerson)
  res.json(newPerson)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
  } else {
    response.status(404).end()
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
