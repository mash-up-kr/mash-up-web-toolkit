export default function Page({ params }: { params: { slug: string } }) {
  return <h1>Blog Post: {params.slug}</h1>;
}