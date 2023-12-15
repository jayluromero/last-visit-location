const db = await Deno.openKv()

// const user = 'jayluromero'
// const result = await db.set(["username"], user)
// console.log(result)

// const username = await db.get(["username"])
// console.log(username)

// const result = await db.set(["counter"], 0)
// console.log(result)

// const count = await db.get(["counter"])
// console.log(count)

// const { value } = await db.get<number>(["counter"])
// console.log(value)
// const newCounter = value == null ? 0 : value + 1

// const result = await db.set(["counter"], newCounter)

//await db.set(["visits"], new Deno.KvU64(0n)) // 0n ---> bigint 

// await db
//   .atomic()
//   .sum(["visits"], 1n)
//   .commit()

// const result = await db.get<Deno.KvU64>(["visits"])
// console.log(result)

// const preferencesJl = {
//   username: "jayluromero",
//   name: "Jose",
//   languaje: "es"
// }

// const preferencesAniu = {
//   username: "aniusolis",
//   name: "Aniuska",
//   languaje: "es"
// }

// await db.set(["preferences", "jaylu"], preferencesJl)
// await db.set(["preferences", "aniusolis"], preferencesAniu)

// const [
//   preferencesAniu, 
//   preferencesJl
// ] = await db.getMany([
//   ["preferences", "jaylu"],
//   ["preferences", "aniusolis"]
// ])

// console.log(preferencesAniu)
// console.log(preferencesJl)

const entries = db.list({ prefix: ["preferences"]})

for await (const entry of entries) {
  console.log(entry)
}

await db.delete(["preferences", "jaylu"])