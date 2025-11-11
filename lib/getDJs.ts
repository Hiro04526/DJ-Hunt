export async function getDJs() {
  const res = await fetch(`${process.env.BASE_URL}/api/djs`, {
    cache: "no-store",
  });
  const { data } = await res.json();
  return data as any[];
}