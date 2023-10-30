export class UserActivityFilter {
    username;
    predicate;
    constructor(username="", predicate = "future") {
      this.username = username;
      this.predicate = predicate;
    }
  }
  