<template>
  <v-app>
    <v-app-bar app color="primary" class="rounded-b-lg">
      <v-spacer></v-spacer>
      <div class="text-h4 font-weight-bold highlight--text">
        ConDiv Tool
      </div>
      <v-spacer>
      </v-spacer>


     
    </v-app-bar>

    <v-container fluid class="mt-1 mb-1">
      <v-row no-gutters>
        <v-dialog
          v-model="isIncluster"
          persistent
          max-width="290"
        >
          <v-card>
            <v-card-title class="text-h6">
              Do you want to in-cluster <br> with this cluster?
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="#0C1446"
                text
                @click="isInclusterCondition = false, isIncluster = false"
              >
                Disagree
              </v-btn>
              <v-btn
                color="#0C1446"
                text
                @click="isInclusterCondition = true , isIncluster = false"
              >
                Agree
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-col cols="2">
          <v-card
            :elevation="3"
            class="pa-2 ma-2 rounded-xl"
            :style="{ height: '460px' }"
          >
            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title class="text-h6 mb-1 font-weight-bold">
                  Cluster Menu
                </v-list-item-title>
                <v-list-item-subtitle
                  >Please select the clustering input condition you
                  want.</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>

            <v-container fluid>
              <v-row no-gutters>
                <v-col
                  ><v-switch
                    v-model="cluster_switch"
                    label="number"
                    color="accent"
                    value="number"
                    hide-details
                    @click="number = !number"
                  ></v-switch>
                </v-col>
                <v-col>
                  <v-switch
                    v-model="cluster_switch"
                    label="floor shiloutte"
                    color="accent darken-2"
                    value="floor shiloutte"
                    hide-details
                    @click="floorShiloutte = !floorShiloutte"
                  >
                  </v-switch>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col>
                  <v-switch
                    v-model="cluster_switch"
                    label="location"
                    color="accent"
                    value="location"
                    hide-details
                    @click="location = !location"
                  >
                  </v-switch>
                </v-col>
                <v-col
                  ><v-switch
                    v-model="cluster_switch"
                    label="shape layout"
                    color="accent darken-2"
                    value="shape layout"
                    hide-details
                    @click="shapeLayout = !shapeLayout"
                  >
                  </v-switch>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col
                  ><v-switch
                    v-model="cluster_switch"
                    label="connectivity"
                    color="accent"
                    value="connectivity"
                    hide-details
                    @click="connectivity = !connectivity"
                  ></v-switch
                ></v-col>
                <v-col
                  ><v-switch
                    v-model="cluster_switch"
                    label="shape"
                    color="accent darken-2"
                    value="shape"
                    hide-details
                    @click="shape = !shape"
                  ></v-switch
                ></v-col>
              </v-row>
            </v-container>

            <v-container>
              <v-img
                v-bind:src="
                  require('./assets/floorplan_img/' + make_this_input + '.png')
                "
                transition="scale-transition"
                class="shrink"
                contain
                height="130"
                v-if="make_this_input != null"
              >
              </v-img>
              <v-img
                v-bind:src="
                  require('./assets/null.png')
                "
                transition="scale-transition"
                class="shrink"
                contain
                height="130"
                v-else-if="make_this_input === null"
              >
              </v-img>
            </v-container>
            <v-btn
              v-on:click="clusterButton++
                isInclusterCondition = false;"
              depressed
              color="accent"
              :elevation="2"
              class="rounded-xl"
            >
              <div class="white--text">Cluster</div></v-btn
            >
          </v-card>

          <v-card
            :elevation="3"
            class="pa-2 ma-2 rounded-xl"
            :style="{ height: '60px' }"
          >
            <div id="minimap">
              <v-row no-gutters>
                <v-col cols="8" class="text-h8 mt-2 font-weight-bold"> Previous cluster </v-col>
                <v-col>
                  <v-btn
                    v-on:click="
                      backupCluster++;
                      isInclusterCondition = !isInclusterCondition;
                    "
                    color="accent lighten-1"
                    :elevation="2"
                    justify="space-around"
                    class="rounded-lg mt-3"
                    height="20"
                    :disabled="!isInclusterCondition"
                  >
                    <div class="white--text text-h6">⬅</div></v-btn
                  >
                </v-col>
              </v-row>
            </div>
          </v-card>

          <v-card 
            :elevation="3"
            class="pa-2 ma-2 rounded-xl"
            :style="{ height: '132px' }">

            <v-img
                  v-bind:src="
                    require('./assets/legend.png')
                  "
                  transition="scale-transition"
                  class="shrink"
                  contain
                  height="130"
                >
            </v-img>

          </v-card>

        </v-col>

        <v-col cols="10">
          <v-card
            :elevation="3"
            class="pa-2 ma-2 rounded-xl"
            :style="{ height: '668px' }"
          >
            <div id="clustername">
              <zoomtest
                :clusterFeatures="clusterFeatures"
                :backupCluster="backupCluster"
                :inCluster_condition="isInclusterCondition"
                :make_this_input="make_this_input"
                :view_to_count="view_to_count"
                @id="
                  added_count++;
                  viewed_fp_id = $event;
                "
                @eventsignal="
                  eventsignal = $event
                  "
                @isIncluster="isIncluster = $event"
              />
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-bottom-navigation app :style="{ height: '195px' }" class="rounded-t-xl">
      <v-container fluid>
        <v-row>
          <viewedFloorplan
            :added="viewed_fp_id"
            :added_count="added_count"
            :eventsignal="eventsignal"
            @make_this_input="make_this_input = $event"
          />

        </v-row>
      </v-container>
    </v-bottom-navigation>
  </v-app>
