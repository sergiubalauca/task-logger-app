export interface RandomUser {
  info: {
    results: number;
    page: number;
  };
  results: {
    id: {
      name: string;
      value: string;
    };
    email: string;
    name: {
      title: string;
      first: string;
      last: string;
    };
    picture: {
      medium: string;
    };
  }[];
}
