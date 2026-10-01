export function findSimilarIssues(issues, title, location, category) {
  const newTitle = title.trim().toLowerCase();
  const newLocation = location.trim().toLowerCase();

  if (!newTitle && !newLocation) {
    return [];
  }

  return issues.filter((issue) => {
    const sameCategory = issue.category === category;

    const sameLocation =
      newLocation &&
      issue.location.toLowerCase().includes(newLocation);

    const titleWords = newTitle
      .split(/\s+/)
      .filter((word) => word.length > 3);

    const matchingWords = titleWords.filter((word) =>
      issue.title.toLowerCase().includes(word)
    );

    return (
      sameCategory &&
      (sameLocation || matchingWords.length >= 2) &&
      issue.status !== 'Resolved'
    );
  });
}
