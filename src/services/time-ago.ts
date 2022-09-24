import JavascriptTimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

JavascriptTimeAgo.addDefaultLocale(en);

const javascriptTimeAgo = new JavascriptTimeAgo('en-US');

export function TimeAgo(date: Date): string {
  return javascriptTimeAgo.format(date);
}
