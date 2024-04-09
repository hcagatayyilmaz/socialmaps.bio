export default function page({params}: {params: {username: string}}) {
  return (
    <div>
      <h1>{params.username}</h1>
    </div>
  )
}