</template>

<script>
import zoomtest from "./components/zoomtest.vue";
import viewedFloorplan from "./components/viewed_floorplan.vue";
import axios from "axios";

axios.defaults.baseURL = "http://166.104.34.136:5000";
axios.defaults.headers.post["Content-Type"] = "application/json;charset=utf-8";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

export default {
  components: {
    zoomtest,
    viewedFloorplan,
  },
  data() {
    return {
      cluster_switch: [
        "number",
        "location",
        "connectivity",
        "floor shiloutte",
        "shape layout",
        "shape",
      ],
      remove_count:0,
      view_to_count:0,
      id: false,
      count: 0,
      viewed_fp_id: null,
      selected_fp_id: null,
      viewed_to_selected_fp: null,
      removed_fp_id: null,
      entropy_count:0,
      clusterButton: 0,
      clusterFeatures: [1,1,1,1,1,1],
      number: true,
      location: true,
      connectivity: true,
      floorShiloutte: true,
      shapeLayout: true,
      shape: true,
      isIncluster: false,
      isInclusterCondition: false,
      make_this_input: null,
      backupCluster: 0,
      added_count: 0,
      eventsignal:0,

      dialog: false,

    };
  },
  watch: {
    loader() {
      const l = this.loader;
      this[l] = !this[l];

      setTimeout(() => (this[l] = false), 3000);

      this.loader = null;
    },
    count() {
      console.log("hi", this.viewed_fp_id);
      // this.viewed_fp_id = this.viewed_fp_id;
    },
    clusterButton() {
      this.clusterFeatures = [
        this.booleanToNumber(this.number),
        this.booleanToNumber(this.floorShiloutte),
        this.booleanToNumber(this.location),
        this.booleanToNumber(this.connectivity),
        this.booleanToNumber(this.shape),
        this.booleanToNumber(this.shapeLayout),
      ];
    },
    viewed_fp_id(){
      this.make_this_input = this.viewed_fp_id
    },
  },
  methods: {
    booleanToNumber: (x) => {
      if (x) {
        return (x = 1);
      } else {
        return (x = 0);
      }
    },
  },
};
</script>
<style>
#minimap {
  overflow: hidden;
}
.margintest {
  padding: 0px;
}
.v-input .v-label {
  font-size: 0.8em;
}
.fontsize {
  font-size: 1rem;
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
