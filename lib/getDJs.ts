export async function getDJs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/djs`, {
    cache: "no-store",
  });
  const { data } = await res.json();
  return data as any[];
}