/** Profile-skill state helpers keep accepted AI suggestions deduplicated and remove them from the review queue. */
export function acceptSuggestedSkill(profileSkills: string[], suggestedSkills: string[], tag: string) {
  return {
    profileSkills: profileSkills.includes(tag) ? profileSkills : [...profileSkills, tag],
    suggestedSkills: suggestedSkills.filter((item) => item !== tag),
  };
}
