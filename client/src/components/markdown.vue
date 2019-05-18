<template>
  <div v-html="compiledMarkdown" class="richtext" @click="handleClicks"></div>
</template>

<script>
import md from 'md';

export default {
  props: {
    source: { default: '', type: String },
  },
  computed: {
    compiledMarkdown() {
      let html = md(this.source, { sanitize: true, breaks: true });

      // "downgrade" headings, so no h1's are output and compete with main page h1
      // meaning - h1 becomes h2, h2 becomes h3, etc
      for (let i = 5; i > 0; i--) {
        html = html
          .replace(new RegExp(`</h${i}>`, 'g'), `</h${i + 1}>`)
          .replace(new RegExp(`<h${i}>`, 'g'), `<h${i + 1}>`)
          .replace(new RegExp(`<h${i} `, 'g'), `<h${i + 1} `);
      }

      return html;
    },
  },
  methods: {
    // intercept regular link clicks and pass to vue router if applicable
    // see - https://dennisreimann.de/articles/delegating-html-links-to-vue-router.html
    handleClicks($event) {
      // ensure we use the link, in case the click has been received by a sub-element
      let { target } = $event;
      while (target && target.tagName !== 'A') target = target.parentNode;
      if (!target || !target.href) return;
      if (!target.matches('.richtext a')) return; // handle only links that occur inside the component

      // target.href is full url, including host, even if not specified
      // attribute href is just the specified value
      const href = target.getAttribute('href');

      if (href.includes('://')) return; // do not handle external links

      // force new window for external schemes (mailto, tel, etc)
      if (href.match(/^[a-z]+:/)) {
        window.open(href);
        $event.preventDefault();
        return;
      }

      // some sanity checks taken from vue-router:
      // https://github.com/vuejs/vue-router/blob/dev/src/components/link.js#L106
      const {
        altKey, ctrlKey, metaKey, shiftKey, button, defaultPrevented,
      } = $event;
        // don't handle with control keys
      if (metaKey || altKey || ctrlKey || shiftKey) return;
      // don't handle when preventDefault called
      if (defaultPrevented) return;
      // don't handle right clicks
      if (button !== undefined && button !== 0) return;
      // don't handle if `target="_blank"`
      if (target && target.getAttribute) {
        const linkTarget = target.getAttribute('target');
        if (/\b_blank\b/i.test(linkTarget)) return;
      }
      // don't handle same page links/anchors
      const url = new URL(target.href);
      const to = url.pathname;
      if (window.location.pathname !== to && $event.preventDefault) {
        $event.preventDefault();
        this.$router.push(to);
      }
    },
  },
};
</script>

<style lang='less'>
  .richtext {
    a {
      color: inherit;
      text-decoration: none;
      transition: color .2s;
    }
    h2, h3 {
      margin: .3em 0;
    }
    h2 + h3, h3 + h2 {
      margin-top: -5px;
      margin-bottom: 10px;
    }
    ul {
      list-style-position: inside;
      padding-left: 5px;
    }


  }
</style>
