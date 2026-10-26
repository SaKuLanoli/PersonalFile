/* charts.js — ECharts 图表 + Mermaid 渲染 | Trae Work */
(function () {
  'use strict';

  if (!window.echarts) { console.warn('[charts] echarts 未加载'); return; }

  function v(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  var C = {
    ink: v('--ink'),
    muted: v('--muted'),
    rule: v('--rule'),
    accent: v('--accent'),
    accent2: v('--accent2'),
    bg2: v('--bg2'),
    bg3: v('--bg3'),
    font: v('--font-body'),
    mono: v('--font-mono')
  };

  function mmss(s) {
    var m = Math.floor(s / 60), sec = Math.floor(s % 60);
    return (m < 10 ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  function baseGrid(extra) {
    return Object.assign({ left: 8, right: 16, top: 14, bottom: 6, containLabel: true }, extra || {});
  }

  function tooltipStyle() {
    return {
      backgroundColor: C.bg2,
      borderColor: C.rule,
      borderWidth: 1,
      padding: [8, 11],
      textStyle: { color: C.ink, fontSize: 12, fontFamily: C.font },
      extraCssText: 'box-shadow:0 4px 18px rgba(30,27,22,.10);border-radius:2px;'
    };
  }

  var charts = [];
  function mount(el, option) {
    if (!el) return;
    var c = echarts.init(el, null, { renderer: 'svg' });
    c.setOption(option);
    charts.push(c);
    return c;
  }

  /* ---------------------------------------------- 图 1 账号存量 vs 单条表现 */
  function chartBaseline() {
    var el = document.getElementById('chart-baseline');
    if (!el) return;
    var rows = [
      { name: '本条笔记 · 点赞', value: 28000, color: C.accent, note: '2.8 万' },
      { name: '本条笔记 · 收藏', value: 15000, color: C.accent2, note: '1.5 万' },
      { name: '账号累计获赞与收藏', value: 10000, color: C.muted, note: '1 万+（展示下限）' },
      { name: '账号粉丝数', value: 10000, color: C.muted, note: '1 万+（展示下限）' }
    ];
    mount(el, {
      animation: false,
      grid: baseGrid({ left: 8, right: 96, top: 10, bottom: 4 }),
      tooltip: Object.assign({
        trigger: 'item',
        formatter: function (p) {
          return '<b>' + p.name + '</b><br/>' + p.value.toLocaleString('zh-CN') +
            (p.name.indexOf('账号') === 0 ? '（平台区间显示下限）' : '');
        }
      }, tooltipStyle()),
      xAxis: {
        type: 'value',
        max: 32000,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: C.rule, type: 'dashed' } },
        axisLabel: {
          color: C.muted, fontSize: 11, fontFamily: C.mono,
          formatter: function (val) { return (val / 10000).toFixed(val % 10000 === 0 ? 0 : 1) + '万'; }
        }
      },
      yAxis: {
        type: 'category',
        inverse: true,
        data: rows.map(function (r) { return r.name; }),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: C.ink, fontSize: 12.5, fontFamily: C.font }
      },
      series: [{
        type: 'bar',
        barWidth: 22,
        data: rows.map(function (r) {
          return {
            name: r.name,
            value: r.value,
            itemStyle: { color: r.color, borderRadius: [0, 2, 2, 0] }
          };
        }),
        label: {
          show: true, position: 'right', distance: 8,
          color: C.muted, fontSize: 11.5, fontFamily: C.mono,
          formatter: function (p) { return rows[p.dataIndex].note; }
        }
      }]
    });
  }

  /* ---------------------------------------------- 图 5 段落时长分配 */
  function chartSegments() {
    var el = document.getElementById('chart-segments');
    if (!el) return;
    var segs = [
      { name: '反常识钩子', v: 11, g: 0 },
      { name: '人设前置', v: 11, g: 0 },
      { name: '高光与骄傲', v: 14, g: 0 },
      { name: '转折失效', v: 14, g: 1 },
      { name: '谷底', v: 13, g: 1 },
      { name: '认知命名', v: 17, g: 2 },
      { name: '方法动作', v: 21, g: 2 },
      { name: '结果承诺', v: 5, g: 2 },
      { name: '新的日常', v: 18, g: 3 },
      { name: '价值升华', v: 22, g: 3 },
      { name: '权威背书', v: 7, g: 3 }
    ];
    var groupColor = [C.accent2, C.accent, C.ink, C.muted];
    var groupName = ['钩子与身份', '失效与谷底', '归因与方法', '兑现与升华'];
    mount(el, {
      animation: false,
      legend: {
        top: 0, left: 0, itemWidth: 10, itemHeight: 10, itemGap: 16,
        icon: 'roundRect',
        data: groupName,
        textStyle: { color: C.muted, fontSize: 11.5, fontFamily: C.font }
      },
      grid: baseGrid({ left: 8, right: 52, top: 34, bottom: 4 }),
      tooltip: Object.assign({
        trigger: 'item',
        formatter: function (p) {
          return '<b>' + p.name + '</b><br/>时长 ' + p.value + ' 秒' +
            '<br/><span style="opacity:.7">' + groupName[segs[p.dataIndex].g] + '</span>';
        }
      }, tooltipStyle()),
      xAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: C.rule, type: 'dashed' } },
        axisLabel: { color: C.muted, fontSize: 11, fontFamily: C.mono, formatter: '{value}s' }
      },
      yAxis: {
        type: 'category',
        inverse: true,
        data: segs.map(function (s) { return s.name; }),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: C.ink, fontSize: 12.5, fontFamily: C.font }
      },
      series: [{
        type: 'bar',
        barWidth: 14,
        data: segs.map(function (s) {
          return {
            name: s.name,
            value: s.v,
            itemStyle: { color: groupColor[s.g], borderRadius: [0, 2, 2, 0] }
          };
        }),
        label: {
          show: true, position: 'right', distance: 6,
          color: C.muted, fontSize: 11, fontFamily: C.mono,
          formatter: '{c}s'
        }
      }]
    });
  }

  /* ---------------------------------------------- 图 6 情绪张力曲线 */
  function chartTimeline() {
    var el = document.getElementById('chart-timeline');
    if (!el) return;
    var pts = [
      [0, 46], [11, 38], [22, 56], [36, 68], [50, 34], [63, 44],
      [80, 72], [101, 82], [106, 66], [124, 70], [146, 92], [153, 74]
    ];
    var noteAt = {
      0: '反常识立论',
      22: '高光峰值',
      50: '谷底',
      63: '找到原因',
      101: '方法高点',
      146: '升华峰值'
    };
    mount(el, {
      animation: false,
      grid: baseGrid({ left: 8, right: 20, top: 16, bottom: 4 }),
      tooltip: Object.assign({
        trigger: 'axis',
        formatter: function (ps) {
          var p = ps[0];
          var key = noteAt[p.data[0]];
          return '<b>' + mmss(p.data[0]) + '</b>　张力 ' + p.data[1] +
            (key ? '<br/>' + key : '');
        }
      }, tooltipStyle()),
      xAxis: {
        type: 'value',
        min: 0, max: 153,
        axisLine: { lineStyle: { color: C.rule } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: {
          color: C.muted, fontSize: 11, fontFamily: C.mono, interval: 17,
          formatter: function (val) { return mmss(val); }
        }
      },
      yAxis: {
        type: 'value',
        min: 0, max: 100,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: C.rule, type: 'dashed' } },
        axisLabel: { color: C.muted, fontSize: 11, fontFamily: C.mono }
      },
      series: [{
        type: 'line',
        smooth: 0.35,
        symbol: 'circle',
        symbolSize: 5,
        data: pts,
        lineStyle: { width: 2.4, color: C.accent },
        itemStyle: { color: C.accent, borderColor: C.bg2, borderWidth: 1.5 },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(178,58,36,.20)' },
              { offset: 1, color: 'rgba(178,58,36,.02)' }
            ]
          }
        },
        markArea: {
          silent: true,
          itemStyle: { color: 'rgba(178,58,36,.06)' },
          data: [
            [{ xAxis: 50, name: '谷底区 00:50–01:03' }, { xAxis: 63 }],
            [{ xAxis: 124, name: '峰值区 02:04–02:26', itemStyle: { color: 'rgba(198,138,22,.10)' } }, { xAxis: 146 }]
          ],
          label: {
            position: 'insideTop', color: C.muted, fontSize: 10.5, fontFamily: C.mono
          }
        },
        markPoint: {
          symbol: 'pin', symbolSize: 40,
          itemStyle: { color: C.accent2 },
          label: { color: C.bg2, fontSize: 10.5, fontFamily: C.font },
          data: [
            { coord: [50, 34], value: '谷底' },
            { coord: [146, 92], value: '峰值' }
          ]
        }
      }]
    });
  }

  function initAll() {
    chartBaseline();
    chartSegments();
    chartTimeline();
    var t = null;
    window.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(function () {
        charts.forEach(function (c) { c.resize(); });
      }, 140);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();

/* ---------------------------------------------- Mermaid 渲染 */
(function () {
  'use strict';
  function v(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  if (!window.mermaid) { console.warn('[charts] mermaid 未加载'); return; }
  var nodes = Array.prototype.slice.call(document.querySelectorAll('pre.mermaid'));
  if (!nodes.length) return;
  window.mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    theme: 'base',
    flowchart: { htmlLabels: true, curve: 'basis', nodeSpacing: 30, rankSpacing: 46 },
    themeVariables: {
      fontFamily: v('--font-body'),
      fontSize: '13px',
      primaryColor: v('--bg3'),
      primaryTextColor: v('--ink'),
      primaryBorderColor: v('--rule'),
      lineColor: v('--muted'),
      secondaryColor: v('--bg2'),
      tertiaryColor: v('--bg3'),
      background: v('--bg2'),
      mainBkg: v('--bg3'),
      clusterBkg: v('--bg2'),
      clusterBorder: v('--rule'),
      edgeLabelBackground: v('--bg2'),
      fontSize: '13px'
    }
  });
  window.mermaid.run({ nodes: nodes }).catch(function (e) {
    console.warn('[charts] mermaid 渲染失败', e);
  });
})();
