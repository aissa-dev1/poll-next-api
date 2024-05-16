export type PollOption = {
  id: string;
  name: string;
  voters: string[];
};

export type FindPollParams = {
  id: string;
};

export type LikePollParams = {
  id: string;
};

export type LikePollQuery = Partial<{
  fanId: string;
}>;

export type VotePollOptionParams = {
  id: string;
};

export type VotePollOptionQuery = Partial<{
  fanId: string;
  index: string;
}>;

export type DeletePollParams = {
  id: string;
};
