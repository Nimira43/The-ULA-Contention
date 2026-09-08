const DIRS = [
  { name: 'N', dc: 0, dr: -1, opp: 'S' },
  { name: 'S', dc: 0, dr: 1, opp: 'N' },
  { name: 'E', dc: 1, dr: 0, opp: 'W' },
  { name: 'W', dc: -1, dr: 0, opp: 'E' },
]

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function roomKey(col, row) {
  return `${col},${row}`
}

/**
 * @param {number} cols - grid width (in rooms)
 * @param {number} rows - grid height (in rooms)
 * @param {number} roomCount - how many rooms to carve (<= cols * rows)
 * @returns {{ rooms: Map<string, object>, startKey: string }}
 */
export function generateGrid(cols, rows, roomCount) {
  const rooms = new Map()

  const startCol = Math.floor(Math.random() * cols)
  const startRow = Math.floor(Math.random() * rows)
  const startKey = roomKey(startCol, startRow)

  rooms.set(startKey, {
    col: startCol,
    row: startRow,
    doors: {}
  })
  
  const stack = [{
    col: startCol,
    row: startRow
  }]

  while (stack.length && rooms.size < roomCount) {
    const current = stack[stack.length - 1]

    const candidates = shuffle([...DIRS]).filter((d) => {
      const nc = current.col + d.dc
      const nr = current.row + d.dr
      return nc >= 0 && nc < cols && nr >= 0 && nr < rows && !rooms.has(roomKey(nc, nr))
    })

    if (candidates.length === 0) {
      stack.pop()
      continue
    }

    const dir = candidates[0]
    const nc = current.col + dir.dc
    const nr = current.row + dir.dr

    rooms.get(roomKey(current.col, current.row)).doors[dir.name] = true

    const newRoom = { col: nc, row: nr, doors: {} }
    newRoom.doors[dir.opp] = true
    rooms.set(roomKey(nc, nr), newRoom)

    stack.push({ col: nc, row: nr })
  }

  return { rooms, startKey }
}