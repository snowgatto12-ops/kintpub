(function () {
  'use strict';

  const EVENT_TYPES = ['app.record.index.show', 'mobile.app.record.index.show'];
  const COUNT_ELEMENT_ID = 'kintone-record-count-badge-v2';
  const LABEL = 'git v3555555555553';

  kintone.events.on(EVENT_TYPES, async (event) => {
    const isMobile = event.type.indexOf('mobile.') === 0;
    const appApi = isMobile ? kintone.mobile.app : kintone.app;
    const headerSpace = appApi.getHeaderSpaceElement();
    const appId = appApi.getId();

    if (!headerSpace || !appId) {
      return event;
    }

    let countElement = document.getElementById(COUNT_ELEMENT_ID);
    if (!countElement) {
      countElement = document.createElement('div');
      countElement.id = COUNT_ELEMENT_ID;
      countElement.style.display = 'inline-flex';
      countElement.style.alignItems = 'center';
      countElement.style.gap = '8px';
      countElement.style.margin = '8px 0';
      countElement.style.padding = '6px 12px';
      countElement.style.borderRadius = '999px';
      countElement.style.background = '#d97706';
      countElement.style.color = '#ffffff';
      countElement.style.fontWeight = '700';
      countElement.style.fontSize = isMobile ? '12px' : '13px';
      headerSpace.appendChild(countElement);
    }

    countElement.textContent = LABEL + ' 総件数: 取得中...';

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
      countElement.textContent = LABEL + ' 総件数: ' + totalCount + ' 件';
    } catch (error) {
      console.error('レコード総数の取得に失敗しました。', error);
      countElement.style.background = '#8b0000';
      countElement.textContent = LABEL + ' 総件数: 取得に失敗しました';
    }

    return event;
  });
})();
