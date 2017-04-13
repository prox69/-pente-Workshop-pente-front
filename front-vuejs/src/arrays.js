// export function matrix (colCount, rowCount, initial) {
//   let columns = []
//
//   for (let i = 0; i < colCount; ++i) {
//     let rows = []
//     for (let j = 0; j < rowCount; ++j) {
//       rows[j] = 0
//     }
//
//     columns[i] = rows
//   }
//
//   return columns
// }

export function matrix () {
  let array = []
  let row = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  for (let i = 0; i < 19; ++i) {
    array.push(row)
  }
  console.log(array)
  return array
}
