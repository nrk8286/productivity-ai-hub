export function getAnthropicModel() {
  const model = process.env.ANTHROPIC_MODEL?.trim();
  if (!model) throw new Error("ANTHROPIC_MODEL must identify a model available to your account");
  return model;
}
