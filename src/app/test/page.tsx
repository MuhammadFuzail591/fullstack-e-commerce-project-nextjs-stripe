import db from '@/db/db'

export default async function Test () {
  const users = await db.user.findMany()


//   const newOrder = await db.order.
  console.log(users)
  return <h1>test</h1>
}
