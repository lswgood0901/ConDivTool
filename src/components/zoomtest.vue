<template>
  <div>
    <v-overlay :value="g_screenoverlay">
      <span class="text-h3 white--text">Clustering...</span>
    </v-overlay>
    <v-overlay :value="screenoverlay">
      <span class="text-h3 white--text">Loading...</span>
    </v-overlay>
  </div>
</template>

<script>
import * as d3 from "d3";
// import allData from "../assets/allData.json";
import axios from "axios";

axios.defaults.baseURL = "http://166.104.34.136:5000";
axios.defaults.headers.post["Content-Type"] = "application/json;charset=utf-8";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

export default {
  name: "zoomtest",
  props: {
    clusterFeatures: Array,
    backupCluster: Number,
    entropy_count: Number,
    inCluster_condition: Boolean,
    removed_fp_id: String,
    viewed_to_selected_fp: String,
    make_this_input: String,
  },
  data() {
    return {
      g_screenoverlay: false,
      screenoverlay: false,
      // allData: allData,
      svg: null,
      svgMap: null,
      svgmini: null,
      miniMap: null,
      minimapScatter: null,
      width: 1550,
      height: 660,
      simulation: null,
      miniSimulation: null,
      newSimulation: null,
      svgBrush: null,
      brushSelection: null,
      k: 1,
      tx: 0,
      ty: 0,
      scatter: null,
      arrayK: [0, 0, 0],
      arrayTx: [0, 0, 0, 0, 0],
      arrayTy: [0, 0, 0, 0, 0],
      zooms: null,
      brush: null,
      i: 0,
      clicki: 0,
      bbox: null,
      arrayBbox: [],
      eventType: null,
      tFlag: null,
      bFlag: true,
      uFlag: null,
      userActionStatus: [0, 0, 0, 0, 0],
      t: null,
      universeChange: 0,
      translateX: 0,
      reCluster: 0,
      rScale: null,
      bdeJson: {},
      asyncBDE: 0,
      showNode: 300,
      entropyFlag: 0,
      scaleArray: [null],
      isRecluster: false,
      isBackup: false,
      isIncluster: false,
      lookDetailSignal: false,
      lookDetail: false,
      selected_fp_array: [],
      viewed_fp_array: [],
    };
  },
  methods: {
    initialize: async () => {
      // eslint-disable-line no-unused-vars
      axios
        .post("/initialize", {
        })
        .then((response) => {
          return response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    visualize_entropy: async (designNode, x) => {
      console.log("in visualize_entropy");
      // eslint-disable-line no-unused-vars
      const response = axios
        .post("/visualize_entropy", {
          in_view: designNode,
        })
        .then((response) => {
          console.log(response.data);
          return response.data
        })
        .catch(function (error) {
          console.log(error);
        });
        x = response
      return x;
    },
    add_to_designMoves: async (id, eventsignal) => {
      console.log("in add_to_designMoves");
      // eslint-disable-line no-unused-vars
      const response = axios
        .post("/add_to_designMoves", {
          reference_name: id,
          signal: eventsignal
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
      return response.data;
    },
    add_to_designMoves_caadria: async (id, eventsignal) => {
      console.log("in add_to_designMoves");
      // eslint-disable-line no-unused-vars
      const response = axios
        .post("/add_to_designMoves_caadria", {
            reference_name: id,
            signal: eventsignal
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
      return response.data;
    },
    generate_cluster: async (design, clustering_option, universe, x) => {
      const response = axios
        .post("/generate_cluster", {
          input_design: design,
          clustering_option: clustering_option,
          universe: universe,
        })
        .then(function (response) {
          console.log(response.data);
          return response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
      x = response;
      return x;
    },
    conduct_BIG: async (userAction, clusterinView, bdeJson) => {
      // eslint-disable-line no-unused-vars
      const response = axios
        .post("/conduct_BIG", {
          user_action: userAction,
          clusters_in_view: clusterinView,
        })
        .then((response) => {
          return response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
      bdeJson = response;
      return bdeJson;
    },
    isBrushed: (brushCoords, cx, cy) => {
      // eslint-disable-line no-unused-vars
      const x0 = brushCoords[0][0];
      const x1 = brushCoords[1][0];
      const y0 = brushCoords[0][1];
      const y1 = brushCoords[1][1];
      return x0 > cx || cx > x1 || y0 > cy || cy > y1;
    },
    delay: (ms) => {
      const wakeUpTime = Date.now() + ms;
      while (Date.now() < wakeUpTime) {
        //
      }
    },
    sleep: (ms) => {
      return new Promise((r) => setTimeout(r, ms));
    },
    d3Scale: (width, k) => {
      return d3.scaleLinear([0, width], [0, width * k]);
    },
    pixelScale: () =>{
      return d3.scaleLinear([1.4, 12], [0.1, 1.3])
    }
  },

  watch: {
    viewed_to_selected_fp() {
      if(!this.selected_fp_array.includes(this.viewed_to_selected_fp)){
        this.selected_fp_array.push(this.viewed_to_selected_fp);
        console.log(this.selected_fp_array)
      }
      d3.selectAll(".clickedImage").remove()
      for(let i in this.selected_fp_array) {
        d3.selectAll("#image"+this.selected_fp_array[i])
          .attr("class", d=>{
            this.gCam.append("circle")
              .attr("cx", d.x)
              .attr("cy", d.y)
              .attr("r", d.r + 1)
              .attr("class", "clickedImage")
              .attr("id", "clickedImage"+this.selected_fp_array[i])
              .lower()
          })
      }
    },
    viewed_fp_array(){
        this.add_to_designMoves_caadria(this.viewed_fp_array[this.viewed_fp_array.length-1], this.eventsignal)
    },
    removed_fp_id() {
      let idx = this.selected_fp_array.indexOf(this.removed_fp_id)
      this.selected_fp_array.splice(idx,1)
      console.log(this.selected_fp_array)
      d3.selectAll(".clickedImage").remove()
      for(let i in this.selected_fp_array) {
        d3.selectAll("#image"+this.selected_fp_array[i])
          .attr("class", d=>{
            this.gCam.append("circle")
              .attr("cx", d.x)
              .attr("cy", d.y)
              .attr("r", d.r + 1)
              .attr("class", "clickedImage")
              .attr("id", "clickedImage"+this.selected_fp_array[i])
              .lower()
          })
      }
    },
    inCluster_condition() {
      if(this.inCluster_condition) {
        this.reCluster = this.reCluster + 1;
      }
      else {
        this.isIncluster = false;
      }
    },
    
    clicki() {
      let r = d3.selectAll("circle.inbox.presentCircle").attr("r");
      let dx = d3.selectAll("circle.inbox.presentCircle").attr("cx") - r;
      let dy = d3.selectAll("circle.inbox.presentCircle").attr("cy") - r;
      this.svgMap.call(
        this.zooms.transform,
        d3.zoomIdentity
          .translate(
            this.d3Scale(this.width, this.height / (2 * r))(-dx),
            this.d3Scale(this.height, this.height / (2 * r))(-dy)
          )
          .scale(this.height / (2 * r))
      );
      let marginX =
        this.d3Scale(
          this.width,
          this.height / (2 * r)
        )(-this.brushSelection[1][0]) -
        this.d3Scale(this.width, this.height / (2 * r))(-(dx + 2 * r));
      let marginY =
        this.d3Scale(
          this.width,
          this.height / (2 * r)
        )(-this.brushSelection[1][1]) -
        this.d3Scale(this.width, this.height / (2 * r))(-(dy + 2 * r));
      this.svgMap.call(
        this.zooms.transform,
        d3.zoomIdentity
          .translate(
            this.d3Scale(this.width, this.height / (2 * r))(-dx) - marginX / 2,
            this.d3Scale(this.height, this.height / (2 * r))(-dy) - marginY / 2
          )
          .scale(this.height / (2 * r))
      );
    },
    reCluster() {
      console.log("B")
      this.g_screenoverlay = true
      this.previousClusterFeatures = [...this.clusterFeatures]
      this.userAction = undefined;
      this.bdePrior = []
      this.previousInputDesign = [this.input_design]
      let childUniverse = new Array
      if(this.isIncluster && !this.isRecluster && !this.isBackup){

        d3.selectAll("#"+this.eventTarget.id).attr("id", (d)=>{
          this.inClusterInputDesign = d.data.clusterRepresentPlans[2].name.slice(1)
          console.log(d)
          for(let i=0; i<d.children.length; i++){
            childUniverse.push(d.children[i].data.name.slice(1))
          }
        })
      }
      d3.selectAll("circle").remove();
      d3.selectAll("image").remove();
      d3.selectAll("rect").remove();
      d3.selectAll("g").remove();
      this.scaleArray = [null]
      this.strokeScale = d3
            .scaleLinear()
            .domain([0, 1])
            .range([0.1, 1])

      //incluster universe
        if(this.isIncluster && !this.isRecluster && !this.isBackup) {
          this.reGenerateCluster = this.generate_cluster(
            this.inClusterInputDesign,
            [1,1,1,1,1,1],
            childUniverse
          )
        } else if(this.isRecluster) {
          if(this.make_this_input !== null){
            this.input_design = this.make_this_input
          }
          this.isRecluster = false
          this.isIncluster = false
          this.$emit("isIncluster", false)
          this.reGenerateCluster = this.generate_cluster(
            this.input_design,
            this.clusterFeatures,
            this.universe
          )
        } else if(this.isBackup) {
          this.isBackup = false
          this.isIncluster = false
          console.log( this.input_design,
            this.previousClusterFeatures,
            this.universe)
          this.reGenerateCluster = this.generate_cluster(
            ...this.previousInputDesign,
            this.previousClusterFeatures,
            this.universe
          )
        }

      this.reGenerateCluster.then((value) => {
        // console.log(value);
        this.imgData = new Object();
        this.imgData.name = "ancestor";
        this.imgData.children = value;
        // console.log("clustering", this.imgData);
        let threshold = new Array
        for(let step=0; step<this.imgData.children.length; step++){
          threshold.push(this.imgData.children[step].children.length)
        }
          this.maingCam = this.svgMap.append("g");
          this.maingCam
            .append("rect")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("fill-opacity", 0);
          this.maingCam = this.svgMap.append("g");
        this.maingCam
          .append("rect")
          .attr("width", this.width)
          .attr("height", this.height)
          .attr("fill-opacity", 0);
        this.gCam = this.maingCam.append("g").attr("class", "gCam");

        this.root = this.pack(this.imgData);
        this.cluster = this.gCam
          .selectAll("g")
          .data(d3.group(this.root.descendants(), (d) => d.height))
          .join("g")
          .selectAll("g")
          .data((d) => {
            return d[1];
          })
          .join("g");
        this.cluster
          .append("circle")
          .attr("r", (d) => d.r)
          .attr("cx", (d) => d.x)
          .attr("cy", (d) => d.y)
          .attr("id", (d) => {
            return d.data.name;
          })
          .attr("class", (d) => {
            if (d.data.name[0] === "C") {
              let meanWidth = (d.r-2) * Math.sqrt(2, 2)
              let meanX = d.x - (d.r-2) * Math.sqrt(0.5, 2)
              let meanY = d.y - (d.r-2) * Math.sqrt(0.5, 2)
              let newRepresentArray = new Array
              newRepresentArray = [...d.data.clusterRepresentPlans]
              for(let step=0; step < d.data.clusterRepresentPlans.length; step++){
                let dummyObject = new Object
                dummyObject.name = newRepresentArray[step].name
                dummyObject.value = 1
                newRepresentArray.push(dummyObject)
              }

              this.gCam.append("g")
                .selectAll("image")
                .data(newRepresentArray)
                .join("image")
                .attr("x", (d,i)=>{
                  if(i < newRepresentArray.length/2){
                    return meanX
                    } else {
                      return meanX + meanWidth * 0.205 * (i-newRepresentArray.length/2)
                    }
                })
                .attr("y", (d,i)=>{
                  if(i < newRepresentArray.length/2){
                    return meanY
                    } else {
                      return meanY + meanWidth* 0.82
                    }
                })
                .attr("width", (d,i)=>{
                  if(i < newRepresentArray.length/2){
                    return meanWidth
                    } else {
                      return meanWidth * 0.18
                    }
                })
                .attr("height", (d,i)=>{
                  if(i < newRepresentArray.length/2){
                    return meanWidth * 0.8
                    } else {
                      return meanWidth * 0.18
                    }
                })
                .attr("xlink:href", (d,i) => {
                  if(i < newRepresentArray.length/2){
                    let imgX = this.bboxBox.find(
                      (item) => item.split("/")[2].split(".")[0] == newRepresentArray[i].name.slice(1)
                      );
                      return imgX;
                    } else {
                      let imgX = this.imgBox.find(
                      (item) => item.split("/")[2].split(".")[0] == newRepresentArray[i].name.slice(1)
                      );
                      return imgX
                    }
                  })
                .attr("class", "clusterMeans")
                .style("opacity", (d,i)=>{
                  if(i < newRepresentArray.length/2){
                    return 1/ (newRepresentArray.length/2)
                  } else {
                    return 1
                  }
                })
              return "inbox presentCircle";
            } else if (d.data.name == "ancestor") {
              return "ancestor";
            } else {
              return "inboxCircle presentCircle";
            }
          });
        d3.selectAll("#ancestor").attr("class", "no");
        this.imggCam = this.gCam.append("g");
        this.indvImg = this.imggCam
          .selectAll("image")
          .data(d3.group(this.root.descendants()).filter((d) => d.height == 0))
          .join("image")
          .attr("x", (d) => {
            return d.x - d.r;
          })
          .attr("y", (d) => {
            return d.y - d.r;
          })
          .attr("width", (d) => {
            return d.r * 2;
          })
          .attr("height", (d) => {
            return d.r * 2;
          })
          .attr("id", (d) => {
            return "image"+d.data.name.slice(1)
          })
          .style("pointer-events", "none")
          .attr("xlink:href", (d) => {
          let imgX = this.imgBox.find(
                    (item) => item.split("/")[2].split(".")[0] == d.data.name.slice(1)
                    );
                    return imgX;
          })
          .style("visibility", "hidden")

        this.scatter = d3.selectAll(".inbox.presentCircle, .outofBox.presentCircle")
          .on("click", (event) => {
          let inclusterThreshold = d3.selectAll("#"+event.target.id)._groups[0][0].__data__.children.length
          if (
            d3.select(".inbox.presentCircle").attr("id") == event.target.id && inclusterThreshold > 100 && !event.defaultPrevented
          ) {
            // this.reCluster = this.reCluster + 1;
            this.isIncluster = true
            this.$emit("isIncluster", true);
          } else if (
            !event.defaultPrevented
          ) {
            d3.selectAll("circle.inbox.presentCircle").attr(
              "class",
              "outofBox presentCircle"
            );
            d3.select(event.target).attr("class", "inbox presentCircle");
            this.eventTarget = event.target;
            this.clicki++
          }
        })
        .on("mouseover", (event,d)=>{
            d3.selectAll("#"+d.data.name)
              .style("stroke", "#fbb81b")
        })
        .on("mouseout", (event,d)=>{
            d3.selectAll("#"+d.data.name)
            .style("stroke", "#528c41")
        })
        this.childScatter = d3.selectAll(".inboxCircle.presentCircle, .outofBoxCircle.presentCircle")
        this.svgBrush = this.miniMap.append("g");
        this.svgBrush.call(this.brush);
        this.brush.move(this.svgBrush, [
          [0, 0],
          [this.width * this.k, this.height * this.k],
        ]);
        this.miniMap.selectAll(".handle").remove();
        this.miniMap.selectAll(".overlay").remove();
        d3.selectAll(".selection").style("display", "none");
        this.miniMapRect = this.miniMap
        .append("rect")
        .attr("fill", "grey")
        .attr("fill-opacity", 0.2)
        .attr("stroke", "grey")
        // .attr("stroke-width", 1.5);
      this.minimapScatter = this.miniMap
        .selectAll("circle")
        .data(d3.group(this.root.descendants()).filter((d) => d.height == 1))
        .join("circle")
        .attr("r", (d) => {
          return d.r;
        })
        .attr("cx", (d) => {
          return d.x;
        })
        .attr("cy", (d) => {
          return d.y;
        })
        .attr("id", (d) => {
          return "minimapCircle" + d.data.name;
        })
        .attr("class", "minimapinCircle presentCircle")
        .attr(
          "transform",
          "translate(" +
            this.translateX +
            "," +
            this.translateY +
            ") scale(" +
            this.translateK +
            ")"
        );

      this.childScatter
        .on("mouseover", (event) => {
          this.mouseDateTime = Date.now();
            d3.selectAll("#" + event.target.id).attr("r", (d) => {

              this.maingCam
                .append("circle")
                .attr("cx", d.x)
                .attr("cy", d.y)
                .attr("r", d.r + (1 / this.k) * 80)
                .attr("class", "appendCircle")
              this.maingCam
                .append("image")
                .attr("xlink:href", () => {
                  let imgX = this.imgBox.find(
                    (item) =>
                      item.split("/")[2].split(".")[0] == d.data.name.slice(1)
                  );
                  return imgX;
                })
                .attr("x", d.x-d.r - (1 / this.k) * 50)
                .attr("y", d.y-d.r - (1 / this.k) * 50)
                .attr("width", 2*d.r + (1 / this.k) * 100)
                .attr("height", 2*d.r + (1 / this.k) * 100)
                .attr("class", "floorPlanNode")
                .style("pointer-events", "none");

              return d.r + (1 / this.k) * 50;
            })
          
        })
        .on("mouseout", (event) => {
          d3.selectAll("#" + event.target.id)
            .attr("r", (d) => d.r)
            .style("fill-opacity", 0)
          d3.selectAll(".overlay").remove();
          d3.selectAll(".floorPlanNode").remove();
          d3.selectAll(".appendCircle").remove();
          if (this.mouseDateTime + 2000 < Date.now()) {
            console.log(event.target.id.slice(1), "장바구니로");
            this.newinput_design = event.target.id.slice(1)
            this.$emit("id", event.target.id.slice(1));
            if(!this.viewed_fp_array.includes(this.viewed_fp_array)){
                this.viewed_fp_array.push(event.target.id.slice(1));
                this.eventsignal = 0
                console.log(this.viewed_fp_array)
            }
          }
        })
        .on("click", (event) => {
          this.userAction = 4
          if(!event.defaultPrevented) {
                console.log(event.target.id.slice(1), "장바구니로");
                this.newinput_design = event.target.id.slice(1)
                this.$emit("id", event.target.id.slice(1));
                this.$emit("selectId", event.target.id.slice(1))
                if(!this.selected_fp_array.includes(event.target.id.slice(1))){
                  this.selected_fp_array.push(event.target.id.slice(1))
                }
                if(!this.viewed_fp_array.includes(this.viewed_fp_array)){
                this.viewed_fp_array.push(event.target.id.slice(1));
                this.eventsignal = 1
                console.log(this.viewed_fp_array)
            }
          }
        });
        this.svgMap.call(
          this.zooms.transform,
          d3.zoomIdentity.translate(0, 0).scale(1)
        );
        this.bFlag = true;
        this.zoomFlag = true
        this.bdePrior = [];
        this.g_screenoverlay = false
      });
    },
    backupCluster() {
      this.isBackup = true
      this.reCluster++
    },
    clusterFeatures() {
      console.log(this.clusterFeatures);
      this.isRecluster = true
      this.reCluster++;
    },

  },

  created() {
    this.imgBox = new Array();
    this.bboxBox = new Array();
    let fs = require.context("../assets/floorplan_img", true, /^.*\.png$/);
    let subuniverse = new Array();
    this.universe = new Array();
    subuniverse = fs.keys();
    for (let i = 0; i < subuniverse.length; i++) {
      this.universe.push(subuniverse[i].split("/")[1].split(".")[0]);
      const imagePath = require("@/assets/floorplan_img/" +
        subuniverse[i].split("/")[1].split(".")[0] +
        ".png");
      const bboxPath = require("@/assets/bbox_img/" +
        subuniverse[i].split("/")[1].split(".")[0] +
        ".png");
      this.imgBox.push(imagePath);
      this.bboxBox.push(bboxPath);
    }
    this.input_design = [...this.universe][0]

  },
  mounted() {
    this.g_screenoverlay = true
    this.initialize();
    const generateCluster = this.generate_cluster(
      this.input_design,
      this.clusterFeatures,
      this.universe
    );
    generateCluster.then((value) => {
      this.imgData = new Object();
      this.imgData.name = "ancestor";
      this.imgData.children = value;
      // console.log("clustering", this.imgData);
      let threshold = new Array
      for(let step=0; step<this.imgData.children.length; step++){
        threshold.push(this.imgData.children[step].children.length)
      }

      this.svg = d3
        .select("#clustername")
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .style("border-width", "0.5px")
        .attr("transform", "translate(0,-4)");
      this.minimapClient =
        d3.select(".pa-2.ma-2.v-card.v-sheet.theme--light.elevation-3")
          ._groups[0][0].clientWidth - 16;

    //   this.translateK = 0.29;
    //   this.translateX = this.d3Scale(this.width, this.translateK)(-260);
    //   this.translateY = -1 * this.translateK;

      this.svgmini = d3
        .select("#minimap")
        .append("svg")
        .attr("width", this.minimapClient)
        .attr("height", 160)
        .style("border-width", "0.5px");

      this.svgMap = this.svg
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height);

      this.miniMap = this.svgmini
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height);

      this.maingCam = this.svgMap.append("g");
      this.maingCam
        .append("rect")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("fill-opacity", 0);
      this.gCam = this.maingCam.append("g").attr("class", "gCam");

      this.pack = (data) =>
        d3.pack().size([1500, 650]).padding(8)(
          d3.hierarchy(data).sum((d) => {
            return d.value;
          })
        );

      this.root = this.pack(this.imgData);
      this.cluster = this.gCam
        .selectAll("g")
        .data(d3.group(this.root.descendants(), (d) => d.height))
        .join("g")
        .selectAll("g")
        .data((d) => {
          return d[1];
        })
        .join("g");
      this.cluster
        .append("circle")
        .attr("r", (d) => d.r)
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("id", (d) => {
          return d.data.name;
        })
        .attr("class", (d) => {
          let randomY = Math.random()*0.3 + 0.5
          if (d.data.name[0] === "C") {
            let meanWidth = (d.r-2) * Math.sqrt(2, 2)
            let meanX = d.x - (d.r-2) * Math.sqrt(0.5, 2)
            let meanY = d.y - (d.r-2) * Math.sqrt(0.5, 2)
            let newRepresentArray = new Array
            newRepresentArray = [...d.data.clusterRepresentPlans]
            for(let step=0; step < d.data.clusterRepresentPlans.length; step++){
              let dummyObject = new Object
              dummyObject.name = newRepresentArray[step].name
              dummyObject.value = 1
              newRepresentArray.push(dummyObject)
            }

            this.gCam
              .append("svg")
              .selectAll("svg")
              .data(newRepresentArray)
              .join("svg")
              .attr("viewBox", "0 0 600 600")
              .attr("preserveAspectRatio", (d,i)=>{
                if(i < newRepresentArray.length/2){
                  return "none"
                  }
              })
              .attr("x", (d,i)=>{
                if(i < newRepresentArray.length/2){
                  return meanX
                  }
              })
              .attr("y", (d,i)=>{
                if(i < newRepresentArray.length/2){
                  return meanY
                  }
              })
              .attr("width", (d,i)=>{
                if(i < newRepresentArray.length/2){
                  return meanWidth
                  }
              })
              .attr("height", (d,i)=>{
                if(i < newRepresentArray.length/2){
                  return meanWidth * randomY
                  }
              })
              .append("image")
              .attr("xlink:href", (d,i) => {
              if(i < newRepresentArray.length/2){
                let imgX = this.bboxBox.find(
                  (item) => item.split("/")[2].split(".")[0] == newRepresentArray[i].name.slice(1)
                  );
                  return imgX;
                }
              })
              .attr("class", "clusterMeans")
              .style("opacity", (d,i)=>{
                if(i < newRepresentArray.length/2){
                  return 1/ (newRepresentArray.length/2)
                }
              })

            this.gCam.append("g")
              .selectAll("image")
              .data(newRepresentArray)
              .join("image")
              .attr("x", (d,i)=>{
                if(i >= newRepresentArray.length/2){
                    return meanX + meanWidth * 0.205 * (i-newRepresentArray.length/2)
                  }
              })
              .attr("y", (d,i)=>{
                if(i >= newRepresentArray.length/2){
                    return meanY + meanWidth* 0.82
               }
              })
              .attr("width", (d,i)=>{
                if(i >= newRepresentArray.length/2){
                    return meanWidth * 0.18
               }
              })
              .attr("height", (d,i)=>{
                if(i >= newRepresentArray.length/2){
                    return meanWidth * 0.18
                  }
              })
              .attr("xlink:href", (d,i) => {
                if(i >= newRepresentArray.length/2){
                    let imgX = this.imgBox.find(
                    (item) => item.split("/")[2].split(".")[0] == newRepresentArray[i].name.slice(1)
                    );
                    return imgX
                  }
                })
              .attr("class", "clusterMeans")
              .style("opacity", (d,i)=>{
                if(i >= newRepresentArray.length/2){
                  return 1
                }
              })
            return "inbox presentCircle";
          } else if (d.data.name == "ancestor") {
            return "ancestor";
          } else {
            return "inboxCircle presentCircle";
          }
        });
      d3.selectAll("#ancestor").attr("class", "no");
      this.imggCam = this.gCam.append("g");
      this.indvImg = this.imggCam
        .selectAll("image")
        .data(d3.group(this.root.descendants()).filter((d) => d.height == 0))
        .join("image")
        .attr("x", (d) => {
          return d.x - d.r;
        })
        .attr("y", (d) => {
          return d.y - d.r;
        })
        .attr("width", (d) => {
          return d.r * 2;
        })
        .attr("height", (d) => {
          return d.r * 2;
        })
        .style("pointer-events", "none")
        .attr("xlink:href", (d) => {
         let imgX = this.imgBox.find(
                  (item) => item.split("/")[2].split(".")[0] == d.data.name.slice(1)
                  );
                  return imgX;
        })
        .attr("id", (d) => {
          return "image"+d.data.name.slice(1)
        })
        .style("visibility", "hidden")

      this.scatter = d3.selectAll(".inbox.presentCircle, .outofBox.presentCircle")
        .on("click", (event) => {
          let inclusterThreshold = d3.selectAll("#"+event.target.id)._groups[0][0].__data__.children.length
          if (
            d3.select(".inbox.presentCircle").attr("id") == event.target.id && inclusterThreshold > 100 && !event.defaultPrevented
          ) {
            // this.reCluster = this.reCluster + 1;
            this.isIncluster = true
            this.$emit("isIncluster", true);
          } else if (
            !event.defaultPrevented
          ) {
            d3.selectAll("circle.inbox.presentCircle").attr(
              "class",
              "outofBox presentCircle"
            );
            d3.select(event.target).attr("class", "inbox presentCircle");
            this.eventTarget = event.target;
            this.clicki++
          }
        })
        .on("mouseover", (event,d)=>{
            d3.selectAll("#"+d.data.name)
              .style("stroke", "#fbb81b")
        })
        .on("mouseout", (event,d)=>{
            d3.selectAll("#"+d.data.name)
            .style("stroke", "#528c41")
        })
      this.childScatter = d3.selectAll(".inboxCircle.presentCircle, .outofBoxCircle.presentCircle")
      this.onZoom = (event) => {
        if (event.type == "brush") {
          return null;
        }
        this.k = event.transform.k;
        this.tx = event.transform.x;
        this.ty = event.transform.y;
        this.childScatter.attr("class", (d) => {
          if (!this.isBrushed(this.brushSelection, d.x, d.y)) {
            return "inboxCircle presentCircle";
          } else {
            return "outofBoxCircle presentCircle";
          }
        });
        
        if(d3.selectAll(".inboxCircle.presentCircle")._groups[0].length < 400){
            d3.selectAll(".clusterMeans").style("visibility", "hidden")
            this.childScatter.style("visibility", "visible")
            this.indvImg.style("visibility", "visible")
            d3.selectAll(".clickedImage").style("visibility", "visible")
        } else {
            d3.selectAll(".clusterMeans").style("visibility", "visible")
            this.childScatter.style("visibility", "hidden")
            this.indvImg.style("visibility", "hidden")
            d3.selectAll(".clickedImage").style("visibility", "hidden")
        }

        this.d3Scale(this.translateX, 0.7)(this.translateX);
        this.maingCam.attr("transform", event.transform);
        
        this.brush.move(this.svgBrush, [
          [
            this.d3Scale(this.width, this.k).invert(-this.tx),
            this.d3Scale(this.height, this.k).invert(-this.ty),
          ],
          [
            this.d3Scale(this.width, this.k).invert(-this.tx + this.width),
            this.d3Scale(this.height, this.k).invert(-this.ty + this.height),
          ],
        ]);


      };

      this.zooms = d3
        .zoom()
        .wheelDelta((event) => {
          return (
            -event.deltaY *
            (event.deltaMode === 0.1 ? 0.01 : event.deltaMode ? 0.1 : 0.001)
          );
        })
        .on("zoom", this.onZoom);

      this.svgBrush = this.miniMap.append("g");

      this.onBrush = (event) => {
        if (event.type == "zoom") {
          return null;
        }

        if (Array.isArray(event.selection)) {
          this.burshXY = event.selection;
          this.brushX = event.selection[0][0];
          this.brushY = event.selection[0][1];
          this.brushSelection = event.selection;
          this.zoomscale = d3.zoomTransform(this.svgMap.node()).k;
        }
      };

      this.brush = d3
        .brush()
        .extent([
          [0, 0],
          [this.width, this.height],
        ])
        .on("brush", this.onBrush);

      this.svgMap.call(this.zooms).on("dblclick.zoom", null);

      this.svgBrush.call(this.brush);
      this.brush.move(this.svgBrush, [
        [0, 0],
        [this.width * this.k, this.height * this.k],
      ]);
      this.miniMap.selectAll(".handle").remove();
      this.miniMap.selectAll(".overlay").remove();
      d3.selectAll(".selection").style("display", "none");

      this.miniMapRect = this.miniMap
        .append("rect")
        .attr("fill", "grey")
        .attr("fill-opacity", 0.2)
        .attr("stroke", "grey")
        // .attr("stroke-width", 1.5);

      this.childScatter
        .on("mouseover", (event) => {
            console.log("hi")
          this.mouseDateTime = Date.now();
            d3.selectAll("#" + event.target.id).attr("r", (d) => {

              this.maingCam
                .append("circle")
                .attr("cx", d.x)
                .attr("cy", d.y)
                .attr("r", d.r + (1 / this.k) * 80)
                .attr("class", "appendCircle")
              this.maingCam
                .append("image")
                .attr("xlink:href", () => {
                  let imgX = this.imgBox.find(
                    (item) =>
                      item.split("/")[2].split(".")[0] == d.data.name.slice(1)
                  );
                  return imgX;
                })
                .attr("x", d.x-d.r - (1 / this.k) * 50)
                .attr("y", d.y-d.r - (1 / this.k) * 50)
                .attr("width", 2*d.r + (1 / this.k) * 100)
                .attr("height", 2*d.r + (1 / this.k) * 100)
                .attr("class", "floorPlanNode")
                .style("pointer-events", "none");
              if(this.scaleArray[0]!==null){
              // let appendScale = d3.scaleLinear([Math.min(...this.scaleArray), Math.max(...this.scaleArray)],
              // [0, 2*d.r + (1 / this.k) * 100])
              }
              return d.r + (1 / this.k) * 50;
            })
          
        })
        .on("mouseout", (event) => {
          d3.selectAll("#" + event.target.id)
            .attr("r", (d) => d.r)
            .style("fill-opacity", 0)
          d3.selectAll(".overlay").remove();
          d3.selectAll(".floorPlanNode").remove();
          d3.selectAll(".appendCircle").remove();
          if (this.mouseDateTime + 2000 < Date.now()) {
            this.newinput_design = event.target.id.slice(1)
            console.log(event.target.id.slice(1), "장바구니로");
            this.$emit("id", event.target.id.slice(1));
            if(!this.viewed_fp_array.includes(this.viewed_fp_array)){
                this.viewed_fp_array.push(event.target.id.slice(1));
                this.eventsignal = 0
                console.log(this.viewed_fp_array)
            }
          }
        })
        .on("click", (event) => {
          this.userAction = 4
          if(!event.defaultPrevented){
                this.newinput_design = event.target.id.slice(1)
                console.log(event.target.id.slice(1), "장바구니로");
                this.$emit("id", event.target.id.slice(1));
                this.$emit("selectId", event.target.id.slice(1))
                if(!this.selected_fp_array.includes(event.target.id.slice(1))){
                  this.selected_fp_array.push(event.target.id.slice(1))
                }
                if(!this.viewed_fp_array.includes(this.viewed_fp_array)){
                this.viewed_fp_array.push(event.target.id.slice(1));
                this.eventsignal = 1
                console.log(this.viewed_fp_array)
            }
          }
        });
      this.g_screenoverlay = false
    });
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
circle {
  display: none;
}
.outofBox {
  fill: #f2efe6;
  fill-opacity: 0.4;
  stroke: #528c41;
  /* stroke-width: 1px; */
  opacity: 1;
  display: block;
}
.inbox {
  fill: #f2efe6;
  fill-opacity: 0.4;
  stroke: #528c41;
  /* stroke-width: 1px; */
  opacity: 1;
  display: block;
}
.inboxCircle {
  fill: #f2efe6;
  fill-opacity: 0;
  stroke: #528c41;
  /* stroke-width: 0; */
  opacity: 0;
  visibility: hidden;
  display: block;
}
.outofBoxCircle {
  fill: rgb(255, 0, 0);
  fill-opacity: 0;
  opacity: 0;
  display: block;
}

.previousCircle {
  display: none;
}
.minimapoutCircle {
  /* fill: grey; */
  fill: grey;
  fill-opacity: 0.1;
  stroke: grey;
  stroke-width: 3px;
  opacity: 0.2;
  display: block;
}
.minimapinCircle {
  /* fill: #528c41; */
  fill: #f2efe6;
  fill-opacity: 0.3;
  stroke-width: 3px;
  stroke: #528c41;
  opacity: 0.8;
  display: block;
}
.overlay {
  fill: orange;
  pointer-events: none;
}
.selection {
  display: none;
}
.clusterMeans {
  pointer-events: none;
}
.appendCircle {
  fill: white;
  fill-opacity: 1;
  stroke: #ff5555;
  /* stroke-width: 0.7px; */
  display: block;
  pointer-events: none;
}
.clickedImage {
  fill: #ff5555;
  fill-opacity: 1;
  stroke-width: 0px;
  opacity: 1;
  display: block;
  pointer-events: none;
}
</style>
