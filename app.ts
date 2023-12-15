import { Hono } from "https://deno.land/x/hono@v3.11.7/mod.ts"
import { serveStatic } from "https://deno.land/x/hono@v3.11.7/middleware.ts"
import { streamSSE } from "https://deno.land/x/hono@v3.11.7/helper/streaming/index.ts"
import { stringBufferToString } from "https://deno.land/x/hono@v3.11.7/utils/html.ts";

const app = new Hono()
const db = await Deno.openKv()


let i = 0

interface LastVisit {
    country: string,
    city: string,
    flag: string, 
    
}

app.get('/', serveStatic( { path: './index.html' } ))


app.post('/counter', async (c) => {
    await db.atomic().sum(["visits"], 1n).commit()
    return c.json({message: 'ok'})
})

app.post('/visit', async (c) => {

    const { city, country, flag } = await c.req.json<LastVisit>()

    await db.atomic()
    .set(["lastVisit"], { country, city, flag })
    .sum(["visits"], 1n)
    .commit()
    return c.json({message: 'ok'})
})

app.get('/visit', (c) => {
    return streamSSE(c, async (stream) => {        
        const watcher = db.watch([["lastVisit"]])
        for await (const entry of watcher) {
            const { value } = entry[0]
            if (value !== null) {
                await stream.writeSSE({ data: JSON.stringify(value), event: "update", id: String(i++)})
            }
        }
    })
})


// app.get('/counter', (c) => {
//     return streamSSE(c, async (stream) => {
//         const visitsKey = ["visits"]
//         const listVisits = [visitsKey]
//         const watcher = db.watch(listVisits)

//         for await (const entry of watcher) {
//             const { value } = entry[0]
//             if (value !== null) {
//                 await stream.writeSSE({ data: Number(value).toString(), event: "update", id: String(i++)})
//             }
//         }

//         // while (true) {
//         //     const { value } = await db.get(["visits"])
//         //     await stream.writeSSE({ data: Number(value).toString(), event: "update", id: String(i++)})
//         //     //const message = `Son las ${new Date().toLocaleDateString()}`
//         //     //await stream.writeSSE({ data: message, event: "update", id: String(i++)})
//         //     await stream.sleep(1000)

//         // }
//     })
// })

Deno.serve(app.fetch)