import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#f2efe6',
        secondary: '#b0bec5',
        accent: '#528c41',
        error: '#b71c1c',
        my_color: '#ffffff',
        highlight: '#036358'
      },
    },
  },
});
