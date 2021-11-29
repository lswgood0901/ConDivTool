<template>

  <v-col cols="12">
    <v-sheet color="primary" class="mx-auto rounded-xl" elevation="2">
      <div class="text-h7 pt-1 font-weight-bold">viewed floorplan (selected : {{selected_length}})</div>
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
            v-if="selected_floorplan.includes(viewed_floorplan[n])"
            color="#DB1F48"
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

          <v-card
            @click="toggle"
            class="ma-4 rounded-lg"
            height="80"
            width="80"
            v-else
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
  
  name: "viewedFloorplan",
  props: {
    added: String,
    added_count: Number,
    eventsignal: Number,
  },
  data: () => ({
    model: null,
    viewed_floorplan: [],
    selected_floorplan:[],
    selected_length:0,
  }),
  watch: {
    added_count() {
      // if(!this.viewed_floorplan.includes(this.added)){
      //   this.viewed_floorplan.push(this.added);
      //   this.add_to_viewedFP_caadria(this.added, this.eventsignal)
      // } else {
      //   // const newArray = this.selected_fp_array.filter(e => e !== this.removed_fp_id)
      //   // console.log(newArray)
      //   // this.selected_fp_array = newArray
      //   const newArray = this.viewed_floorplan.filter(e => e !== this.added)
      //   this.viewed_floorplan = newArray
      //   this.viewed_floorplan.push(this.added)
      //   this.delete_designMove(this.added).then(()=>{
      //     this.add_to_viewedFP_caadria(this.added, this.eventsignal)
      //   })
      // }
      this.viewed_floorplan.push(this.added);
      this.add_to_viewedFP_caadria(this.added, this.eventsignal)
      if(this.eventsignal == 1){
        this.selected_floorplan.push(this.added)
        this.selected_length = this.selected_floorplan.length
      }
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
    },
    add_to_viewedFP_caadria: async (id, eventsignal,x) => {
      console.log("in add_to_designMoves");
      // eslint-disable-line no-unused-vars
      const response = axios
        .post("/add_to_viewedFP_caadria", {
            reference_name: id,
            signal: eventsignal
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
        x = response
      return x
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

  },
};
</script>
