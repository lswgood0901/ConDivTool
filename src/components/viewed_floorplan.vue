<template>

  <v-col cols="6">
    <v-sheet color="primary" class="mx-auto rounded-xl" elevation="2">
      <div class="text-h7 pt-1 font-weight-bold">viewed floorplan</div>
      <v-slide-group v-model="model" show-arrows center-active>
        <v-slide-item
          v-for="(id, n) in viewed_floorplan"
          :key="n"
          v-slot="{ active, toggle }"
        >
          <v-card
            @click="toggle"
            class="ma-4 rounded-lg"
            height="80"
            width="80"
          >
            <v-row class="fill-height" align="center" justify="center">
              <v-col>
                <v-img
                  v-bind:src="
                    require('../assets/floorplan_img/' +
                      viewed_floorplan[n] +
                      '.png')
                  "
                  @click="make_this_input(n)"
                  height="80"
                  width="80"
                  transition="scale-transition"
                  class="shrink rounded-lg"
                  contain
                >
                </v-img>
                <v-overlay
                  v-if="active"
                  absolute
                  color="highlight lighten-3"
                  class="rounded-lg"
                >
                </v-overlay>
              </v-col>
            </v-row>
          </v-card>
        </v-slide-item>
      </v-slide-group>

      <v-expand-transition>
        <v-sheet
          v-if="model != null"
          height="45"
          tile
          class="rounded-xl"
          color="primary"
        >
          <v-row class="fill-height" align="center" justify="center">
            <h3 class="text-h6">{{ viewed_floorplan[model] }}</h3>
            <v-btn
              depressed
              color="accent lighten-2"
              :elevation="2"
              justify="space-around"
              align="center"
              class="rounded-xl ma-3"
              height="25"
              @click="select_highlighted(model)"
            >
              <div class="white--text">Select ✔</div></v-btn
            >
          </v-row>
        </v-sheet>
      </v-expand-transition>
    </v-sheet>
  </v-col>
</template>

<script>

export default {
  name: "viewedFloorplan",
  props: {
    added: String,
  },
  data: () => ({
    model: null,
    viewed_floorplan: [],
    entropy_count: 0,
  }),
  watch: {
    added() {
      this.viewed_floorplan.push(this.added);
      this.model = this.viewed_floorplan.length-1;
      console.log("added_floorplan_name", this.added);
    },
  },
  methods: {
    select_highlighted(model) {
      console.log("hi highlighted", model);
      this.$emit("selected_floorplan_id", this.viewed_floorplan[model]);
    },
    make_this_input(model) {
      this.$emit("make_this_input", this.viewed_floorplan[model]);
    }
  },
};
</script>
