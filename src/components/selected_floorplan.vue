<template>
  <v-col cols="6">
    <v-sheet color="primary" class="mx-auto rounded-xl" elevation="2">
      <div class="text-h7 pt-1 font-weight-bold">selected floorplan</div>
      <v-slide-group v-model="model" show-arrows center-active>
        <v-slide-item
          v-for="(id, n) in selected_floorplan"
          :key="n"
          v-slot="{ active, toggle }"
        >
          <v-card class="ma-4 rounded-lg" height="80" width="80" @click="toggle">
            <v-row class="fill-height" align="center" justify="center">
              <v-col>
                <v-img
                  v-bind:src="
                    require('../assets/floorplan_img/' +
                      selected_floorplan[n] +
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
            <h3 class="text-h6">{{ selected_floorplan[model] }}</h3>
            <v-btn
              depressed
              color="red lighten-2"
              :elevation="2"
              justify="space-around"
              align="center"
              class="rounded-lg ma-3"
              height="25"
              @click="
              remove(model);
              "
            >
              <div class="white--text">Remove ❌</div></v-btn
            >
          </v-row>
        </v-sheet>
      </v-expand-transition>
    </v-sheet>
  </v-col>
</template>

<script>
import axios from "axios";

axios.defaults.baseURL = "http://166.104.34.136:5000";
axios.defaults.headers.post["Content-Type"] = "application/json;charset=utf-8";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
export default {
  name: "selectedFloorplan",
  props: {
    added: String,
  },
  data: () => ({
    model: null,
    selected_floorplan: [],
    loadingcount: 0,
  }),
  watch: {
    added() {
      if(!this.selected_floorplan.includes(this.added)){
        this.selected_floorplan.push(this.added);
      }
      this.model = this.selected_floorplan.length-1;
    },
  },
  methods: {
     remove(model) {
      this.$emit("loadingcount")
      const delete_fp = this.selected_floorplan[model]
      this.delete_designMove(this.selected_floorplan[model]).then(()=>{
        this.$emit("removed_floorplan_id", delete_fp);
        const newArray = this.selected_floorplan.filter(e => e !== delete_fp)
        this.selected_floorplan = newArray
      })
      model = null;
    },
    delete_designMove: async (id, x) => {
      console.log("delete_designMove")
      const response = axios
        .post("/delete_in_designMoves", {
          reference_name: id,
        })
        .then(function(response){
          console.log("delete done",response.data)
        })
        .catch(function(error){
          console.log(error)
        })
        x = response
        return x
    },
    make_this_input(model) {
      this.$emit("make_this_input", this.selected_floorplan[model]);
    }
  },
};
</script>
