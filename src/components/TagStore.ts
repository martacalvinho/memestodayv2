interface TagStore {
  [key: string]: number;
}

class TagManager {
  private static instance: TagManager;
  private tags: TagStore = {};

  private constructor() {
    // Load tags from localStorage
    const storedTags = localStorage.getItem('memeTags');
    if (storedTags) {
      this.tags = JSON.parse(storedTags);
    }
  }

  public static getInstance(): TagManager {
    if (!TagManager.instance) {
      TagManager.instance = new TagManager();
    }
    return TagManager.instance;
  }

  public addTags(newTags: string[]) {
    newTags.forEach(tag => {
      this.tags[tag] = (this.tags[tag] || 0) + 1;
    });
    this.saveTags();
  }

  public removeTags(tagsToRemove: string[]) {
    tagsToRemove.forEach(tag => {
      if (this.tags[tag] > 1) {
        this.tags[tag]--;
      } else {
        delete this.tags[tag];
      }
    });
    this.saveTags();
  }

  public getAllTags(): { name: string; count: number }[] {
    return Object.entries(this.tags)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

  public searchTags(query: string): string[] {
    const lowercaseQuery = query.toLowerCase();
    return Object.keys(this.tags)
      .filter(tag => tag.toLowerCase().includes(lowercaseQuery))
      .sort((a, b) => this.tags[b] - this.tags[a]);
  }

  private saveTags() {
    localStorage.setItem('memeTags', JSON.stringify(this.tags));
  }
}

export default TagManager;