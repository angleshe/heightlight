import { highlightText } from './script/coverHighlight';
const contentDom = document.getElementById('content');

if (contentDom) {
  highlightText(contentDom, '生命');
}
