/**
 * @description 关键dom的id
 * @enum {string}
 */
enum ELEMENT_CLASS {
  HIGHLIGHT_CONTAINER = 'highlight-container',
  HIGHLIGHT_ITEM = 'highlight-item'
}

/**
 * @description 创建Range
 * @author angle
 * @date 2021-03-04
 * @param {HTMLElement} root Range所在的Element节点
 * @param {number} offset 偏移位置
 * @returns {Range}
 */
function createdRange(root: HTMLElement, offset: number): Range {
  for (let i: number = 0; i < root.childNodes.length; i++) {
    const node = root.childNodes[i];
    const content = node.textContent;
    if (content) {
      // 判断range是否落在该节点上
      // 如果落在改节点上 则可能在文本节点中或者element节点上
      // 如果在文本节点上直接创建
      // 如果在element节点上直接递归
      if (content.length >= offset) {
        if (node.nodeType === Node.TEXT_NODE) {
          const range = document.createRange();
          range.setStart(node, offset);
          return range;
        }
        if (node.nodeType === Node.ELEMENT_NODE) {
          return createdRange(node as HTMLElement, offset);
        }
      } else {
        // range不在这个节点则让偏移减去改节点内容长度，进入下一个节点
        offset -= content.length;
      }
    }
  }

  throw new Error('offset 超过 root 内容长度！');
}

/**
 * @description 创建高亮节点
 * @author angle
 * @date 2021-03-05
 * @param {number} width 长
 * @param {number} height 高
 * @param {number} left 左偏移
 * @param {number} top 右偏移
 * @returns {HTMLDivElement}
 */
function createdHighlightDom(
  width: number,
  height: number,
  left: number,
  top: number
): HTMLDivElement {
  const dom = document.createElement('div');
  dom.classList.add(ELEMENT_CLASS.HIGHLIGHT_ITEM);

  dom.style.height = `${height}px`;
  dom.style.width = `${width}px`;
  dom.style.left = `${document.documentElement.scrollLeft + left}px`;
  dom.style.top = `${document.documentElement.scrollTop + top}px`;

  return dom;
}

/**
 * @description 创建高亮区域
 * @author angle
 * @date 2021-03-05
 * @param {HTMLElement} containerDom 容器节点
 * @param {HTMLElement} paragraph 高亮所在段落
 * @param {Range} startRange 高亮起始range
 * @param {Range} endRange  高亮终点range
 */
function createdHighlightArea(
  containerDom: HTMLElement,
  paragraph: HTMLElement,
  startRange: Range,
  endRange: Range
): void {
  const paragraphRect = paragraph.getBoundingClientRect();
  const startRect = startRange.getBoundingClientRect();
  const endRect = endRange.getBoundingClientRect();

  if (startRect.top === endRect.top) {
    // 高亮的词在同一行
    const dom = createdHighlightDom(
      endRect.left - startRect.left,
      startRect.height,
      startRect.left,
      startRect.top
    );
    containerDom.append(dom);
  } else {
    // 跨度多行
    const topLineDom = createdHighlightDom(
      paragraphRect.right - startRect.left,
      startRect.height,
      startRect.left,
      startRect.top
    );
    const bottomLineDom = createdHighlightDom(
      endRect.left - paragraphRect.left,
      endRect.height,
      paragraphRect.left,
      endRect.top
    );
    containerDom.append(topLineDom);
    containerDom.append(bottomLineDom);

    if (endRect.top - startRect.bottom > 5) {
      // 在误差允许的范围内,认为跨度3行以上
      const middleLineDom = createdHighlightDom(
        paragraphRect.width,
        endRect.top - startRect.bottom,
        paragraphRect.left,
        startRect.bottom
      );
      containerDom.append(middleLineDom);
    }
  }
}

/**
 * @description 高亮文本
 * @author angle
 * @date 2021-03-04
 * @export
 * @param {HTMLElement} root 文档根节点
 * @param {string} text 高亮文本
 */
export function highlightText(root: HTMLElement, text: string): void {
  if (text) {
    // 查询前先清除所有高亮节点
    // 查找高亮容器节点，有则清除
    let highlightContainerDom = document.querySelector<HTMLElement>(
      `.${ELEMENT_CLASS.HIGHLIGHT_CONTAINER}`
    );
    if (highlightContainerDom) {
      highlightContainerDom.parentElement?.removeChild(highlightContainerDom);
    }
    // 创建新的高亮容器节点
    highlightContainerDom = document.createElement('div');
    highlightContainerDom.classList.add(ELEMENT_CLASS.HIGHLIGHT_CONTAINER);

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
            // 创建起始range
            const startRange = createdRange(paragraph, startIndex);
            // 创建终点Range
            const endRange = createdRange(paragraph, startIndex + text.length);
            // 创建高亮
            createdHighlightArea(highlightContainerDom, paragraph, startRange, endRange);

            // 释放Range
            startRange.detach();
            endRange.detach();

            // 获取下一个起点值
            startIndex = content.indexOf(text, startIndex + text.length);
          }
        }
      }
    }

    document.body.append(highlightContainerDom);
  }
}
