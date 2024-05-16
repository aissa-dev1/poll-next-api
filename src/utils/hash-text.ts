import * as bcrypt from 'bcrypt';

export async function hashText(text: string): Promise<string> {
  const saltOrRounds = 10;
  const hash = await bcrypt.hash(text, saltOrRounds);
  return hash;
}
