import { highlightText as coverHighlight } from './script/coverHighlight';
import { highlightText as tagHighlight } from './script/tagHighlight';
const contentDom = document.getElementById('content');

if (contentDom) {
  coverHighlight(contentDom, '生命');
  tagHighlight(contentDom, '人生');
}
