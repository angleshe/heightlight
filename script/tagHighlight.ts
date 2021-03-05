// 高亮标签的class
const HIGHLIGHT_CLASS = 'tag-highlight';

/**
 * @description 创建高亮标签
 * @author angle
 * @date 2021-03-05
 * @param {string} content 标签内容
 * @returns {HTMLSpanElement} 高亮标签
 */
function createdHightLightElement(content: string): HTMLSpanElement {
  const spanElement = document.createElement<'span'>('span');
  spanElement.classList.add(HIGHLIGHT_CLASS);
  const nodeText = document.createTextNode(content);
  spanElement.appendChild(nodeText);
  return spanElement;
}

/**
 * @description 插入高亮标签
 * @author angle
 * @date 2021-03-05
 * @param {Node} contentNode 内容节点
 * @param {number} start 高亮文本的起点位置
 * @param {number} length 高亮文本的长度
 */
function insertTag(contentNode: Node, start: number, length: number): void {
  // 节点内容
  const content = contentNode.textContent;
  if (content) {
    const nextNode = contentNode.nextSibling;
    if (content.length > start) {
      // 目标节点包含有高亮文本时：
      // 这时候有两种情况：
      // 1. 高亮文本整个都落在目标节点中： 高亮“sdnxxdd”中的“xx”
      // 此时这需要直接替换文本中的xx就行了
      if (contentNode.nodeType === Node.TEXT_NODE && contentNode instanceof Text) {
        // 判断是否该节点是文本节点
        // splitText就是一把剪绳子的剪刀
        // 要取一条绳子中的一部分需要剪几刀？？？

        // 1. 先在需要部分的前端剪一刀
        const targetNode = contentNode.splitText(start);

        if (content.length >= start + length) {
          // 2.如果是需要部分不在绳子的末端则需要第二刀把绳子多余的末端剪去
          targetNode.splitText(length);
        }

        // 创建高亮节点
        const ele = createdHightLightElement(targetNode.data);
        // 替换旧节点
        targetNode.parentNode?.replaceChild(ele, targetNode);
      } else if (contentNode.nodeType === Node.ELEMENT_NODE && contentNode.firstChild) {
        // 不是文本节点则往子节点递归
        insertTag(contentNode.firstChild, start, length);
      }

      if (content.length < start + length) {
        // 2. 高亮文本一部分落在目标节点上： 高亮“<span>sdnx</span>xdd”中的“xx”
        // 此时不仅需要高亮当前节点，还需高亮它的后续节点
        // 这里采用递归前节点的下一个兄弟节点
        // 注意： 下一个节点插入高亮标签的位置一定是在开头（0）的位置，
        // 高亮的长度剩下start + length - content.length
        if (nextNode) {
          insertTag(nextNode, 0, start + length - content.length);
        }
      }
    } else {
      // 目标节点中不含有高亮词时
      // 递归下个兄弟节点：
      // 此时高亮词的起始位置需要减去该节点内容长度
      if (nextNode) {
        insertTag(nextNode, start - content.length, length);
      }
    }
  }
}

/**
 * @description 标签式高亮
 * @author angle
 * @date 2021-03-05
 * @export
 * @param {HTMLElement} root 文档根节点
 * @param {string} text 高亮文本
 */
export function highlightText(root: HTMLElement, text: string): void {
  if (text) {
    for (let i: number = 0; i < root.childElementCount; i++) {
      const paragraph = root.children[i];
      if (paragraph instanceof HTMLElement) {
        // 获取段落的内容
        const content = paragraph.textContent;
        // 段落内容不为空才处理
        if (content) {
          // 查找高亮字符串
          let startIndex = content.indexOf(text);
          // 遍历查找到高亮词位置
          while (startIndex !== -1) {
            // 插入高亮标签
            insertTag(paragraph, startIndex, text.length);
            // 获取下一个起点值
            startIndex = content.indexOf(text, startIndex + text.length);
          }
        }
      }
    }
  }
}
