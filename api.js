const express = require('express')
const sqlite3 = require('sqlite3')
const bodyParser = require('body-parser')
const cors = require('cors')
const uuid = require('uuid')

// TODO: Move to typescript with proper framework
const app = express()

app.use(cors())
app.use(express.json({ extended: true, limit: '25mb' }))

app.use(express.urlencoded({ extended: true, limit: '25mb' }))

const port = 4001
const db = new sqlite3.Database('memories.db')

app.use(express.json())

db.serialize(() => {
  db.run(`PRAGMA foreign_keys = ON;`)
  db.run(`

    CREATE TABLE IF NOT EXISTS lanes (
      id TEXT PRIMARY KEY,
      name TEXT,
      description TEXT
    );
  
  `)

  db.run(`
  
    CREATE TABLE IF NOT EXISTS memories (
      id TEXT PRIMARY KEY,
      lane_id INTEGER,
      name TEXT,
      description TEXT,
      timestamp DATE,
      FOREIGN KEY(lane_id) REFERENCES lanes(id) ON DELETE CASCADE
    );
  `)

  db.run(`
  
    CREATE TABLE IF NOT EXISTS memory_images (
      id TEXT PRIMARY KEY,
      memory_id INTEGER,
      base64 TEXT,
      FOREIGN KEY(memory_id) REFERENCES memories(id) ON DELETE CASCADE
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

  const id = uuid.v4()

  const stmt = db.prepare(
    'INSERT INTO lanes (id,name, description) VALUES (?, ?, ?)'
  )
  stmt.run(id, name, description, (err) => {
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

app.delete('/lanes/:id', (req, res) => {
  const { id } = req.params
  db.run('DELETE FROM lanes WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ message: 'Lane deleted successfully' })
  })
})

// MEMORIES
app.get('/memories/:laneId', (req, res) => {
  const laneId = req.params.laneId

  const sort = req.query.sort ?? 'ASC'

  console.log(sort)

  if (laneId === undefined) {
    res.status(400).json({
      error: 'lane id is required to query memories',
    })
  }

  const order = `ORDER BY timestamp ${sort}`

  const getMemories = new Promise((resolve) => {
    db.serialize(() => {
      db.all(
        `SELECT * FROM memories WHERE lane_id = ? ${order};`,
        [laneId],
        (err, rows) => {
          if (err) {
            throw new Error('Failed to fetch memory')
          }

          resolve(rows)
        }
      )
    })
  })

  const getMemoryImages = (memory) =>
    new Promise((resolve) => {
      db.serialize(() => {
        db.all(
          'SELECT * FROM memory_images WHERE memory_id = ?',
          [memory.id],
          (err, rows) => {
            if (err) {
              throw new Error('Failed to fetch memory images')
            }

            resolve({
              ...memory,
              images: rows,
            })
          }
        )
      })
    })

  getMemories.then((memories) => {
    Promise.all(
      memories.map((memory) => {
        return getMemoryImages(memory)
      })
    ).then((memories) => {
      res.json({ memories })
    })
  })
})

app.post('/memories', (req, res) => {
  const { name, laneId, description, timestamp, images } = req.body

  if (!name || !laneId || !description || !timestamp || !images) {
    res.status(400).json({
      error: 'Please provide all fields: name, laneId, description, timestamp',
    })
    return
  }

  const id = uuid.v4()

  const createMemory = new Promise((resolve) => {
    db.serialize(() => {
      const stmt = db.prepare(
        'INSERT INTO memories (id, name, lane_id, description, timestamp) VALUES (?,?, ?, ?, ?)'
      )

      stmt.run(id, name, laneId, description, timestamp, (err) => {
        if (err) {
          res.status(500).json({ error: err.message })
          return
        }

        resolve(true)
      })
    })
  })

  const createImage = (img) =>
    new Promise((resolve) => {
      const imageStmt = db.prepare(
        'INSERT INTO memory_images (memory_id, base64) VALUES (?, ?)'
      )
      imageStmt.run(id, img, (err) => {
        if (err) {
          res.status(500).json({ error: err.message })
          return
        }
        resolve(true)
      })
    })

  createMemory.then((_sucess) => {
    Promise.all(
      images.map((img) => {
        return createImage(img)
      })
    ).then((_ok) => {
      res.status(201).json({ message: 'Memory created successfully' })
    })
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
