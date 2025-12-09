export async function getDJs() {
  const res = await fetch(`${process.env.BASE_URL}/app/dj-hunt/djs`, {
    cache: "no-store",
  });
  const { data } = await res.json();
  return data as any[];
}