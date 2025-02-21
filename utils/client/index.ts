import "client-only";

export async function runAction(promise: Promise<string | undefined | null>) {
  const error = await promise;
  if (error) throw new Error(error);
}
