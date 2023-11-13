const express = require('express')
const sqlite3 = require('sqlite3')
const cors = require('cors')

const app = express()

app.use(cors())
const port = 4001
const db = new sqlite3.Database('memories.db')

app.use(express.json())

db.serialize(() => {
  db.run(`

    CREATE TABLE IF NOT EXISTS lanes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT
    );
  
    CREATE TABLE IF NOT EXISTS memories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lane_id INTEGER,
      name TEXT,
      description TEXT,
      timestamp DATE,
      FOREIGN KEY(lane_id) REFERENCES lanes(id)
    );
  `)
})

// LANES
app.get('/lanes', (req, res) => {
  db.all('SELECT * FROM lanes', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ lanes: rows })
  })
})

app.post('/lanes', (req, res) => {
  const { name, description } = req.body

  if (!name || !description) {
    res.status(400).json({
      error: 'Please provide all fields: name, description',
    })
    return
  }

  const stmt = db.prepare('INSERT INTO lanes (name, description) VALUES (?, ?)')
  stmt.run(name, description, (err) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }

    res.status(201).json({ message: 'Memory created successfully' })
  })
})

app.get('/lanes/:id', (req, res) => {
  const { id } = req.params
  db.get('SELECT * FROM lanes WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    if (!row) {
      res.status(404).json({ error: 'Lane not found' })
      return
    }
    res.json({ lane: row })
  })
})

app.put('/lanes/:id', (req, res) => {
  const { id } = req.params
  const { name, description } = req.body

  if (!name || !description) {
    res.status(400).json({
      error: 'Please provide all fields: name, description',
    })
    return
  }

  const stmt = db.prepare(
    'UPDATE lanes SET name = ?, description = ? WHERE id = ?'
  )
  stmt.run(name, description, id, (err) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ message: 'Lane updated successfully' })
  })
})

// MEMORIES
app.get('/memories/:laneId', (req, res) => {
  const laneId = req.params.laneId

  if (laneId === undefined) {
    res.status(400).json({
      error: 'lane id is required to query memories',
    })
  }
  db.all('SELECT * FROM memories WHERE lane_id = ?', [laneId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ memories: rows })
  })
})

app.post('/memories', (req, res) => {
  const { name, laneId, description, timestamp } = req.body

  if (!name || !laneId || !description || !timestamp) {
    res.status(400).json({
      error: 'Please provide all fields: name, laneId, description, timestamp',
    })
    return
  }

  const stmt = db.prepare(
    'INSERT INTO memories (name, laneId, description, timestamp) VALUES (?, ?, ?, ?)'
  )
  stmt.run(name, laneId, description, timestamp, (err) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.status(201).json({ message: 'Memory created successfully' })
  })
})

app.get('/memories/:id', (req, res) => {
  const { id } = req.params
  db.get('SELECT * FROM memories WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    if (!row) {
      res.status(404).json({ error: 'Memory not found' })
      return
    }
    res.json({ memory: row })
  })
})

app.put('/memories/:id', (req, res) => {
  const { id } = req.params
  const { name, description, timestamp } = req.body

  if (!name || !description || !timestamp) {
    res.status(400).json({
      error: 'Please provide all fields: name, description, timestamp',
    })
    return
  }

  const stmt = db.prepare(
    'UPDATE memories SET name = ?, description = ?, timestamp = ? WHERE id = ?'
  )
  stmt.run(name, description, timestamp, id, (err) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ message: 'Memory updated successfully' })
  })
})

app.delete('/memories/:id', (req, res) => {
  const { id } = req.params
  db.run('DELETE FROM memories WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ message: 'Memory deleted successfully' })
  })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
