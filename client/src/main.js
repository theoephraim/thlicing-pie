import Vue from 'vue';
import Meta from 'vue-meta';

import App from './app.vue';
import router from './router';

// import './lib/load-content-from-cms';

// register some global components
import MarkdownComponent from './components/markdown.vue';

Vue.component('markdown', MarkdownComponent);

Vue.config.devtools = true;
Vue.config.productionTip = false;
Vue.use(Meta);

// netlify identity login (used for CMS) redirects back to the main page
// but we dont want to include the netlify identity widget in our public bundle
// so we redirect back to /admin/ and pass through the access token
if (window.location.hash.startsWith('#access_token=')) {
  window.location = `/admin/${window.location.hash}`;
}

// simple central event bus to communicate with contact popup
// a bit hacky, but means we don't need to add vuex
window.eventBus = new Vue({});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');

if (navigator.userAgent !== 'ReactSnap') {
  // TODO: initialize GA?
}
