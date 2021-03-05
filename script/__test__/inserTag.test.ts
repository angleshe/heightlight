import assert from 'power-assert';
import { insertTag, HIGHLIGHT_CLASS } from '../tagHighlight';

describe('src/tagHighlight', () => {
  describe('insertTag', () => {
    document.body.innerHTML = `
      <span id="dom1">你好，很高兴见到你</span>
      <span id="dom2">你好，很高<span>兴见到</span>你</span>
      <span id="dom3"> <span>你好，很高</span>兴见到你 </span>
    `;
    it('dom1', () => {
      const dom = document.getElementById('dom1')!;
      insertTag(dom, dom.textContent?.indexOf('高兴') ?? 0, 2);
      console.log('dom', dom.outerHTML);
      const hightLightDom = dom.querySelector(`.${HIGHLIGHT_CLASS}`);
      assert.ok(hightLightDom);
      assert.strictEqual(hightLightDom?.innerHTML, '高兴');
    });
    it('dom2', () => {
      const dom = document.getElementById('dom2')!;
      insertTag(dom, dom.textContent?.indexOf('高兴') ?? 0, 2);
      const hightLightDoms = dom.querySelectorAll(`.${HIGHLIGHT_CLASS}`);
      console.log('dom', dom.outerHTML);
      assert.strictEqual(hightLightDoms.length, 2);
      assert.strictEqual(hightLightDoms[0].innerHTML, '高');
      assert.strictEqual(hightLightDoms[1].innerHTML, '兴');
    });
    it('dom3', () => {
      const dom = document.getElementById('dom3')!;
      insertTag(dom, dom.textContent?.indexOf('高兴') ?? 0, 2);
      const hightLightDoms = dom.querySelectorAll(`.${HIGHLIGHT_CLASS}`);
      console.log('dom', dom.outerHTML);
      assert.strictEqual(hightLightDoms.length, 2);
      assert.strictEqual(hightLightDoms[0].innerHTML, '高');
      assert.strictEqual(hightLightDoms[1].innerHTML, '兴');
    });
  });
});
