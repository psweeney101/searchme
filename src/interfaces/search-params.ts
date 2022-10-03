export enum SearchParam {
  Query = 'query',
  StartDate = 'startDate',
  EndDate = 'endDate',
  SentBy = 'sentBy',
  LikedBy = 'likedBy',
  Attachments = 'attachments',
  Sort = 'sort',
  Page = 'page',
  MessageID = 'messageID',
}

export type SetSearchParams = (params: { name: SearchParam, value?: string | string[] | number }[]) => void;
