import "client-only";

export async function runAction(promise: Promise<string | undefined>) {
  const error = await promise;
  if (error) throw new Error(error);
}
