import { ReactElement } from 'react';
import reactStringReplace from 'react-string-replace';

type Props = {
  text: string;
  query: string;
};

export function Highlight (props: Props): ReactElement {
  // Match URLs
  let text = reactStringReplace(props.text, /(https?:\/\/\S+)/g, (match, i) => (
    <a key={match + i} href={match} target="_blank" rel="noreferrer">{match}</a>
  ));

  // Match query
  if (props.query.trim()) {
    const regex = new RegExp(`(${props.query.split(/\s+/).join('|')})`, 'igm');
    text = reactStringReplace(text, regex, (match, i) => (
      <mark key={match + i}>{match}</mark>
    ));
  }

  return <div>{text}</div>
}
