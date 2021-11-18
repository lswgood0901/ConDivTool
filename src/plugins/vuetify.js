import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#E8EEF1',
        secondary: '#2B7C85',
        accent: '#0C1446',
        error: '#b71c1c',
        my_color: '#ffffff',
        highlight: '#0C1446'
      },
    },
  },
});
