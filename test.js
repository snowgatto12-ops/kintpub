(function () {
  'use strict';

  const EVENT_TYPES = ['app.record.index.show'];
  const COUNT_ELEMENT_ID = 'kintone-record-count';

  kintone.events.on(EVENT_TYPES, async (event) => {
    const headerMenuSpace = kintone.app.getHeaderMenuSpaceElement();
    const appId = kintone.app.getId();

    if (!headerMenuSpace || !appId) {
      return event;
    }

    let countElement = document.getElementById(COUNT_ELEMENT_ID);
    if (!countElement) {
      countElement = document.createElement('div');
      countElement.id = COUNT_ELEMENT_ID;
      countElement.style.margin = '8px 0';
      countElement.style.fontWeight = 'bold';
      headerMenuSpace.appendChild(countElement);
    }

    countElement.textContent = 'レコード総数: 取得中...';

    try {
      const params = {
        app: appId,
        query: 'limit 1',
        totalCount: true
      };

      const response = await kintone.api(
        kintone.api.url('/k/v1/records', true),
        'GET',
        params
      );

      const totalCount = Number(response.totalCount || 0).toLocaleString('ja-JP');
      countElement.textContent = `レコード総数: ${totalCount} 件`;
    } catch (error) {
      console.error('レコード総数の取得に失敗しました。', error);
      countElement.textContent = 'レコード総数: 取得に失敗しました';
    }

    return event;
  });
})();
